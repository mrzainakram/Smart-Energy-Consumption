import os
import tempfile
from typing import List, Tuple, Optional
from pathlib import Path
import logging

# Simplified imports for minimal requirements
# from langchain_huggingface import HuggingFaceEmbeddings
# from langchain_chroma import Chroma
# from langchain.text_splitter import RecursiveCharacterTextSplitter
# from langchain.schema import Document

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
PROJECT_DATA_DIR = Path(__file__).parent.parent / "backend" / "energy_app"
CHROMA_DIR = Path(__file__).parent / "secpars_app" / "chroma_db"
EMBED_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

# Ensure directories exist
PROJECT_DATA_DIR.mkdir(parents=True, exist_ok=True)
CHROMA_DIR.mkdir(parents=True, exist_ok=True)

# Simplified Document class
class Document:
    def __init__(self, page_content: str, metadata: dict = None):
        self.page_content = page_content
        self.metadata = metadata or {}

# Simplified vector store class
class SimpleVectorStore:
    def __init__(self, collection_name: str = "secpars_kb"):
        self.collection_name = collection_name
        self.documents = []
        self._collection = type('MockCollection', (), {'count': lambda: len(self.documents)})()
    
    def add_documents(self, docs):
        self.documents.extend(docs)
        logger.info(f"Added {len(docs)} documents to simple vector store")
    
    def similarity_search_with_score(self, query: str, k: int = 5):
        # Simple mock implementation
        results = []
        for i, doc in enumerate(self.documents[:k]):
            # Mock similarity score
            score = 0.8 - (i * 0.1)
            results.append((doc, score))
        return results

def build_or_load_vectorstore():
    """Build or load a simplified vector store."""
    try:
        logger.info("Building simplified vector store...")
        vs = SimpleVectorStore()
        
        # Check if we have any documents
        if len(vs.documents) == 0:
            logger.info("Vector store is empty, ingesting project data...")
            ingest_directory_into_store(vs, PROJECT_DATA_DIR)
        else:
            logger.info(f"Loaded existing vector store with {len(vs.documents)} documents")
        
        return vs
        
    except Exception as e:
        logger.error(f"Error building/loading vector store: {e}")
        # Return a working mock store
        return SimpleVectorStore()

def ingest_directory_into_store(vs, directory: Path) -> None:
    """Ingest documents from a directory into the vector store."""
    try:
        documents = []
        
        # Walk through directory
        for file_path in directory.rglob("*"):
            if file_path.is_file() and file_path.suffix.lower() in ['.txt', '.md', '.py', '.js', '.jsx', '.html', '.css']:
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Create document
                    doc = Document(
                        page_content=content,
                        metadata={"source": str(file_path), "filename": file_path.name}
                    )
                    documents.append(doc)
                    logger.info(f"Processed: {file_path}")
                    
                except Exception as e:
                    logger.warning(f"Could not process {file_path}: {e}")
                    continue
        
        if documents:
            # Simple text splitting (no advanced splitting)
            split_docs = []
            for doc in documents:
                # Split into chunks of 1000 characters
                content = doc.page_content
                for i in range(0, len(content), 1000):
                    chunk = content[i:i+1000]
                    split_doc = Document(
                        page_content=chunk,
                        metadata=doc.metadata.copy()
                    )
                    split_docs.append(split_doc)
            
            # Add to vector store
            vs.add_documents(split_docs)
            logger.info(f"Added {len(split_docs)} document chunks to vector store")
        else:
            logger.warning("No documents found to ingest")
            
    except Exception as e:
        logger.error(f"Error ingesting directory: {e}")
        # Continue with empty store

def add_uploaded_file(vs, file_path: str) -> None:
    """Add a single uploaded file to the vector store."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        doc = Document(
            page_content=content,
            metadata={"source": file_path, "filename": Path(file_path).name}
        )
        
        # Simple splitting
        split_docs = []
        for i in range(0, len(content), 1000):
            chunk = content[i:i+1000]
            split_doc = Document(
                page_content=chunk,
                metadata=doc.metadata.copy()
            )
            split_docs.append(split_doc)
        
        # Add to vector store
        vs.add_documents(split_docs)
        logger.info(f"Added uploaded file: {Path(file_path).name}")
        
    except Exception as e:
        logger.error(f"Error adding uploaded file: {e}")

def retrieve_with_scores(vs, query: str, k: int = 5) -> List[Tuple[Document, float]]:
    """Retrieve documents with similarity scores."""
    try:
        # Enhanced logging for debugging
        logger.info(f"Retrieving documents for query: '{query}'")
        logger.info(f"Total documents in vector store: {len(vs.documents)}")
        
        results = vs.similarity_search_with_score(query, k=k)
        
        # Log detailed results
        logger.info(f"Retrieved {len(results)} documents")
        for i, (doc, score) in enumerate(results, 1):
            logger.info(f"Document {i}:")
            logger.info(f"  Score: {score}")
            logger.info(f"  Source: {doc.metadata.get('source', 'Unknown')}")
            logger.info(f"  First 200 chars: {doc.page_content[:200]}...")
        
        return results
    except Exception as e:
        logger.error(f"Error retrieving documents: {e}")
        return [] 