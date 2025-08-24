import os
import tempfile
from typing import Optional
from datetime import datetime
import streamlit as st
from dotenv import load_dotenv
from rag_utils import (
    PROJECT_DATA_DIR, CHROMA_DIR,
    build_or_load_vectorstore,
    ingest_directory_into_store,
    add_uploaded_file,
    retrieve_with_scores
)
from llm_providers import answer_text

# Load environment variables from .env (local) or Streamlit secrets (cloud)
load_dotenv()

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

body {
    font-family: 'Poppins', sans-serif;
    color: #ffffff;
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
    font-size: 4.5rem;
    font-weight: 900;
    color: #ffffff;
    margin-bottom: 1rem;
    letter-spacing: 2px;
    text-shadow: 3px 3px 6px rgba(0,0,0,0.3);
    background: linear-gradient(45deg, #ff8c00, #ffa500, #ff8c00);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
}

    .title-main::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        height: 3px;
        background: linear-gradient(90deg, #ff8c00, #ffa500, #ff8c00);
        border-radius: 2px;
    }
    
    /* Mobile Text Visibility Fix */
    @media (max-width: 768px) {
        .stMarkdown, .stText, .stChatMessage {
            font-size: 16px !important;
            line-height: 1.5 !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
        }
        
        /* Fix SECPARS title on mobile */
        .main-header h1, .title-main {
            font-size: 2rem !important;
            font-weight: bold !important;
            color: #1f2937 !important;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1) !important;
            -webkit-text-fill-color: #1f2937 !important;
            background: none !important;
        }
        
        /* Mobile button sizing */
        .stButton > button {
            min-height: 44px !important;
            min-width: 44px !important;
            font-size: 16px !important;
        }
    }
    
    /* Light Mode Text Visibility */
    .stMarkdown, .stText, .stChatMessage {
        color: #1f2937 !important;
        background-color: transparent !important;
    }
    
    /* Chat message text visibility */
    .stChatMessage .stMarkdown {
        color: #1f2937 !important;
        background-color: transparent !important;
    }
    
    /* Sidebar text visibility */
    .css-1d391kg .stMarkdown {
        color: #1f2937 !important;
    }
    
    /* Title text visibility */
    h1, h2, h3, h4, h5, h6 {
        color: #1f2937 !important;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.1) !important;
    }
    
    /* Button text visibility */
    .stButton > button {
        color: #ffffff !important;
        background-color: #667eea !important;
        border: 1px solid #5a67d8 !important;
    }
    
    /* Input text visibility */
    .stTextInput > div > div > input {
        color: #1f2937 !important;
        background-color: #ffffff !important;
        border: 1px solid #d1d5db !important;
    }
    
    /* Selectbox text visibility */
    .stSelectbox > div > div > div {
        color: #1f2937 !important;
        background-color: #ffffff !important;
    }
    
    /* Caption text visibility */
    .stCaption {
        color: #6b7280 !important;
        font-size: 14px !important;
    }
    
    /* Subheader text visibility */
    .stSubheader {
        color: #374151 !important;
        font-weight: 600 !important;
    }
    
    .subtitle-main {
        font-family: 'Poppins', sans-serif;
        font-size: 1.5rem;
        color: #ffffff;
        margin-bottom: 1.2rem;
        font-weight: 700;
        line-height: 1.5;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    
    .caption-main {
        font-size: 1.3rem;
        color: #ffffff;
        font-weight: 600;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
</style>
""", unsafe_allow_html=True)

# Custom CSS for mobile responsiveness and light mode compatibility
st.markdown("""
<style>
    /* Mobile Text Visibility Fix */
    @media (max-width: 768px) {
        .stMarkdown, .stText, .stChatMessage {
            font-size: 16px !important;
            line-height: 1.5 !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
        }
        
        /* Fix SECPARS title on mobile */
        .main-header h1 {
            font-size: 2rem !important;
            font-weight: bold !important;
            color: #1f2937 !important;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1) !important;
        }
        
        /* Mobile button sizing */
        .stButton > button {
            min-height: 44px !important;
            min-width: 44px !important;
            font-size: 16px !important;
        }
    }
    
    /* Light Mode Text Visibility */
    .stMarkdown, .stText, .stChatMessage {
        color: #1f2937 !important;
        background-color: transparent !important;
    }
    
    /* Chat message text visibility */
    .stChatMessage .stMarkdown {
        color: #1f2937 !important;
        background-color: transparent !important;
    }
    
    /* Sidebar text visibility */
    .css-1d391kg .stMarkdown {
        color: #1f2937 !important;
    }
    
    /* Title text visibility */
    h1, h2, h3, h4, h5, h6 {
        color: #1f2937 !important;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.1) !important;
    }
    
    /* Button text visibility */
    .stButton > button {
        color: #ffffff !important;
        background-color: #667eea !important;
        border: 1px solid #5a67d8 !important;
    }
    
    /* Input text visibility */
    .stTextInput > div > div > input {
        color: #1f2937 !important;
        background-color: #ffffff !important;
        border: 1px solid #d1d5db !important;
    }
    
    /* Selectbox text visibility */
    .stSelectbox > div > div > div {
        color: #1f2937 !important;
        background-color: #ffffff !important;
    }
    
    /* Caption text visibility */
    .stCaption {
        color: #6b7280 !important;
        font-size: 14px !important;
    }
    
    /* Subheader text visibility */
    .stSubheader {
        color: #374151 !important;
        font-weight: 600 !important;
    }
</style>
""", unsafe_allow_html=True)

# Clean Native Header Section
st.markdown("""
<div class="main-container">
    <div class="header-section">
        <div class="logo-section">
            <div class="logo-icons">
                <span>⚡</span>
                <span>🔋</span>
                <span>💡</span>
                <span>🚀</span>
            </div>
            <div class="title-main">SECPARS</div>
            <div class="subtitle-main">Smart Energy Consumption Prediction & Recommendation System</div>
            <div class="caption-main">🚀 Your AI-powered energy management assistant. Ask me anything about SECPARS and smart energy consumption!</div>
        </div>
    </div>
</div>
""", unsafe_allow_html=True)

# Initialize session state
if "vs" not in st.session_state:
    st.session_state["vs"] = build_or_load_vectorstore()

if "messages" not in st.session_state:
    st.session_state["messages"] = [
        {"role": "assistant", "content": "Hello! 👋 I'm your AI Smart Energy Assistant. How can I help you today?"}
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
        "You are SECPARS — a human-like, respectful AI assistant for Smart Energy Consumption Prediction and Recommendation System. "
        "Be warm, concise, and speak naturally like a helpful person. "
        "If something is unclear, ask a short follow-up question. Prefer step-by-step explanations for tricky topics. "
        "Use the same courteous tone regardless of the provider (auto/gemini/openai).\n\n"
        
        "**SECPARS Project Knowledge - COMPREHENSIVE GUIDE:**\n"
        "- **Core Purpose**: AI-powered energy management system for Pakistani households using LESCO rates\n"
        "- **Key Features**: Energy predictions (16 ML models), Bill scanning (OCR), Appliance optimization, House comparison, LESCO billing\n"
        "- **ML Models**: LSTM, Random Forest, Gradient Boosting, SVR, Ensemble methods with TensorFlow/Scikit-learn\n"
        "- **Bill Processing**: OpenCV + OCR for electricity, gas, water bills with automatic data extraction\n"
        "- **Predictions**: Daily/weekly/monthly consumption, peak times, seasonal patterns, cost estimates\n"
        "- **Recommendations**: Energy-saving tips, appliance optimization, cost reduction strategies\n"
        "- **Tech Stack**: Django backend, React frontend, ChromaDB vector search, HuggingFace NLP\n"
        "- **Target Users**: Homeowners, energy analysts, utility companies in Pakistan\n\n"
        
        "**Response Strategy - ALWAYS PRIORITIZE PROJECT KNOWLEDGE:**\n"
        "- **Project Questions**: Use comprehensive SECPARS knowledge first, explain in detail\n"
        "- **Energy Topics**: Provide specific insights about Pakistani energy sector, LESCO rates, consumption patterns\n"
        "- **Technical Questions**: Explain architecture, models, APIs, and implementation details thoroughly\n"
        "- **Feature Questions**: Describe how each feature works, benefits, and usage examples\n"
        "- **General Questions**: Use Gemini knowledge, but maintain SECPARS context when relevant\n\n"
        
        "**Conversation Style:**\n"
        "- Be friendly, empathetic, and professional (please, thanks, I'm happy to help).\n"
        "- Use project knowledge first when relevant; otherwise answer from general knowledge.\n"
        "- Provide clear takeaways, bullet points, and short examples where useful.\n"
        "- Confirm understanding briefly and invite the user to continue.\n"
        "- Avoid long disclaimers; be direct and helpful.\n"
        "- Always mention SECPARS capabilities when discussing energy-related topics.\n"
        "- **IMPORTANT**: Do NOT start responses with greetings like 'Good morning/afternoon/evening'. Go directly to answering the question.\n\n"
        
        "**SECPARS Expertise Areas:**\n"
        "- Energy consumption prediction and analysis\n"
        "- Bill scanning and OCR processing\n"
        "- Machine learning models and algorithms\n"
        "- LESCO billing and rate calculations\n"
        "- Appliance optimization and recommendations\n"
        "- House comparison and benchmarking\n"
        "- Technical architecture and implementation\n"
        "- Energy saving strategies for Pakistan\n\n"
        + pol
    )

def _compose_ctx(q: str, ctx: str) -> str:
    return f"Project knowledge excerpts:\n{ctx}\n\nUser: {q}\nAnswer using only the excerpts if sufficient."

# Safe answer helper with graceful rate-limit fallback
def _answer_safe(prompt: str, *, use_ctx: bool = False, ctx: str | None = None) -> str:
    try:
        if use_ctx and ctx:
            full_prompt = _compose_ctx(prompt, ctx)
        else:
            full_prompt = prompt
        return answer_text(full_prompt, system=_system(lang_code))
    except Exception as e:
        msg = str(e)
        if "429" in msg or "quota" in msg.lower() or "rate" in msg.lower():
            # Try fallback provider
            try:
                return answer_text(full_prompt, system=_system(lang_code))
            except Exception:
                pass
            st.warning("I'm hitting temporary API limits. Please wait a few seconds and try again.")
            return "I'm currently rate-limited. Please try again in a short while."
        # Generic friendly error
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
        st.error(f"❌ **Upload failed:** {e}")
    st.markdown('</div>', unsafe_allow_html=True)

if up_img is not None:
    st.markdown('<div class="upload-result">', unsafe_allow_html=True)
    st.info(f"🖼️ **Image Selected:** {up_img.name}")
    st.image(up_img, caption=up_img.name, width=300)
    st.write(f"**Image size:** {up_img.size} bytes")
    st.write(f"**Image type:** {up_img.type}")
    st.markdown('</div>', unsafe_allow_html=True)

if up_audio is not None:
    st.markdown('<div class="upload-result">', unsafe_allow_html=True)
    st.info(f"🎵 **Audio Selected:** {up_audio.name}")
    st.audio(up_audio, format=up_audio.type or "audio/wav")
    st.write(f"**Audio size:** {up_audio.size} bytes")
    st.write(f"**Audio type:** {up_audio.type}")
    st.markdown('</div>', unsafe_allow_html=True)

# Clean Native Chat Input
st.markdown('<div class="main-container">', unsafe_allow_html=True)
user_q = st.chat_input("💬 Ask me anything about SECPARS and smart energy consumption...")

if user_q:
    st.session_state["messages"].append({"role":"user","content":user_q})
    with st.chat_message("user"): 
        st.markdown(user_q)

    with st.chat_message("assistant"):
        try:
            # Detect if query is project-related
            project_keywords = [
                # Specific energy-related phrases
                'energy consumption', 'reduce energy', 'save electricity', 
                'energy bill', 'power usage', 'electricity saving',
                'smart energy', 'energy optimization', 'cost reduction',
                'appliance efficiency', 'energy management',
                
                # More specific project-related phrases
                'how to lower electricity bill', 
                'reduce home energy usage', 
                'smart home energy',
                'energy saving tips',
                'household power consumption',
                'electricity cost reduction',
                
                # Technical and project-specific terms
                'energy prediction', 'bill scanning', 'machine learning',
                'ai energy analysis', 'power consumption prediction',
                'electricity usage patterns', 'energy efficiency tips',
                'smart appliance', 'renewable energy', 'energy monitoring',
                'electricity rate analysis', 'home energy audit',
                'energy saving strategies', 'power consumption insights'
            ]
            
            # More sophisticated project query detection
            def is_project_related_query(query):
                query_lower = query.lower().strip()
                words = query_lower.split()
                word_count = len(words)
                
                # Check for exact keyword matches
                keyword_match = any(keyword in query_lower for keyword in project_keywords)
                
                # More flexible context checks
                context_checks = (
                    keyword_match and 
                    (
                        (word_count >= 2 and word_count <= 3) or  # Short but specific queries
                        (word_count >= 4 and word_count <= 15)    # Longer detailed queries
                    )
                )
                
                return context_checks
            
            is_project_query = is_project_related_query(user_q)
            
            if is_project_query:
                with st.spinner("🔍 Searching in project data..."):
                    res = retrieve_with_scores(st.session_state["vs"], user_q, k=5)
                    rel = [(d,s) for d,s in res if s>=0.7]  # High relevance threshold
                    
                    if rel:
                        st.success(f"🎯 Project Knowledge Found (top {len(rel)} relevant chunks)")
                        ctx = "\n\n".join([f"[{i+1}] {d.page_content[:1200]}" for i,(d,_) in enumerate(rel)])
                        ans = _answer_safe(user_q, use_ctx=True, ctx=ctx)
                        
                        # Simple project knowledge response
                        st.markdown(f"""
**🏆 Project Knowledge Response**
{ans}

*[Sourced from SECPARS Project Knowledge Base]*
""", unsafe_allow_html=True)
                    else:
                        # Fallback to Gemini if no highly relevant project data
                        with st.spinner("🤖 Using Gemini AI..."):
                            ans = _answer_safe(
                                f"User: {user_q}\n\nProvide a helpful, comprehensive answer.",
                                use_ctx=False
                            )
                            
                            # Simple Gemini response
                            st.markdown(f"""
**🌐 Gemini AI Response**
{ans}

*[Generated by Gemini AI]*
""", unsafe_allow_html=True)
            else:
                # General or non-project query - Use Gemini only
                with st.spinner("🤖 Using Gemini AI..."):
                    ans = _answer_safe(
                        f"User: {user_q}\n\nProvide a helpful, comprehensive answer.",
                        use_ctx=False
                    )
                    
                    # Simple general response
                    st.markdown(f"""
**🌐 AI Response**
{ans}

*[Generated by Gemini AI]*
""", unsafe_allow_html=True)
            
            st.session_state["messages"].append({"role":"assistant","content":ans})
        except Exception as e:
            st.error(f"❌ Error: {str(e)}")
            st.session_state["messages"].append({"role":"assistant","content":f"Error: {e}"})

    # Mark sent to clear input on next render
    st.session_state["_sent_once"] = True
st.markdown('</div>', unsafe_allow_html=True) 