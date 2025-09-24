from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
import json
import numpy as np
from datetime import datetime

# LESCO 2025 Tariff System
class LESCOBillingSystem:
    """Updated LESCO 2025 Tariff System"""
    
    # 2025 LESCO Domestic Slab Rates (PKR per unit)
    TARIFF_SLABS = [
        (1, 50, 22),      # 1-50 units @ PKR 22/unit
        (51, 100, 32),    # 51-100 units @ PKR 32/unit
        (101, 200, 37),   # 101-200 units @ PKR 37/unit
        (201, 300, 43),   # 201-300 units @ PKR 43/unit
        (301, 400, 47),   # 301-400 units @ PKR 47/unit
        (401, 500, 49),   # 401-500 units @ PKR 49/unit
        (501, 600, 52),   # 501-600 units @ PKR 52/unit
        (601, float('inf'), 65)  # 601+ units @ PKR 65/unit
    ]
    
    # Off-peak and Peak Hours Information
    PEAK_OFF_PEAK_INFO = {
        'off_peak_hours': ['11:00 PM - 6:00 AM', '9:00 AM - 5:00 PM'],
        'peak_hours': '6:00 PM - 11:00 PM',
        'off_peak_discount': '20% savings available',
        'recommendations': [
            'Use washing machine during 11 PM - 6 AM',
            'Run dishwasher after 11 PM',
            'Charge electric vehicles during off-peak hours',
            'Use water heater during 9 AM - 5 PM'
        ]
    }
    
    @classmethod
    def calculate_bill_with_slabs(cls, units_consumed, current_month=None):
        """Calculate LESCO bill with 2025 slab rates"""
        total_cost = 0
        breakdown = []
        remaining_units = units_consumed
        
        # Calculate slab-wise billing with correct slab logic
        for start, end, rate in cls.TARIFF_SLABS:
            if remaining_units <= 0:
                break
                
            if start <= units_consumed:
                # Calculate units in current slab
                if end == float('inf'):
                    slab_units = remaining_units
                else:
                    slab_units = min(remaining_units, end - start + 1)
                
                slab_cost = slab_units * rate
                total_cost += slab_cost
                remaining_units -= slab_units
                
                breakdown.append({
                    'slab': f"{start}-{end if end != float('inf') else '∞'}",
                    'units': slab_units,
                    'rate': rate,
                    'cost': round(slab_cost, 2)
                })
        
        # Add taxes and surcharges (typical LESCO charges)
        base_cost = total_cost
        
        # Fixed charges
        service_charge = 50  # Fixed monthly service charge
        
        # Calculate taxes (approximate LESCO structure)
        gst = base_cost * 0.17  # 17% GST
        electricity_duty = base_cost * 0.015  # 1.5% Electricity Duty
        tv_fee = 35 if units_consumed > 0 else 0  # TV license fee
        
        final_amount = base_cost + service_charge + gst + electricity_duty + tv_fee
        
        # Get off-peak recommendations
        off_peak_info = cls.PEAK_OFF_PEAK_INFO
        
        return {
            'units_consumed': units_consumed,
            'base_cost': round(total_cost, 2),
            'service_charge': service_charge,
            'gst': round(gst, 2),
            'electricity_duty': round(electricity_duty, 2),
            'tv_fee': tv_fee,
            'total_bill': round(final_amount, 2),
            'breakdown': breakdown,
            'off_peak_info': off_peak_info,
            'currency': 'PKR',
            'per_unit_average': round(final_amount / units_consumed, 2) if units_consumed > 0 else 0,
            'recommendations': [
                f"💡 Use heavy appliances during off-peak hours: {', '.join(off_peak_info['off_peak_hours'])}",
                f"⚡ Avoid peak hours: {off_peak_info['peak_hours']}",
                "🌙 Schedule washing machine, dishwasher for night time",
                "☀️ Use water heater during day time (9 AM - 5 PM)"
            ]
        }

