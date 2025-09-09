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
    # Optimized system prompt for concise responses
    concise_system = """
    You are SECPARS - Smart Energy Consumption Prediction & Recommendation System.
    
    RESPONSE RULES:
    1. Keep answers SHORT and CONCISE (max 2-3 sentences)
    2. Answer ONLY what was asked
    3. Don't give extra details unless specifically requested
    4. End with 1-2 relevant follow-up questions
    5. Suggest related topics user might ask about
    
    Example format:
    [Direct answer to question]
    
    💡 You can also ask:
    - [Related question 1]
    - [Related question 2]
    """
    
    return call_gemini_text(prompt, system or concise_system)

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
