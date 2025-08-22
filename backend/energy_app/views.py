from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
import json

@api_view(['GET'])
def health_check(request):
    """Simple health check endpoint"""
    return JsonResponse({
        'status': 'healthy',
        'message': 'FYP Backend Server is running',
        'service': 'Smart Energy Consumption Prediction'
    })

@api_view(['POST'])
@csrf_exempt
def lesco_prediction(request):
    """Simple LESCO prediction endpoint"""
    try:
        data = json.loads(request.body)
        units = data.get('units', 0)
        
        # Simple LESCO calculation
        lesco_slabs = [
            (0, 50, 3.95),
            (51, 100, 7.74), 
            (101, 200, 10.06),
            (201, 300, 16.73),
            (301, 700, 22.68),
            (701, float('inf'), 35.24)
        ]
        
        total_cost = 0
        remaining_units = units
        breakdown = []
        
        for start, end, rate in lesco_slabs:
            if remaining_units <= 0:
                break
            
            if start <= units:
                slab_units = min(remaining_units, end - start + 1 if end != float('inf') else remaining_units)
                slab_cost = slab_units * rate
                total_cost += slab_cost
                remaining_units -= slab_units
                
                breakdown.append({
                    'slab': f"{start}-{end if end != float('inf') else '∞'}",
                    'units': slab_units,
                    'rate': rate,
                    'cost': slab_cost
                })
        
        # Add taxes
        gst = total_cost * 0.17
        electricity_duty = total_cost * 0.015
        final_amount = total_cost + gst + electricity_duty
        
        return JsonResponse({
            'success': True,
            'prediction': {
                'units_consumed': units,
                'base_cost': round(total_cost, 2),
                'gst': round(gst, 2),
                'electricity_duty': round(electricity_duty, 2),
                'total_amount': round(final_amount, 2),
                'breakdown': breakdown
            }
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        })
