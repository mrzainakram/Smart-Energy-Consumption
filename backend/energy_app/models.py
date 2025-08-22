# Enhanced Authentication Models for Smart Energy System
from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator
# from phonenumber_field.modelfields import PhoneNumberField  # Temporarily disabled
import uuid
import random
from datetime import timedelta

# Using Django's default User model instead of custom one

class OTP(models.Model):
    """OTP verification model"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='energy_otps')
    otp_code = models.CharField(max_length=6)
    purpose = models.CharField(max_length=20, choices=[
        ('signup', 'Signup Verification'),
        ('login', 'Login Verification'),
        ('password_reset', 'Password Reset'),
        ('email_change', 'Email Change'),
    ])
    is_used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    def save(self, *args, **kwargs):
        if not self.otp_code:
            self.otp_code = f"{random.randint(100000, 999999)}"
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=10)
        super().save(*args, **kwargs)
    
    def is_expired(self):
        return timezone.now() > self.expires_at
    
    def is_valid(self):
        return not self.is_used and not self.is_expired()

class Appliance(models.Model):
    """Available appliances with power consumption data"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, choices=[
        ('cooling', 'Cooling'),
        ('heating', 'Heating'),
        ('kitchen', 'Kitchen'),
        ('laundry', 'Laundry'),
        ('entertainment', 'Entertainment'),
        ('lighting', 'Lighting'),
        ('other', 'Other'),
    ])
    typical_wattage = models.IntegerField()  # in watts
    usage_hours_per_day = models.FloatField(default=8.0)
    efficiency_rating = models.CharField(max_length=10, blank=True)
    icon = models.CharField(max_length=50, blank=True)  # Icon name or emoji
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} ({self.typical_wattage}W)"

class UserAppliance(models.Model):
    """User's specific appliances"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='energy_appliances')
    appliance = models.ForeignKey(Appliance, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    custom_usage_hours = models.FloatField(blank=True, null=True)
    is_smart = models.BooleanField(default=False)
    purchase_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'appliance']

class ElectricityProvider(models.Model):
    """Pakistani electricity providers with their tariff structures"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50)  # LESCO, MEPCO, PESCO, IESCO, etc.
    full_name = models.CharField(max_length=200)
    region = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.region}"

class TariffSlab(models.Model):
    """Electricity tariff slabs for different providers"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    provider = models.ForeignKey(ElectricityProvider, on_delete=models.CASCADE, related_name='tariff_slabs')
    slab_min = models.IntegerField()  # Minimum units
    slab_max = models.IntegerField()  # Maximum units (-1 for unlimited)
    rate_per_unit = models.DecimalField(max_digits=8, decimal_places=4)
    fixed_charges = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    is_peak_hour = models.BooleanField(default=False)
    effective_from = models.DateField()
    effective_to = models.DateField(blank=True, null=True)
    
    class Meta:
        ordering = ['provider', 'slab_min']

class BillData(models.Model):
    """Enhanced historical electricity bill data"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='energy_bills')
    provider = models.ForeignKey(ElectricityProvider, on_delete=models.CASCADE, blank=True, null=True)
    bill_month = models.DateField()
    units_consumed = models.FloatField()
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    peak_units = models.FloatField(default=0)
    off_peak_units = models.FloatField(default=0)
    bill_pdf = models.FileField(upload_to='bills/', blank=True, null=True)
    meter_reading_start = models.FloatField(blank=True, null=True)
    meter_reading_end = models.FloatField(blank=True, null=True)
    tariff_slab = models.CharField(max_length=20, blank=True)
    weather_avg_temp = models.FloatField(blank=True, null=True)
    house_occupancy = models.IntegerField(default=1)
    house_size_sqft = models.IntegerField(blank=True, null=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'bill_month']
        ordering = ['-bill_month']

class PredictionHistory(models.Model):
    """Enhanced prediction results with detailed analysis"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='energy_predictions')
    predicted_units = models.FloatField()
    predicted_cost = models.DecimalField(max_digits=10, decimal_places=2)
    prediction_month = models.DateField()
    prediction_year = models.IntegerField()
    confidence_score = models.FloatField()
    model_used = models.CharField(max_length=50)
    provider = models.ForeignKey(ElectricityProvider, on_delete=models.CASCADE, blank=True, null=True)
    input_data = models.JSONField()  # Store the input parameters
    slab_breakdown = models.JSONField(blank=True, null=True)  # Detailed slab calculations
    peak_hours_breakdown = models.JSONField(blank=True, null=True)
    recommendations = models.JSONField(blank=True, null=True)
    appliances_breakdown = models.JSONField(blank=True, null=True)
    actual_units = models.FloatField(blank=True, null=True)  # For accuracy tracking
    actual_cost = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']

class PeakHourSchedule(models.Model):
    """Peak and off-peak hour schedules for different providers"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    provider = models.ForeignKey(ElectricityProvider, on_delete=models.CASCADE, related_name='peak_schedules')
    day_type = models.CharField(max_length=20, choices=[
        ('weekday', 'Monday to Friday'),
        ('weekend', 'Saturday and Sunday'),
        ('holiday', 'Public Holidays'),
    ])
    peak_start_time = models.TimeField()
    peak_end_time = models.TimeField()
    season = models.CharField(max_length=20, choices=[
        ('summer', 'Summer (Apr-Sep)'),
        ('winter', 'Winter (Oct-Mar)'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['provider', 'day_type', 'season']

class UserPreferences(models.Model):
    """User preferences for predictions and notifications"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='energy_preferences')
    default_provider = models.ForeignKey(ElectricityProvider, on_delete=models.SET_NULL, blank=True, null=True)
    notification_threshold = models.DecimalField(max_digits=10, decimal_places=2, default=5000)  # Alert if prediction exceeds
    preferred_currency = models.CharField(max_length=3, default='PKR')
    timezone = models.CharField(max_length=50, default='Asia/Karachi')
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    prediction_frequency = models.CharField(max_length=20, choices=[
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('manual', 'Manual Only'),
    ], default='monthly')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ChatHistory(models.Model):
    """AI Chatbot conversation history"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='energy_chat_history')
    message = models.TextField()
    response = models.TextField()
    context = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']

class EnergyConsumption(models.Model):
    """Model for storing energy consumption data"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='energy_consumption')
    date = models.DateField()
    units_consumed = models.FloatField()
    bill_amount = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'energy_consumption'
        
    def __str__(self):
        return f"Consumption: {self.units_consumed} units on {self.date}"

class BillPrediction(models.Model):
    """Model for storing bill predictions"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='energy_bill_predictions')
    predicted_units = models.FloatField()
    predicted_amount = models.FloatField()
    prediction_date = models.DateTimeField(auto_now_add=True)
    accuracy = models.FloatField(null=True, blank=True)
    
    class Meta:
        db_table = 'bill_predictions'
        
    def __str__(self):
        return f"Prediction: {self.predicted_units} units = PKR {self.predicted_amount}"

class SimplePredictionHistory(models.Model):
    """Simple prediction history for OCR-based predictions"""
    id = models.AutoField(primary_key=True)
    consumed_units = models.FloatField()
    predicted_units = models.FloatField()
    model_predictions = models.JSONField(blank=True, null=True)
    appliance_data = models.JSONField(blank=True, null=True)
    slab_wise_bill = models.FloatField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'simple_prediction_history'
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"Prediction: {self.consumed_units} -> {self.predicted_units} units"