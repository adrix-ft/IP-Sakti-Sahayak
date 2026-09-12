import os
import json
from dotenv import load_dotenv
from supabase import create_client, Client
from google import genai
from google.genai import types

# Load environment variables
load_dotenv()

# Setup Supabase client
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Missing Supabase credentials in .env")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Setup Gemini client
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("Missing Gemini credentials in .env")
gemini = genai.Client(api_key=GEMINI_API_KEY)

# Read file
FILE_PATH = "data/patents_act_sample.md"
print(f"Reading {FILE_PATH}...")
with open(FILE_PATH, "r", encoding="utf-8") as f:
    text = f.read()

# Naive split by double newline (paragraphs)
chunks = [chunk.strip() for chunk in text.split("\n\n") if len(chunk.strip()) > 50]

print(f"Found {len(chunks)} chunks. Generating embeddings...")

# Ingest chunks
for i, chunk in enumerate(chunks):
    try:
        # Embed
        embed_res = gemini.models.embed_content(
            model="gemini-embedding-2",
            contents=chunk,
            config=types.EmbedContentConfig(output_dimensionality=768)
        )
        vector = embed_res.embeddings[0].values
        
        # Metadata
        metadata = {
            "jurisdiction": "India",
            "source": "Patents Act, 1970",
            "chunk_index": i
        }
        
        # Insert to Supabase table 'documents'
        data = {
            "content": chunk,
            "embedding": vector,
            "metadata": metadata
        }
        
        # Execute insert
        response = supabase.table("documents").insert(data).execute()
        print(f"Inserted chunk {i+1}/{len(chunks)}")
    except Exception as e:
        print(f"Failed to insert chunk {i+1}: {e}")

print("Ingestion complete!")
