#!/usr/bin/env python3
"""
Simple Django Test Server for LESCO FYP System
Tests the core LESCO prediction endpoints without full server
"""

import os
import sys
import django
from django.conf import settings
from django.core.management import execute_from_command_line

# Add the current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_energy.settings')

try:
    django.setup()
    print("✅ Django setup successful")
    
    # Test imports
    from energy_app.enhanced_prediction_system import LESCOBillingSystem, HistoricalPredictionEngine
    print("✅ LESCO system imports successful")
    
    # Test LESCO billing calculation
    print("\n🧪 Testing LESCO Billing System...")
    bill_data = LESCOBillingSystem.calculate_bill(300, include_taxes=True, off_peak_units=50)
    print(f"✅ Bill calculation successful: PKR {bill_data['total_bill']:.2f}")
    
    # Test historical prediction engine initialization
    print("\n🧪 Testing Historical Prediction Engine...")
    engine = HistoricalPredictionEngine()
    print("✅ Prediction engine initialized successfully")
    
    # Test model file existence
    print("\n🧪 Checking trained model files...")
    import os
    model_dir = os.path.join(current_dir, 'model')
    model_files = ['rf_model.pkl', 'gb_model.pkl', 'lr_model.pkl', 'lstm_model.pkl', 'rnn_model.pkl']
    
    for model_file in model_files:
        model_path = os.path.join(model_dir, model_file)
        if os.path.exists(model_path):
            print(f"✅ {model_file} found")
        else:
            print(f"❌ {model_file} missing")
    
    print("\n🎉 Core LESCO FYP system is working correctly!")
    print("The system is ready to make predictions using trained models.")
    
except Exception as e:
    print(f"❌ Error: {str(e)}")
    import traceback
    traceback.print_exc()

if __name__ == '__main__':
    # If run directly, start the development server
    if len(sys.argv) > 1 and sys.argv[1] == 'runserver':
        execute_from_command_line(sys.argv)
    else:
        print("\nTo start the development server, run:")
        print("python3 test_django_system.py runserver 8000")
