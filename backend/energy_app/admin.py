from django.contrib import admin
from .models import (
    OTP, Appliance, UserAppliance, BillData, 
    PredictionHistory, ChatHistory
)

# Removed User admin registration since we're using Django's default User model

@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ['user', 'otp_code', 'purpose', 'expires_at', 'is_used', 'created_at']
    list_filter = ['purpose', 'is_used', 'created_at']
    search_fields = ['user__username', 'user__email', 'otp_code']
    readonly_fields = ['created_at']

@admin.register(Appliance)
class ApplianceAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'typical_wattage', 'usage_hours_per_day', 'created_at']
    list_filter = ['category', 'created_at']
    search_fields = ['name', 'category']
    readonly_fields = ['created_at']

@admin.register(UserAppliance)
class UserApplianceAdmin(admin.ModelAdmin):
    list_display = ['user', 'appliance', 'quantity', 'custom_usage_hours', 'is_smart', 'created_at']
    list_filter = ['appliance__category', 'is_smart', 'created_at']
    search_fields = ['user__username', 'appliance__name']
    readonly_fields = ['created_at']

@admin.register(BillData)
class BillDataAdmin(admin.ModelAdmin):
    list_display = ['user', 'bill_month', 'units_consumed', 'amount_paid', 'created_at']
    list_filter = ['bill_month', 'created_at']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at']

@admin.register(PredictionHistory)
class PredictionHistoryAdmin(admin.ModelAdmin):
    list_display = ['user', 'predicted_units', 'predicted_cost', 'confidence_score', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at']

@admin.register(ChatHistory)
class ChatHistoryAdmin(admin.ModelAdmin):
    list_display = ['user', 'message', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'message']
    readonly_fields = ['created_at']