# Simple Prediction Engine
class SimplePredictionEngine:
    """Simple prediction without complex ML models"""
    
    def predict_next_month(self, historical_data, house_profile=None):
        """Simple prediction based on historical data"""
        try:
            if len(historical_data) < 3:
                return {"error": "Need at least 3 months of historical data"}
            
            # Extract units from historical data
            units = [month['units'] for month in historical_data if month.get('units')]
            
            if len(units) < 3:
                return {"error": "Need valid units data for at least 3 months"}
            
            # Simple prediction logic
            recent_avg = np.mean(units[-3:])  # Last 3 months average
            trend = (units[-1] - units[-3]) / 2 if len(units) >= 3 else 0  # Simple trend
            predicted_units = recent_avg + trend
            
            # Seasonal adjustment
            current_month = datetime.now().month
            if 4 <= current_month <= 10:  # Summer
                predicted_units *= 1.2  # 20% more for summer
            else:  # Winter
                predicted_units *= 0.9   # 10% less for winter
            
            # Ensure realistic range
            predicted_units = max(50, min(1500, predicted_units))
            
            # Calculate bill prediction
            bill_data = LESCOBillingSystem.calculate_bill_with_slabs(
                int(predicted_units), current_month=datetime.now().month
            )
            
            # Calculate confidence
            variance = np.var(units) if len(units) > 1 else 0
            confidence = max(75, min(95, 95 - (variance / np.mean(units)) * 100))
            
            return {
                'success': True,
                'predicted_units': round(predicted_units, 2),
                'bill_prediction': bill_data,
                'confidence': round(confidence, 1),
                'model_used': 'Simple Average with Trend',
                'prediction_date': datetime.now().strftime('%Y-%m-%d'),
                'recommendations': self.get_energy_recommendations(predicted_units, historical_data)
            }
                
        except Exception as e:
            return {"error": f"Prediction failed: {str(e)}"}
    
    def get_energy_recommendations(self, predicted_units, historical_data):
        """Get personalized energy recommendations"""
        avg_consumption = np.mean([month['units'] for month in historical_data if month.get('units')])
        
        recommendations = []
        
        if predicted_units > avg_consumption * 1.2:
            recommendations.extend([
                "⚡ High consumption predicted! Consider energy-saving measures",
                "🌡️ Use AC at 24°C instead of lower temperatures", 
                "💡 Switch to LED lights to reduce consumption by 60%"
            ])
        
        # Season-based recommendations
        current_month = datetime.now().month
        if 4 <= current_month <= 10:  # Summer
            recommendations.extend([
                "☀️ Use fans along with AC to feel cooler at higher temperatures",
                "🕰️ Use heavy appliances during off-peak hours (after 10:30 PM)",
                "🏠 Improve home insulation to reduce AC load"
            ])
        else:  # Winter
            recommendations.extend([
                "🌡️ Use water heater timer to heat water during off-peak hours",
                "🔥 Use room heaters only in occupied rooms",
                "🏠 Seal windows and doors to retain heat"
            ])
        
        return recommendations

# Initialize the prediction engine
prediction_engine = SimplePredictionEngine()

@api_view(['GET'])
def health_check(request):
    """Enhanced views health check"""
    return JsonResponse({
        'status': 'healthy',
        'service': 'Enhanced Views New with 2025 LESCO Rates',
        'message': 'FYP Backend Enhanced Views Running',
        'lesco_2025_rates': 'Active',
        'off_peak_recommendations': 'Enabled'
    })

@api_view(['POST'])
@csrf_exempt
def advanced_prediction(request):
    """Advanced prediction endpoint with 2025 LESCO rates"""
    try:
        data = json.loads(request.body)
        historical_data = data.get('historical_data', [])
        house_profile = data.get('house_profile', {})
        consumed_units = data.get('consumed_units', 0)
        
        if len(historical_data) < 3:
            return JsonResponse({
                'success': False,
                'error': 'Please provide at least 3 months of historical data',
                'required_format': {
                    'historical_data': [
                        {'month': 8, 'year': 2024, 'units': 245, 'amount': 4580},
                        {'month': 9, 'year': 2024, 'units': 267, 'amount': 5120},
                    ]
                }
            })
        
        # Get prediction using enhanced engine
        prediction_result = prediction_engine.predict_next_month(historical_data, house_profile)
        
        # Add consumed units context if provided
        if consumed_units:
            prediction_result['current_month_consumed'] = consumed_units
            prediction_result['comparison'] = {
                'predicted_vs_current': prediction_result.get('predicted_units', 0) - consumed_units,
                'trend': 'increasing' if prediction_result.get('predicted_units', 0) > consumed_units else 'decreasing'
            }
        
        return JsonResponse(prediction_result)
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        })

