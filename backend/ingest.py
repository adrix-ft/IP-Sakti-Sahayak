import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document

def main():
    data_dir = "./data"
    chroma_db_dir = "./chroma_db"
    collection_name = "ayush_ip"

    print(f"Starting ingestion process...")
    print(f"Looking for .md files in '{data_dir}'...")

    if not os.path.exists(data_dir):
        print(f"Data directory '{data_dir}' does not exist. Creating it...")
        os.makedirs(data_dir, exist_ok=True)
        print("Please add .md files to the data directory and run again.")
        return

    documents = []
    for filename in os.listdir(data_dir):
        if filename.endswith(".md"):
            filepath = os.path.join(data_dir, filename)
            print(f"Reading file: {filepath}")
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    text = f.read()
                    documents.append(Document(page_content=text, metadata={"source": filepath}))
            except Exception as e:
                print(f"Error reading {filepath}: {e}")

    if not documents:
        print("No .md files found to process.")
        return

    print(f"Successfully read {len(documents)} files.")
    print("Chunking text (chunk_size=1000, chunk_overlap=200)...")

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    
    chunks = text_splitter.split_documents(documents)
    print(f"Created {len(chunks)} chunks from the documents.")

    print("Initializing embedding model 'all-MiniLM-L6-v2'...")
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    print(f"Saving chunks to ChromaDB at '{chroma_db_dir}' (collection: '{collection_name}')...")
    
    # Initialize persistent Chroma client and add documents
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        collection_name=collection_name,
        persist_directory=chroma_db_dir
    )

    print("Successfully saved data to the database!")

if __name__ == "__main__":
    main()
