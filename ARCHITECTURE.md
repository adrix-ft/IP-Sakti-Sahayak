# Architecture Guide: IP-SAKTI Sahayak

This document outlines the software architecture, deployment strategy, and technical stack of the IP-SAKTI Sahayak project, developed for the Ministry of Ayush hackathon. 

## 1. Monorepo Structure Overview

To optimize for modern Serverless deployments and separation of concerns, the project is structured as a Monorepo containing two distinct layers:

- **`/frontend` (React/Vite UI)**: Handles the client-side presentation, state management, and user experience.
- **`/api` (Serverless Python Backend)**: Handles AI retrieval, database connectivity, and RAG execution via FastAPI.

At the root of the project, configuration files (`vercel.json`, `requirements.txt`) seamlessly unify these two layers for automated continuous deployment.

### Folder Tree
```text
IP-Sakti-Sahayak/
├── frontend/             # Client-side UI
│   ├── src/              # React Components & Logic
│   ├── public/           # Static assets
│   ├── index.html        # Vite entry point
│   └── vite.config.ts    # Frontend build configuration
├── api/                  # Serverless Backend
│   ├── index.py          # FastAPI application & RAG Pipeline
│   └── ingest.py         # Vector database ingestion scripts
├── vercel.json           # Cloud routing & deployment logic
├── requirements.txt      # Python dependencies for the Vercel Builder
└── .env                  # Environment Variables (Ignored in Git)
```

## 2. Infrastructure & Deployment (Vercel)

The application relies entirely on Vercel's serverless infrastructure, meaning there are no persistent servers constantly running or requiring maintenance. 

### `vercel.json` Routing
Vercel is instructed on how to build and map the monorepo via `vercel.json`. It maps routes using the following logic:
- Any traffic hitting `/api/*` is routed directly to the `@vercel/python` builder, which executes `api/index.py` as a serverless FastAPI function.
- All other traffic is routed to the `@vercel/vite` builder, returning the static React frontend.

### `requirements.txt` Optimization
Serverless functions enforce strict 50MB size limits. To achieve blazing-fast cold starts and avoid build errors, the root `requirements.txt` is kept incredibly lean by offloading all Machine Learning weights to the cloud. Local PyTorch, sentence-transformers, and ChromaDB packages have been removed, relying exclusively on API-driven SDKs (`fastapi`, `supabase`, `google-genai`).

## 3. Data Flow & Environment Setup

The backend FastAPI layer is entirely stateless. Knowledge retrieval and AI inference are managed through external services connected via the `.env` configuration.

### Cloud Integrations
- **Supabase pgvector (`SUPABASE_URL`, `SUPABASE_KEY`)**: Replaces local vector databases. It stores the embedded legal and regulatory documents for the Ministry of Ayush. The backend invokes a Postgres RPC function (`match_documents`) to perform instantaneous similarity searches on the `query_embedding`.
- **Google Gemini API (`GEMINI_API_KEY`)**: Powers both the vector embedding generation (`text-embedding-004`) for incoming queries and the conversational text generation (`gemini-3.6-flash`) for the final RAG answer. 

## 4. Mapping to Ministry of Ayush Requirements

The architectural choices made in this repository map directly to the specific use-case requirements defined for the Ayush sector:

### A. UI Jurisdiction Toggles
The Ministry of Ayush requires distinguishing between domestic (India) and international IP regulations. 
- **Implementation**: The `frontend/src/` components manage jurisdiction toggles. This state is passed directly to the backend within the JSON payload (`QueryRequest.jurisdiction`). 

### B. RAG Metadata Filtering
Ayush regulations span various complex domains (Patents, TKDL, Biodiversity). 
- **Implementation**: The stateless `api/index.py` backend captures the jurisdiction and injects it as a system prompt or filter. Supabase's `match_documents` RPC can be configured to filter metadata, ensuring the RAG pipeline only retrieves context strictly bounded by the selected jurisdiction, minimizing AI hallucinations on complex legal matters.

### C. Classification Router & Escalation
Complex or ambiguous queries must be handled carefully.
- **Implementation**: The frontend utilizes components like `ExpertEscalationModal.tsx` for edge cases where the AI determines a query requires human intervention (e.g., highly specific patent filing disputes). The backend parses the Gemini output and flags ambiguous responses, allowing the UI state machine to escalate the request to human IP experts.
