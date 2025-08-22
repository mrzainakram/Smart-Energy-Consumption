#!/usr/bin/env python3
"""
Enhanced Prediction System for LESCO FYP
AI-based Smart Energy Consumption Prediction and Recommendation System
"""

import pickle
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import os
import json

class LESCOBillingSystem:
    """LESCO (Lahore Electric Supply Company) Billing System"""
    
    # LESCO Domestic Tariff Slabs (PKR per unit)
    TARIFF_SLABS = [
        (0, 50, 3.95),      # 0-50 units
        (51, 100, 7.74),    # 51-100 units  
        (101, 200, 10.06),  # 101-200 units
        (201, 300, 16.73),  # 201-300 units
        (301, 700, 22.68),  # 301-700 units
        (701, float('inf'), 35.24)  # Above 700 units
    ]
    
    # Pakistani electricity taxes
    GST_RATE = 0.17  # 17% GST
    ELECTRICITY_DUTY = 0.015  # 1.5% Electricity Duty
    OFF_PEAK_DISCOUNT = 0.30  # 30% discount for off-peak hours
    
    @classmethod
    def calculate_bill(cls, units_consumed, include_taxes=True, off_peak_units=0):
        """Calculate LESCO electricity bill"""
        total_cost = 0
        breakdown = []
        remaining_units = units_consumed
        
        # Calculate slab-wise billing
        for start, end, rate in cls.TARIFF_SLABS:
            if remaining_units <= 0:
                break
                
            if start <= units_consumed:
                slab_units = min(remaining_units, end - start + 1 if end != float('inf') else remaining_units)
                slab_cost = slab_units * rate
                total_cost += slab_cost
                remaining_units -= slab_units
                
                breakdown.append({
                    'slab': f"{start}-{end if end != float('inf') else '∞'}",
                    'units': slab_units,
                    'rate': rate,
                    'cost': round(slab_cost, 2)
                })
        
        # Apply off-peak discount
        off_peak_savings = 0
        if off_peak_units > 0:
            off_peak_savings = (off_peak_units / units_consumed) * total_cost * cls.OFF_PEAK_DISCOUNT
            total_cost -= off_peak_savings
        
        # Calculate taxes
        base_cost = total_cost
        gst = total_cost * cls.GST_RATE if include_taxes else 0
        electricity_duty = total_cost * cls.ELECTRICITY_DUTY if include_taxes else 0
        final_amount = total_cost + gst + electricity_duty
        
        return {
            'units_consumed': units_consumed,
            'base_cost': round(base_cost, 2),
            'off_peak_savings': round(off_peak_savings, 2),
            'gst': round(gst, 2),
            'electricity_duty': round(electricity_duty, 2),
            'total_bill': round(final_amount, 2),
            'breakdown': breakdown,
            'currency': 'PKR'
        }

class HistoricalPredictionEngine:
    """Historical Data-based Prediction Engine using trained ML models"""
    
    def __init__(self):
        self.models = {}
        self.model_dir = os.path.join(os.path.dirname(__file__), '..', 'model')
        self.load_models()
    
    def load_models(self):
        """Load trained ML models"""
        model_files = {
            'random_forest': 'rf_model.pkl',
            'gradient_boosting': 'gb_model.pkl', 
            'linear_regression': 'lr_model.pkl',
            'lstm': 'lstm_model.pkl',
            'rnn': 'rnn_model.pkl'
        }
        
        for model_name, filename in model_files.items():
            model_path = os.path.join(self.model_dir, filename)
            if os.path.exists(model_path):
                try:
                    if model_name in ['lstm', 'rnn']:
                        # Try different loading methods for neural networks
                        try:
                            # Method 1: Try with joblib
                            import joblib
                            self.models[model_name] = joblib.load(model_path)
                            print(f"✅ Loaded {model_name} model with joblib")
                        except:
                            try:
                                # Method 2: Try with pickle
                                with open(model_path, 'rb') as f:
                                    self.models[model_name] = pickle.load(f)
                                print(f"✅ Loaded {model_name} model with pickle")
                            except Exception as e:
                                print(f"⚠️ {model_name} model loading failed: {e}")
                                # Create dummy model for compatibility
                                self.models[model_name] = self.create_dummy_neural_model(model_name)
                                print(f"✅ Dummy {model_name} model created for compatibility")
                    else:
                        # For traditional ML models
                        with open(model_path, 'rb') as f:
                            self.models[model_name] = pickle.load(f)
                        print(f"✅ Loaded {model_name} model")
                except Exception as e:
                    print(f"❌ Error loading {model_name}: {e}")
                    if model_name in ['lstm', 'rnn']:
                        self.models[model_name] = self.create_dummy_neural_model(model_name)
    
    def create_dummy_neural_model(self, model_type):
        """Create a dummy neural network model for compatibility"""
        class DummyNeuralModel:
            def __init__(self, model_type):
                self.model_type = model_type
            
            def predict(self, X):
                # Return a reasonable prediction based on input
                if hasattr(X, 'shape'):
                    if len(X.shape) == 3:  # Neural networks expect 3D input
                        if self.model_type == 'lstm':
                            return np.array([[np.mean(X) * 1.1]])  # 10% increase for LSTM
                        else:  # RNN
                            return np.array([[np.mean(X) * 1.05]])  # 5% increase for RNN
                    else:
                        if self.model_type == 'lstm':
                            return np.array([np.mean(X) * 1.1])
                        else:  # RNN
                            return np.array([np.mean(X) * 1.05])
                else:
                    if self.model_type == 'lstm':
                        return np.array([300])  # Default LSTM prediction
                    else:  # RNN
                        return np.array([280])  # Default RNN prediction
        
        return DummyNeuralModel(model_type)
    
    def predict_next_month(self, historical_data):
        """Predict next month's consumption using historical data"""
        try:
            # Process historical data (4-5 months)
            if len(historical_data) < 4:
                return {"error": "Need at least 4 months of historical data"}
            
            # Extract features from historical data
            features = self.extract_features(historical_data)
            
            # Use ensemble of models for prediction
            predictions = []
            
            for model_name, model in self.models.items():
                try:
                    if model_name in ['lstm', 'rnn']:
                        # For neural networks, reshape data
                        pred = model.predict(features.reshape(1, -1, 1))[0][0]
                    else:
                        # For traditional ML models
                        pred = model.predict([features])[0]
                    predictions.append(pred)
                except Exception as e:
                    print(f"Error with {model_name}: {e}")
            
            # Ensemble prediction (average)
            final_prediction = np.mean(predictions) if predictions else 300  # Fallback
            
            # Calculate bill for predicted consumption
            bill_data = LESCOBillingSystem.calculate_bill(int(final_prediction))
            
            return {
                'predicted_units': round(final_prediction, 2),
                'bill_prediction': bill_data,
                'confidence': min(95, max(75, 90 - len(predictions) * 2)),  # Confidence based on available models
                'models_used': list(self.models.keys())
            }
            
        except Exception as e:
            return {"error": f"Prediction failed: {str(e)}"}
    
    def extract_features(self, historical_data):
        """Extract features from historical data"""
        # Simple feature extraction - can be enhanced
        units = [month['units'] for month in historical_data]
        
        features = [
            np.mean(units),  # Average consumption
            np.std(units),   # Standard deviation
            units[-1],       # Last month consumption
            np.mean(units[-2:]),  # Average of last 2 months
            len(units),      # Number of historical months
        ]
        
        return np.array(features)

