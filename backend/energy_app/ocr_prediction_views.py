import os
import json
import pickle
import numpy as np
import pandas as pd
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import cv2
import pytesseract
from PIL import Image
import io
import base64
from datetime import datetime
from .models import SimplePredictionHistory as PredictionHistory

# Load trained models
def load_models():
    """Load all trained models from the model directory"""
    models = {}
    model_path = os.path.join(os.path.dirname(__file__), '..', 'model')
    print(f"DEBUG: Model path: {model_path}")
    print(f"DEBUG: Model path exists: {os.path.exists(model_path)}")
    
    model_files = {
        'lr_model.pkl': 'linear_regression',
        'rf_model.pkl': 'random_forest', 
        'gb_model.pkl': 'gradient_boosting',
        'lstm_model.pkl': 'lstm',
        'rnn_model.pkl': 'rnn'
    }
    
    for filename, model_name in model_files.items():
        filepath = os.path.join(model_path, filename)
        print(f"DEBUG: Checking {filepath} - exists: {os.path.exists(filepath)}")
        if os.path.exists(filepath):
            try:
                with open(filepath, 'rb') as f:
                    models[model_name] = pickle.load(f)
                print(f"DEBUG: Successfully loaded {model_name}")
            except Exception as e:
                print(f"Error loading {filename}: {e}")
        else:
            print(f"DEBUG: File not found: {filepath}")
    
    print(f"DEBUG: Total models loaded: {len(models)}")
    # Load scalers
    scalers = {}
    scaler_files = ['feature_scaler.pkl', 'target_scaler.pkl']
    for filename in scaler_files:
        filepath = os.path.join(model_path, filename)
        if os.path.exists(filepath):
            try:
                with open(filepath, 'rb') as f:
                    scalers[filename.replace('.pkl', '')] = pickle.load(f)
            except Exception as e:
                print(f"Error loading {filename}: {e}")
    
    return models, scalers

# LESCO Slab Rates 2025
LESCO_SLAB_RATES = {
    '1-100': 22,
    '101-200': 32,
    '201-300': 37,
    '301-400': 43,
    '401-500': 47,
    '501-600': 49,
    '601-700': 52,
    'above-700': 65
}

def calculate_slab_wise_bill(units):
    """Calculate bill using LESCO slab rates"""
    units = int(units)
    total_cost = 0
    
    if units <= 100:
        total_cost = units * LESCO_SLAB_RATES['1-100']
    elif units <= 200:
        total_cost = 100 * LESCO_SLAB_RATES['1-100'] + (units - 100) * LESCO_SLAB_RATES['101-200']
    elif units <= 300:
        total_cost = 100 * LESCO_SLAB_RATES['1-100'] + 100 * LESCO_SLAB_RATES['101-200'] + (units - 200) * LESCO_SLAB_RATES['201-300']
    elif units <= 400:
        total_cost = 100 * LESCO_SLAB_RATES['1-100'] + 100 * LESCO_SLAB_RATES['101-200'] + 100 * LESCO_SLAB_RATES['201-300'] + (units - 300) * LESCO_SLAB_RATES['301-400']
    elif units <= 500:
        total_cost = 100 * LESCO_SLAB_RATES['1-100'] + 100 * LESCO_SLAB_RATES['101-200'] + 100 * LESCO_SLAB_RATES['201-300'] + 100 * LESCO_SLAB_RATES['301-400'] + (units - 400) * LESCO_SLAB_RATES['401-500']
    elif units <= 600:
        total_cost = 100 * LESCO_SLAB_RATES['1-100'] + 100 * LESCO_SLAB_RATES['101-200'] + 100 * LESCO_SLAB_RATES['201-300'] + 100 * LESCO_SLAB_RATES['301-400'] + 100 * LESCO_SLAB_RATES['401-500'] + (units - 500) * LESCO_SLAB_RATES['501-600']
    elif units <= 700:
        total_cost = 100 * LESCO_SLAB_RATES['1-100'] + 100 * LESCO_SLAB_RATES['101-200'] + 100 * LESCO_SLAB_RATES['201-300'] + 100 * LESCO_SLAB_RATES['301-400'] + 100 * LESCO_SLAB_RATES['401-500'] + 100 * LESCO_SLAB_RATES['501-600'] + (units - 600) * LESCO_SLAB_RATES['601-700']
    else:
        total_cost = 100 * LESCO_SLAB_RATES['1-100'] + 100 * LESCO_SLAB_RATES['101-200'] + 100 * LESCO_SLAB_RATES['201-300'] + 100 * LESCO_SLAB_RATES['301-400'] + 100 * LESCO_SLAB_RATES['401-500'] + 100 * LESCO_SLAB_RATES['501-600'] + 100 * LESCO_SLAB_RATES['601-700'] + (units - 700) * LESCO_SLAB_RATES['above-700']
    
    return total_cost

