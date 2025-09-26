import os
import tempfile
from typing import Optional
from datetime import datetime
import streamlit as st

# Try to import dotenv, but don't fail if it's not available
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from rag_utils import (
    PROJECT_DATA_DIR, CHROMA_DIR,
    build_or_load_vectorstore,
    ingest_directory_into_store,
    add_uploaded_file,
    retrieve_with_scores
)
from llm_providers import answer_text

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
    margin: 1rem 0;
}

.logo-section {
    margin-bottom: 1.5rem;
}

.logo-icons {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.logo-icons span {
    animation: bounce 2s ease-in-out infinite;
    animation-delay: calc(var(--i) * 0.1s);
}

.logo-icons span:nth-child(1) { --i: 1; }
.logo-icons span:nth-child(2) { --i: 2; }
.logo-icons span:nth-child(3) { --i: 3; }
.logo-icons span:nth-child(4) { --i: 4; }

@keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-8px); }
    60% { transform: translateY(-4px); }
}

.title-main {
    font-family: 'Poppins', sans-serif;
    font-size: 3.8rem; /* Slightly reduced font size */
    font-weight: 900;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0;
    line-height: 1.1;
}

.subtitle {
    font-family: 'Poppins', sans-serif;
    font-size: 1.2rem;
    font-weight: 600;
    color: #a0a0a0;
    margin: 0.5rem 0 0 0;
    opacity: 0.9;
}

