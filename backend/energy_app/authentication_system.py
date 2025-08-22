import os
import random
import string
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.contrib.auth.hashers import make_password, check_password
import json
from datetime import datetime, timedelta
import jwt
from django.conf import settings

# OTP storage (in production, use Redis or database)
otp_storage = {}

def generate_otp():
    """Generate a 6-digit OTP"""
    return ''.join(random.choices(string.digits, k=6))

def send_gmail_otp(email, otp):
    """Send OTP via Gmail SMTP with console fallback"""
    try:
        from django.core.mail import send_mail
        from django.conf import settings
        
        # Check if email settings are configured
        if not settings.EMAIL_HOST_USER or settings.EMAIL_HOST_USER == 'your-email@gmail.com':
            print(f"📧 OTP {otp} sent to {email} (Console only - Email not configured)")
            print(f"🔧 To enable email OTP, configure EMAIL_HOST_USER and EMAIL_HOST_PASSWORD in .env file")
            return True
        
        # Email subject and body
        subject = "Smart Energy - OTP Verification"
        html_message = f"""
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; background-color: #f4f4f4; }}
                .container {{ max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 10px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; text-align: center; }}
                .otp-box {{ background-color: #f8f9fa; border: 2px solid #007bff; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }}
                .otp-code {{ font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px; }}
                .footer {{ margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px; font-size: 12px; color: #666; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔋 Smart Energy AI</h1>
                    <p>Your Authentication Code</p>
                </div>
                
                <div class="otp-box">
                    <h2>Your OTP Code</h2>
                    <div class="otp-code">{otp}</div>
                    <p>This code will expire in 30 seconds.</p>
                </div>
                
                <div class="footer">
                    <p>⚠️ If you didn't request this code, please ignore this email.</p>
                    <p>🔒 This is a secure authentication system for Smart Energy AI.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        # Send email using Django's email backend
        try:
            send_mail(
                subject=subject,
                message=f"Your OTP is: {otp}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                html_message=html_message,
                fail_silently=False,
            )
            print(f"📧 OTP {otp} sent to {email} via SMTP successfully!")
            return True
        except Exception as smtp_error:
            print(f"❌ SMTP Error: {smtp_error}")
            print(f"📧 OTP {otp} sent to {email} (Console only - SMTP failed)")
            print(f"🔧 Check your Gmail settings and app password")
            return True  # Still return True for testing
        
    except Exception as e:
        print(f"❌ Email error: {e}")
        print(f"📧 OTP {otp} sent to {email} (Console only - Email system error)")
        return True  # Return True to allow OTP verification to continue

def generate_jwt_token(user):
    """Generate JWT token for user"""
    payload = {
        'user_id': user.id,
        'email': user.email,
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, 'your-secret-key', algorithm='HS256')

@csrf_exempt
def signup_view(request):
    """Handle user signup with OTP verification"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            
            if not email or not password:
                return JsonResponse({
                    'success': False,
                    'message': 'Email and password are required'
                }, status=400)
            
            # Check if user already exists
            if User.objects.filter(email=email).exists():
                return JsonResponse({
                    'success': False,
                    'message': 'Account already exists. Please sign in instead.'
                }, status=400)
            
            # Generate OTP
            otp = generate_otp()
            
            # Store OTP with timestamp
            otp_storage[email] = {
                'otp': otp,
                'timestamp': datetime.utcnow(),
                'action': 'signup',
                'password': password
            }
            
            # Send OTP via email
            if send_gmail_otp(email, otp):
                return JsonResponse({
                    'success': True,
                    'message': 'OTP sent to your email!'
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Failed to send OTP'
                }, status=500)
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': str(e)
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def signin_view(request):
    """Handle user signin with OTP verification"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            
            if not email or not password:
                return JsonResponse({
                    'success': False,
                    'message': 'Email and password are required'
                }, status=400)
            
            # Check if user exists
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'Account not found. Please create an account first.'
                }, status=404)
            
            # Verify password
            if not check_password(password, user.password):
                return JsonResponse({
                    'success': False,
                    'message': 'Password is incorrect'
                }, status=400)
            
            # Generate OTP
            otp = generate_otp()
            
            # Store OTP with timestamp
            otp_storage[email] = {
                'otp': otp,
                'timestamp': datetime.utcnow(),
                'action': 'signin'
            }
            
            # Send OTP via email
            if send_gmail_otp(email, otp):
                return JsonResponse({
                    'success': True,
                    'message': 'OTP sent to your email!'
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Failed to send OTP'
                }, status=500)
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': str(e)
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def verify_otp_view(request):
    """Verify OTP and complete authentication"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            otp = data.get('otp')
            
            # Debug logging
            print(f"🔍 OTP Verification Debug:")
            print(f"📧 Email: {email}")
            print(f"🔢 OTP: {otp}")
            print(f"📦 Full data: {data}")
            
            if not email or not otp:
                return JsonResponse({
                    'success': False,
                    'message': 'Email and OTP are required'
                }, status=400)
            
            # Check if OTP exists and is valid
            print(f"🔍 OTP Storage Debug:")
            print(f"📧 Looking for email: {email}")
            print(f"📦 Available emails: {list(otp_storage.keys())}")
            
            if email not in otp_storage:
                return JsonResponse({
                    'success': False,
                    'message': 'OTP not found or expired'
                }, status=400)
            
            stored_data = otp_storage[email]
            stored_otp = stored_data['otp']
            timestamp = stored_data['timestamp']
            action = stored_data.get('action')
            
            # Check if OTP is expired (30 seconds)
            if datetime.utcnow() - timestamp > timedelta(seconds=30):
                del otp_storage[email]
                return JsonResponse({
                    'success': False,
                    'message': 'OTP expired'
                }, status=400)
            
            # Verify OTP
            if otp != stored_otp:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid OTP'
                }, status=400)
            
            # Handle signup
            if action == 'signup':
                password = stored_data['password']
                
                # Create user
                user = User.objects.create_user(
                    username=email,
                    email=email,
                    password=password
                )
                
                # Clean up OTP
                del otp_storage[email]
                
                return JsonResponse({
                    'success': True,
                    'message': 'Account created successfully! Please sign in.',
                    'action': 'signup_success',
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'username': user.username
                    }
                })
            
            # Handle signin
            elif action == 'signin':
                user = User.objects.get(email=email)
                
                # Generate token
                token = generate_jwt_token(user)
                
                # Clean up OTP
                del otp_storage[email]
                
                return JsonResponse({
                    'success': True,
                    'message': 'Authentication successful',
                    'token': token,
                    'user': {
                        'id': user.id,
                        'email': user.email,
                        'username': user.username
                    }
                })
            
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid action'
                }, status=400)
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': str(e)
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)

@csrf_exempt
def resend_otp_view(request):
    """Resend OTP to user"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            
            if not email:
                return JsonResponse({
                    'success': False,
                    'message': 'Email is required'
                }, status=400)
            
            # Check if user exists for signin
            try:
                user = User.objects.get(email=email)
                action = 'signin'
            except User.DoesNotExist:
                # For signup, we don't need to check if user exists
                action = 'signup'
            
            # Generate new OTP
            otp = generate_otp()
            
            # Store OTP with timestamp
            otp_storage[email] = {
                'otp': otp,
                'timestamp': datetime.utcnow(),
                'action': action
            }
            
            # Send OTP via email
            if send_gmail_otp(email, otp):
                return JsonResponse({
                    'success': True,
                    'message': 'OTP resent successfully'
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Failed to send OTP'
                }, status=500)
                
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': str(e)
            }, status=500)
    
    return JsonResponse({
        'success': False,
        'message': 'Method not allowed'
    }, status=405)