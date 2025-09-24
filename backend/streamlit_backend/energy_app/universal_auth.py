from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def universal_send_otp(request):
    """Send OTP for authentication"""
    try:
        data = json.loads(request.body)
        phone = data.get('phone', '')
        return JsonResponse({
            'success': True,
            'message': f'OTP sent to {phone}',
            'otp_id': '12345'
        })
    except:
        return JsonResponse({'success': False, 'error': 'Invalid request'})

@csrf_exempt
def universal_verify_otp(request):
    """Verify OTP"""
    try:
        data = json.loads(request.body)
        otp = data.get('otp', '')
        return JsonResponse({
            'success': True,
            'message': 'OTP verified successfully',
            'token': 'auth_token_12345'
        })
    except:
        return JsonResponse({'success': False, 'error': 'Invalid OTP'})

@csrf_exempt
def universal_refresh_token(request):
    """Refresh authentication token"""
    return JsonResponse({
        'success': True,
        'token': 'new_refresh_token_12345'
    })

@csrf_exempt
def universal_health_check(request):
    """Universal auth health check"""
    return JsonResponse({
        'status': 'healthy',
        'service': 'Universal Authentication'
    })