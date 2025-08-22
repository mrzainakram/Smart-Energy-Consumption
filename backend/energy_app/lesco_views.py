"""
LESCO Views - Final Year Project API Endpoints
Django REST API views for LESCO billing and prediction system
"""

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
import traceback
from .enhanced_prediction_system import (
    LESCOBillingSystem, 
    HistoricalPredictionEngine, 
    BillScannerOCR,
    ConsumptionDifferentiator
)

@csrf_exempt
@require_http_methods(["POST"])
def lesco_bill_calculation(request):
    """
    Calculate LESCO electricity bill using Pakistani tariff rates
    """
    try:
        data = json.loads(request.body)
        units_consumed = data.get('units_consumed', 0)
        off_peak_units = data.get('off_peak_units', 0)
        include_taxes = data.get('include_taxes', True)
        
        # Calculate bill using LESCO system
        bill_data = LESCOBillingSystem.calculate_bill(
            units_consumed=units_consumed,
            include_taxes=include_taxes,
            off_peak_units=off_peak_units
        )
        
        return JsonResponse({
            'success': True,
            'bill_data': bill_data,
            'message': 'LESCO bill calculated successfully'
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e),
            'message': 'Error calculating LESCO bill'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def historical_prediction(request):
    """
    Predict next month consumption using historical data and trained models
    """
    try:
        data = json.loads(request.body)
        historical_data = data.get('historical_data', [])
        appliance_data = data.get('appliance_data', {})
        
        # Initialize prediction engine
        engine = HistoricalPredictionEngine()
        
        # Generate prediction
        prediction = engine.predict_next_month(historical_data, appliance_data)
        
        return JsonResponse({
            'success': True,
            'prediction': prediction,
            'message': 'Historical prediction generated successfully'
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e),
            'message': 'Error generating historical prediction'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def scan_electricity_bill(request):
    """
    Extract data from electricity bill using OCR
    """
    try:
        if 'bill_image' not in request.FILES:
            return JsonResponse({
                'success': False,
                'error': 'No bill image provided',
                'message': 'Please upload a bill image'
            }, status=400)
        
        bill_image = request.FILES['bill_image']
        
        # Initialize OCR scanner
        scanner = BillScannerOCR()
        
        # Extract bill data
        extracted_data = scanner.extract_bill_data(bill_image)
        
        return JsonResponse({
            'success': True,
            'extracted_data': extracted_data,
            'message': 'Bill scanned successfully'
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e),
            'message': 'Error scanning electricity bill'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def energy_recommendations(request):
    """
    Generate energy saving recommendations based on consumption patterns
    """
    try:
        data = json.loads(request.body)
        consumption_data = data.get('consumption_data', [])
        appliance_usage = data.get('appliance_usage', {})
        
        # Generate recommendations using LESCO system
        recommendations = LESCOBillingSystem.generate_recommendations(
            consumption_data, appliance_usage
        )
        
        return JsonResponse({
            'success': True,
            'recommendations': recommendations,
            'message': 'Energy recommendations generated successfully'
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e),
            'message': 'Error generating energy recommendations'
        }, status=500)

@csrf_exempt
@require_http_methods(["GET"])
def lesco_tariff_info(request):
    """
    Get current LESCO tariff information
    """
    try:
        tariff_info = LESCOBillingSystem.get_tariff_info()
        
        return JsonResponse({
            'success': True,
            'tariff_info': tariff_info,
            'message': 'LESCO tariff information retrieved successfully'
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e),
            'message': 'Error retrieving LESCO tariff information'
        }, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def compare_houses(request):
    """
    Compare different houses with same consumption patterns
    """
    try:
        data = json.loads(request.body)
        house1_data = data.get('house1_data', {})
        house2_data = data.get('house2_data', {})
        
        # Initialize consumption differentiator
        differentiator = ConsumptionDifferentiator()
        
        # Compare houses
        comparison = differentiator.compare_houses(house1_data, house2_data)
        
        return JsonResponse({
            'success': True,
            'comparison': comparison,
            'message': 'House comparison completed successfully'
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e),
            'message': 'Error comparing houses'
        }, status=500)
