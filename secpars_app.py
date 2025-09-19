import os
import tempfile
from typing import Optional
from datetime import datetime
import streamlit as st

# Try to import optional dependencies
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    st.warning("dotenv not available, using environment variables only")

try:
    from rag_utils import (
        PROJECT_DATA_DIR, CHROMA_DIR,
        build_or_load_vectorstore,
        ingest_directory_into_store,
        add_uploaded_file,
        retrieve_with_scores
    )
    from llm_providers import answer_text
    RAG_AVAILABLE = True
except ImportError as e:
    st.error(f"RAG utilities not available: {e}")
    RAG_AVAILABLE = False

# Load Streamlit secrets for cloud deployment
if hasattr(st, 'secrets'):
    # Set environment variables from Streamlit secrets
    if 'GEMINI_API_KEY' in st.secrets:
        os.environ['GEMINI_API_KEY'] = st.secrets['GEMINI_API_KEY']
    if 'OPENAI_API_KEY' in st.secrets:
        os.environ['OPENAI_API_KEY'] = st.secrets['OPENAI_API_KEY']
    if 'PROJECT_DATA_DIR' in st.secrets:
        os.environ['PROJECT_DATA_DIR'] = st.secrets['PROJECT_DATA_DIR']
    if 'CHROMA_DIR' in st.secrets:
        os.environ['CHROMA_DIR'] = st.secrets['CHROMA_DIR']

# Clean Native Streamlit SECPARS Interface
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Poppins:wght@400;600;700;800;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Metal+Mania&display=swap');

body {
    font-family: 'Poppins', sans-serif;
    color: #ffffff; /* Ensure default text is white in dark mode */
}

.main-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.header-section {
    text-align: center;
    padding: 2rem 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20px;
    margin-bottom: 2rem;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.header-title {
    font-size: 3.5rem;
    font-weight: 900;
    margin: 0;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
    background-size: 400% 400%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradientShift 3s ease-in-out infinite;
}

@keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
}

.header-subtitle {
    font-size: 1.2rem;
    margin: 1rem 0 0 0;
    color: rgba(255,255,255,0.9);
    font-weight: 400;
}

.chat-container {
    background: rgba(255,255,255,0.05);
    border-radius: 20px;
    padding: 2rem;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.message {
    margin: 1rem 0;
    padding: 1rem;
    border-radius: 15px;
    animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.user-message {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    margin-left: 20%;
}

.assistant-message {
    background: rgba(255,255,255,0.1);
    color: white;
    margin-right: 20%;
    border: 1px solid rgba(255,255,255,0.2);
}

.input-container {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
}

.stTextInput > div > div > input {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 25px;
    color: white;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
}

.stTextInput > div > div > input::placeholder {
    color: rgba(255,255,255,0.6);
}

.stButton > button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 25px;
    padding: 0.75rem 2rem;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.stButton > button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.status-indicator {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 8px;
}

.status-online {
    background: #4ecdc4;
    box-shadow: 0 0 10px rgba(78, 205, 196, 0.5);
}

.status-offline {
    background: #ff6b6b;
    box-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
}

.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin: 2rem 0;
}

.feature-card {
    background: rgba(255,255,255,0.05);
    border-radius: 15px;
    padding: 1.5rem;
    text-align: center;
    border: 1px solid rgba(255,255,255,0.1);
    transition: all 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
}

.feature-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.feature-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #4ecdc4;
}

.feature-description {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.7);
    line-height: 1.4;
}

.loading-spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: #4ecdc4;
    animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.error-message {
    background: rgba(255, 107, 107, 0.1);
    border: 1px solid rgba(255, 107, 107, 0.3);
    color: #ff6b6b;
    padding: 1rem;
    border-radius: 10px;
    margin: 1rem 0;
}

