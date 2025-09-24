from tensorflow.keras.models import load_model
import numpy as np
import os

# Load the LSTM model (updated to match your file name)
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'models', 'lstm_model_improved.h5')
model = None  # Initialize as None to handle loading conditionally

def load_model_if_exists():
    global model
    if model is None and os.path.exists(MODEL_PATH):
        model = load_model(MODEL_PATH)
    return model

def predict(input_data):
    model_instance = load_model_if_exists()
    if model_instance is None:
        raise ValueError("Model file not found or not loaded. Please ensure lstm_model_improved.h5 is in backend/models/")
    # Normalize and reshape for LSTM (adjust based on your training data)
    input_array = np.array([input_data]) / 100  # Example scaling
    input_array = input_array.reshape((input_array.shape[0], input_array.shape[1], 1))
    predicted_kwh = model_instance.predict(input_array)[0][0] * 100  # Example scaling back
    return float(predicted_kwh)

def generate_recommendations(predicted_kwh, weights, appliances):
    recommendations = []
    if predicted_kwh > 500:
        savings = 50.0
        recommendations.append({
            'text': f"Turn off unused {appliances[1]} to save energy.",
            'savings_kw': savings * weights[1]
        })
    elif predicted_kwh > 300:
        savings = 30.0
        recommendations.append({
            'text': f"Reduce usage of {appliances[0]} to save energy.",
            'savings_kw': savings * weights[0]
        })
    elif predicted_kwh > 100:
        savings = 10.0
        recommendations.append({
            'text': f"Optimize {appliances[2]} usage to save energy.",
            'savings_kw': savings * weights[2]
        })
    else:
        savings = 5.0
        recommendations.append({
            'text': f"Maintain low usage of {appliances[0]} to keep saving.",
            'savings_kw': savings * weights[0]
        })
    return recommendations