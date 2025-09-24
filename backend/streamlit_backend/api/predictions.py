import os
import json
import pickle
import numpy as np
import pandas as pd
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime, timedelta
import joblib

# Load machine learning models
MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'model')

def load_models():
    """Load all machine learning models"""
    models = {}
    try:
        # Load different model types
        model_files = {
            'gb_model': 'gb_model.pkl',
            'rf_model': 'rf_model.pkl',
            'lr_model': 'lr_model.pkl',
            'lstm_model': 'lstm_model.pkl',
            'rnn_model': 'rnn_model.pkl',
            'feature_scaler': 'feature_scaler.pkl',
            'target_scaler': 'target_scaler.pkl'
        }
        
        for model_name, filename in model_files.items():
            file_path = os.path.join(MODEL_DIR, filename)
            if os.path.exists(file_path):
                try:
                    if filename.endswith('.pkl'):
                        models[model_name] = joblib.load(file_path)
                    print(f"Loaded {model_name} successfully")
                except Exception as e:
                    print(f"Error loading {model_name}: {e}")
        
        return models
    except Exception as e:
        print(f"Error loading models: {e}")
        return {}

# Load models on module import
MODELS = load_models()

def calculate_slab_billing(units, slab_rates=None):
    """Calculate bill amount based on slab-wise billing"""
    if slab_rates is None:
        # Default LESCO slab rates (example)
        slab_rates = {
            (0, 100): 3.95,      # First 100 units
            (101, 200): 7.14,    # 101-200 units
            (201, 300): 10.69,   # 201-300 units
            (301, 400): 16.22,   # 301-400 units
            (401, 500): 18.49,   # 401-500 units
            (501, float('inf')): 22.14  # Above 500 units
        }
    
    total_amount = 0
    remaining_units = units
    
    for (min_units, max_units), rate in slab_rates.items():
        if remaining_units <= 0:
            break
        
        if max_units == float('inf'):
            # Last slab
            slab_units = remaining_units
        else:
            slab_units = min(remaining_units, max_units - min_units + 1)
        
        total_amount += slab_units * rate
        remaining_units -= slab_units
    
    return round(total_amount, 2)

def prepare_features(appliances, bill_data=None, historical_data=None):
    """Prepare features for prediction"""
    features = {}
    
    # Appliance power consumption features
    appliance_powers = {
        'ac': 1500,
        'fridge': 150,
        'lights': 10,
        'tv': 100,
        'washing': 500,
        'heater': 2000
    }
    
    total_power = 0
    for appliance in appliances:
        if appliance in appliance_powers:
            total_power += appliance_powers[appliance]
    
    features['total_power'] = total_power
    features['appliance_count'] = len(appliances)
    
    # Historical data features
    if historical_data and len(historical_data) > 0:
        recent_data = historical_data[-3:]  # Last 3 months
        features['avg_units'] = np.mean([d['units'] for d in recent_data])
        features['avg_amount'] = np.mean([d['amount'] for d in recent_data])
        features['units_trend'] = recent_data[-1]['units'] - recent_data[0]['units'] if len(recent_data) > 1 else 0
    else:
        features['avg_units'] = 350  # Default average
        features['avg_amount'] = 50.0  # Default average
        features['units_trend'] = 0
    
    # Bill data features
    if bill_data:
        features['last_units'] = bill_data.get('units', 350)
        features['last_amount'] = bill_data.get('amount', 50.0)
    else:
        features['last_units'] = 350
        features['last_amount'] = 50.0
    
    # Seasonal features
    current_month = datetime.now().month
    features['is_summer'] = 1 if current_month in [5, 6, 7, 8] else 0
    features['is_winter'] = 1 if current_month in [12, 1, 2] else 0
    
    return features

def predict_consumption(features, model_type='ensemble'):
    """Predict energy consumption using loaded models"""
    try:
        if model_type == 'ensemble':
            # Use multiple models and average predictions
            predictions = []
            
            # Gradient Boosting
            if 'gb_model' in MODELS:
                gb_pred = MODELS['gb_model'].predict([list(features.values())])
                predictions.append(gb_pred[0])
            
            # Random Forest
            if 'rf_model' in MODELS:
                rf_pred = MODELS['rf_model'].predict([list(features.values())])
                predictions.append(rf_pred[0])
            
            # Linear Regression
            if 'lr_model' in MODELS:
                lr_pred = MODELS['lr_model'].predict([list(features.values())])
                predictions.append(lr_pred[0])
            
            if predictions:
                # Average predictions
                predicted_units = np.mean(predictions)
            else:
                # Fallback to simple calculation
                predicted_units = features['avg_units'] * 1.05  # 5% increase
        else:
            # Use specific model
            if model_type in MODELS:
                model = MODELS[model_type]
                predicted_units = model.predict([list(features.values())])[0]
            else:
                # Fallback
                predicted_units = features['avg_units'] * 1.05
        
        # Ensure prediction is reasonable
        predicted_units = max(100, min(1000, predicted_units))
        
        return round(predicted_units, 2)
        
    except Exception as e:
        print(f"Error in prediction: {e}")
        # Fallback prediction
        return round(features['avg_units'] * 1.05, 2)