.chat-container {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 2rem;
    margin: 2rem 0;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.section-title {
    font-family: 'Poppins', sans-serif;
    font-size: 1.8rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 1.5rem;
    text-align: center;
}

.project-info-content {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 15px;
    padding: 1.5rem;
    margin: 1rem 0;
}

.upload-collapsible {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 10px;
    padding: 1rem;
}

.upload-result {
    background: rgba(0, 255, 0, 0.1);
    border-radius: 10px;
    padding: 1rem;
    margin: 1rem 0;
    border-left: 4px solid #00ff00;
}

/* Responsive design */
@media (max-width: 768px) {
    .title-main {
        font-size: 2.5rem;
    }
    
    .subtitle {
        font-size: 1rem;
    }
    
    .chat-container {
        padding: 1rem;
        margin: 1rem 0;
    }
    
    .logo-icons {
        font-size: 3rem;
    }
}
</style>
""", unsafe_allow_html=True)

# Main Header
st.markdown('<div class="main-container">', unsafe_allow_html=True)
st.markdown('<div class="header-section">', unsafe_allow_html=True)
st.markdown('<div class="logo-section">', unsafe_allow_html=True)
st.markdown('<div class="logo-icons">', unsafe_allow_html=True)
st.markdown('⚡🔋💡🌱', unsafe_allow_html=True)
st.markdown('</div>', unsafe_allow_html=True)
st.markdown('<h1 class="title-main">SECPARS</h1>', unsafe_allow_html=True)
st.markdown('<p class="subtitle">Smart Energy Consumption Prediction & Recommendation System</p>', unsafe_allow_html=True)
st.markdown('</div>', unsafe_allow_html=True)
st.markdown('</div>', unsafe_allow_html=True)

# Initialize session state
if "vs" not in st.session_state:
    with st.spinner("🔄 Loading SECPARS knowledge base..."):
        st.session_state["vs"] = build_or_load_vectorstore()
        if st.session_state["vs"] is None:
            st.warning("⚠️ Knowledge base not available. Using AI-only mode.")

if "messages" not in st.session_state:
    st.session_state["messages"] = [
        {"role": "assistant", "content": "Hi there! 👋 I'm SECPARS, your Smart Energy Assistant. I can help you with energy consumption predictions, bill analysis, and cost-saving tips. What would you like to know about your energy usage?"}
    ]

# Clean Native Sidebar
with st.sidebar:
    st.title("🔧 Configuration")
    
    # LLM Provider Preference
    prefer = st.selectbox(
        "LLM Provider Preference",
        ["auto", "gemini", "openai"],
        help="Choose your preferred AI model"
    )
    
    # Language Selection
    lang_code = st.selectbox(
        "Language",
        ["auto", "en", "ur"],
        help="Choose your preferred language"
    )
    
    st.markdown("---")
    
    # System Status
    st.subheader("📊 System Status")
    
    # Project data path
    st.caption(f"Project data: {PROJECT_DATA_DIR}")
    
    # Chroma DB path
    st.caption(f"Chroma DB: {CHROMA_DIR}")
    
    # API Key Status
    st.caption(f"GEMINI_API_KEY: {'set' if os.getenv('GEMINI_API_KEY') else 'missing'}")
    st.caption(f"OPENAI_API_KEY: {'set' if os.getenv('OPENAI_API_KEY') else 'missing'}")
    
    # Re-ingest button
    if st.button("Re-ingest project_data/now"):
        with st.spinner("Re-ingesting project data..."):
            st.session_state["vs"] = build_or_load_vectorstore()
        st.success("✅ Project data re-ingested!")

# Project Information (Hidden by default - Click to expand)
st.markdown('<div class="main-container">', unsafe_allow_html=True)
with st.expander("📋 **Project Information & How to Use SECPARS**", expanded=False):
    st.markdown('<div class="project-info-content">', unsafe_allow_html=True)
    st.markdown("""
    ## 🚀 **SECPARS - Smart Energy Consumption Prediction & Recommendation System**
    
    ### **What is SECPARS?**
    SECPARS is an AI-powered energy management system designed specifically for Pakistani households. It helps you understand, optimize, and save on your energy consumption.
    
    ### **Key Features:**
    - **📊 Energy Predictions**: 16 advanced ML models for consumption forecasting
    - **📷 Bill Analysis**: OCR-powered bill scanning and data extraction
    - **🤖 Smart Recommendations**: Personalized energy-saving tips
    - **🏠 House Comparison**: Benchmark your usage against similar households
    - **💰 LESCO Integration**: Pakistan-specific billing and rate calculations
    
    ### **How to Use:**
    1. **Ask Questions**: Type any energy-related question in the chat
    2. **Get Insights**: Receive AI-powered analysis and recommendations
    3. **Save Money**: Learn how to reduce your electricity bills
    4. **Track Progress**: Monitor your energy consumption over time
    
    ### **Example Questions:**
    - "How can I reduce my electricity bill?"
    - "What's my peak usage time?"
    - "How does LESCO billing work?"
    - "What appliances use the most power?"
    
    ### **Technology Stack:**
    - **Backend**: Django + Python
    - **AI Models**: LSTM, Random Forest, Gradient Boosting
    - **Frontend**: React + Modern UI
    - **Database**: ChromaDB for vector search
    - **OCR**: OpenCV for bill processing
    
    ---
    *Click this expander anytime to review this information!*
    """)
    st.markdown('</div>', unsafe_allow_html=True)
st.markdown('</div>', unsafe_allow_html=True)

# Chat Interface After Project Information
st.markdown('<div class="chat-container">', unsafe_allow_html=True)
st.markdown('<div class="section-title">💬 Chat with SECPARS</div>', unsafe_allow_html=True)

for m in st.session_state["messages"]:
    with st.chat_message(m["role"]):
        st.markdown(m["content"])
st.markdown('</div>', unsafe_allow_html=True)

def _system(lang: str) -> str:
    pol = {"en":"Respond ONLY in English.","ur":"Respond ONLY in Urdu script.","roman-ur":"Respond ONLY in Roman Urdu."}.get(lang,"Respond ONLY in English.")
    return (
        "You are SECPARS — a helpful AI assistant for Smart Energy Consumption Prediction and Recommendation System. "
        "Be friendly, concise, and speak naturally like a helpful person. "
        "Always prioritize project knowledge when answering energy-related questions. "
        "For general questions, provide helpful answers. "
        "Keep responses to-the-point and practical.\n\n"
        
        "**SECPARS Project Knowledge:**\n"
        "- **Core Purpose**: AI-powered energy management system for Pakistani households using LESCO rates\n"
        "- **Key Features**: Energy predictions (16 ML models), Bill scanning (OCR), Appliance optimization, House comparison, LESCO billing\n"
        "- **ML Models**: LSTM, Random Forest, Gradient Boosting, SVR, Ensemble methods\n"
        "- **Bill Processing**: OpenCV + OCR for electricity, gas, water bills with automatic data extraction\n"
        "- **Predictions**: Daily/weekly/monthly consumption, peak times, seasonal patterns, cost estimates\n"
        "- **Recommendations**: Energy-saving tips, appliance optimization, cost reduction strategies\n"
        "- **Tech Stack**: Django backend, React frontend, ChromaDB vector search\n"
        "- **Target Users**: Homeowners, energy analysts, utility companies in Pakistan\n\n"
        
        "**Response Guidelines:**\n"
        "- For energy/project questions: Use SECPARS knowledge first\n"
        "- For general questions: Use your general knowledge\n"
        "- Be warm and helpful: 'Hi!', 'Great question!', 'I'd be happy to help!'\n"
        "- Keep answers concise but informative\n"
        "- Provide practical, actionable advice\n"
        "- Always mention SECPARS capabilities when relevant\n\n"
        + pol
    )

def _compose_ctx(q: str, ctx: str) -> str:
    return f"Project knowledge:\n{ctx}\n\nUser: {q}\nAnswer using the project knowledge above."

# Safe answer helper with graceful fallback
def _answer_safe(prompt: str, *, use_ctx: bool = False, ctx: str | None = None) -> str:
    try:
        if use_ctx and ctx:
            full_prompt = _compose_ctx(prompt, ctx)
        else:
            full_prompt = prompt
        return answer_text(full_prompt)
    except Exception as e:
        msg = str(e)
        if "429" in msg or "quota" in msg.lower() or "rate" in msg.lower():
            st.warning("I'm hitting temporary API limits. Please wait a few seconds and try again.")
            return "I'm currently rate-limited. Please try again in a short while."
        st.error("Sorry, something went wrong while generating the response.")
        return "I'm sorry—something went wrong while generating the response. Please try again."

# Hidden File Upload Section (Horizontal, Small Size)
st.markdown('<div class="main-container">', unsafe_allow_html=True)
with st.expander("📎 File Upload", expanded=False):
    st.markdown('<div class="upload-collapsible">', unsafe_allow_html=True)
    st.markdown("### 📎 Upload Files")
    
    # Horizontal layout with small size
    col1, col2, col3 = st.columns(3)
    with col1:
        up_doc = st.file_uploader("📄 Document", type=["pdf","docx","txt","md"], key="up_doc", label_visibility="collapsed")
    with col2:
        up_img = st.file_uploader("🖼️ Image", type=["png","jpg","jpeg"], key="up_img", label_visibility="collapsed")
    with col3:
        up_audio = st.file_uploader("🎵 Audio", type=["mp3","wav","m4a"], key="up_audio", label_visibility="collapsed")
    
    st.markdown('</div>', unsafe_allow_html=True)
st.markdown('</div>', unsafe_allow_html=True)

# Handle uploads with results
if up_doc is not None:
    st.markdown('<div class="upload-result">', unsafe_allow_html=True)
    st.info(f"📎 **Document Selected:** {up_doc.name}")
    try:
        suffix = f".{up_doc.name.split('.')[-1]}".lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(up_doc.read()); path = tmp.name
        add_uploaded_file(st.session_state["vs"], path)
        st.success("✅ **Successfully added to knowledge base!**")
        st.write(f"**File processed:** {up_doc.name}")
        st.write(f"**File size:** {up_doc.size} bytes")
        st.write(f"**File type:** {up_doc.type}")
    except Exception as e:
        st.error(f"❌ **Error processing document:** {str(e)}")
    st.markdown('</div>', unsafe_allow_html=True)

if up_img is not None:
    st.markdown('<div class="upload-result">', unsafe_allow_html=True)
    st.info(f"🖼️ **Image Selected:** {up_img.name}")
    try:
        suffix = f".{up_img.name.split('.')[-1]}".lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(up_img.read()); path = tmp.name
        add_uploaded_file(st.session_state["vs"], path)
        st.success("✅ **Successfully added to knowledge base!**")
        st.write(f"**File processed:** {up_img.name}")
        st.write(f"**File size:** {up_img.size} bytes")
        st.write(f"**File type:** {up_img.type}")
    except Exception as e:
        st.error(f"❌ **Error processing image:** {str(e)}")
    st.markdown('</div>', unsafe_allow_html=True)

if up_audio is not None:
    st.markdown('<div class="upload-result">', unsafe_allow_html=True)
    st.info(f"�� **Audio Selected:** {up_audio.name}")
    try:
        suffix = f".{up_audio.name.split('.')[-1]}".lower()
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(up_audio.read()); path = tmp.name
        add_uploaded_file(st.session_state["vs"], path)
        st.success("✅ **Successfully added to knowledge base!**")
        st.write(f"**File processed:** {up_audio.name}")
        st.write(f"**File size:** {up_audio.size} bytes")
        st.write(f"**File type:** {up_audio.type}")
    except Exception as e:
        st.error(f"❌ **Error processing audio:** {str(e)}")
    st.markdown('</div>', unsafe_allow_html=True)

# Chat input and processing
if prompt := st.chat_input("Ask me anything about energy consumption, predictions, or SECPARS..."):
    st.session_state["messages"].append({"role": "user", "content": prompt})
    
    with st.chat_message("user"):
        st.markdown(prompt)
    
    with st.chat_message("assistant"):
        try:
            user_q = prompt.strip()
            
            # Project-related keywords
            project_keywords = [
                'energy', 'electricity', 'consumption', 'prediction', 'bill', 'lesco',
                'appliance', 'power', 'usage', 'cost', 'saving', 'efficiency',
                'smart energy', 'energy management', 'electricity bill',
                'energy consumption', 'power consumption', 'energy efficiency',
                'electricity usage', 'energy saving', 'bill analysis',
                'energy prediction', 'consumption prediction', 'energy optimization',
                'electricity usage patterns', 'energy efficiency tips',
                'smart appliance', 'renewable energy', 'energy monitoring',
                'electricity rate analysis', 'home energy audit',
                'energy saving strategies', 'power consumption insights',
                'secpars', 'smart energy consumption', 'energy recommendation'
            ]
            
            # Check if query is project-related
            def is_project_related_query(query):
                query_lower = query.lower().strip()
                return any(keyword in query_lower for keyword in project_keywords)
            
            is_project_query = is_project_related_query(user_q)
            
            if is_project_query and st.session_state["vs"] is not None:
                # Search in project knowledge first
                with st.spinner("🔍 Searching SECPARS knowledge base..."):
                    res = retrieve_with_scores(st.session_state["vs"], user_q, k=5)
                    rel = [(d,s) for d,s in res if s>=0.6]  # Medium relevance threshold
                    
                    if rel:
                        ctx = "\n\n".join([f"[{i+1}] {d[:800]}" for i,(d,_) in enumerate(rel)])
                        ans = _answer_safe(user_q, use_ctx=True, ctx=ctx)
                    else:
                        # Fallback to general AI if no relevant project data
                        ans = _answer_safe(user_q, use_ctx=False)
            else:
                # General query - Use AI directly
                ans = _answer_safe(user_q, use_ctx=False)
            
            st.markdown(ans)
            st.session_state["messages"].append({"role":"assistant","content":ans})
        except Exception as e:
            st.error(f"❌ Error: {str(e)}")
            st.session_state["messages"].append({"role":"assistant","content":f"Error: {e}"})

st.markdown('</div>', unsafe_allow_html=True)
