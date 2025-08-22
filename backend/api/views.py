from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import EnergyInputSerializer, PredictionSerializer, RecommendationSerializer, BillDataSerializer, ApplianceSerializer, UserSerializer, ProviderSerializer
from energy_app.models import BillData, PredictionHistory, Appliance, User, ElectricityProvider
import json

@api_view(['GET'])
def health_check(request):
    """Health check endpoint"""
    return JsonResponse({
        'status': 'healthy',
        'message': 'Smart Energy API is running',
        'timestamp': '2024-08-03T04:30:00Z'
    })

@api_view(['GET'])
def get_appliances(request):
    """Get list of available appliances"""
    appliances = Appliance.objects.all()
    serializer = ApplianceSerializer(appliances, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def predict_consumption(request):
    """Predict energy consumption"""
    try:
        data = json.loads(request.body)
        serializer = EnergyInputSerializer(data=data)
        
        if serializer.is_valid():
            # Mock prediction logic
            units = serializer.validated_data['units_consumed']
            predicted_units = units * 1.05  # 5% increase
            predicted_amount = predicted_units * 15.0  # Mock rate
            
            return JsonResponse({
                'success': True,
                'predicted_units': predicted_units,
                'predicted_amount': predicted_amount,
                'confidence': 0.85
            })
        else:
            return JsonResponse({
                'success': False,
                'errors': serializer.errors
            }, status=400)
            
    except Exception as e:
        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=500)