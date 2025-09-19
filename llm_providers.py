import os
from typing import Optional, Dict, Any
import base64
import google.generativeai as genai
from io import BytesIO

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

def _ensure_gemini():
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key:
        try:
            import streamlit as st
            if hasattr(st, 'secrets') and 'GEMINI_API_KEY' in st.secrets:
                api_key = st.secrets['GEMINI_API_KEY']
        except Exception:
            pass

    if not api_key:
        raise RuntimeError("GEMINI_API_KEY not configured")
    genai.configure(api_key=api_key)

def call_gemini_text(prompt: str, system: Optional[str] = None) -> str:
    _ensure_gemini()
    model = genai.GenerativeModel(GEMINI_MODEL, system_instruction=system or "")
    resp = model.generate_content(prompt)
    return (resp.text or "").strip()

def call_gemini_multimodal(prompt: str, images: list = None, audios: list = None, system: Optional[str] = None) -> str:
    _ensure_gemini()
    model = genai.GenerativeModel(GEMINI_MODEL, system_instruction=system or "")
    parts = []
    if prompt:
        parts.append(prompt)
    for img in images or []:
        parts.append({"inline_data": img})
    for au in audios or []:
        parts.append({"inline_data": au})
    resp = model.generate_content(parts)
    return (resp.text or "").strip()

def answer_text(prompt: str, system: Optional[str] = None) -> str:
    # Professional system prompt for SECPARS
    professional_system = """
    You are SECPARS - Smart Energy Consumption Prediction & Recommendation System.
    
    CORE IDENTITY:
    - I'm your AI assistant for smart energy management
    - I help predict energy consumption and provide recommendations
    - I'm designed to make energy usage more efficient and cost-effective
    
    RESPONSE RULES:
    1. Keep answers SHORT and PROFESSIONAL (max 2-3 sentences)
    2. Answer ONLY what was asked - no extra technical details
    3. NEVER reveal internal technical details (models, APIs, endpoints, algorithms)
    4. NEVER share implementation specifics or code details
    5. Focus on USER BENEFITS, not technical implementation
    6. End with 1-2 relevant follow-up questions
    7. Maintain professional tone always
    
    GREETING RESPONSE:
    When user greets, respond with:
    "Hello! I'm SECPARS, your Smart Energy Consumption assistant. I help predict energy usage and provide recommendations to save costs and improve efficiency. How can I assist you with your energy management needs today?"
    
    TECHNICAL QUESTIONS:
    - If asked about "how predictions work" → "I use advanced AI algorithms to analyze your energy patterns and predict future consumption"
    - If asked about "models" → "I use machine learning models trained on energy data to make accurate predictions"
    - If asked about "APIs" → "I connect to various data sources to provide comprehensive energy insights"
    - NEVER mention specific model names, endpoints, or technical architecture
    
    PRIVACY PROTECTION:
    - Never reveal internal system details
    - Never share code or implementation specifics
    - Never mention specific technologies or frameworks
    - Focus on user benefits and outcomes only
    
    Example format:
    [Direct, professional answer]
    
    💡 You can also ask:
    - [Related question 1]
    - [Related question 2]
    """
    
    return call_gemini_text(prompt, system or professional_system)

def answer_multimodal(prompt: str, image_bytes: Optional[bytes], image_mime: Optional[str], system: Optional[str] = None) -> str:
    if image_bytes is None:
        return answer_text(prompt, system)
    return call_gemini_multimodal(prompt, [{"mime_type": image_mime, "data": base64.b64encode(image_bytes).decode("utf-8")}], system=system)

def answer_audio(prompt: str, audio_bytes: Optional[bytes], audio_mime: Optional[str], system: Optional[str] = None) -> str:
    if audio_bytes is None:
        return answer_text(prompt, system)
    return call_gemini_multimodal(prompt, audios=[{"mime_type": audio_mime, "data": base64.b64encode(audio_bytes).decode("utf-8")}], system=system)

def get_available_models() -> Dict[str, list]:
    return {"gemini": [GEMINI_MODEL]}

def test_connection() -> Dict[str, Any]:
    try:
        result = call_gemini_text("Hello, this is a test message.")
        return {"status": "success", "provider": "gemini", "response": result[:100] + "..." if len(result) > 100 else result}
    except Exception as e:
        return {"status": "error", "message": str(e), "provider": "gemini"}