def extract_bill_data_from_image(image):
    """Extract bill data using OCR"""
    try:
        # Convert to PIL Image
        if isinstance(image, bytes):
            pil_image = Image.open(io.BytesIO(image))
        else:
            pil_image = image
        
        # Convert to OpenCV format
        opencv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
        
        # Preprocess image for better OCR
        gray = cv2.cvtColor(opencv_image, cv2.COLOR_BGR2GRAY)
        thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
        
        # Extract text using Tesseract
        text = pytesseract.image_to_string(thresh)
        
        # Parse extracted text for bill data
        extracted_data = parse_bill_text(text)
        
        return extracted_data
        
    except Exception as e:
        print(f"OCR Error: {e}")
        return None

def parse_bill_text(text):
    """Parse OCR text to extract bill information"""
    lines = text.split('\n')
    extracted_data = {
        'consumed_units': None,
        'price': None,
        'gov_charges': None,
        'lesco_charges': None,
        'total_bill': None
    }
    
    for line in lines:
        line = line.strip().lower()
        
        # Extract consumed units
        if 'units' in line or 'consumed' in line:
            numbers = [int(s) for s in line.split() if s.isdigit()]
            if numbers:
                extracted_data['consumed_units'] = numbers[0]
        
        # Extract price per unit
        if 'price' in line or 'rate' in line or 'tariff' in line:
            numbers = [float(s) for s in line.split() if s.replace('.', '').isdigit()]
            if numbers:
                extracted_data['price'] = numbers[0]
        
        # Extract government charges
        if 'gov' in line or 'government' in line or 'duty' in line:
            numbers = [float(s) for s in line.split() if s.replace('.', '').isdigit()]
            if numbers:
                extracted_data['gov_charges'] = numbers[0]
        
        # Extract LESCO charges
        if 'lesco' in line or 'electricity' in line:
            numbers = [float(s) for s in line.split() if s.replace('.', '').isdigit()]
            if numbers:
                extracted_data['lesco_charges'] = numbers[0]
        
        # Extract total bill
        if 'total' in line or 'bill' in line:
            numbers = [float(s) for s in line.split() if s.replace('.', '').isdigit()]
            if numbers:
                extracted_data['total_bill'] = numbers[0]
    
    return extracted_data

