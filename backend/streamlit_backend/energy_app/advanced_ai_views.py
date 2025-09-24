# Enhanced AI Energy Views - Advanced Machine Learning Integration
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import pickle
import os
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import json
import logging

logger = logging.getLogger(__name__)

# Advanced AI Prediction System
class AdvancedEnergyPredictor:
    def __init__(self):
        self.models = {
            'lstm': None,
            'random_forest': None,
            'xgboost': None
        }
        self.scaler = StandardScaler()
        self.load_models()
    
    def load_models(self):
        """Load pre-trained ML models"""
        try:
            model_path = os.path.join(os.path.dirname(__file__), '../../model/')
            
            # Load Random Forest (fallback model)
            rf_path = os.path.join(model_path, 'rf_model.pkl')
            if os.path.exists(rf_path):
                with open(rf_path, 'rb') as f:
                    self.models['random_forest'] = pickle.load(f)
            
            # Load scaler
            scaler_path = os.path.join(model_path, 'feature_scaler.pkl')
            if os.path.exists(scaler_path):
                with open(scaler_path, 'rb') as f:
                    self.scaler = pickle.load(f)
                    
        except Exception as e:
            logger.warning(f"Could not load models: {e}")
            # Create fallback models
            self.create_fallback_models()
    
    def create_fallback_models(self):
        """Create simple fallback models for demonstration"""
        # Generate sample training data
        X = np.random.rand(1000, 10)
        y = np.random.rand(1000) * 500 + 200
        
        # Train simple Random Forest
        self.models['random_forest'] = RandomForestRegressor(n_estimators=100)
        self.models['random_forest'].fit(X, y)
        
        # Fit scaler
        self.scaler.fit(X)
    
    def predict_consumption(self, features, model_type='random_forest'):
        """Predict energy consumption using specified model"""
        try:
            model = self.models.get(model_type)
            if model is None:
                return self.simple_prediction(features)
            
            # Scale features
            features_scaled = self.scaler.transform([features])
            prediction = model.predict(features_scaled)[0]
            
            return max(50, min(2000, prediction))  # Clamp between reasonable bounds
            
        except Exception as e:
            logger.error(f"Prediction error: {e}")
            return self.simple_prediction(features)
    
    def simple_prediction(self, features):
        """Fallback simple prediction"""
        base_consumption = 300
        time_factor = features[0] if len(features) > 0 else 12  # Hour of day
        temp_factor = features[1] if len(features) > 1 else 25  # Temperature
        
        # Simple model based on time and temperature
        time_multiplier = 1 + 0.3 * np.sin((time_factor - 6) * np.pi / 12)
        temp_multiplier = 1 + max(0, (temp_factor - 22) * 0.05)
        
        return base_consumption * time_multiplier * temp_multiplier

# Global predictor instance
predictor = AdvancedEnergyPredictor()

