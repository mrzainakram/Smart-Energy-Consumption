from django.urls import path
from . import views
from . import enhanced_views_new as enhanced_views
from . import advanced_ai_views
from . import authentication_system as auth_views
from . import ocr_prediction_views as ocr_views
from . import enhanced_prediction_views as enhanced_pred_views
from . import support_views
from . import enhanced_views

urlpatterns = [
    # Basic endpoints
    path('health/', enhanced_views.health_check, name='health_check'),
    path('lesco-prediction/', views.lesco_prediction, name='lesco_prediction'),
    
    # Authentication endpoints
    path('auth/signup/', auth_views.signup_view, name='signup'),
    path('auth/signin/', auth_views.signin_view, name='signin'),
    path('auth/verify-otp/', auth_views.verify_otp_view, name='verify_otp'),
    path('auth/resend-otp/', auth_views.resend_otp_view, name='resend_otp'),
    
    # OCR and Prediction endpoints
    path('ocr/scan-bill/', ocr_views.scan_bill_view, name='scan_bill'),
    path('predict/energy/', enhanced_pred_views.enhanced_energy_prediction, name='predict_energy'),
    path('predict/history/', ocr_views.get_prediction_history_view, name='prediction_history'),
    
    # Enhanced Prediction endpoints
    path('enhanced-predict/energy/', enhanced_pred_views.enhanced_energy_prediction, name='enhanced_energy_prediction'),
    path('enhanced-ocr/scan-bill/', enhanced_pred_views.enhanced_ocr_scan_bill, name='enhanced_ocr_scan_bill'),
    path('chatbot/', enhanced_pred_views.chatbot_api, name='chatbot_api'),
    
    # Advanced ML endpoints
    path('advanced-prediction/', enhanced_views.advanced_prediction, name='advanced_prediction'),
    path('differentiate-houses/', enhanced_views.differentiate_houses, name='differentiate_houses'),
    
    # Seasonal Factors and House Comparison endpoints
    path('seasonal-factors/', enhanced_views.get_seasonal_factors, name='get_seasonal_factors'),
    path('enhanced-compare-houses/', enhanced_views.enhanced_compare_houses, name='enhanced_compare_houses'),
    path('compare-houses/', enhanced_pred_views.compare_houses, name='compare_houses'),
    path('appliance-prediction/', enhanced_pred_views.appliance_prediction, name='appliance_prediction'),
    path('house-efficiency-score/', enhanced_views.get_house_efficiency_score, name='get_house_efficiency_score'),
    
    # Advanced AI endpoints
    path('ai-prediction/', advanced_ai_views.advanced_ai_prediction, name='advanced_ai_prediction'),
    path('real-time-optimization/', advanced_ai_views.real_time_optimization, name='real_time_optimization'),
    path('analytics-dashboard/', advanced_ai_views.energy_analytics_dashboard, name='analytics_dashboard'),
    path('smart-automation/', advanced_ai_views.smart_home_automation, name='smart_automation'),
    
    # Data endpoints
    path('providers/', enhanced_views.get_providers, name='get_providers'),
    path('appliances/', enhanced_views.get_appliances, name='get_appliances'),
    path('prediction-history/', enhanced_views.get_prediction_history, name='get_prediction_history'),
    
    # Utility endpoints
    path('save-bill-data/', enhanced_views.save_bill_data, name='save_bill_data'),
    path('scan-bill/', enhanced_views.scan_bill, name='scan_bill'),
    path('ai-chat/', enhanced_views.ai_chat, name='ai_chat'),
    
    # Support and Chatbot endpoints
    path('support/', support_views.customer_support, name='customer_support'),
    path('chatbot/', support_views.chatbot_response, name='chatbot_response'),
]