@csrf_exempt
def scan_bill_view(request):
    """OCR endpoint for scanning bill images"""
    if request.method == 'POST':
        try:
            if 'image' not in request.FILES:
                return JsonResponse({
                    'success': False,
                    'message': 'No image file provided'
                }, status=400)
            
            image_file = request.FILES['image']
            
            # Read image data
            image_data = image_file.read()
            
            # Extract bill data using OCR
            extracted_data = extract_bill_data_from_image(image_data)
            
            if extracted_data:
                return JsonResponse({
                    'success': True,
                    'message': 'Bill scanned successfully',
                    'data': extracted_data
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Failed to extract data from image'
                }, status=400)
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error processing image: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def predict_energy_view(request):
    """Energy prediction endpoint using trained models"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            consumed_units = data.get('consumed_units')
            appliance_data = data.get('appliance_data', {})
            slab_wise_bill = data.get('slab_wise_bill')
            
            if not consumed_units:
                return JsonResponse({
                    'success': False,
                    'message': 'Consumed units are required'
                }, status=400)
            
            # Load models
            models, scalers = load_models()
            
            if not models:
                return JsonResponse({
                    'success': False,
                    'message': 'No trained models available'
                }, status=500)
            
            # Prepare features for prediction
            features = prepare_features(consumed_units, appliance_data)
            
            # Make predictions with all available models
            predictions = {}
            for model_name, model in models.items():
                try:
                    if hasattr(model, 'predict'):
                        # For scikit-learn models
                        prediction = model.predict([features])[0]
                    elif hasattr(model, 'predict_proba'):
                        # For models with predict_proba
                        prediction = model.predict_proba([features])[0][1]
                    else:
                        # For custom models
                        prediction = model.predict(features)
                    
                    predictions[model_name] = round(float(prediction), 2)
                except Exception as e:
                    print(f"Error with {model_name}: {e}")
                    predictions[model_name] = None
            
            # Calculate average prediction if multiple models available
            valid_predictions = [p for p in predictions.values() if p is not None]
            if valid_predictions:
                avg_prediction = round(sum(valid_predictions) / len(valid_predictions), 2)
            else:
                avg_prediction = consumed_units  # Fallback to current consumption
            
            # Generate recommendations
            recommendations = generate_recommendations(consumed_units, appliance_data, avg_prediction)
            
            # Save prediction to history
            try:
                PredictionHistory.objects.create(
                    consumed_units=consumed_units,
                    predicted_units=avg_prediction,
                    model_predictions=json.dumps(predictions),
                    appliance_data=json.dumps(appliance_data),
                    slab_wise_bill=slab_wise_bill,
                    timestamp=datetime.now()
                )
            except Exception as e:
                print(f"Error saving prediction history: {e}")
            
            return JsonResponse({
                'success': True,
                'message': 'Prediction generated successfully',
                'model_predictions': predictions,
                'average_prediction': avg_prediction,
                'recommendations': recommendations,
                'slab_wise_bill': calculate_slab_wise_bill(avg_prediction)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error generating prediction: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

def prepare_features(consumed_units, appliance_data):
    """Prepare features for model prediction"""
    features = [float(consumed_units)]
    
    # Add appliance consumption features
    appliance_features = [
        appliance_data.get('ac', 0),
        appliance_data.get('refrigerator', 0),
        appliance_data.get('oven', 0),
        appliance_data.get('washingMachine', 0),
        appliance_data.get('tv', 0)
    ]
    
    features.extend([float(x) if x else 0 for x in appliance_features])
    
    # Add time-based features (current month, day of week, etc.)
    now = datetime.now()
    features.extend([
        now.month,
        now.day,
        now.weekday(),
        now.hour
    ])
    
    return features

def generate_recommendations(consumed_units, appliance_data, predicted_units):
    """Generate energy-saving recommendations"""
    recommendations = []
    
    # Off-peak usage recommendations
    recommendations.append("Use heavy appliances during 10 PM - 6 AM for lower rates")
    recommendations.append("Run washing machine and dishwasher during off-peak hours")
    recommendations.append("Charge electric vehicles at night")
    
    # Appliance-specific recommendations
    if appliance_data.get('ac', 0) > 100:
        recommendations.append("Set AC temperature to 24°C for optimal energy efficiency")
        recommendations.append("Use AC during cooler evening hours")
    
    if appliance_data.get('refrigerator', 0) > 50:
        recommendations.append("Ensure refrigerator door seals are tight")
        recommendations.append("Don't leave refrigerator door open unnecessarily")
    
    if appliance_data.get('oven', 0) > 30:
        recommendations.append("Batch cooking during off-peak periods")
        recommendations.append("Use microwave for small meals instead of oven")
    
    # General recommendations based on consumption
    if consumed_units > 200:
        recommendations.append("Consider switching to LED lights to save energy")
        recommendations.append("Unplug devices when not in use")
    
    if predicted_units > consumed_units:
        recommendations.append("Monitor your energy usage to avoid high bills")
        recommendations.append("Consider energy-efficient appliances")
    
    return recommendations

@csrf_exempt
def get_prediction_history_view(request):
    """Get prediction history for the user"""
    if request.method == 'GET':
        try:
            # Get recent predictions (last 10)
            history = PredictionHistory.objects.order_by('-timestamp')[:10]
            
            history_data = []
            for entry in history:
                history_data.append({
                    'id': entry.id,
                    'consumed_units': entry.consumed_units,
                    'predicted_units': entry.predicted_units,
                    'model_predictions': json.loads(entry.model_predictions) if entry.model_predictions else {},
                    'appliance_data': json.loads(entry.appliance_data) if entry.appliance_data else {},
                    'slab_wise_bill': entry.slab_wise_bill,
                    'timestamp': entry.timestamp.isoformat()
                })
            
            return JsonResponse({
                'success': True,
                'history': history_data
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error retrieving history: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405) 