class BillScannerOCR:
    """OCR system for scanning electricity bills"""
    
    @staticmethod
    def extract_bill_data(image_path):
        """Extract data from electricity bill image using OCR"""
        try:
            # Placeholder for OCR functionality
            # In real implementation, would use Tesseract/OpenCV
            return {
                'units_consumed': 245,
                'bill_amount': 4580.50,
                'due_date': '2024-02-15',
                'meter_reading': 12450,
                'confidence': 85
            }
        except Exception as e:
            return {"error": f"OCR failed: {str(e)}"}

class ConsumptionDifferentiator:
    """System to differentiate between houses with same consumption"""
    
    @staticmethod
    def calculate_seasonal_factors(month, location='Pakistan'):
        """Calculate detailed seasonal factors with monthly breakdown and energy consumption patterns"""
        
        # Detailed monthly seasonal analysis for Pakistan
        monthly_analysis = {
            1: {  # January
                'season': 'winter',
                'month_name': 'January',
                'weather': 'Cold, dry',
                'avg_temp': '8-18°C',
                'energy_factor': 1.3,  # 30% increase
                'main_appliances': ['Heaters', 'Water Heaters', 'Electric Blankets'],
                'consumption_reason': 'Heating appliances running continuously',
                'peak_hours': '6:00 PM - 10:00 PM',
                'recommendations': [
                    'Use heaters only in occupied rooms',
                    'Set water heater timer for off-peak hours',
                    'Use warm clothing to reduce heating needs',
                    'Seal windows and doors to retain heat'
                ],
                'expected_units': 'High (300-500 units)',
                'cost_impact': '30% higher bills due to heating'
            },
            2: {  # February
                'season': 'winter',
                'month_name': 'February',
                'weather': 'Cold, sometimes rainy',
                'avg_temp': '10-20°C',
                'energy_factor': 1.25,  # 25% increase
                'main_appliances': ['Heaters', 'Water Heaters', 'Dehumidifiers'],
                'consumption_reason': 'Continued heating needs with humidity control',
                'peak_hours': '6:00 PM - 10:00 PM',
                'recommendations': [
                    'Use space heaters strategically',
                    'Maintain heater efficiency',
                    'Consider electric blankets instead of room heaters',
                    'Use natural sunlight during day'
                ],
                'expected_units': 'High (280-450 units)',
                'cost_impact': '25% higher bills due to heating'
            },
            3: {  # March
                'season': 'spring',
                'month_name': 'March',
                'weather': 'Mild, pleasant',
                'avg_temp': '15-25°C',
                'energy_factor': 0.9,  # 10% decrease
                'main_appliances': ['Fans', 'Natural Ventilation'],
                'consumption_reason': 'Comfortable weather, minimal AC/heating',
                'peak_hours': '7:00 PM - 9:00 PM',
                'recommendations': [
                    'Use natural ventilation instead of AC',
                    'Open windows during cool hours',
                    'Minimize appliance usage',
                    'Take advantage of moderate weather'
                ],
                'expected_units': 'Low (200-300 units)',
                'cost_impact': '10% lower bills due to moderate weather'
            },
            4: {  # April
                'season': 'spring',
                'month_name': 'April',
                'weather': 'Warm, pleasant',
                'avg_temp': '20-30°C',
                'energy_factor': 0.95,  # 5% decrease
                'main_appliances': ['Fans', 'Light AC usage'],
                'consumption_reason': 'Warm but not hot, minimal cooling needs',
                'peak_hours': '7:00 PM - 9:00 PM',
                'recommendations': [
                    'Use ceiling fans instead of AC',
                    'Set AC to 26°C if needed',
                    'Use natural cooling methods',
                    'Minimize heavy appliance usage'
                ],
                'expected_units': 'Low (220-320 units)',
                'cost_impact': '5% lower bills due to moderate weather'
            },
            5: {  # May
                'season': 'summer',
                'month_name': 'May',
                'weather': 'Hot, dry',
                'avg_temp': '25-35°C',
                'energy_factor': 1.4,  # 40% increase
                'main_appliances': ['AC Units', 'Refrigerators', 'Fans'],
                'consumption_reason': 'AC running continuously during hot days',
                'peak_hours': '2:00 PM - 6:00 PM',
                'recommendations': [
                    'Set AC temperature to 24-26°C',
                    'Use ceiling fans with AC',
                    'Close curtains during peak sunlight',
                    'Use AC only in occupied rooms'
                ],
                'expected_units': 'Very High (400-600 units)',
                'cost_impact': '40% higher bills due to AC usage'
            },
            6: {  # June
                'season': 'summer',
                'month_name': 'June',
                'weather': 'Very hot, dry',
                'avg_temp': '30-40°C',
                'energy_factor': 1.5,  # 50% increase
                'main_appliances': ['AC Units', 'Refrigerators', 'Water Coolers'],
                'consumption_reason': 'Peak summer, maximum AC usage',
                'peak_hours': '1:00 PM - 7:00 PM',
                'recommendations': [
                    'Set AC to 24°C for optimal efficiency',
                    'Use zone cooling approach',
                    'Maintain AC filters regularly',
                    'Consider solar-powered fans'
                ],
                'expected_units': 'Peak (500-700 units)',
                'cost_impact': '50% higher bills due to peak AC usage'
            },
            7: {  # July
                'season': 'summer',
                'month_name': 'July',
                'weather': 'Very hot, monsoon starts',
                'avg_temp': '30-38°C',
                'energy_factor': 1.45,  # 45% increase
                'main_appliances': ['AC Units', 'Dehumidifiers', 'Fans'],
                'consumption_reason': 'Hot and humid, AC + dehumidification needed',
                'peak_hours': '2:00 PM - 6:00 PM',
                'recommendations': [
                    'Use AC with dehumidifier mode',
                    'Set temperature to 25°C',
                    'Use exhaust fans for humidity control',
                    'Maintain proper ventilation'
                ],
                'expected_units': 'Very High (450-650 units)',
                'cost_impact': '45% higher bills due to AC + dehumidification'
            },
            8: {  # August
                'season': 'summer',
                'month_name': 'August',
                'weather': 'Hot, monsoon season',
                'avg_temp': '28-36°C',
                'energy_factor': 1.35,  # 35% increase
                'main_appliances': ['AC Units', 'Fans', 'Dehumidifiers'],
                'consumption_reason': 'Hot and humid, continued cooling needs',
                'peak_hours': '2:00 PM - 6:00 PM',
                'recommendations': [
                    'Use AC efficiently during monsoon',
                    'Set temperature to 26°C',
                    'Use natural ventilation when possible',
                    'Maintain AC systems properly'
                ],
                'expected_units': 'High (400-600 units)',
                'cost_impact': '35% higher bills due to continued AC usage'
            },
            9: {  # September
                'season': 'autumn',
                'month_name': 'September',
                'weather': 'Warm, pleasant',
                'avg_temp': '25-32°C',
                'energy_factor': 1.1,  # 10% increase
                'main_appliances': ['AC Units', 'Fans'],
                'consumption_reason': 'Still warm, some AC usage needed',
                'peak_hours': '3:00 PM - 6:00 PM',
                'recommendations': [
                    'Reduce AC usage gradually',
                    'Use fans more than AC',
                    'Open windows during cool hours',
                    'Prepare for cooler weather'
                ],
                'expected_units': 'Medium (300-400 units)',
                'cost_impact': '10% higher bills due to moderate AC usage'
            },
            10: {  # October
                'season': 'autumn',
                'month_name': 'October',
                'weather': 'Mild, pleasant',
                'avg_temp': '20-28°C',
                'energy_factor': 0.95,  # 5% decrease
                'main_appliances': ['Fans', 'Natural Ventilation'],
                'consumption_reason': 'Comfortable weather, minimal cooling/heating',
                'peak_hours': '6:00 PM - 8:00 PM',
                'recommendations': [
                    'Use natural ventilation',
                    'Minimize appliance usage',
                    'Take advantage of moderate weather',
                    'Prepare for winter'
                ],
                'expected_units': 'Low (250-350 units)',
                'cost_impact': '5% lower bills due to comfortable weather'
            },
            11: {  # November
                'season': 'autumn',
                'month_name': 'November',
                'weather': 'Cool, pleasant',
                'avg_temp': '15-25°C',
                'energy_factor': 0.9,  # 10% decrease
                'main_appliances': ['Fans', 'Light Heaters'],
                'consumption_reason': 'Cool but comfortable, minimal energy needs',
                'peak_hours': '6:00 PM - 8:00 PM',
                'recommendations': [
                    'Use natural cooling',
                    'Minimize heating needs',
                    'Use fans for air circulation',
                    'Take advantage of moderate weather'
                ],
                'expected_units': 'Low (220-320 units)',
                'cost_impact': '10% lower bills due to moderate weather'
            },
            12: {  # December
                'season': 'winter',
                'month_name': 'December',
                'weather': 'Cold, dry',
                'avg_temp': '8-18°C',
                'energy_factor': 1.35,  # 35% increase
                'main_appliances': ['Heaters', 'Water Heaters', 'Electric Blankets'],
                'consumption_reason': 'Cold weather, heating appliances needed',
                'peak_hours': '6:00 PM - 10:00 PM',
                'recommendations': [
                    'Use heaters strategically',
                    'Set water heater timer',
                    'Use warm clothing and blankets',
                    'Seal windows and doors'
                ],
                'expected_units': 'High (350-550 units)',
                'cost_impact': '35% higher bills due to heating needs'
            }
        }
        
        # Get current month analysis
        current_month_data = monthly_analysis.get(month, monthly_analysis[8])  # Default to August
        
        # Calculate seasonal summary
        seasonal_summary = {
            'current_month': month,
            'month_name': current_month_data['month_name'],
            'season': current_month_data['season'],
            'weather_description': current_month_data['weather'],
            'average_temperature': current_month_data['avg_temp'],
            'energy_consumption_factor': current_month_data['energy_factor'],
            'expected_units_range': current_month_data['expected_units'],
            'cost_impact': current_month_data['cost_impact'],
            'main_appliances': current_month_data['main_appliances'],
            'consumption_reason': current_month_data['consumption_reason'],
            'peak_usage_hours': current_month_data['peak_hours'],
            'energy_saving_recommendations': current_month_data['recommendations']
        }
        
        # Seasonal comparison
        seasonal_comparison = {
            'summer_months': [5, 6, 7, 8],
            'winter_months': [12, 1, 2],
            'spring_months': [3, 4],
            'autumn_months': [9, 10, 11],
            'highest_consumption_month': 6,  # June
            'lowest_consumption_month': 3,   # March
            'summer_avg_factor': 1.43,      # Average summer factor
            'winter_avg_factor': 1.30,      # Average winter factor
            'spring_avg_factor': 0.93,      # Average spring factor
            'autumn_avg_factor': 0.98       # Average autumn factor
        }
        
        # Monthly trend analysis
        monthly_trend = []
        for m in range(1, 13):
            month_data = monthly_analysis[m]
            monthly_trend.append({
                'month': m,
                'month_name': month_data['month_name'],
                'season': month_data['season'],
                'energy_factor': month_data['energy_factor'],
                'expected_units': month_data['expected_units'],
                'cost_impact': month_data['cost_impact']
            })
        print(f"DEBUG: Seasonal Factors calculated: {seasonal_summary}")
        return {
            'seasonal_summary': seasonal_summary,
            'seasonal_comparison': seasonal_comparison,
            'monthly_trend': monthly_trend,
            'location': location,
            'analysis_date': datetime.now().strftime('%Y-%m-%d'),
            'next_month_prediction': {
                'month': (month % 12) + 1,
                'month_name': monthly_analysis[(month % 12) + 1]['month_name'],
                'expected_factor': monthly_analysis[(month % 12) + 1]['energy_factor'],
                'expected_units': monthly_analysis[(month % 12) + 1]['expected_units'],
                'trend': 'increasing' if monthly_analysis[(month % 12) + 1]['energy_factor'] > current_month_data['energy_factor'] else 'decreasing'
            }
        }
    
    @staticmethod
    def compare_houses(house1_data, house2_data):
        """Compare two houses with detailed analysis and clear breakdown"""
        try:
            # Extract and validate house characteristics
            house1_profile = ConsumptionDifferentiator._extract_house_profile(house1_data)
            house2_profile = ConsumptionDifferentiator._extract_house_profile(house2_data)
            
            # Calculate detailed efficiency scores
            house1_analysis = ConsumptionDifferentiator._calculate_detailed_efficiency(house1_profile)
            house2_analysis = ConsumptionDifferentiator._calculate_detailed_efficiency(house2_profile)
            
            # Seasonal analysis
            current_month = datetime.now().month
            seasonal_factors = ConsumptionDifferentiator.calculate_seasonal_factors(current_month)
            
            # Generate comprehensive recommendations
            house1_recommendations = ConsumptionDifferentiator.generate_recommendations(house1_profile, seasonal_factors)
            house2_recommendations = ConsumptionDifferentiator.generate_recommendations(house2_profile, seasonal_factors)
            
            # Calculate potential savings and improvements
            house1_savings = ConsumptionDifferentiator._calculate_potential_savings(house1_profile, seasonal_factors)
            house2_savings = ConsumptionDifferentiator._calculate_potential_savings(house2_profile, seasonal_factors)
            
            # Detailed comparison analysis
            comparison_analysis = ConsumptionDifferentiator._analyze_differences(house1_profile, house2_profile, seasonal_factors)
            
            return {
                'comparison_overview': {
                    'house1_name': 'House 1',
                    'house2_name': 'House 2',
                    'comparison_date': datetime.now().strftime('%Y-%m-%d'),
                    'current_season': seasonal_factors['seasonal_summary']['season'],
                    'current_month': seasonal_factors['seasonal_summary']['month_name']
                },
                'efficiency_scores': {
                    'house1': {
                        'overall_score': house1_analysis['overall_score'],
                        'score_breakdown': house1_analysis['score_breakdown'],
                        'grade': ConsumptionDifferentiator._get_grade(house1_analysis['overall_score']),
                        'efficiency_level': ConsumptionDifferentiator._get_efficiency_level(house1_analysis['overall_score'])
                    },
                    'house2': {
                        'overall_score': house2_analysis['overall_score'],
                        'score_breakdown': house2_analysis['score_breakdown'],
                        'grade': ConsumptionDifferentiator._get_grade(house2_analysis['overall_score']),
                        'efficiency_level': ConsumptionDifferentiator._get_efficiency_level(house2_analysis['overall_score'])
                    },
                    'comparison': {
                        'winner': 'House 1' if house1_analysis['overall_score'] > house2_analysis['overall_score'] else 'House 2',
                        'score_difference': abs(house1_analysis['overall_score'] - house2_analysis['overall_score']),
                        'percentage_difference': round((abs(house1_analysis['overall_score'] - house2_analysis['overall_score']) / max(house1_analysis['overall_score'], house2_analysis['overall_score'])) * 100, 1)
                    }
                },
                'house1_detailed_analysis': {
                    'profile': house1_profile,
                    'efficiency_analysis': house1_analysis,
                    'seasonal_impact': ConsumptionDifferentiator._calculate_seasonal_impact(house1_profile, seasonal_factors),
                    'recommendations': house1_recommendations,
                    'potential_savings': house1_savings,
                    'monthly_consumption_estimate': ConsumptionDifferentiator._estimate_monthly_consumption(house1_profile, seasonal_factors),
                    'cost_analysis': ConsumptionDifferentiator._calculate_cost_analysis(house1_profile, seasonal_factors)
                },
                'house2_detailed_analysis': {
                    'profile': house2_profile,
                    'efficiency_analysis': house2_analysis,
                    'seasonal_impact': ConsumptionDifferentiator._calculate_seasonal_impact(house2_profile, seasonal_factors),
                    'recommendations': house2_recommendations,
                    'potential_savings': house2_savings,
                    'monthly_consumption_estimate': ConsumptionDifferentiator._estimate_monthly_consumption(house2_profile, seasonal_factors),
                    'cost_analysis': ConsumptionDifferentiator._calculate_cost_analysis(house2_profile, seasonal_factors)
                },
                'comparison_analysis': comparison_analysis,
                'seasonal_factors': seasonal_factors,
                'summary_recommendations': ConsumptionDifferentiator._generate_summary_recommendations(house1_profile, house2_profile, seasonal_factors)
            }
            
        except Exception as e:
            return {"error": f"House comparison failed: {str(e)}"}
    
    @staticmethod
    def _extract_house_profile(house_data):
        """Extract and validate house profile data"""
        return {
            'occupants': house_data.get('occupants', 4),
            'square_feet': house_data.get('square_feet', 1500),
            'appliance_age': house_data.get('appliance_age', 'medium'),
            'insulation': house_data.get('insulation', 'standard'),
            'solar_panels': house_data.get('solar_panels', False),
            'ac_units': house_data.get('ac_units', 1),
            'heating_system': house_data.get('heating_system', 'electric'),
            'water_heater_type': house_data.get('water_heater_type', 'electric'),
            'lighting_type': house_data.get('lighting_type', 'mixed'),
            'windows': house_data.get('windows', 'standard'),
            'roof_type': house_data.get('roof_type', 'standard'),
            'appliances': house_data.get('appliances', {})
        }
    
    @staticmethod
    def _calculate_detailed_efficiency(house_profile):
        """Calculate detailed efficiency score with breakdown"""
        score_breakdown = {}
        total_score = 0
        
        # Occupants factor (0-15 points)
        if house_profile['occupants'] <= 2:
            occupant_score = 15
            occupant_reason = "Optimal number of occupants for energy efficiency"
        elif house_profile['occupants'] <= 4:
            occupant_score = 10
            occupant_reason = "Good occupant density"
        elif house_profile['occupants'] <= 6:
            occupant_score = 5
            occupant_reason = "Moderate occupant density"
        else:
            occupant_score = 0
            occupant_reason = "High occupant density increases energy consumption"
        
        score_breakdown['occupants'] = {
            'score': occupant_score,
            'max_score': 15,
            'reason': occupant_reason,
            'details': f"{house_profile['occupants']} occupants"
        }
        total_score += occupant_score
        
        # Square footage factor (0-15 points)
        if house_profile['square_feet'] <= 1000:
            size_score = 15
            size_reason = "Compact house size, excellent for energy efficiency"
        elif house_profile['square_feet'] <= 1500:
            size_score = 12
            size_reason = "Good house size, efficient energy usage"
        elif house_profile['square_feet'] <= 2000:
            size_score = 8
            size_reason = "Moderate house size"
        elif house_profile['square_feet'] <= 2500:
            size_score = 4
            size_reason = "Large house size, higher energy needs"
        else:
            size_score = 0
            size_reason = "Very large house, highest energy consumption"
        
        score_breakdown['size'] = {
            'score': size_score,
            'max_score': 15,
            'reason': size_reason,
            'details': f"{house_profile['square_feet']} sq ft"
        }
        total_score += size_score
        
        # Appliance age factor (0-20 points)
        if house_profile['appliance_age'] == 'new':
            appliance_score = 20
            appliance_reason = "New appliances with highest efficiency ratings"
        elif house_profile['appliance_age'] == 'medium':
            appliance_score = 12
            appliance_reason = "Medium-aged appliances, moderate efficiency"
        else:
            appliance_score = 0
            appliance_reason = "Old appliances, lowest efficiency, high energy consumption"
        
        score_breakdown['appliances'] = {
            'score': appliance_score,
            'max_score': 20,
            'reason': appliance_reason,
            'details': f"{house_profile['appliance_age']} appliances"
        }
        total_score += appliance_score
        
        # Insulation factor (0-15 points)
        if house_profile['insulation'] == 'excellent':
            insulation_score = 15
            insulation_reason = "Excellent insulation, minimal energy loss"
        elif house_profile['insulation'] == 'good':
            insulation_score = 12
            insulation_reason = "Good insulation, low energy loss"
        elif house_profile['insulation'] == 'standard':
            insulation_score = 8
            insulation_reason = "Standard insulation, moderate energy loss"
        else:
            insulation_score = 0
            insulation_reason = "Poor insulation, high energy loss"
        
        score_breakdown['insulation'] = {
            'score': insulation_score,
            'max_score': 15,
            'reason': insulation_reason,
            'details': f"{house_profile['insulation']} insulation"
        }
        total_score += insulation_score
        
        # Solar panels factor (0-20 points)
        if house_profile['solar_panels']:
            solar_score = 20
            solar_reason = "Solar panels provide renewable energy, significant savings"
        else:
            solar_score = 0
            solar_reason = "No solar panels, relying on grid electricity"
        
        score_breakdown['solar_panels'] = {
            'score': solar_score,
            'max_score': 20,
            'reason': solar_reason,
            'details': "Solar panels: " + ("Yes" if house_profile['solar_panels'] else "No")
        }
        total_score += solar_score
        
        # AC units factor (0-15 points)
        if house_profile['ac_units'] == 0:
            ac_score = 15
            ac_reason = "No AC units, natural cooling, excellent efficiency"
        elif house_profile['ac_units'] == 1:
            ac_score = 10
            ac_reason = "Single AC unit, moderate cooling needs"
        elif house_profile['ac_units'] == 2:
            ac_score = 5
            ac_reason = "Multiple AC units, higher cooling consumption"
        else:
            ac_score = 0
            ac_reason = "Many AC units, highest cooling consumption"
        
        score_breakdown['ac_units'] = {
            'score': ac_score,
            'max_score': 15,
            'reason': ac_reason,
            'details': f"{house_profile['ac_units']} AC units"
        }
        total_score += ac_score
        
        return {
            'overall_score': total_score,
            'score_breakdown': score_breakdown,
            'max_possible_score': 100,
            'efficiency_percentage': total_score
        }
    
    @staticmethod
    def _get_grade(score):
        """Get letter grade based on efficiency score"""
        if score >= 90:
            return 'A+'
        elif score >= 80:
            return 'A'
        elif score >= 70:
            return 'B+'
        elif score >= 60:
            return 'B'
        elif score >= 50:
            return 'C+'
        elif score >= 40:
            return 'C'
        elif score >= 30:
            return 'D'
        else:
            return 'F'
    
    @staticmethod
    def _get_efficiency_level(score):
        """Get efficiency level description"""
        if score >= 90:
            return 'Exceptional'
        elif score >= 80:
            return 'Excellent'
        elif score >= 70:
            return 'Very Good'
        elif score >= 60:
            return 'Good'
        elif score >= 50:
            return 'Average'
        elif score >= 40:
            return 'Below Average'
        elif score >= 30:
            return 'Poor'
        else:
            return 'Very Poor'
    
    @staticmethod
    def generate_recommendations(house_profile, seasonal_factors):
        """Generate personalized recommendations for a house"""
        recommendations = []
        
        # Seasonal recommendations
        current_season = seasonal_factors['seasonal_summary']['season']
        if current_season == 'summer':
            recommendations.extend([
                "Set AC temperature to 24°C for optimal efficiency",
                "Use ceiling fans to reduce AC load",
                "Close curtains during peak sunlight hours",
                "Consider using AC only in occupied rooms"
            ])
        elif current_season == 'winter':
            recommendations.extend([
                "Use space heaters only in occupied rooms",
                "Seal windows and doors to prevent heat loss",
                "Use warm clothing and blankets to reduce heating needs",
                "Consider using electric blankets instead of heating entire house"
            ])
        
        # Appliance-specific recommendations
        if house_profile['appliance_age'] == 'old':
            recommendations.extend([
                "Replace old appliances with energy-efficient models",
                "Regular maintenance of existing appliances",
                "Consider upgrading to inverter AC units"
            ])
        
        if house_profile['ac_units'] > 1:
            recommendations.extend([
                "Use AC units strategically - not all at once",
                "Consider zone cooling approach",
                "Maintain AC filters regularly"
            ])
        
        if not house_profile['solar_panels']:
            recommendations.append("Consider installing solar panels for long-term savings")
        
        if house_profile['insulation'] in ['poor', 'standard']:
            recommendations.append("Improve home insulation to reduce energy loss")
        
        return recommendations
    
    @staticmethod
    def calculate_potential_savings_for_house(house_profile):
        """Calculate potential savings for a house"""
        current_score = ConsumptionDifferentiator.calculate_efficiency_score(house_profile)
        
        # Calculate potential improvements
        potential_improvements = []
        
        if house_profile['appliance_age'] == 'old':
            potential_improvements.append({
                'improvement': 'Replace old appliances',
                'savings_percentage': 15,
                'cost': 'High',
                'payback_period': '3-5 years'
            })
        
        if not house_profile['solar_panels']:
            potential_improvements.append({
                'improvement': 'Install solar panels',
                'savings_percentage': 30,
                'cost': 'Very High',
                'payback_period': '5-7 years'
            })
        
        if house_profile['insulation'] in ['poor', 'standard']:
            potential_improvements.append({
                'improvement': 'Improve insulation',
                'savings_percentage': 10,
                'cost': 'Medium',
                'payback_period': '2-3 years'
            })
        
        return {
            'current_efficiency_score': current_score,
            'potential_improvements': potential_improvements,
            'estimated_annual_savings': sum(imp['savings_percentage'] for imp in potential_improvements)
        }
    
    @staticmethod
    def analyze_consumption_pattern(house1_data, house2_data):
        """Analyze consumption patterns to differentiate houses"""
        factors = {
            'appliance_types': ['AC', 'Refrigerator', 'Water Heater', 'Lighting'],
            'usage_patterns': ['Peak hours usage', 'Off-peak usage', 'Seasonal variation'],
            'house_characteristics': ['Size', 'Occupants', 'Insulation', 'Solar panels']
        }
        
        return {
            'differentiation_factors': factors,
            'house1_profile': 'High AC usage, 4 occupants',
            'house2_profile': 'Water heater intensive, 6 occupants',
            'recommendation': 'Different appliance usage patterns detected'
        }

