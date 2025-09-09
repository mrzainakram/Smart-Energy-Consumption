"""
Smart Energy Consumption Backend API
Entry point for Streamlit Cloud deployment
"""

import sys
import os
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

# Import and run the main streamlit backend
from streamlit_backend import *