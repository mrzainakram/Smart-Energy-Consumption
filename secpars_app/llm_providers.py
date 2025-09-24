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

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

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
    if any(x in pl for x in ["energy", "consumption", "bill", "units", "kwh"]):
        return (
            "I'm SECPARS. I provide smart energy insights and recommendations. "
            "Ask about energy consumption, predictions, or tips to save costs."
        )
    return (
        "I'm SECPARS, your Smart Energy assistant. I can help with energy usage, predictions, and cost-saving tips. "
        "What would you like to know about your energy consumption?"
    )

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
    # Professional system prompt for SECPARS
    professional_system = """
    You are SECPARS - Smart Energy Consumption Prediction & Recommendation System.
    Keep answers concise (2-3 sentences), professional, and focused on user benefits.
    Never reveal internal technical details. Suggest one follow-up question.
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
    return {"gemini": [GEMINI_MODEL] if GEMINI_AVAILABLE else []}

def test_connection() -> Dict[str, Any]:
    if not _ensure_gemini():
        return {"status": "error", "message": "Gemini not configured", "provider": "gemini"}
    try:
        result = call_gemini_text("Hello, this is a test message.")
        return {"status": "success", "provider": "gemini", "response": (result[:100] + "...") if len(result) > 100 else result}
    except Exception as e:
        return {"status": "error", "message": str(e), "provider": "gemini"}
