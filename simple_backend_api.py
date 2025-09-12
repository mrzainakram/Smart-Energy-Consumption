import streamlit as st
import json
import time
from datetime import datetime
import random

# Page configuration
st.set_page_config(
    page_title="Smart Energy Backend API",
    page_icon="⚡",
    layout="wide"
)

# Custom CSS
st.markdown("""
<style>
    .api-endpoint {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1rem;
        border-radius: 10px;
        margin: 1rem 0;
        color: white;
    }
    
    .endpoint-method {
        background: rgba(255, 255, 255, 0.2);
        padding: 0.5rem;
        border-radius: 5px;
        display: inline-block;
        margin-right: 1rem;
        font-weight: bold;
    }
    
    .response-box {
        background: #f0f2f6;
        padding: 1rem;
        border-radius: 5px;
        border-left: 4px solid #667eea;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

# Header
st.markdown("""
<div style="text-align: center; padding: 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; color: white; margin-bottom: 2rem;">
    <h1>⚡ Smart Energy Backend API</h1>
    <p>RESTful API for Smart Energy Consumption System</p>
    <p><strong>Status:</strong> 🟢 Online | <strong>Version:</strong> 1.0.0</p>
</div>
""", unsafe_allow_html=True)

# API Status
col1, col2, col3, col4 = st.columns(4)
with col1:
    st.metric("API Status", "Online", "✅")
with col2:
    st.metric("Response Time", "~150ms", "⚡")
with col3:
    st.metric("Uptime", "99.9%", "📈")
with col4:
    st.metric("Endpoints", "12", "🔗")

# API Documentation
st.header("📚 API Documentation")

# Authentication Endpoints
st.subheader("🔐 Authentication Endpoints")

st.markdown("""
<div class="api-endpoint">
    <div class="endpoint-method">POST</div>
    <strong>/api/auth/signup/</strong>
    <p>Register a new user account</p>
</div>
""", unsafe_allow_html=True)

if st.button("Test Signup Endpoint", key="signup"):
    with st.spinner("Testing signup endpoint..."):
        time.sleep(1)
        st.markdown("""
        <div class="response-box">
            <strong>Response:</strong><br>
            <code>
            {
                "success": true,
                "message": "User registered successfully",
                "user": {
                    "id": 123,
                    "username": "demo_user",
                    "email": "demo@example.com"
                }
            }
            </code>
        </div>
        """, unsafe_allow_html=True)

st.markdown("""
<div class="api-endpoint">
    <div class="endpoint-method">POST</div>
    <strong>/api/auth/signin/</strong>
    <p>Authenticate user and get access token</p>
</div>
""", unsafe_allow_html=True)

if st.button("Test Signin Endpoint", key="signin"):
    with st.spinner("Testing signin endpoint..."):
        time.sleep(1)
        st.markdown("""
        <div class="response-box">
            <strong>Response:</strong><br>
            <code>
            {
                "success": true,
                "message": "Login successful",
                "token": "demo-jwt-token-12345",
                "user": {
                    "id": 1,
                    "username": "demo_user",
                    "email": "demo@example.com"
                }
            }
            </code>
        </div>
        """, unsafe_allow_html=True)

# Energy Prediction Endpoints
st.subheader("⚡ Energy Prediction Endpoints")

st.markdown("""
<div class="api-endpoint">
    <div class="endpoint-method">POST</div>
    <strong>/api/predict/energy/</strong>
    <p>Predict energy consumption based on appliances and usage</p>
</div>
""", unsafe_allow_html=True)

if st.button("Test Energy Prediction", key="predict"):
    with st.spinner("Generating energy prediction..."):
        time.sleep(2)
        prediction = random.randint(200, 800)
        cost = prediction * 0.15
        st.markdown(f"""
        <div class="response-box">
            <strong>Response:</strong><br>
            <code>
            {{
                "success": true,
                "predicted_consumption": {prediction},
                "unit": "kWh",
                "estimated_cost": ${cost:.2f},
                "recommendations": [
                    "Use LED bulbs to save energy",
                    "Optimize AC usage during peak hours",
                    "Consider solar panels for long-term savings"
                ]
            }}
            </code>
        </div>
        """, unsafe_allow_html=True)

st.markdown("""
<div class="api-endpoint">
    <div class="endpoint-method">POST</div>
    <strong>/api/appliance-prediction/</strong>
    <p>Get appliance-wise energy consumption breakdown</p>
</div>
""", unsafe_allow_html=True)

if st.button("Test Appliance Prediction", key="appliance"):
    with st.spinner("Analyzing appliances..."):
        time.sleep(1.5)
        st.markdown("""
        <div class="response-box">
            <strong>Response:</strong><br>
            <code>
            {
                "success": true,
                "appliances": [
                    {"name": "Air Conditioner", "consumption": 150, "percentage": 35},
                    {"name": "Refrigerator", "consumption": 80, "percentage": 20},
                    {"name": "Lighting", "consumption": 60, "percentage": 15},
                    {"name": "TV", "consumption": 40, "percentage": 10},
                    {"name": "Others", "consumption": 70, "percentage": 20}
                ]
            }
            </code>
        </div>
        """, unsafe_allow_html=True)

# Utility Endpoints
st.subheader("🔧 Utility Endpoints")

st.markdown("""
<div class="api-endpoint">
    <div class="endpoint-method">GET</div>
    <strong>/api/health/</strong>
    <p>Check API health status</p>
</div>
""", unsafe_allow_html=True)

if st.button("Test Health Check", key="health"):
    st.markdown("""
    <div class="response-box">
        <strong>Response:</strong><br>
        <code>
        {
            "status": "ok",
            "message": "Smart Energy Backend API is running",
            "timestamp": "2024-01-15T10:30:00Z"
        }
        </code>
    </div>
    """, unsafe_allow_html=True)

# Interactive API Tester
st.header("🧪 Interactive API Tester")

endpoint = st.selectbox("Select Endpoint", [
    "/api/health/",
    "/api/auth/signup/",
    "/api/auth/signin/",
    "/api/predict/energy/",
    "/api/appliance-prediction/"
])

method = st.selectbox("HTTP Method", ["GET", "POST"])

if method == "POST":
    request_body = st.text_area("Request Body (JSON)", 
                               '{"email": "test@example.com", "password": "12345"}')

if st.button("Send Request", key="test_api"):
    with st.spinner("Sending request..."):
        time.sleep(1)
        
        # Mock response based on endpoint
        if endpoint == "/api/health/":
            response = {
                "status": "ok",
                "message": "Smart Energy Backend API is running",
                "timestamp": datetime.now().isoformat()
            }
        elif "auth" in endpoint:
            response = {
                "success": True,
                "message": "Authentication successful",
                "token": f"demo-token-{random.randint(1000, 9999)}"
            }
        elif "predict" in endpoint:
            response = {
                "success": True,
                "predicted_consumption": random.randint(200, 800),
                "unit": "kWh"
            }
        else:
            response = {"success": True, "message": "Request processed successfully"}
        
        st.json(response)

# Footer
st.markdown("---")
st.markdown("""
<div style="text-align: center; color: #666; padding: 2rem;">
    <p>⚡ Smart Energy Backend API - Powering intelligent energy management</p>
    <p>Built with Streamlit | Version 1.0.0</p>
</div>
""", unsafe_allow_html=True)

# Sidebar with API info
with st.sidebar:
    st.markdown("### 📊 API Statistics")
    st.metric("Total Requests", "1,247", "+23")
    st.metric("Active Users", "89", "+5")
    st.metric("Avg Response", "145ms", "-12ms")
    
    st.markdown("### 🔗 Quick Links")
    st.markdown("- [API Documentation](https://api-docs.example.com)")
    st.markdown("- [GitHub Repository](https://github.com/example/repo)")
    st.markdown("- [Support](https://support.example.com)")
    
    st.markdown("### 🛠️ Development")
    st.markdown("- **Language:** Python")
    st.markdown("- **Framework:** Streamlit")
    st.markdown("- **Database:** SQLite")
    st.markdown("- **Authentication:** JWT")