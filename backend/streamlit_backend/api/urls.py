from django.urls import path
from . import views, auth, bills, predictions

urlpatterns = [
    # Health check
    path('health/', views.health_check, name='health_check'),
    
    # Authentication endpoints
    path('auth/signup/', auth.signup, name='signup'),
    path('auth/login/', auth.login, name='login'),
    path('auth/send-otp/', auth.send_otp, name='send_otp'),
    path('auth/verify-otp/', auth.verify_otp, name='verify_otp'),
    path('auth/forgot-password/', auth.forgot_password, name='forgot_password'),
    path('auth/reset-password/', auth.reset_password, name='reset_password'),
    
    # Bill scanning endpoints
    path('bills/scan/', bills.scan_bill, name='scan_bill'),
    path('bills/history/', bills.get_bill_history, name='get_bill_history'),
    
    # Prediction endpoints
    path('predictions/generate/', predictions.generate_prediction, name='generate_prediction'),
    path('predictions/history/', predictions.get_prediction_history, name='get_prediction_history'),
    path('predictions/model-status/', predictions.get_model_status, name='get_model_status'),
    
    # Existing endpoints
    path('appliances/', views.get_appliances, name='get_appliances'),
    path('predict/', views.predict_consumption, name='predict_consumption'),
]