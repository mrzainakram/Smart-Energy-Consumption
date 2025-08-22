import os
from typing import List, Optional, Dict, Any
import base64
import google.generativeai as genai
from openai import OpenAI
from io import BytesIO

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
OPENAI_MODEL_TEXT = os.getenv("OPENAI_MODEL_TEXT", "gpt-4o-mini")
OPENAI_MODEL_VISION = os.getenv("OPENAI_MODEL_VISION", "gpt-4o-mini")

# Multi-key rotation support: set GEMINI_API_KEYS=key1,key2,... in env
_GEMINI_KEYS = [k.strip() for k in os.getenv("GEMINI_API_KEYS", "").split(",") if k.strip()]
_GEMINI_IDX = 0

def _ensure_gemini():
    global _GEMINI_IDX
    # Prefer rotating keys if provided; else fallback to single key
    if _GEMINI_KEYS:
        api_key = _GEMINI_KEYS[_GEMINI_IDX % len(_GEMINI_KEYS)]
        _GEMINI_IDX = (_GEMINI_IDX + 1) % max(1, len(_GEMINI_KEYS))
    else:
        api_key = os.getenv("GEMINI_API_KEY", "")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY or GEMINI_API_KEYS not configured")
    genai.configure(api_key=api_key)

def _ensure_openai() -> OpenAI:
    api_key = os.getenv("OPENAI_API_KEY", "")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY not configured")
    return OpenAI(api_key=api_key)

def call_gemini_text(prompt: str, system: Optional[str] = None) -> str:
    _ensure_gemini()
    model = genai.GenerativeModel(GEMINI_MODEL, system_instruction=system or "")
    resp = model.generate_content(prompt)
    return (resp.text or "").strip()

def call_gemini_multimodal(prompt: str, images: List[Dict]=None, audios: List[Dict]=None, system: Optional[str]=None) -> str:
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

def call_openai_text(prompt: str, system: Optional[str] = None) -> str:
    client = _ensure_openai()
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})
    resp = client.chat.completions.create(model=OPENAI_MODEL_TEXT, messages=messages)
    return resp.choices[0].message.content.strip()

def call_openai_vision(prompt: str, image_bytes: Optional[bytes] = None, image_mime: str = "image/png") -> str:
    client = _ensure_openai()
    content = [{"type": "text", "text": prompt}]
    if image_bytes:
        b64 = base64.b64encode(image_bytes).decode("utf-8")
        content.append({"type": "input_image", "image_data": {"b64": b64, "mime_type": image_mime}})
    resp = client.chat.completions.create(
        model=OPENAI_MODEL_VISION,
        messages=[{"role": "user", "content": content}],
    )
    return resp.choices[0].message.content.strip()

def choose_llm(prefer: str = "gemini") -> str:
    has_gemini_single = bool(os.getenv("GEMINI_API_KEY"))
    has_gemini_multi = bool(os.getenv("GEMINI_API_KEYS"))
    has_openai = bool(os.getenv("OPENAI_API_KEY"))
    has_gemini_any = has_gemini_single or has_gemini_multi

    if prefer == "gemini":
        if has_gemini_any:
            return "gemini"
        if has_openai:
            return "openai"
    elif prefer == "openai":
        if has_openai:
            return "openai"
        if has_gemini_any:
            return "gemini"
    else:  # auto
        if has_gemini_any:
            return "gemini"
        if has_openai:
            return "openai"
    raise RuntimeError("No LLM API keys configured. Set GEMINI_API_KEY or GEMINI_API_KEYS or OPENAI_API_KEY.")

def answer_text(prompt: str, system: Optional[str] = None, prefer: str = "gemini") -> str:
    provider = choose_llm(prefer)
    if provider == "gemini":
        return call_gemini_text(prompt, system)
    return call_openai_text(prompt, system)

def answer_multimodal(prompt: str, image_bytes: Optional[bytes], image_mime: Optional[str], system: Optional[str] = None, prefer: str = "gemini") -> str:
    provider = choose_llm(prefer)
    if image_bytes is None:
        return answer_text(prompt, system, prefer)
    if provider == "gemini":
        img_part = {"mime_type": image_mime or "image/png", "data": base64.b64encode(image_bytes).decode("utf-8")}
        return call_gemini_multimodal(prompt, images=[img_part], audios=None, system=system)
    return call_openai_vision(prompt, image_bytes, image_mime) 

# ===== Voice helpers =====

def transcribe_audio_with_gemini(audio_bytes: bytes, audio_mime: str = "audio/wav", system: Optional[str] = None) -> str:
    """Speech-to-text using Gemini. Returns plain transcript text."""
    au_part = {"mime_type": audio_mime or "audio/wav", "data": base64.b64encode(audio_bytes).decode("utf-8")}
    return call_gemini_multimodal(
        "Transcribe this audio accurately. Return ONLY the transcript text without any extra words.",
        images=None,
        audios=[au_part],
        system=system
    )

def transcribe_audio_with_openai(audio_bytes: bytes, audio_mime: str = "audio/wav") -> str:
    """Speech-to-text using OpenAI Whisper. Returns plain transcript text."""
    client = _ensure_openai()
    resp = client.audio.transcriptions.create(
        file=BytesIO(audio_bytes),
        model="whisper-1",
        response_format="text"
    )
    return resp.strip()

def answer_voice(prompt: str, audio_bytes: bytes, audio_mime: str = "audio/wav", system: Optional[str] = None, prefer: str = "gemini") -> str:
    """Process voice input and return text response."""
    # First transcribe the audio
    if prefer == "gemini":
        transcript = transcribe_audio_with_gemini(audio_bytes, audio_mime, system)
    else:
        transcript = transcribe_audio_with_openai(audio_bytes, audio_mime)
    
    # Then process the transcript with the LLM
    full_prompt = f"User said: {transcript}\n\nUser's question: {prompt}"
    return answer_text(full_prompt, system, prefer) 