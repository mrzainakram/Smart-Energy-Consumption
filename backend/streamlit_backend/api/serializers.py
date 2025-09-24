from rest_framework import serializers
from energy_app.models import BillData, PredictionHistory, Appliance, User, ElectricityProvider

class EnergyInputSerializer(serializers.Serializer):
    """Serializer for energy consumption input"""
    units_consumed = serializers.FloatField()
    bill_amount = serializers.FloatField()
    date = serializers.DateField()

class PredictionSerializer(serializers.ModelSerializer):
    """Serializer for bill predictions"""
    class Meta:
        model = PredictionHistory
        fields = ['id', 'predicted_units', 'predicted_cost', 'prediction_month', 'prediction_year', 'confidence_score', 'model_used', 'created_at']

class RecommendationSerializer(serializers.Serializer):
    """Serializer for energy-saving recommendations"""
    type = serializers.CharField()
    message = serializers.CharField()
    suggestion = serializers.CharField()

class BillDataSerializer(serializers.ModelSerializer):
    """Serializer for bill data"""
    class Meta:
        model = BillData
        fields = ['id', 'bill_month', 'units_consumed', 'amount_paid', 'peak_units', 'off_peak_units', 'created_at']

class ApplianceSerializer(serializers.ModelSerializer):
    """Serializer for appliances"""
    class Meta:
        model = Appliance
        fields = ['id', 'name', 'category', 'typical_wattage', 'usage_hours_per_day', 'efficiency_rating', 'icon']

class UserSerializer(serializers.ModelSerializer):
    """Serializer for user data"""
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'is_email_verified', 'created_at']

class ProviderSerializer(serializers.ModelSerializer):
    """Serializer for electricity providers"""
    class Meta:
        model = ElectricityProvider
        fields = ['id', 'name', 'full_name', 'region']
