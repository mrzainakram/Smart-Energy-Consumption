# Enhanced Authentication and OTP Services
import smtplib
import random
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from django.conf import settings
from django.contrib.auth import authenticate
from django.utils import timezone
from datetime import timedelta
from .models import User, OTP
import openai

logger = logging.getLogger(__name__)

class EmailService:
    """Service for sending OTP emails"""
    
    @staticmethod
    def send_otp_email(user_email, otp_code, purpose='signup'):
        """Send OTP email to user"""
        try:
            subject_map = {
                'signup': 'Verify Your Account - Smart Energy System',
                'login': 'Login Verification - Smart Energy System',
                'password_reset': 'Password Reset - Smart Energy System',
                'email_change': 'Email Change Verification - Smart Energy System'
            }
            
            subject = subject_map.get(purpose, 'Verification Code - Smart Energy System')
            
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    .container {{
                        max-width: 600px;
                        margin: 0 auto;
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        padding: 20px;
                        border-radius: 15px;
                    }}
                    .content {{
                        background: white;
                        padding: 40px;
                        border-radius: 10px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    }}
                    .otp-code {{
                        font-size: 48px;
                        font-weight: bold;
                        color: #667eea;
                        text-align: center;
                        letter-spacing: 10px;
                        margin: 30px 0;
                        padding: 20px;
                        background: #f8f9fa;
                        border-radius: 10px;
                        border: 2px dashed #667eea;
                    }}
                    .header {{
                        text-align: center;
                        color: #333;
                        margin-bottom: 30px;
                    }}
                    .footer {{
                        text-align: center;
                        color: #666;
                        font-size: 14px;
                        margin-top: 30px;
                    }}
                    .warning {{
                        background: #fff3cd;
                        color: #856404;
                        padding: 15px;
                        border-radius: 5px;
                        margin: 20px 0;
                        border-left: 4px solid #ffc107;
                    }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="content">
                        <div class="header">
                            <h1>⚡ Smart Energy System</h1>
                            <h2>Verification Code</h2>
                        </div>
                        
                        <p>Hello!</p>
                        <p>Your verification code for Smart Energy System is:</p>
                        
                        <div class="otp-code">{otp_code}</div>
                        
                        <div class="warning">
                            <strong>⚠️ Important:</strong>
                            <ul>
                                <li>This code expires in 10 minutes</li>
                                <li>Don't share this code with anyone</li>
                                <li>If you didn't request this, please ignore this email</li>
                            </ul>
                        </div>
                        
                        <p>Enter this code in the Smart Energy System app to continue.</p>
                        
                        <div class="footer">
                            <p>Smart Energy System - Intelligent Energy Management</p>
                            <p>This is an automated message, please do not reply.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            """
            
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = settings.DEFAULT_FROM_EMAIL
            msg['To'] = user_email
            
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            # Send email
            server = smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT)
            server.starttls()
            server.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
            server.send_message(msg)
            server.quit()
            
            logger.info(f"OTP email sent successfully to {user_email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send OTP email: {str(e)}")
            return False

class OTPService:
    """Service for OTP generation and verification"""
    
    @staticmethod
    def generate_otp(user, purpose='signup'):
        """Generate and save OTP for user"""
        try:
            # Invalidate any existing OTPs for this purpose
            OTP.objects.filter(
                user=user, 
                purpose=purpose, 
                is_used=False
            ).update(is_used=True)
            
            # Create new OTP
            otp = OTP.objects.create(user=user, purpose=purpose)
            
            # Send email
            email_sent = EmailService.send_otp_email(user.email, otp.otp_code, purpose)
            
            if email_sent:
                logger.info(f"OTP generated and sent for user {user.email}")
                return otp
            else:
                otp.delete()
                return None
                
        except Exception as e:
            logger.error(f"Failed to generate OTP: {str(e)}")
            return None
    
    @staticmethod
    def verify_otp(user, otp_code, purpose='signup'):
        """Verify OTP code"""
        try:
            otp = OTP.objects.filter(
                user=user,
                otp_code=otp_code,
                purpose=purpose,
                is_used=False
            ).first()
            
            if not otp:
                return False, "Invalid OTP code"
            
            if otp.is_expired():
                return False, "OTP code has expired"
            
            # Mark as used
            otp.is_used = True
            otp.save()
            
            # Update user verification status
            if purpose == 'signup':
                user.is_email_verified = True
                user.save()
            
            logger.info(f"OTP verified successfully for user {user.email}")
            return True, "OTP verified successfully"
            
        except Exception as e:
            logger.error(f"Failed to verify OTP: {str(e)}")
            return False, "Verification failed"

class ChatbotService:
    """AI Chatbot service using OpenAI"""
    
    @staticmethod
    def get_response(user_message, context=None):
        """Get response from AI chatbot"""
        try:
            # Set OpenAI API key
            openai.api_key = settings.OPENAI_API_KEY
            
            # System prompt for energy-focused chatbot
            system_prompt = """
            You are an intelligent energy consultant AI for a Smart Energy System. Your expertise includes:
            
            1. Energy consumption optimization
            2. Electricity bill analysis and reduction strategies
            3. Appliance efficiency recommendations
            4. Solar panel and renewable energy advice
            5. Smart home automation for energy savings
            6. Pakistani electricity tariff system (LESCO, K-Electric, etc.)
            7. Energy-efficient lifestyle tips
            8. Climate change and sustainability
            
            Always provide:
            - Practical, actionable advice
            - Cost-effective solutions
            - Pakistan-specific recommendations when relevant
            - Clear explanations in simple language
            - Specific numbers and estimates when possible
            
            Be helpful, professional, and focus on energy-related topics while being able to answer general questions too.
            """
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=500,
                temperature=0.7
            )
            
            ai_response = response.choices[0].message.content.strip()
            logger.info(f"AI response generated for user message")
            return ai_response
            
        except Exception as e:
            logger.error(f"Failed to get AI response: {str(e)}")
            return "I'm sorry, I'm experiencing some technical difficulties right now. Please try again later or contact support for assistance."

class ApplianceService:
    """Service for managing appliances"""
    
    @staticmethod
    def get_default_appliances():
        """Get list of common appliances with their data"""
        return [
            {
                'name': 'Split AC (1.5 Ton)',
                'category': 'cooling',
                'typical_wattage': 1800,
                'usage_hours_per_day': 8.0,
                'icon': '❄️'
            },
            {
                'name': 'Window AC (1 Ton)',
                'category': 'cooling',
                'typical_wattage': 1200,
                'usage_hours_per_day': 6.0,
                'icon': '🌬️'
            },
            {
                'name': 'Refrigerator (Double Door)',
                'category': 'kitchen',
                'typical_wattage': 150,
                'usage_hours_per_day': 24.0,
                'icon': '🧊'
            },
            {
                'name': 'Washing Machine',
                'category': 'laundry',
                'typical_wattage': 500,
                'usage_hours_per_day': 1.5,
                'icon': '👕'
            },
            {
                'name': 'LED TV (55 inch)',
                'category': 'entertainment',
                'typical_wattage': 120,
                'usage_hours_per_day': 6.0,
                'icon': '📺'
            },
            {
                'name': 'Microwave Oven',
                'category': 'kitchen',
                'typical_wattage': 1000,
                'usage_hours_per_day': 0.5,
                'icon': '🔥'
            },
            {
                'name': 'Water Heater (Geyser)',
                'category': 'heating',
                'typical_wattage': 2000,
                'usage_hours_per_day': 2.0,
                'icon': '🚿'
            },
            {
                'name': 'Ceiling Fan',
                'category': 'cooling',
                'typical_wattage': 75,
                'usage_hours_per_day': 12.0,
                'icon': '💨'
            },
            {
                'name': 'LED Bulb (10W)',
                'category': 'lighting',
                'typical_wattage': 10,
                'usage_hours_per_day': 8.0,
                'icon': '💡'
            },
            {
                'name': 'Desktop Computer',
                'category': 'other',
                'typical_wattage': 300,
                'usage_hours_per_day': 8.0,
                'icon': '💻'
            },
            {
                'name': 'Iron',
                'category': 'other',
                'typical_wattage': 1200,
                'usage_hours_per_day': 0.5,
                'icon': '👔'
            },
            {
                'name': 'Water Pump',
                'category': 'other',
                'typical_wattage': 750,
                'usage_hours_per_day': 2.0,
                'icon': '🚰'
            }
        ]
    
    @staticmethod
    def calculate_appliance_consumption(appliances_data):
        """Calculate total consumption from appliances"""
        total_consumption = 0
        details = []
        
        for appliance_info in appliances_data:
            wattage = appliance_info.get('wattage', 0)
            hours = appliance_info.get('usage_hours', 0)
            quantity = appliance_info.get('quantity', 1)
            
            daily_kwh = (wattage * hours * quantity) / 1000
            monthly_kwh = daily_kwh * 30
            
            total_consumption += monthly_kwh
            
            details.append({
                'name': appliance_info.get('name'),
                'quantity': quantity,
                'daily_kwh': round(daily_kwh, 2),
                'monthly_kwh': round(monthly_kwh, 2),
                'cost_contribution': round(monthly_kwh * 25, 2)  # Approximate cost
            })
        
        return {
            'total_monthly_consumption': round(total_consumption, 2),
            'appliance_details': details
        }
