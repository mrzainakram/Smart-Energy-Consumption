import streamlit as st
import requests
import json
import os
from datetime import datetime

# Page configuration
st.set_page_config(
    page_title="Smart Energy Backend API",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for responsive design
st.markdown("""
<style>
    .main-header {
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        padding: 2rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        margin-bottom: 2rem;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }
    
    .api-section {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 8px;
        margin: 1rem 0;
        border-left: 4px solid #667eea;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .endpoint {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        border-radius: 3px;
        font-size: 0.8rem;
        font-weight: bold;
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
    }
    
    .get { background: #d4edda; color: #155724; }
    .post { background: #cce5ff; color: #004085; }
    
    @media (max-width: 768px) {
        .main-header h1 { font-size: 2rem; }
        .api-section { padding: 1rem; margin: 0.5rem 0; }
    }
</style>
""", unsafe_allow_html=True)

# Main Header
st.markdown("""
<div class="main-header">
    <h1>⚡ Smart Energy Backend API</h1>
    <p>Backend Server for Smart Energy Consumption Analysis</p>
</div>
""", unsafe_allow_html=True)

# Sidebar
st.sidebar.title("🔧 Backend Control Panel")
st.sidebar.markdown("---")

# API Status
st.sidebar.subheader("📊 API Status")
api_status = st.sidebar.selectbox(
    "Server Status",
    ["🟢 Running", "🔴 Stopped", "🟡 Maintenance"]
)

# Backend URL configuration
backend_url = st.sidebar.text_input(
    "Backend URL",
    value="https://smart-energy-backend-api.vercel.app",
    help="Enter your backend API URL"
)

# Test API connection
if st.sidebar.button("🔗 Test Connection"):
    try:
        response = requests.get(f"{backend_url}/api/health/", timeout=10)
        if response.status_code == 200:
            st.sidebar.success("✅ Backend connected successfully!")
        else:
            st.sidebar.error(f"❌ Backend returned status: {response.status_code}")
    except requests.exceptions.RequestException as e:
        st.sidebar.error(f"❌ Connection failed: {str(e)}")

# Main Content
st.header("🚀 API Endpoints")

# Authentication Endpoints
st.subheader("🔐 Authentication")
st.markdown("""
<div class="api-section">
    <h4>User Authentication & Management</h4>
    <div>
        <span class="endpoint post">POST</span>
        <strong>/api/auth/signup/</strong> - User registration
    </div>
    <div>
        <span class="endpoint post">POST</span>
        <strong>/api/auth/signin/</strong> - User login
    </div>
    <div>
        <span class="endpoint post">POST</span>
        <strong>/api/auth/verify-otp/</strong> - OTP verification
    </div>
</div>
""", unsafe_allow_html=True)

# Energy Prediction Endpoints
st.subheader("⚡ Energy Predictions")
st.markdown("""
<div class="api-section">
    <h4>AI-Powered Energy Consumption Analysis</h4>
    <div>
        <span class="endpoint post">POST</span>
        <strong>/api/predict/energy/</strong> - Generate energy predictions
    </div>
    <div>
        <span class="endpoint post">POST</span>
        <strong>/api/appliance-prediction/</strong> - Analyze appliance usage
    </div>
    <div>
        <span class="endpoint post">POST</span>
        <strong>/api/ocr/scan-bill/</strong> - Process energy bills
    </div>
</div>
""", unsafe_allow_html=True)

# API Testing Section
st.header("🧪 API Testing")

# Test Authentication
st.subheader("Test Authentication")
with st.form("auth_test"):
    test_email = st.text_input("Test Email", "test@example.com")
    test_password = st.text_input("Test Password", "testpass123", type="password")
    
    if st.form_submit_button("Test Login"):
        try:
            payload = {
                "email": test_email,
                "password": test_password
            }
            response = requests.post(f"{backend_url}/api/auth/signin/", json=payload, timeout=10)
            
            if response.status_code == 200:
                st.success("✅ Authentication test successful!")
                st.json(response.json())
            else:
                st.error(f"❌ Authentication failed: {response.status_code}")
                st.json(response.json())
        except requests.exceptions.RequestException as e:
            st.error(f"❌ Request failed: {str(e)}")

# Test Energy Prediction
st.subheader("Test Energy Prediction")
if st.button("Test Energy Prediction"):
    try:
        payload = {
            "appliances": ["AC", "Refrigerator", "TV"],
            "house_size": "medium",
            "occupants": 4
        }
        response = requests.post(f"{backend_url}/api/predict/energy/", json=payload, timeout=10)
        
        if response.status_code == 200:
            st.success("✅ Energy prediction test successful!")
            st.json(response.json())
        else:
            st.error(f"❌ Prediction failed: {response.status_code}")
    except requests.exceptions.RequestException as e:
        st.error(f"❌ Request failed: {str(e)}")

# System Information
st.header("ℹ️ System Information")

col1, col2, col3 = st.columns(3)

with col1:
    st.metric("API Version", "1.0.0")
    st.metric("Framework", "Node.js")

with col2:
    st.metric("Database", "Mock Data")
    st.metric("Status", "Active")

with col3:
    st.metric("Uptime", "24/7")
    st.metric("Response Time", "< 500ms")

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: #666; padding: 2rem;">
    <p>⚡ Smart Energy Backend API Server</p>
    <p>Powered by Streamlit Cloud</p>
    <p>Last updated: {}</p>
</div>
""".format(datetime.now().strftime("%Y-%m-%d %H:%M:%S")), unsafe_allow_html=True)

# Auto-refresh button
if st.button("🔄 Refresh Status"):
    st.rerun()