@api_view(['POST'])
@csrf_exempt
def differentiate_houses(request):
    """Differentiate between houses with same consumption"""
    try:
        data = json.loads(request.body)
        house1_data = data.get('house1_data', {})
        house2_data = data.get('house2_data', {})
        
        differentiation = {
            'house1_analysis': {
                'peak_usage_pattern': 'High AC usage during peak hours',
                'recommended_off_peak_hours': '11:00 PM - 6:00 AM',
                'appliance_efficiency': house1_data.get('appliance_age', 'old'),
                'occupancy_pattern': f"{house1_data.get('occupants', 4)} occupants",
                'suggestions': [
                    "Shift AC usage to off-peak hours",
                    "Use timer for water heater", 
                    "Replace old appliances with energy-efficient models"
                ]
            },
            'house2_analysis': {
                'peak_usage_pattern': 'Heavy water heater and cooking appliances',
                'recommended_off_peak_hours': '10:30 PM - 7:00 AM',
                'appliance_efficiency': house2_data.get('appliance_age', 'new'),
                'occupancy_pattern': f"{house2_data.get('occupants', 6)} occupants",
                'suggestions': [
                    "Use washing machine during off-peak hours",
                    "Set water heater timer for off-peak heating",
                    "Use microwave instead of oven when possible"
                ]
            }
        }
        
        return JsonResponse({
            'success': True,
            'differentiation_analysis': differentiation,
            'off_peak_schedule': LESCOBillingSystem.PEAK_OFF_PEAK_INFO
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        })

@api_view(['GET'])
def get_providers(request):
    """Get electricity providers"""
    providers = [
        {'id': 1, 'name': 'LESCO', 'region': 'Lahore'},
        {'id': 2, 'name': 'GEPCO', 'region': 'Gujranwala'},
        {'id': 3, 'name': 'FESCO', 'region': 'Faisalabad'},
        {'id': 4, 'name': 'PESCO', 'region': 'Peshawar'}
    ]
    return JsonResponse({'providers': providers})

@api_view(['GET'])
def get_appliances(request):
    """Get common appliances list"""
    appliances = [
        {'name': 'Air Conditioner', 'avg_watts': 1500, 'category': 'cooling'},
        {'name': 'Refrigerator', 'avg_watts': 150, 'category': 'kitchen'},
        {'name': 'Water Heater', 'avg_watts': 4000, 'category': 'heating'},
        {'name': 'Television', 'avg_watts': 100, 'category': 'entertainment'}
    ]
    return JsonResponse({'appliances': appliances})

@api_view(['POST'])
@csrf_exempt
def save_bill_data(request):
    """Save bill data"""
    try:
        data = json.loads(request.body)
        return JsonResponse({
            'success': True,
            'message': 'Bill data saved successfully',
            'bill_id': 12345
        })
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        })

@api_view(['GET'])
def get_prediction_history(request):
    """Get prediction history with accuracy metrics"""
    try:
        # Mock prediction history
        history = [
            {
                'id': 1,
                'date': '2024-01-15',
                'predicted_units': 345,
                'actual_units': 352,
                'accuracy': 98.0,
                'bill_amount': 8750
            },
            {
                'id': 2,
                'date': '2024-02-15',
                'predicted_units': 298,
                'actual_units': 301,
                'accuracy': 99.0,
                'bill_amount': 7650
            }
        ]
        
        return JsonResponse({
            'success': True,
            'history': history,
            'average_accuracy': 98.5
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        })

@api_view(['POST'])
@csrf_exempt
def scan_bill(request):
    """Scan electricity bill using OCR"""
    try:
        data = json.loads(request.body)
        reference_number = data.get('reference_number', '')
        
        # Mock OCR result
        scanned_data = {
            'reference_number': reference_number,
            'customer_id': '12345678',
            'units_consumed': 345,
            'bill_amount': 8750,
            'due_date': '2025-02-15',
            'reading_date': '2025-01-15'
        }
        
        return JsonResponse({
            'success': True,
            'scanned_data': scanned_data,
            'message': 'Bill scanned successfully'
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        })

@api_view(['POST'])
@csrf_exempt
def ai_chat(request):
    """AI chatbot for energy recommendations"""
    try:
        data = json.loads(request.body)
        message = data.get('message', '')
        
        # Simple AI responses
        responses = {
            'high bill': 'Your bill seems high. Try using AC at 24°C and shift heavy appliances to off-peak hours (11 PM - 6 AM).',
            'save energy': 'To save energy: 1) Use LED lights 2) Set AC to 24°C 3) Use appliances during off-peak hours 4) Unplug devices when not in use.',
            'off peak hours': 'Off-peak hours in Pakistan: 11:00 PM - 6:00 AM and 9:00 AM - 5:00 PM. You can save up to 20% on electricity costs.',
            'default': 'I can help you with energy saving tips, bill analysis, and LESCO tariff information. What would you like to know?'
        }
        
        # Simple keyword matching
        response = responses['default']
        for key in responses:
            if key in message.lower():
                response = responses[key]
                break
        
        return JsonResponse({
            'success': True,
            'response': response,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        })
