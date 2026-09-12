# fastapi_app.py
import os
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List
from enum import Enum
from supabase import create_client, Client
from google import genai
from google.genai import types

# Set up built-in logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

app = FastAPI(title="RAG Chatbot API - Serverless")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to your actual Vercel domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class JurisdictionEnum(str, Enum):
    india = "India"
    international = "International"

class Citation(BaseModel):
    source: str
    text: str

class QueryRequest(BaseModel):
    message: str = Field(..., min_length=2, max_length=1000)
    jurisdiction: JurisdictionEnum

class ChatResponse(BaseModel):
    answer: str
    citations: List[Citation]

def get_supabase() -> Client:
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_KEY")
    if not url or not key:
        raise ValueError("Supabase credentials missing. Set SUPABASE_URL and SUPABASE_KEY.")
    return create_client(url, key)

def get_gemini() -> genai.Client:
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        raise ValueError("Gemini credentials missing. Set GEMINI_API_KEY.")
    return genai.Client(api_key=key)

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: QueryRequest):
    try:
        logger.info(f"Received request payload: {request.model_dump()}")
        
        # 1. Initialize Clients (Stateless)
        try:
            supabase = get_supabase()
            gemini = get_gemini()
        except ValueError as ve:
            logger.error(str(ve))
            return ChatResponse(
                answer=f"Server setup error: {str(ve)}",
                citations=[]
            )

        # 2. Generate Embedding
        logger.info("Generating query embedding via Gemini...")
        embed_res = gemini.models.embed_content(
            model="gemini-embedding-2",
            contents=request.message,
            config=types.EmbedContentConfig(output_dimensionality=768)
        )
        query_vector = embed_res.embeddings[0].values

        # 3. Retrieve Context from Supabase
        logger.info("Querying Supabase pgvector...")
        # Note: Your database must have an RPC function named 'match_documents'
        # matching the expected vector schema.
        rpc_response = supabase.rpc("match_documents", {
            "query_embedding": query_vector,
            "match_count": 3
        }).execute()
        
        documents = rpc_response.data or []
        context_string = "\n\n".join([doc.get("content", "") for doc in documents])
        
        citations = []
        for doc in documents:
            metadata = doc.get("metadata", {})
            source = metadata.get("source", "Unknown Source")
            snippet = doc.get("content", "")[:200] + "..."
            citations.append(Citation(source=source, text=snippet))

        # 4. Generate LLM Response
        logger.info("Calling Gemini LLM...")
        prompt = f"Answer strictly using the provided context. Do not use outside knowledge.\n\nContext:\n{context_string}\n\nQuestion: {request.message}"
        system_instruction = f"You are an Ayush regulatory expert answering a question regarding {request.jurisdiction.value} jurisdiction."

        llm_response = gemini.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.1
            )
        )

        return ChatResponse(
            answer=llm_response.text or "No response generated.",
            citations=citations if citations else [Citation(source="None", text="No context matched.")]
        )

    except Exception as e:
        logger.error(f"Error processing chat request: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