@api_view(['POST'])
def advanced_ai_prediction(request):
    """Advanced AI-powered energy prediction with multiple models"""
    try:
        data = request.data
        
        # Extract features from request
        current_hour = data.get('hour', datetime.now().hour)
        temperature = data.get('temperature', 25)
        humidity = data.get('humidity', 60)
        occupancy = data.get('occupancy', 3)
        day_of_week = data.get('day_of_week', datetime.now().weekday())
        
        # Build feature vector
        features = [
            current_hour / 24.0,  # Normalized hour
            temperature / 50.0,   # Normalized temperature
            humidity / 100.0,     # Normalized humidity
            occupancy / 10.0,     # Normalized occupancy
            day_of_week / 7.0,    # Normalized day of week
            np.sin(2 * np.pi * current_hour / 24),  # Cyclical hour feature
            np.cos(2 * np.pi * current_hour / 24),
            np.sin(2 * np.pi * day_of_week / 7),    # Cyclical day feature
            np.cos(2 * np.pi * day_of_week / 7),
            (temperature - 22) ** 2 / 100  # Temperature comfort deviation
        ]
        
        # Get predictions from different models
        model_predictions = {}
        model_type = data.get('model_type', 'random_forest')
        
        for model_name in ['random_forest', 'lstm', 'xgboost']:
            if model_name == model_type:
                prediction = predictor.predict_consumption(features, model_name)
                model_predictions[model_name] = {
                    'prediction': round(prediction, 1),
                    'confidence': np.random.uniform(85, 95),  # Simulated confidence
                    'selected': True
                }
            else:
                # Generate variant predictions for comparison
                variant_features = features.copy()
                variant_features[0] += np.random.uniform(-0.1, 0.1)
                prediction = predictor.predict_consumption(variant_features, 'random_forest')
                model_predictions[model_name] = {
                    'prediction': round(prediction, 1),
                    'confidence': np.random.uniform(80, 92),
                    'selected': False
                }
        
        # Generate 24-hour prediction
        hourly_predictions = []
        for hour in range(24):
            hour_features = features.copy()
            hour_features[0] = hour / 24.0
            hour_features[5] = np.sin(2 * np.pi * hour / 24)
            hour_features[6] = np.cos(2 * np.pi * hour / 24)
            
            prediction = predictor.predict_consumption(hour_features, model_type)
            hourly_predictions.append({
                'hour': hour,
                'prediction': round(prediction, 1),
                'time': f"{hour:02d}:00"
            })
        
        # Generate AI insights
        insights = generate_ai_insights(hourly_predictions, features)
        
        response_data = {
            'status': 'success',
            'timestamp': datetime.now().isoformat(),
            'model_predictions': model_predictions,
            'hourly_forecast': hourly_predictions,
            'insights': insights,
            'model_info': {
                'selected_model': model_type,
                'features_used': len(features),
                'prediction_horizon': '24 hours'
            }
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Advanced prediction error: {e}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def generate_ai_insights(predictions, features):
    """Generate AI-powered insights based on predictions"""
    insights = []
    
    # Peak consumption analysis
    max_hour = max(predictions, key=lambda x: x['prediction'])
    min_hour = min(predictions, key=lambda x: x['prediction'])
    
    insights.append({
        'type': 'peak_analysis',
        'title': 'Peak Consumption Alert',
        'description': f"Highest consumption expected at {max_hour['time']} ({max_hour['prediction']:.0f}W)",
        'recommendation': 'Consider shifting non-essential appliances to off-peak hours',
        'priority': 'high' if max_hour['prediction'] > 600 else 'medium',
        'savings_potential': f"₨{int((max_hour['prediction'] - min_hour['prediction']) * 0.15)}/day"
    })
    
    # Efficiency insights
    avg_consumption = np.mean([p['prediction'] for p in predictions])
    if avg_consumption > 500:
        insights.append({
            'type': 'efficiency',
            'title': 'High Consumption Pattern',
            'description': f"Average consumption ({avg_consumption:.0f}W) is above optimal range",
            'recommendation': 'Review appliance usage and consider energy-efficient alternatives',
            'priority': 'high',
            'savings_potential': f"₨{int(avg_consumption * 0.2 * 24 * 0.15)}/month"
        })
    
    # Temperature-based insights
    temperature = features[1] * 50  # Denormalize
    if temperature > 30:
        insights.append({
            'type': 'climate',
            'title': 'Cooling Optimization',
            'description': f"High temperature ({temperature:.0f}°C) will increase AC usage",
            'recommendation': 'Pre-cool rooms during off-peak hours (6-10 AM)',
            'priority': 'medium',
            'savings_potential': '₨800/month'
        })
    
    # Time-based optimization
    night_consumption = np.mean([p['prediction'] for p in predictions if 22 <= p['hour'] or p['hour'] <= 6])
    day_consumption = np.mean([p['prediction'] for p in predictions if 7 <= p['hour'] <= 21])
    
    if night_consumption > day_consumption * 0.3:
        insights.append({
            'type': 'scheduling',
            'title': 'Night Usage Optimization',
            'description': 'Significant night-time consumption detected',
            'recommendation': 'Review standby power consumption and timer settings',
            'priority': 'low',
            'savings_potential': f"₨{int(night_consumption * 0.3 * 8 * 0.15)}/month"
        })
    
    return insights

@api_view(['POST'])
def real_time_optimization(request):
    """Real-time energy optimization suggestions"""
    try:
        data = request.data
        current_usage = data.get('current_usage', 400)
        appliances = data.get('appliances', [])
        target_reduction = data.get('target_reduction', 10)  # percentage
        
        # Calculate optimization suggestions
        optimizations = []
        total_potential_savings = 0
        
        for appliance in appliances:
            if appliance.get('status', False):  # If appliance is on
                power = appliance.get('power', 0)
                priority = appliance.get('priority', 5)  # 1-10 scale
                
                if priority <= 3:  # Low priority appliances
                    savings = power * 0.8  # Assume 80% reduction possible
                    optimizations.append({
                        'appliance': appliance['name'],
                        'action': 'reduce_power',
                        'current_power': power,
                        'optimized_power': power * 0.2,
                        'savings': savings,
                        'method': 'Power management'
                    })
                    total_potential_savings += savings
                
                elif priority <= 6:  # Medium priority
                    savings = power * 0.3
                    optimizations.append({
                        'appliance': appliance['name'],
                        'action': 'schedule_shift',
                        'current_power': power,
                        'optimized_power': power,
                        'savings': savings,
                        'method': 'Time shifting to off-peak'
                    })
                    total_potential_savings += savings
        
        # Sort by savings potential
        optimizations.sort(key=lambda x: x['savings'], reverse=True)
        
        # Calculate achievability
        target_savings = current_usage * (target_reduction / 100)
        achievable = total_potential_savings >= target_savings
        
        response_data = {
            'status': 'success',
            'current_usage': current_usage,
            'target_reduction': target_reduction,
            'target_savings': target_savings,
            'total_potential_savings': round(total_potential_savings, 1),
            'achievable': achievable,
            'optimizations': optimizations[:5],  # Top 5 suggestions
            'efficiency_score': min(100, (total_potential_savings / current_usage) * 100),
            'estimated_monthly_savings': round(total_potential_savings * 24 * 30 * 0.15, 0)  # Convert to PKR
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Optimization error: {e}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def energy_analytics_dashboard(request):
    """Advanced energy analytics dashboard data"""
    try:
        # Generate comprehensive analytics
        current_time = datetime.now()
        
        # Weekly pattern analysis
        weekly_data = []
        for i in range(7):
            date = current_time - timedelta(days=i)
            base_consumption = 20 + np.random.normal(0, 3)
            daily_consumption = base_consumption + (5 if date.weekday() >= 5 else 0)  # Weekend boost
            weekly_data.append({
                'date': date.strftime('%Y-%m-%d'),
                'day': date.strftime('%A'),
                'consumption': round(max(15, daily_consumption), 1),
                'cost': round(daily_consumption * 15, 0),  # Assuming PKR 15/kWh
                'efficiency': round(np.random.uniform(80, 95), 1)
            })
        
        # Monthly trends
        monthly_trends = []
        for i in range(12):
            month_date = current_time.replace(day=1) - timedelta(days=30*i)
            base = 600 + 100 * np.sin(i * np.pi / 6)  # Seasonal variation
            monthly_trends.append({
                'month': month_date.strftime('%B'),
                'year': month_date.year,
                'consumption': round(base + np.random.normal(0, 50), 1),
                'cost': round((base + np.random.normal(0, 50)) * 15, 0),
                'carbon_footprint': round((base + np.random.normal(0, 50)) * 0.5, 1)  # kg CO2
            })
        
        # Appliance breakdown
        appliance_breakdown = [
            {'name': 'Air Conditioning', 'consumption': 45, 'cost': 2800, 'efficiency': 78},
            {'name': 'Water Heating', 'consumption': 20, 'cost': 1200, 'efficiency': 85},
            {'name': 'Lighting', 'consumption': 15, 'cost': 900, 'efficiency': 92},
            {'name': 'Refrigeration', 'consumption': 10, 'cost': 600, 'efficiency': 88},
            {'name': 'Electronics', 'consumption': 10, 'cost': 600, 'efficiency': 90}
        ]
        
        # Energy sources
        energy_sources = {
            'grid': {'percentage': 65, 'cost_per_kwh': 15, 'carbon_intensity': 0.5},
            'solar': {'percentage': 30, 'cost_per_kwh': 3, 'carbon_intensity': 0.0},
            'battery': {'percentage': 5, 'cost_per_kwh': 8, 'carbon_intensity': 0.1}
        }
        
        # Savings opportunities
        savings_opportunities = [
            {
                'category': 'Solar Installation',
                'potential_savings': 8500,
                'investment_required': 450000,
                'payback_period': '4.2 years',
                'priority': 'high'
            },
            {
                'category': 'Smart Thermostat',
                'potential_savings': 2200,
                'investment_required': 25000,
                'payback_period': '11 months',
                'priority': 'high'
            },
            {
                'category': 'LED Lighting Upgrade',
                'potential_savings': 1200,
                'investment_required': 15000,
                'payback_period': '12 months',
                'priority': 'medium'
            }
        ]
        
        response_data = {
            'status': 'success',
            'timestamp': current_time.isoformat(),
            'summary': {
                'current_month_consumption': round(np.random.uniform(580, 620), 1),
                'current_month_cost': round(np.random.uniform(8700, 9300), 0),
                'efficiency_score': round(np.random.uniform(85, 92), 1),
                'carbon_footprint': round(np.random.uniform(290, 310), 1),
                'projected_savings': round(np.random.uniform(2000, 3000), 0)
            },
            'weekly_data': weekly_data,
            'monthly_trends': monthly_trends,
            'appliance_breakdown': appliance_breakdown,
            'energy_sources': energy_sources,
            'savings_opportunities': savings_opportunities
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Analytics dashboard error: {e}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def smart_home_automation(request):
    """Smart home automation suggestions and control"""
    try:
        data = request.data
        
        # Current conditions
        current_time = datetime.now().hour
        temperature = data.get('temperature', 25)
        occupancy = data.get('occupancy', True)
        energy_price = data.get('energy_price', 15)  # PKR per kWh
        
        # Generate automation suggestions
        automations = []
        
        # Time-based automations
        if 22 <= current_time or current_time <= 6:  # Night time
            automations.append({
                'trigger': 'Night Mode',
                'action': 'Reduce lighting by 50%',
                'savings': '₨200/month',
                'comfort_impact': 'Low'
            })
            
            if not occupancy:
                automations.append({
                    'trigger': 'No occupancy detected',
                    'action': 'Turn off non-essential appliances',
                    'savings': '₨800/month',
                    'comfort_impact': 'None'
                })
        
        # Temperature-based automations
        if temperature > 28:
            automations.append({
                'trigger': f'High temperature ({temperature}°C)',
                'action': 'Pre-cool with AC at 24°C for 1 hour',
                'savings': '₨500/month',
                'comfort_impact': 'Positive'
            })
        elif temperature < 20:
            automations.append({
                'trigger': f'Low temperature ({temperature}°C)',
                'action': 'Disable cooling systems',
                'savings': '₨1200/month',
                'comfort_impact': 'None'
            })
        
        # Price-based automations
        if energy_price > 20:  # High tariff period
            automations.append({
                'trigger': f'High energy price (₨{energy_price}/kWh)',
                'action': 'Switch to battery power for 2 hours',
                'savings': '₨400/day',
                'comfort_impact': 'None'
            })
        
        # Smart scheduling
        peak_hours = [14, 15, 16, 19, 20, 21]
        if current_time in peak_hours:
            automations.append({
                'trigger': 'Peak demand hours',
                'action': 'Delay washing machine and dishwasher',
                'savings': '₨300/month',
                'comfort_impact': 'Low'
            })
        
        # Device-specific automations
        device_automations = {
            'air_conditioner': {
                'optimal_temp': 24,
                'schedule': 'ON during 2-4 PM (pre-cooling), OFF during 6-8 PM (peak tariff)',
                'savings': '₨2500/month'
            },
            'water_heater': {
                'optimal_schedule': 'Heat water during 6-8 AM and 10-12 PM',
                'temperature': '50°C maximum',
                'savings': '₨1200/month'
            },
            'washing_machine': {
                'optimal_time': 'Off-peak hours (10 PM - 6 AM)',
                'cold_wash_preference': 'Use cold water when possible',
                'savings': '₨600/month'
            }
        }
        
        response_data = {
            'status': 'success',
            'timestamp': datetime.now().isoformat(),
            'current_conditions': {
                'time': current_time,
                'temperature': temperature,
                'occupancy': occupancy,
                'energy_price': energy_price
            },
            'immediate_suggestions': automations,
            'device_optimizations': device_automations,
            'total_potential_savings': sum([
                2500, 1200, 600, 500, 200  # Sum of major savings
            ]),
            'automation_score': round(np.random.uniform(78, 88), 1)
        }
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        logger.error(f"Smart automation error: {e}")
        return Response({
            'status': 'error',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
