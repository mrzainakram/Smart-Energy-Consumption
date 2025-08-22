#!/usr/bin/env python3
"""
Simple Flask API Server for LESCO FYP System
Standalone server to test LESCO functionality without Django dependencies
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import traceback
import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import our enhanced prediction system
from energy_app.enhanced_prediction_system import (
    LESCOBillingSystem, 
    HistoricalPredictionEngine, 
    BillScannerOCR,
    ConsumptionDifferentiator
)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'LESCO FYP API Server is running',
        'version': '1.0.0',
        'features': [
            'LESCO Billing System',
            'Historical Predictions',
            'Bill OCR Scanner',
            'Consumption Analysis'
        ]
    })

@app.route('/api/lesco/calculate_bill', methods=['POST'])
def calculate_bill():
    """Calculate LESCO electricity bill using Pakistani tariff rates"""
    try:
        data = request.get_json()
        units_consumed = data.get('units_consumed', 0)
        off_peak_units = data.get('off_peak_units', 0)
        include_taxes = data.get('include_taxes', True)
        
        # Calculate bill using LESCO system
        bill_data = LESCOBillingSystem.calculate_bill(
            units_consumed=units_consumed,
            include_taxes=include_taxes,
            off_peak_units=off_peak_units
        )
        
        return jsonify({
            'success': True,
            'bill_data': bill_data,
            'message': 'LESCO bill calculated successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Error calculating LESCO bill',
            'traceback': traceback.format_exc()
        }), 500

@app.route('/api/lesco/predict_consumption', methods=['POST'])
def predict_consumption():
    """Predict future energy consumption using historical data"""
    try:
        data = request.get_json()
        historical_bills = data.get('historical_bills', [])
        prediction_month = data.get('prediction_month', 1)
        house_type = data.get('house_type', 'medium')
        appliances = data.get('appliances', [])
        
        # Initialize prediction engine
        prediction_engine = HistoricalPredictionEngine()
        
        # Make prediction
        prediction_result = prediction_engine.predict_monthly_consumption(
            historical_bills=historical_bills,
            target_month=prediction_month,
            house_characteristics={'type': house_type, 'appliances': appliances}
        )
        
        # Calculate predicted bill
        predicted_units = prediction_result.get('predicted_consumption', 0)
        predicted_bill = LESCOBillingSystem.calculate_bill(
            units_consumed=predicted_units,
            include_taxes=True
        )
        
        return jsonify({
            'success': True,
            'prediction': prediction_result,
            'predicted_bill': predicted_bill,
            'message': 'Consumption prediction completed'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Error predicting consumption',
            'traceback': traceback.format_exc()
        }), 500

@app.route('/api/lesco/scan_bill', methods=['POST'])
def scan_bill():
    """Scan and extract data from electricity bill image"""
    try:
        # This would normally handle file upload
        # For now, return a mock response
        return jsonify({
            'success': True,
            'extracted_data': {
                'reference_number': 'REF123456789',
                'customer_id': 'CUST987654321',
                'units_consumed': 450,
                'bill_amount': 15750.00,
                'month': 'March',
                'year': 2024,
                'due_date': '2024-04-15'
            },
            'message': 'Bill scanning completed (mock data)'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Error scanning bill'
        }), 500

@app.route('/api/lesco/get_tariff_info', methods=['GET'])
def get_tariff_info():
    """Get current LESCO tariff information"""
    try:
        tariff_info = LESCOBillingSystem.get_tariff_structure()
        
        return jsonify({
            'success': True,
            'tariff_info': tariff_info,
            'message': 'Tariff information retrieved successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Error retrieving tariff info'
        }), 500

@app.route('/api/lesco/energy_recommendations', methods=['POST'])
def energy_recommendations():
    """Get energy saving recommendations"""
    try:
        data = request.get_json()
        current_consumption = data.get('current_consumption', 0)
        house_type = data.get('house_type', 'medium')
        appliances = data.get('appliances', [])
        
        # Generate recommendations
        recommendations = {
            'current_consumption': current_consumption,
            'recommendations': [
                {
                    'category': 'Appliance Optimization',
                    'suggestions': [
                        'Use energy-efficient LED bulbs',
                        'Set AC temperature to 24°C',
                        'Unplug electronics when not in use'
                    ],
                    'potential_savings': '15-25%'
                },
                {
                    'category': 'Time-of-Use Optimization',
                    'suggestions': [
                        'Use heavy appliances during off-peak hours (11 PM - 7 AM)',
                        'Schedule washing machine and dishwasher for late night',
                        'Charge devices during off-peak times'
                    ],
                    'potential_savings': '20-30%'
                },
                {
                    'category': 'Seasonal Adjustments',
                    'suggestions': [
                        'Use fans instead of AC when possible',
                        'Optimize refrigerator settings',
                        'Use natural lighting during daytime'
                    ],
                    'potential_savings': '10-20%'
                }
            ],
            'estimated_monthly_savings': current_consumption * 0.20  # 20% average savings
        }
        
        return jsonify({
            'success': True,
            'recommendations': recommendations,
            'message': 'Energy recommendations generated successfully'
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Error generating recommendations'
        }), 500

if __name__ == '__main__':
    print("🔋 Starting LESCO FYP API Server...")
    print("📊 Features available:")
    print("   - LESCO Billing Calculations")
    print("   - Historical Consumption Predictions") 
    print("   - Bill OCR Scanning")
    print("   - Energy Recommendations")
    print("🌐 Server will be available at: http://localhost:8000")
    print("🔗 Health Check: http://localhost:8000/api/health")
    
    app.run(host='0.0.0.0', port=8000, debug=True)
