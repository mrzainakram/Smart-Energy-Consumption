import os
import smtplib
import random
import string
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import User
from django.core.cache import cache
import json

# SMTP Configuration
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_EMAIL = os.getenv('SMTP_EMAIL', 'your-email@gmail.com')
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD', 'your-app-password')

def generate_otp():
    """Generate a 6-digit OTP"""
    return ''.join(random.choices(string.digits, k=6))

def send_otp_email(email, otp):
    """Send OTP via email using SMTP"""
    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = SMTP_EMAIL
        msg['To'] = email
        msg['Subject'] = "Smart Energy - OTP Verification"
        
        # Email body
        body = f"""
        <html>
        <body>
            <h2>Smart Energy OTP Verification</h2>
            <p>Your OTP for account verification is: <strong>{otp}</strong></p>
            <p>This OTP will expire in 1 minute.</p>
            <p>If you didn't request this, please ignore this email.</p>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(body, 'html'))
        
        # Send email
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_EMAIL, SMTP_PASSWORD)
        text = msg.as_string()
        server.sendmail(SMTP_EMAIL, email, text)
        server.quit()
        
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

@csrf_exempt
def signup(request):
    """User signup endpoint"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            full_name = data.get('full_name')
            
            if not all([email, password, full_name]):
                return JsonResponse({
                    'success': False,
                    'message': 'All fields are required'
                }, status=400)
            
            # Check if user already exists
            if User.objects.filter(email=email).exists():
                return JsonResponse({
                    'success': False,
                    'message': 'User with this email already exists'
                }, status=400)
            
            # Create user
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=full_name.split()[0] if full_name else '',
                last_name=' '.join(full_name.split()[1:]) if len(full_name.split()) > 1 else ''
            )
            
            # Generate and send OTP
            otp = generate_otp()
            cache.set(f'otp_{email}', otp, 60)  # Store OTP for 1 minute
            
            if send_otp_email(email, otp):
                return JsonResponse({
                    'success': True,
                    'message': 'Account created successfully. Please verify your email with OTP.'
                })
            else:
                # If email fails, still create user but return error
                return JsonResponse({
                    'success': False,
                    'message': 'Account created but failed to send OTP. Please try again.'
                }, status=500)
                
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
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
def login(request):
    """User login endpoint"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            
            if not all([email, password]):
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
                    'message': 'Invalid credentials'
                }, status=401)
            
            # Check password
            if not check_password(password, user.password):
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid credentials'
                }, status=401)
            
            # Generate token (simple implementation)
            token = f"token_{user.id}_{datetime.now().timestamp()}"
            cache.set(f'user_token_{token}', user.id, 3600)  # Store token for 1 hour
            
            return JsonResponse({
                'success': True,
                'message': 'Login successful',
                'token': token,
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'full_name': f"{user.first_name} {user.last_name}".strip()
                }
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
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
def send_otp(request):
    """Send OTP endpoint"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            
            if not email:
                return JsonResponse({
                    'success': False,
                    'message': 'Email is required'
                }, status=400)
            
            # Generate OTP
            otp = generate_otp()
            cache.set(f'otp_{email}', otp, 60)  # Store OTP for 1 minute
            
            # Send OTP via email
            if send_otp_email(email, otp):
                return JsonResponse({
                    'success': True,
                    'message': 'OTP sent successfully'
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Failed to send OTP'
                }, status=500)
                
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
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
def verify_otp(request):
    """Verify OTP endpoint"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            otp = data.get('otp')
            
            if not all([email, otp]):
                return JsonResponse({
                    'success': False,
                    'message': 'Email and OTP are required'
                }, status=400)
            
            # Get stored OTP
            stored_otp = cache.get(f'otp_{email}')
            
            if not stored_otp:
                return JsonResponse({
                    'success': False,
                    'message': 'OTP expired or not found'
                }, status=400)
            
            if otp != stored_otp:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid OTP'
                }, status=400)
            
            # Clear OTP from cache
            cache.delete(f'otp_{email}')
            
            return JsonResponse({
                'success': True,
                'message': 'OTP verified successfully'
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
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
def forgot_password(request):
    """Forgot password endpoint"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            
            if not email:
                return JsonResponse({
                    'success': False,
                    'message': 'Email is required'
                }, status=400)
            
            # Check if user exists
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'User not found'
                }, status=404)
            
            # Generate and send OTP
            otp = generate_otp()
            cache.set(f'reset_otp_{email}', otp, 60)  # Store OTP for 1 minute
            
            if send_otp_email(email, otp):
                return JsonResponse({
                    'success': True,
                    'message': 'Password reset OTP sent successfully'
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Failed to send OTP'
                }, status=500)
                
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
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
def reset_password(request):
    """Reset password endpoint"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            otp = data.get('otp')
            new_password = data.get('new_password')
            
            if not all([email, otp, new_password]):
                return JsonResponse({
                    'success': False,
                    'message': 'Email, OTP, and new password are required'
                }, status=400)
            
            # Verify OTP
            stored_otp = cache.get(f'reset_otp_{email}')
            
            if not stored_otp:
                return JsonResponse({
                    'success': False,
                    'message': 'OTP expired or not found'
                }, status=400)
            
            if otp != stored_otp:
                return JsonResponse({
                    'success': False,
                    'message': 'Invalid OTP'
                }, status=400)
            
            # Update password
            try:
                user = User.objects.get(email=email)
                user.password = make_password(new_password)
                user.save()
                
                # Clear OTP from cache
                cache.delete(f'reset_otp_{email}')
                
                return JsonResponse({
                    'success': True,
                    'message': 'Password reset successfully'
                })
            except User.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': 'User not found'
                }, status=404)
                
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
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