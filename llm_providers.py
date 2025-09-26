import os
from typing import Optional, Dict, Any
import base64
from io import BytesIO

# Try to import google.generativeai, but allow missing dependency
try:
    import google.generativeai as genai  # type: ignore
    GEMINI_AVAILABLE = True
except Exception:
    genai = None  # type: ignore
    GEMINI_AVAILABLE = False

# Use a stable default model on cloud
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

def _get_api_key() -> str:
    api_key = os.getenv("GEMINI_API_KEY", "")
    if api_key:
        return api_key
    try:
        import streamlit as st  # lazy import
        if hasattr(st, 'secrets') and 'GEMINI_API_KEY' in st.secrets:
            return st.secrets['GEMINI_API_KEY']
    except Exception:
        pass
    return ""

def _ensure_gemini() -> bool:
    if not GEMINI_AVAILABLE:
        return False
    api_key = _get_api_key()
    if not api_key:
        return False
    try:
        genai.configure(api_key=api_key)  # type: ignore
        return True
    except Exception:
        return False

def _fallback_response(prompt: str) -> str:
    pl = (prompt or "").lower()
    
    # Check if it's a greeting
    if any(x in pl for x in ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"]):
        return "Hi there! 👋 I'm SECPARS, your Smart Energy Assistant. I can help you with energy consumption predictions, bill analysis, and cost-saving tips. What would you like to know about your energy usage?"
    
    # Check if it's about SECPARS project
    if any(x in pl for x in ["secpars", "what is", "tell me about", "explain", "project"]):
        return """**SECPARS - Smart Energy Consumption Prediction & Recommendation System**

I'm an AI-powered energy management system designed for Pakistani households. Here's what I can do:

🔋 **Energy Predictions**: 16 advanced ML models for consumption forecasting
📷 **Bill Analysis**: OCR-powered bill scanning and data extraction  
🤖 **Smart Recommendations**: Personalized energy-saving tips
🏠 **House Comparison**: Benchmark your usage against similar households
💰 **LESCO Integration**: Pakistan-specific billing and rate calculations

**Key Features:**
- LSTM, Random Forest, Gradient Boosting models
- OpenCV + OCR for bill processing
- Django backend, React frontend
- ChromaDB for vector search

What specific aspect of SECPARS would you like to know more about?"""
    
    # Check if it's energy-related
    if any(x in pl for x in ["energy", "electricity", "consumption", "bill", "units", "kwh", "power", "saving", "efficiency"]):
        return """**Energy Management Tips:**

🔋 **Reduce Your Bill:**
- Use energy-efficient appliances (5-star rating)
- Turn off lights and electronics when not in use
- Use LED bulbs instead of incandescent
- Set AC temperature to 24-26°C

⚡ **Peak Usage:**
- Avoid heavy appliances during peak hours (6-10 PM)
- Use washing machine, iron during off-peak hours
- Consider time-of-use billing if available

🏠 **Home Optimization:**
- Insulate your home properly
- Use ceiling fans with AC
- Regular maintenance of appliances
- Monitor usage with smart meters

Would you like specific advice for your situation?"""
    
    # General fallback
    return """Hi! I'm SECPARS, your Smart Energy Assistant. I specialize in energy management, consumption predictions, and cost-saving strategies for Pakistani households. 

I can help you with:
- Energy consumption analysis
- Bill optimization tips
- Appliance efficiency advice
- LESCO billing information
- Smart energy solutions

What would you like to know about energy management?"""

def call_gemini_text(prompt: str, system: Optional[str] = None) -> str:
    if not _ensure_gemini():
        return _fallback_response(prompt)
    try:
        model = genai.GenerativeModel(GEMINI_MODEL, system_instruction=system or "")  # type: ignore
        resp = model.generate_content(prompt)
        return (getattr(resp, 'text', '') or '').strip() or _fallback_response(prompt)
    except Exception:
        return _fallback_response(prompt)

def call_gemini_multimodal(prompt: str, images: list = None, audios: list = None, system: Optional[str] = None) -> str:
    if not _ensure_gemini():
        return _fallback_response(prompt)
    try:
        model = genai.GenerativeModel(GEMINI_MODEL, system_instruction=system or "")  # type: ignore
        parts = []
        if prompt:
            parts.append(prompt)
        for img in images or []:
            parts.append({"inline_data": img})
        for au in audios or []:
            parts.append({"inline_data": au})
        resp = model.generate_content(parts)
        return (getattr(resp, 'text', '') or '').strip() or _fallback_response(prompt)
    except Exception:
        return _fallback_response(prompt)

def answer_text(prompt: str, system: Optional[str] = None) -> str:
    # Always try Gemini first, then fallback
    if _ensure_gemini():
        try:
            # Use system prompt if provided
            if system:
                return call_gemini_text(prompt, system)
            else:
                # Use default system prompt for better responses
                default_system = "You are SECPARS, a helpful AI assistant for Smart Energy Consumption Prediction and Recommendation System. Be friendly, concise, and provide helpful answers. For energy-related questions, provide specific insights. For general questions, be helpful and informative."
                return call_gemini_text(prompt, default_system)
        except Exception:
            return _fallback_response(prompt)
    else:
        return _fallback_response(prompt)

def answer_multimodal(prompt: str, image_bytes: Optional[bytes], image_mime: Optional[str], system: Optional[str] = None) -> str:
    if image_bytes is None:
        return answer_text(prompt, system)
    return call_gemini_multimodal(prompt, [{"mime_type": image_mime, "data": base64.b64encode(image_bytes).decode("utf-8")}], system=system)

def answer_audio(prompt: str, audio_bytes: Optional[bytes], audio_mime: Optional[str], system: Optional[str] = None) -> str:
    if audio_bytes is None:
        return answer_text(prompt, system)
    return call_gemini_multimodal(prompt, audios=[{"mime_type": audio_mime, "data": base64.b64encode(audio_bytes).decode("utf-8")}], system=system)

def get_available_models() -> Dict[str, list]:
    return {"gemini": [GEMINI_MODEL] if GEMINI_AVAILABLE else []}

def test_connection() -> Dict[str, Any]:
    if not _ensure_gemini():
        return {"status": "error", "message": "Gemini not configured", "provider": "gemini"}
    try:
        result = call_gemini_text("Hello, this is a test message.")
        return {"status": "success", "provider": "gemini", "response": (result[:100] + "...") if len(result) > 100 else result}
    except Exception as e:
        return {"status": "error", "message": str(e), "provider": "gemini"}
