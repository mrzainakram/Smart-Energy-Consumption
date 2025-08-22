from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.middleware.csrf import get_token

def get_csrf_token(request):
    """Get CSRF token for frontend"""
    return JsonResponse({'csrfToken': get_token(request)})

def api_root(request):
    return JsonResponse({
        "message": "Smart Energy ML API",
        "status": "running",
        "endpoints": {
            "predict": "/api/predict/",
            "health": "/api/health/",
            "models": "/api/models/",
            "csrf": "/api/get-csrf-token/",
            "auth": "/api/auth/",
            "bills": "/api/bills/",
            "predictions": "/api/predictions/"
        }
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('energy_app.urls')),  # Existing endpoints
    path('api/', include('api.urls')),  # New API endpoints
    path('api/get-csrf-token/', get_csrf_token, name='get_csrf_token'),
    path('', api_root),
]