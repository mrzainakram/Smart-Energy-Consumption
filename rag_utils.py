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
        # Silent fallback - no warning
        return None
    
    try:
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        vectorstore = Chroma(persist_directory=CHROMA_DIR, embedding_function=embeddings)
        return vectorstore
    except Exception as e:
        logging.error(f"Vectorstore init failed: {e}")
        return None

def ingest_directory_into_store(directory_path: str, vectorstore: Optional[object] = None) -> bool:
    """Ingest documents from directory into vector store"""
    if not LANGCHAIN_AVAILABLE or not CHROMADB_AVAILABLE:
        return False
    
    if vectorstore is None:
        vectorstore = build_or_load_vectorstore()
        if vectorstore is None:
            return False
    
    try:
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        directory = Path(directory_path)
        if not directory.exists():
            return False
        
        texts: List[str] = []
        for file_path in directory.rglob("*.txt"):
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    texts.append(f.read())
            except Exception:
                continue
        
        if not texts:
            return False
        
        chunks = text_splitter.split_text("\n".join(texts))
        vectorstore.add_texts(chunks)
        return True
    except Exception as e:
        logging.error(f"Ingest failed: {e}")
        return False

def add_uploaded_file(file_content: str, filename: str, vectorstore: Optional[object] = None) -> bool:
    """Add uploaded file to vector store"""
    if not LANGCHAIN_AVAILABLE or not CHROMADB_AVAILABLE:
        return False
    
    if vectorstore is None:
        vectorstore = build_or_load_vectorstore()
        if vectorstore is None:
            return False
    
    try:
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = text_splitter.split_text(file_content)
        vectorstore.add_texts(chunks)
        return True
    except Exception as e:
        logging.error(f"Upload add failed: {e}")
        return False

def retrieve_with_scores(query: str, vectorstore: Optional[object] = None, k: int = 5) -> List[Tuple[str, float]]:
    """Retrieve documents with similarity scores"""
    if not LANGCHAIN_AVAILABLE or not CHROMADB_AVAILABLE:
        return []
    
    if vectorstore is None:
        vectorstore = build_or_load_vectorstore()
        if vectorstore is None:
            return []
    
    try:
        results = vectorstore.similarity_search_with_score(query, k=k)
        return [(doc.page_content, score) for doc, score in results]
    except Exception as e:
        logging.error(f"Retrieve failed: {e}")
        return []
