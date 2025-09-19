import os
import tempfile
from typing import List, Tuple, Optional
from pathlib import Path
import logging

# Default values for when dependencies are not available
PROJECT_DATA_DIR = os.getenv("PROJECT_DATA_DIR", "./project_data")
CHROMA_DIR = os.getenv("CHROMA_DIR", "./chroma_db")

# Try to import optional dependencies
try:
    from langchain_huggingface import HuggingFaceEmbeddings
    from langchain_chroma import Chroma
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    LANGCHAIN_AVAILABLE = True
except ImportError:
    LANGCHAIN_AVAILABLE = False

try:
    import chromadb
    CHROMADB_AVAILABLE = True
except ImportError:
    CHROMADB_AVAILABLE = False

def build_or_load_vectorstore(data_dir: str = PROJECT_DATA_DIR) -> Optional[object]:
    """Build or load vector store with error handling"""
    if not LANGCHAIN_AVAILABLE or not CHROMADB_AVAILABLE:
        logging.warning("LangChain or ChromaDB not available, using fallback")
        return None
    
    try:
        # Create embeddings
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        
        # Create vector store
        vectorstore = Chroma(
            persist_directory=CHROMA_DIR,
            embedding_function=embeddings
        )
        
        return vectorstore
    except Exception as e:
        logging.error(f"Failed to build vector store: {e}")
        return None

def ingest_directory_into_store(directory_path: str, vectorstore: Optional[object] = None) -> bool:
    """Ingest directory into vector store with error handling"""
    if not LANGCHAIN_AVAILABLE or not CHROMADB_AVAILABLE:
        logging.warning("LangChain or ChromaDB not available, skipping ingestion")
        return False
    
    if vectorstore is None:
        vectorstore = build_or_load_vectorstore()
        if vectorstore is None:
            return False
    
    try:
        # Simple text ingestion
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        
        # Process files in directory
        directory = Path(directory_path)
        if not directory.exists():
            logging.warning(f"Directory {directory_path} does not exist")
            return False
        
        texts = []
        for file_path in directory.rglob("*.txt"):
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    texts.append(content)
            except Exception as e:
                logging.warning(f"Failed to read {file_path}: {e}")
        
        if texts:
            chunks = text_splitter.split_text("\n".join(texts))
            vectorstore.add_texts(chunks)
            logging.info(f"Successfully ingested {len(chunks)} chunks")
            return True
        
        return False
    except Exception as e:
        logging.error(f"Failed to ingest directory: {e}")
        return False

def add_uploaded_file(file_content: str, filename: str, vectorstore: Optional[object] = None) -> bool:
    """Add uploaded file to vector store with error handling"""
    if not LANGCHAIN_AVAILABLE or not CHROMADB_AVAILABLE:
        logging.warning("LangChain or ChromaDB not available, skipping file addition")
        return False
    
    if vectorstore is None:
        vectorstore = build_or_load_vectorstore()
        if vectorstore is None:
            return False
    
    try:
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200
        )
        
        chunks = text_splitter.split_text(file_content)
        vectorstore.add_texts(chunks)
        logging.info(f"Successfully added {len(chunks)} chunks from {filename}")
        return True
    except Exception as e:
        logging.error(f"Failed to add uploaded file: {e}")
        return False

def retrieve_with_scores(query: str, vectorstore: Optional[object] = None, k: int = 5) -> List[Tuple[str, float]]:
    """Retrieve documents with scores with error handling"""
    if not LANGCHAIN_AVAILABLE or not CHROMADB_AVAILABLE:
        logging.warning("LangChain or ChromaDB not available, returning empty results")
        return []
    
    if vectorstore is None:
        vectorstore = build_or_load_vectorstore()
        if vectorstore is None:
            return []
    
    try:
        results = vectorstore.similarity_search_with_score(query, k=k)
        return [(doc.page_content, score) for doc, score in results]
    except Exception as e:
        logging.error(f"Failed to retrieve documents: {e}")
        return []

# Fallback functions for when dependencies are not available
def get_fallback_response(query: str) -> str:
    """Get a fallback response when RAG is not available"""
    query_lower = query.lower()
    
    if any(word in query_lower for word in ["energy", "consumption", "electricity"]):
        return "I can help with energy consumption analysis. For detailed AI-powered responses, please ensure all dependencies are installed."
    elif any(word in query_lower for word in ["prediction", "forecast"]):
        return "I can provide energy predictions. For advanced AI predictions, please ensure all dependencies are installed."
    else:
        return "I'm here to help with energy-related questions. For full AI functionality, please ensure all dependencies are installed."