.success-message {
    background: rgba(78, 205, 196, 0.1);
    border: 1px solid rgba(78, 205, 196, 0.3);
    color: #4ecdc4;
    padding: 1rem;
    border-radius: 10px;
    margin: 1rem 0;
}
</style>
""", unsafe_allow_html=True)

# Main App Interface
def main():
    # Header Section
    st.markdown("""
    <div class="header-section">
        <h1 class="header-title">SECPARS</h1>
        <p class="header-subtitle">Smart Energy Consumption Prediction & Analysis Recommendation System</p>
        <div style="margin-top: 1rem;">
            <span class="status-indicator status-online"></span>
            <span style="color: rgba(255,255,255,0.8);">AI Assistant Online</span>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # Feature Overview
    st.markdown("""
    <div class="feature-grid">
        <div class="feature-card">
            <div class="feature-icon">⚡</div>
            <div class="feature-title">Energy Prediction</div>
            <div class="feature-description">AI-powered energy consumption forecasting using advanced ML models</div>
        </div>
        <div class="feature-card">
            <div class="feature-icon">🏠</div>
            <div class="feature-title">Smart Analysis</div>
            <div class="feature-description">Comprehensive analysis of household energy patterns and efficiency</div>
        </div>
        <div class="feature-card">
            <div class="feature-icon">💡</div>
            <div class="feature-title">Recommendations</div>
            <div class="feature-description">Personalized suggestions to optimize energy usage and reduce costs</div>
        </div>
        <div class="feature-card">
            <div class="feature-icon">📊</div>
            <div class="feature-title">Data Insights</div>
            <div class="feature-description">Detailed analytics and visualizations of your energy consumption</div>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # Chat Interface
    st.markdown('<div class="chat-container">', unsafe_allow_html=True)
    
    if not RAG_AVAILABLE:
        st.error("⚠️ RAG utilities are not available. Some features may be limited.")
        st.info("This is a simplified version of SECPARS. For full functionality, ensure all dependencies are installed.")
    
    # Initialize chat history
    if "messages" not in st.session_state:
        st.session_state.messages = []
    
    # Display chat messages
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])
    
    # Chat input
    if prompt := st.chat_input("Ask me about energy consumption, predictions, or recommendations..."):
        # Add user message to chat history
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)
        
        # Generate assistant response
        with st.chat_message("assistant"):
            with st.spinner("Thinking..."):
                if RAG_AVAILABLE:
                    try:
                        # Use RAG system for response
                        response = answer_text(prompt)
                    except Exception as e:
                        response = f"I apologize, but I encountered an error: {str(e)}. Please try again."
                else:
                    # Fallback response without RAG
                    response = generate_fallback_response(prompt)
            
            st.markdown(response)
        
        # Add assistant response to chat history
        st.session_state.messages.append({"role": "assistant", "content": response})
    
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Footer
    st.markdown("""
    <div style="text-align: center; margin-top: 3rem; padding: 2rem; color: rgba(255,255,255,0.6);">
        <p>Powered by Advanced AI & Machine Learning | Smart Energy Solutions</p>
    </div>
    """, unsafe_allow_html=True)

def generate_fallback_response(prompt):
    """Generate a fallback response when RAG is not available"""
    prompt_lower = prompt.lower()
    
    if any(word in prompt_lower for word in ["energy", "consumption", "electricity", "bill"]):
        return """⚡ **Energy Consumption Analysis**

I can help you understand energy consumption patterns! Here are some key insights:

**Common Energy Consumers:**
- Air conditioning: 40-50% of total consumption
- Water heating: 15-20%
- Lighting: 10-15%
- Refrigeration: 8-12%

**Energy Saving Tips:**
- Use LED bulbs (80% less energy than incandescent)
- Set AC temperature to 24-26°C
- Unplug devices when not in use
- Regular maintenance of appliances

**For detailed analysis and predictions, please ensure all dependencies are properly installed.**"""
    
    elif any(word in prompt_lower for word in ["prediction", "forecast", "future"]):
        return """🔮 **Energy Prediction System**

Our AI system uses advanced machine learning models to predict energy consumption:

**Prediction Models:**
- Linear Regression for baseline trends
- Random Forest for complex patterns
- LSTM Neural Networks for time series
- Gradient Boosting for accuracy

**Prediction Factors:**
- Historical consumption data
- Weather patterns
- Seasonal variations
- Appliance usage patterns

**For real-time predictions, please ensure the full system is deployed.**"""
    
    elif any(word in prompt_lower for word in ["recommendation", "suggest", "optimize", "save"]):
        return """💡 **Energy Optimization Recommendations**

Here are personalized recommendations to optimize your energy usage:

**Immediate Actions:**
- Replace old appliances with energy-efficient models
- Install smart thermostats
- Use natural lighting during day
- Regular HVAC maintenance

**Long-term Strategies:**
- Consider solar panel installation
- Implement home automation
- Energy audit and monitoring
- Time-of-use optimization

**For personalized recommendations based on your data, please ensure the full system is available.**"""
    
    else:
        return """🤖 **SECPARS AI Assistant**

I'm here to help with energy consumption analysis and optimization! 

**What I can help with:**
- Energy consumption analysis
- Prediction and forecasting
- Cost optimization strategies
- Appliance efficiency tips
- Renewable energy guidance

**Please note:** Some advanced features require the full system deployment. For complete functionality, ensure all dependencies are installed.

How can I assist you with your energy needs today?"""

if __name__ == "__main__":
    main()