def generate_recommendations(predicted_units, current_units, appliances):
    """Generate energy-saving recommendations"""
    recommendations = []
    
    # Basic recommendations
    if predicted_units > current_units:
        recommendations.append({
            'type': 'warning',
            'message': f'Your predicted consumption ({predicted_units} units) is higher than your current usage ({current_units} units).',
            'suggestion': 'Consider using appliances during off-peak hours (10 PM - 6 AM) to reduce costs.'
        })
    
    # Appliance-specific recommendations
    if 'ac' in appliances:
        recommendations.append({
            'type': 'info',
            'message': 'Air Conditioner detected',
            'suggestion': 'Set AC temperature to 24°C for optimal efficiency. Use ceiling fans to circulate air.'
        })
    
    if 'lights' in appliances:
        recommendations.append({
            'type': 'info',
            'message': 'LED Lights detected',
            'suggestion': 'Switch to LED bulbs if not already using them. Turn off lights when not in use.'
        })
    
    if 'heater' in appliances:
        recommendations.append({
            'type': 'warning',
            'message': 'Water Heater detected',
            'suggestion': 'Set water heater temperature to 60°C. Use timer to heat water only when needed.'
        })
    
    # General recommendations
    recommendations.append({
        'type': 'success',
        'message': 'Off-Peak Hours',
        'suggestion': 'Use high-power appliances between 10 PM - 6 AM to benefit from lower electricity rates.'
    })
    
    recommendations.append({
        'type': 'info',
        'message': 'Energy Monitoring',
        'suggestion': 'Install smart plugs to monitor individual appliance consumption and identify energy hogs.'
    })
    
    return recommendations

@csrf_exempt
def generate_prediction(request):
    """Generate energy consumption prediction"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            appliances = data.get('appliances', [])
            bill_data = data.get('bill_data', {})
            prediction_year = data.get('prediction_year', 2025)
            
            # Validate input
            if not appliances:
                return JsonResponse({
                    'success': False,
                    'message': 'Please select at least one appliance'
                }, status=400)
            
            # Prepare features
            features = prepare_features(appliances, bill_data)
            
            # Generate prediction
            predicted_units = predict_consumption(features)
            
            # Calculate bill amount using slab billing
            predicted_amount = calculate_slab_billing(predicted_units)
            
            # Generate recommendations
            current_units = bill_data.get('units', 350) if bill_data else 350
            recommendations = generate_recommendations(predicted_units, current_units, appliances)
            
            # Generate monthly predictions for the year
            monthly_predictions = []
            for month in range(1, 13):
                # Adjust prediction based on seasonal factors
                seasonal_factor = 1.0
                if month in [5, 6, 7, 8]:  # Summer months
                    seasonal_factor = 1.15
                elif month in [12, 1, 2]:  # Winter months
                    seasonal_factor = 1.10
                
                monthly_units = round(predicted_units * seasonal_factor, 2)
                monthly_amount = calculate_slab_billing(monthly_units)
                
                monthly_predictions.append({
                    'month': f"{datetime(2025, month, 1).strftime('%B %Y')}",
                    'units': monthly_units,
                    'amount': monthly_amount
                })
            
            return JsonResponse({
                'success': True,
                'message': 'Prediction generated successfully',
                'data': {
                    'predicted_units': predicted_units,
                    'predicted_amount': predicted_amount,
                    'monthly_predictions': monthly_predictions,
                    'recommendations': recommendations,
                    'model_info': {
                        'models_loaded': list(MODELS.keys()),
                        'features_used': list(features.keys()),
                        'prediction_method': 'ensemble'
                    }
                }
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': f'Error generating prediction: {str(e)}'
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_prediction_history(request):
    """Get prediction history for a user"""
    if request.method == 'GET':
        try:
            # Mock prediction history
            mock_history = [
                {
                    'date': '2024-01-15',
                    'predicted_units': 320,
                    'actual_units': 315,
                    'accuracy': 98.4
                },
                {
                    'date': '2024-02-15',
                    'predicted_units': 310,
                    'actual_units': 308,
                    'accuracy': 99.4
                },
                {
                    'date': '2024-03-15',
                    'predicted_units': 340,
                    'actual_units': 345,
                    'accuracy': 98.6
                }
            ]
            
            return JsonResponse({
                'success': True,
                'data': mock_history
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': str(e)
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def get_model_status(request):
    """Get status of loaded models"""
    if request.method == 'GET':
        try:
            model_status = {
                'models_loaded': list(MODELS.keys()),
                'total_models': len(MODELS),
                'model_types': {
                    'gradient_boosting': 'gb_model' in MODELS,
                    'random_forest': 'rf_model' in MODELS,
                    'linear_regression': 'lr_model' in MODELS,
                    'lstm': 'lstm_model' in MODELS,
                    'rnn': 'rnn_model' in MODELS
                },
                'scalers': {
                    'feature_scaler': 'feature_scaler' in MODELS,
                    'target_scaler': 'target_scaler' in MODELS
                }
            }
            
            return JsonResponse({
                'success': True,
                'data': model_status
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': str(e)
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405) 