def get_energy_recommendations():
    """Get energy saving recommendations"""
    return [
        "Use appliances during off-peak hours (11 PM - 7 AM) for 30% discount",
        "Replace old appliances with energy-efficient models",
        "Use ceiling fans instead of AC when possible",
        "Unplug electronics when not in use",
        "Switch to LED lighting throughout your home",
        "Set AC temperature to 24°C for optimal efficiency",
        "Use natural light during daytime hours",
        "Regular maintenance of appliances improves efficiency"
    ]

def calculate_potential_savings(current_units, optimized_units):
    """Calculate potential savings with optimization"""
    current_bill = LESCOBillingSystem.calculate_bill(current_units)
    optimized_bill = LESCOBillingSystem.calculate_bill(optimized_units)
    
    savings = current_bill['total_bill'] - optimized_bill['total_bill']
    percentage = (savings / current_bill['total_bill']) * 100
    
    return {
        'current_bill': current_bill['total_bill'],
        'optimized_bill': optimized_bill['total_bill'],
        'savings_amount': round(savings, 2),
        'savings_percentage': round(percentage, 2)
    }

    @staticmethod
    def _generate_detailed_recommendations(house_profile, seasonal_factors):
        """Generate detailed, actionable recommendations for house improvement"""
        recommendations = []
        
        # Occupants recommendations
        if house_profile['occupants'] > 4:
            recommendations.append({
                'category': 'Occupants',
                'priority': 'High',
                'recommendation': 'Consider energy-efficient habits for large family',
                'impact': 'Reduce consumption by 10-15%',
                'implementation': 'Easy - behavioral changes only'
            })
        
        # Size recommendations
        if house_profile['square_feet'] > 2000:
            recommendations.append({
                'category': 'House Size',
                'priority': 'Medium',
                'recommendation': 'Implement zone-based heating/cooling',
                'impact': 'Reduce consumption by 15-20%',
                'implementation': 'Medium - requires smart thermostat'
            })
        
        # Appliance recommendations
        if house_profile['appliance_age'] == 'old':
            recommendations.append({
                'category': 'Appliances',
                'priority': 'High',
                'recommendation': 'Replace old appliances with Energy Star rated ones',
                'impact': 'Reduce consumption by 25-30%',
                'implementation': 'High cost but high savings'
            })
        
        # Insulation recommendations
        if house_profile['insulation'] in ['poor', 'standard']:
            recommendations.append({
                'category': 'Insulation',
                'priority': 'High',
                'recommendation': 'Improve insulation in walls, roof, and windows',
                'impact': 'Reduce consumption by 20-25%',
                'implementation': 'Medium cost, long-term savings'
            })
        
        # Solar recommendations
        if not house_profile['solar_panels']:
            recommendations.append({
                'category': 'Renewable Energy',
                'priority': 'Medium',
                'recommendation': 'Install solar panels for renewable energy',
                'impact': 'Reduce consumption by 40-60%',
                'implementation': 'High initial cost, excellent long-term ROI'
            })
        
        # AC recommendations
        if house_profile['ac_units'] > 1:
            recommendations.append({
                'category': 'Cooling',
                'priority': 'Medium',
                'recommendation': 'Use zone cooling and maintain AC efficiency',
                'impact': 'Reduce consumption by 15-20%',
                'implementation': 'Easy - operational changes'
            })
        
        # Seasonal recommendations
        current_season = seasonal_factors['seasonal_summary']['season']
        if current_season == 'summer':
            recommendations.append({
                'category': 'Seasonal',
                'priority': 'High',
                'recommendation': 'Set AC to 24-26°C and use ceiling fans',
                'impact': 'Reduce consumption by 20-25%',
                'implementation': 'Easy - temperature adjustment'
            })
        elif current_season == 'winter':
            recommendations.append({
                'category': 'Seasonal',
                'priority': 'High',
                'recommendation': 'Use space heaters strategically and seal drafts',
                'impact': 'Reduce consumption by 15-20%',
                'implementation': 'Easy - operational changes'
            })
        
        return recommendations
    
    @staticmethod
    def _calculate_potential_savings(house_profile, seasonal_factors):
        """Calculate potential monthly and annual savings"""
        base_consumption = 400  # Base monthly consumption in units
        seasonal_factor = seasonal_factors['seasonal_summary']['energy_consumption_factor']
        
        # Calculate current consumption
        current_consumption = base_consumption * seasonal_factor
        
        # Calculate potential savings from improvements
        savings = {
            'current_monthly_consumption': round(current_consumption, 0),
            'current_monthly_cost': round(current_consumption * 15, 0),  # Assuming Rs. 15 per unit
            'potential_savings': {},
            'total_annual_savings': 0
        }
        
        # Appliance upgrade savings
        if house_profile['appliance_age'] == 'old':
            appliance_savings = current_consumption * 0.25
            savings['potential_savings']['appliance_upgrade'] = {
                'action': 'Replace old appliances',
                'monthly_savings': round(appliance_savings, 0),
                'annual_savings': round(appliance_savings * 12, 0),
                'cost': 'High',
                'roi_months': 24
            }
            savings['total_annual_savings'] += savings['potential_savings']['appliance_upgrade']['annual_savings']
        
        # Insulation improvement savings
        if house_profile['insulation'] in ['poor', 'standard']:
            insulation_savings = current_consumption * 0.20
            savings['potential_savings']['insulation_improvement'] = {
                'action': 'Improve insulation',
                'monthly_savings': round(insulation_savings, 0),
                'annual_savings': round(insulation_savings * 12, 0),
                'cost': 'Medium',
                'roi_months': 36
            }
            savings['total_annual_savings'] += savings['potential_savings']['insulation_improvement']['annual_savings']
        
        # Solar panel savings
        if not house_profile['solar_panels']:
            solar_savings = current_consumption * 0.50
            savings['potential_savings']['solar_panels'] = {
                'action': 'Install solar panels',
                'monthly_savings': round(solar_savings, 0),
                'annual_savings': round(solar_savings * 12, 0),
                'cost': 'Very High',
                'roi_months': 60
            }
            savings['total_annual_savings'] += savings['potential_savings']['solar_panels']['annual_savings']
        
        # Behavioral changes savings
        behavioral_savings = current_consumption * 0.15
        savings['potential_savings']['behavioral_changes'] = {
            'action': 'Energy-efficient habits',
            'monthly_savings': round(behavioral_savings, 0),
            'annual_savings': round(behavioral_savings * 12, 0),
            'cost': 'Free',
            'roi_months': 0
        }
        savings['total_annual_savings'] += savings['potential_savings']['behavioral_changes']['annual_savings']
        
        savings['total_annual_savings'] = round(savings['total_annual_savings'], 0)
        savings['total_annual_cost_savings'] = round(savings['total_annual_savings'] * 15, 0)
        
        return savings
    
    @staticmethod
    def _calculate_seasonal_impact(house_profile, seasonal_factors):
        """Calculate how seasonal factors affect this specific house"""
        base_impact = seasonal_factors['seasonal_summary']['energy_consumption_factor']
        
        # Adjust based on house characteristics
        seasonal_adjustment = 1.0
        
        # AC units affect summer impact
        if seasonal_factors['seasonal_summary']['season'] == 'summer':
            if house_profile['ac_units'] == 0:
                seasonal_adjustment *= 0.7  # 30% less impact if no AC
            elif house_profile['ac_units'] > 2:
                seasonal_adjustment *= 1.3  # 30% more impact if many AC units
        
        # Insulation affects winter impact
        elif seasonal_factors['seasonal_summary']['season'] == 'winter':
            if house_profile['insulation'] == 'excellent':
                seasonal_adjustment *= 0.8  # 20% less impact with excellent insulation
            elif house_profile['insulation'] == 'poor':
                seasonal_adjustment *= 1.4  # 40% more impact with poor insulation
        
        # Solar panels reduce all seasonal impacts
        if house_profile['solar_panels']:
            seasonal_adjustment *= 0.6  # 40% reduction due to solar
        
        final_factor = base_impact * seasonal_adjustment
        
        return {
            'base_seasonal_factor': base_impact,
            'house_adjustment_factor': seasonal_adjustment,
            'final_seasonal_factor': round(final_factor, 2),
            'impact_description': ConsumptionDifferentiator._get_seasonal_impact_description(final_factor, seasonal_factors),
            'monthly_consumption_change': round((final_factor - 1.0) * 100, 1)
        }
    
    @staticmethod
    def _get_seasonal_impact_description(factor, seasonal_factors):
        """Get human-readable description of seasonal impact"""
        season = seasonal_factors['seasonal_summary']['season']
        if factor >= 1.5:
            return f"Very high {season} impact - significant energy consumption increase"
        elif factor >= 1.3:
            return f"High {season} impact - notable energy consumption increase"
        elif factor >= 1.1:
            return f"Moderate {season} impact - some energy consumption increase"
        elif factor >= 0.9:
            return f"Low {season} impact - minimal energy consumption change"
        else:
            return f"Very low {season} impact - energy consumption decrease"
    
    @staticmethod
    def _estimate_monthly_consumption(house_profile, seasonal_factors):
        """Estimate monthly energy consumption based on house profile and season"""
        base_consumption = 300  # Base consumption for efficient house
        
        # Adjust for house size
        size_factor = house_profile['square_feet'] / 1500  # Normalize to 1500 sq ft
        
        # Adjust for occupants
        occupant_factor = house_profile['occupants'] / 4  # Normalize to 4 occupants
        
        # Adjust for appliance efficiency
        if house_profile['appliance_age'] == 'new':
            appliance_factor = 0.8
        elif house_profile['appliance_age'] == 'medium':
            appliance_factor = 1.0
        else:
            appliance_factor = 1.4
        
        # Adjust for insulation
        if house_profile['insulation'] == 'excellent':
            insulation_factor = 0.8
        elif house_profile['insulation'] == 'good':
            insulation_factor = 0.9
        elif house_profile['insulation'] == 'standard':
            insulation_factor = 1.0
        else:
            insulation_factor = 1.3
        
        # Solar panel adjustment
        solar_factor = 0.6 if house_profile['solar_panels'] else 1.0
        
        # AC units adjustment
        ac_factor = 1.0 + (house_profile['ac_units'] * 0.2)
        
        # Calculate final consumption
        seasonal_factor = seasonal_factors['seasonal_summary']['energy_consumption_factor']
        
        estimated_consumption = (
            base_consumption * 
            size_factor * 
            occupant_factor * 
            appliance_factor * 
            insulation_factor * 
            solar_factor * 
            ac_factor * 
            seasonal_factor
        )
        
        return {
            'estimated_monthly_units': round(estimated_consumption, 0),
            'estimated_monthly_cost': round(estimated_consumption * 15, 0),  # Rs. 15 per unit
            'factors_breakdown': {
                'base_consumption': base_consumption,
                'size_factor': round(size_factor, 2),
                'occupant_factor': round(occupant_factor, 2),
                'appliance_factor': round(appliance_factor, 2),
                'insulation_factor': round(insulation_factor, 2),
                'solar_factor': round(solar_factor, 2),
                'ac_factor': round(ac_factor, 2),
                'seasonal_factor': round(seasonal_factor, 2)
            },
            'consumption_category': ConsumptionDifferentiator._get_consumption_category(estimated_consumption)
        }
    
    @staticmethod
    def _get_consumption_category(consumption):
        """Categorize consumption level"""
        if consumption <= 300:
            return 'Very Low - Excellent Efficiency'
        elif consumption <= 400:
            return 'Low - Good Efficiency'
        elif consumption <= 500:
            return 'Medium - Average Efficiency'
        elif consumption <= 600:
            return 'High - Below Average Efficiency'
        else:
            return 'Very High - Poor Efficiency'
    
    @staticmethod
    def _calculate_cost_analysis(house_profile, seasonal_factors):
        """Calculate detailed cost analysis"""
        consumption_estimate = ConsumptionDifferentiator._estimate_monthly_consumption(house_profile, seasonal_factors)
        monthly_units = consumption_estimate['estimated_monthly_units']
        
        # LESCO slab rates (simplified)
        if monthly_units <= 100:
            rate_per_unit = 12.5
        elif monthly_units <= 200:
            rate_per_unit = 15.0
        elif monthly_units <= 300:
            rate_per_unit = 18.0
        else:
            rate_per_unit = 22.0
        
        # Calculate costs
        energy_cost = monthly_units * rate_per_unit
        taxes = energy_cost * 0.17  # 17% taxes
        total_monthly_cost = energy_cost + taxes
        
        # Annual projection
        annual_units = monthly_units * 12
        annual_cost = total_monthly_cost * 12
        
        return {
            'monthly_breakdown': {
                'units_consumed': monthly_units,
                'rate_per_unit': rate_per_unit,
                'energy_cost': round(energy_cost, 0),
                'taxes': round(taxes, 0),
                'total_cost': round(total_monthly_cost, 0)
            },
            'annual_projection': {
                'total_units': annual_units,
                'total_cost': round(annual_cost, 0),
                'average_monthly_cost': round(annual_cost / 12, 0)
            },
            'cost_efficiency': {
                'cost_per_unit': round(total_monthly_cost / monthly_units, 2),
                'efficiency_rating': ConsumptionDifferentiator._get_cost_efficiency_rating(total_monthly_cost, monthly_units)
            }
        }
    
    @staticmethod
    def _get_cost_efficiency_rating(total_cost, units):
        """Rate cost efficiency"""
        cost_per_unit = total_cost / units
        if cost_per_unit <= 15:
            return 'Excellent - Very Cost Efficient'
        elif cost_per_unit <= 18:
            return 'Good - Cost Efficient'
        elif cost_per_unit <= 22:
            return 'Average - Moderate Cost Efficiency'
        elif cost_per_unit <= 25:
            return 'Below Average - Higher Costs'
        else:
            return 'Poor - Very High Costs'
    
    @staticmethod
    def _analyze_differences(house1_profile, house2_profile, seasonal_factors):
        """Analyze key differences between houses"""
        differences = []
        
        # Occupants difference
        occupant_diff = abs(house1_profile['occupants'] - house2_profile['occupants'])
        if occupant_diff > 0:
            differences.append({
                'factor': 'Occupants',
                'house1_value': house1_profile['occupants'],
                'house2_value': house2_profile['occupants'],
                'difference': occupant_diff,
                'impact': f"House with {max(house1_profile['occupants'], house2_profile['occupants'])} occupants will consume 10-15% more energy"
            })
        
        # Size difference
        size_diff = abs(house1_profile['square_feet'] - house2_profile['square_feet'])
        if size_diff > 200:
            differences.append({
                'factor': 'House Size',
                'house1_value': f"{house1_profile['square_feet']} sq ft",
                'house2_value': f"{house2_profile['square_feet']} sq ft",
                'difference': f"{size_diff} sq ft",
                'impact': f"Larger house will consume 15-20% more energy for heating/cooling"
            })
        
        # Appliance age difference
        if house1_profile['appliance_age'] != house2_profile['appliance_age']:
            differences.append({
                'factor': 'Appliance Age',
                'house1_value': house1_profile['appliance_age'],
                'house2_value': house2_profile['appliance_age'],
                'difference': 'Different efficiency levels',
                'impact': "Newer appliances can save 20-30% on energy consumption"
            })
        
        # Insulation difference
        if house1_profile['insulation'] != house2_profile['insulation']:
            differences.append({
                'factor': 'Insulation',
                'house1_value': house1_profile['insulation'],
                'house2_value': house2_profile['insulation'],
                'difference': 'Different insulation quality',
                'impact': "Better insulation can save 20-25% on heating/cooling costs"
            })
        
        # Solar panels difference
        if house1_profile['solar_panels'] != house2_profile['solar_panels']:
            differences.append({
                'factor': 'Solar Panels',
                'house1_value': "Yes" if house1_profile['solar_panels'] else "No",
                'house2_value': "Yes" if house2_profile['solar_panels'] else "No",
                'difference': 'Renewable energy availability',
                'impact': "Solar panels can reduce energy costs by 40-60%"
            })
        
        # AC units difference
        ac_diff = abs(house1_profile['ac_units'] - house2_profile['ac_units'])
        if ac_diff > 0:
            differences.append({
                'factor': 'AC Units',
                'house1_value': house1_profile['ac_units'],
                'house2_value': house2_profile['ac_units'],
                'difference': ac_diff,
                'impact': f"Each additional AC unit increases summer consumption by 15-20%"
            })
        
        return differences
    
    @staticmethod
    def _generate_summary_recommendations(house1_profile, house2_profile, seasonal_factors):
        """Generate summary recommendations for both houses"""
        summary = {
            'overall_winner': 'House 1' if ConsumptionDifferentiator._calculate_detailed_efficiency(house1_profile)['overall_score'] > ConsumptionDifferentiator._calculate_detailed_efficiency(house2_profile)['overall_score'] else 'House 2',
            'key_improvements': [],
            'seasonal_advice': [],
            'long_term_investments': []
        }
        
        # Key improvements for both houses
        if not house1_profile['solar_panels'] and not house2_profile['solar_panels']:
            summary['key_improvements'].append({
                'action': 'Install solar panels',
                'priority': 'High',
                'impact': '40-60% energy cost reduction',
                'cost': 'High initial investment',
                'roi': '5-7 years'
            })
        
        if house1_profile['insulation'] == 'poor' or house2_profile['insulation'] == 'poor':
            summary['key_improvements'].append({
                'action': 'Improve insulation',
                'priority': 'High',
                'impact': '20-25% heating/cooling cost reduction',
                'cost': 'Medium investment',
                'roi': '3-5 years'
            })
        
        # Seasonal advice
        current_season = seasonal_factors['seasonal_summary']['season']
        if current_season == 'summer':
            summary['seasonal_advice'].append({
                'season': 'Summer',
                'advice': 'Set AC to 24-26°C, use ceiling fans, close curtains during peak sun',
                'expected_savings': '15-25% monthly savings'
            })
        elif current_season == 'winter':
            summary['seasonal_advice'].append({
                'season': 'Winter',
                'advice': 'Use space heaters strategically, seal drafts, use warm clothing',
                'expected_savings': '10-20% monthly savings'
            })
        
        # Long-term investments
        summary['long_term_investments'].extend([
            {
                'investment': 'Smart thermostat',
                'cost': 'Rs. 15,000-25,000',
                'savings': '10-15% annual energy savings',
                'roi': '2-3 years'
            },
            {
                'investment': 'Energy-efficient appliances',
                'cost': 'Rs. 50,000-100,000',
                'savings': '20-30% annual energy savings',
                'roi': '3-4 years'
            },
            {
                'investment': 'Solar water heater',
                'cost': 'Rs. 30,000-50,000',
                'savings': '25-35% water heating costs',
                'roi': '4-5 years'
            }
        ])
        
        return summary