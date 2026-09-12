import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import cors from "cors";
import { z } from "zod";
import { ChromaClient } from "chromadb";
import { DefaultEmbeddingFunction } from "@chroma-core/default-embed";

dotenv.config();

const app = express();
const PORT = 3000;

const chroma = new ChromaClient({ path: "http://localhost:8000" });

app.use(express.json());

// CORS Configuration explicitly allowing the specified origins
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['*'],
  allowedHeaders: ['*']
}));

// Pydantic equivalent validation using Zod
const QueryRequestSchema = z.object({
  message: z.string().min(2, "Message must be at least 2 characters").max(1000, "Message must be at most 1000 characters"),
  jurisdiction: z.enum(["India", "International"])
});

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: { "User-Agent": "aistudio-build" },
      },
    });
  }
  return aiClient;
}

// Chat Query Endpoint matching FastAPI signature
app.post("/api/chat", async (req, res) => {
  try {
    // 1. Data Validation
    const parseResult = QueryRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
      console.error(`[${new Date().toISOString()}] Validation error:`, parseResult.error.errors);
      return res.status(422).json({ detail: "Unprocessable Entity: " + parseResult.error.errors[0].message });
    }

    const { message, jurisdiction } = parseResult.data;

    // 2. Logging payload (Python built-in logging equivalent)
    console.log(`[${new Date().toISOString()}] [INFO] Received request payload:`, req.body);

    // 3. Simulated Error conditions based on user instructions
    const messageLower = message.toLowerCase();
    if (messageLower.includes("fail db")) {
      console.error(`[${new Date().toISOString()}] [ERROR] ChromaDB connection failed`, new Error("Database timeout").stack);
      return res.status(503).json({ detail: "Database connection failed." });
    }
    if (messageLower.includes("fail llm")) {
      console.error(`[${new Date().toISOString()}] [ERROR] Groq LLM timeout`, new Error("Upstream timeout").stack);
      return res.status(502).json({ detail: "Upstream LLM provider unavailable." });
    }

    // 4. Fallback if Gemini is not configured
    const gemini = getGeminiClient();
    if (!gemini) {
      return res.json({
        answer: "This is a simulated RAG response. Note: Please configure GEMINI_API_KEY for dynamic AI generation.",
        citations: [{ source: "Mock System", text: "Please provide a valid API key." }]
      });
    }

    // 4.5. Query ChromaDB for RAG context
    console.log(`[${new Date().toISOString()}] [DEBUG] Connecting to ChromaDB and querying collection...`);
    const embedder = new DefaultEmbeddingFunction();
    const collection = await chroma.getCollection({ name: "ayush_ip", embeddingFunction: embedder });
    const results = await collection.query({
      queryTexts: [message],
      nResults: 3
    });
    
    const contextString = results.documents && results.documents[0] ? results.documents[0].join("\n\n") : "";

    // 5. Generate Content using RAG pipeline LLM
    const systemInstruction = `You are an Ayush regulatory expert answering a question regarding ${jurisdiction} jurisdiction.`;
    
    const prompt = `You are an Ayush IP regulatory assistant. Answer the user's question strictly using the provided context below. Do not use outside knowledge. \n\nContext: ${contextString}\n\nQuestion: ${message}`;
    
    console.log(`[${new Date().toISOString()}] [DEBUG] Preparing to call Gemini model (gemini-3.6-flash)...`);
    
    const response = await gemini.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            answer: { type: Type.STRING },
            citations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  source: { type: Type.STRING },
                  text: { type: Type.STRING }
                },
                required: ["source", "text"]
              }
            }
          },
          required: ["answer", "citations"]
        }
      }
    });

    console.log(`[${new Date().toISOString()}] [DEBUG] Gemini call completed successfully. Response length:`, response.text?.length);

    const resultText = response.text;
    res.json(JSON.parse(resultText || "{}"));

  } catch (err: any) {
    console.error(`[${new Date().toISOString()}] [ERROR] Unhandled exception:`, err.stack, "Payload:", req.body);
    res.status(500).json({ detail: err.message || "Internal Server Error" });
  }
});

// Vite middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
