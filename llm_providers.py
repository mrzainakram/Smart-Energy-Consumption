import os
from typing import Optional, Dict, Any
import base64
from io import BytesIO

# Try to import google.generativeai, but don't fail if it's not available
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    genai = None
    GEMINI_AVAILABLE = False

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

def _ensure_gemini():
    if not GEMINI_AVAILABLE:
        return False, "Google Generative AI not available"
    
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key:
        return False, "GEMINI_API_KEY not found in environment variables"
    
    try:
        genai.configure(api_key=api_key)
        return True, "Gemini configured successfully"
    except Exception as e:
        return False, f"Failed to configure Gemini: {str(e)}"

def answer_text(question: str, context: str = "") -> str:
    """Answer a question using Gemini AI with fallback responses"""
    
    if not GEMINI_AVAILABLE:
        return _get_fallback_response(question)
    
    success, message = _ensure_gemini()
    if not success:
        return _get_fallback_response(question)
    
    try:
        # Create a simple prompt
        prompt = f"""
        You are an AI assistant for Smart Energy Consumption Prediction and Analysis (SECPARS).
        
        Context: {context}
        Question: {question}
        
        Please provide a helpful response about energy consumption, predictions, or recommendations.
        Keep your response concise and practical.
        """
        
        model = genai.GenerativeModel(GEMINI_MODEL)
        response = model.generate_content(prompt)
        return response.text if response.text else _get_fallback_response(question)
        
    except Exception as e:
        return _get_fallback_response(question)

def _get_fallback_response(question: str) -> str:
    """Provide fallback responses when AI is not available"""
    question_lower = question.lower()
    
    if any(word in question_lower for word in ["energy", "consumption", "electricity", "bill"]):
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

**Note:** For detailed AI-powered analysis, please ensure all dependencies are installed."""
    
    elif any(word in question_lower for word in ["prediction", "forecast", "future"]):
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

**Note:** For real-time AI predictions, please ensure all dependencies are installed."""
    
    elif any(word in question_lower for word in ["recommendation", "suggest", "optimize", "save"]):
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

**Note:** For personalized AI recommendations, please ensure all dependencies are installed."""
    
    else:
        return """🤖 **SECPARS AI Assistant**

I'm here to help with energy consumption analysis and optimization! 

**What I can help with:**
- Energy consumption analysis
- Prediction and forecasting
- Cost optimization strategies
- Appliance efficiency tips
- Renewable energy guidance

**Note:** Some advanced AI features require the full system deployment. For complete functionality, ensure all dependencies are installed.

How can I assist you with your energy needs today?"""

# Additional functions for compatibility
def generate_response(prompt: str, context: str = "") -> str:
    """Generate a response using available AI models"""
    return answer_text(prompt, context)

def get_ai_insights(question: str) -> str:
    """Get AI insights for a given question"""
    return answer_text(question)
