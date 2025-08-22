from rest_framework import serializers
from .models import BillData, PredictionHistory, UserAppliance, ElectricityProvider, TariffSlab, User, OTP, Appliance

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone_number', 'is_email_verified', 'location', 'created_at']

class OTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = OTP
        fields = ['id', 'purpose', 'created_at', 'expires_at']

class ElectricityProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectricityProvider
        fields = '__all__'

class TariffSlabSerializer(serializers.ModelSerializer):
    class Meta:
        model = TariffSlab
        fields = '__all__'

class ApplianceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appliance
        fields = '__all__'

class BillDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillData
        fields = '__all__'

class PredictionHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PredictionHistory
        fields = '__all__'

class UserApplianceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAppliance
        fields = '__all__'

# For backward compatibility with existing API endpoints
class RecommendationSerializer(serializers.Serializer):
    type = serializers.CharField()
    title = serializers.CharField()
    description = serializers.CharField()
    potential_savings = serializers.FloatField()
    cost_savings = serializers.FloatField()

class PredictionSerializer(serializers.Serializer):
    predicted_units = serializers.FloatField()
    predicted_cost = serializers.FloatField()
    confidence_score = serializers.FloatField()
    recommendations = RecommendationSerializer(many=True, read_only=True)

class EnergyDataSerializer(serializers.Serializer):
    householdSize = serializers.IntegerField()
    area = serializers.FloatField()
    location = serializers.CharField()
    appliances = serializers.JSONField()
    provider = serializers.CharField()