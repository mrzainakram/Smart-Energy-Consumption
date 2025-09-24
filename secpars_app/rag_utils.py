import os
import tempfile
from typing import List, Tuple, Optional
from pathlib import Path
import logging

# Default directories
PROJECT_DATA_DIR = os.getenv("PROJECT_DATA_DIR", "./secpars_app/project_data")
CHROMA_DIR = os.getenv("CHROMA_DIR", "./secpars_app/chroma_db")

# Optional dependencies
try:
    from langchain_huggingface import HuggingFaceEmbeddings  # type: ignore
    from langchain_chroma import Chroma  # type: ignore
    from langchain.text_splitter import RecursiveCharacterTextSplitter  # type: ignore
    LANGCHAIN_AVAILABLE = True
except Exception:
    LANGCHAIN_AVAILABLE = False

try:
    import chromadb  # type: ignore
    CHROMADB_AVAILABLE = True
except Exception:
    CHROMADB_AVAILABLE = False


def build_or_load_vectorstore(data_dir: str = PROJECT_DATA_DIR) -> Optional[object]:
    if not (LANGCHAIN_AVAILABLE and CHROMADB_AVAILABLE):
        logging.warning("LangChain/Chroma not available; skipping vectorstore init")
        return None
    try:
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        vectorstore = Chroma(persist_directory=CHROMA_DIR, embedding_function=embeddings)
        return vectorstore
    except Exception as e:
        logging.error(f"Vectorstore init failed: {e}")
        return None


def ingest_directory_into_store(directory_path: str, vectorstore: Optional[object] = None) -> bool:
    if not (LANGCHAIN_AVAILABLE and CHROMADB_AVAILABLE):
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
    if not (LANGCHAIN_AVAILABLE and CHROMADB_AVAILABLE):
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
    if not (LANGCHAIN_AVAILABLE and CHROMADB_AVAILABLE):
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