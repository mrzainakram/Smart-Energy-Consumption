"""
SECPARS - Smart Energy Consumption Prediction and Recommendation System
Entry point for Streamlit Cloud deployment
"""

import sys
import os
from pathlib import Path

# Add secpars_app directory to Python path
secpars_path = Path(__file__).parent / "secpars_app"
sys.path.insert(0, str(secpars_path))

# Import and run the main app
try:
    # Import the main app from secpars_app/app.py
    from app import *
    
    # The app will run automatically when imported
    print("✅ SECPARS App loaded successfully!")
    
except ImportError as e:
    import streamlit as st
    st.error(f"❌ Error loading SECPARS app: {e}")
    st.info("Please ensure all dependencies are installed.")
    
except Exception as e:
    import streamlit as st
    st.error(f"❌ Unexpected error: {e}")
    st.info("Please check the application configuration.")