from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings
import json
from datetime import datetime

@csrf_exempt
def customer_support(request):
    """
    Handle customer support form submissions and send emails
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        
        # Extract form data
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        issue = data.get('issue', '').strip()
        contact_preference = data.get('contactPreference', 'email')
        
        # Validate required fields
        if not all([name, email, issue]):
            return JsonResponse({'error': 'Name, email, and issue description are required'}, status=400)
        
        # Prepare email content
        subject = f"Smart Energy Support Request from {name}"
        
        message = f"""
New Support Request - Smart Energy System
========================================

Customer Information:
- Name: {name}
- Email: {email}
- Contact Preference: {contact_preference}
- Submission Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

Issue Description:
{issue}

Contact Details:
- Gmail: support@smartenergy.com
- WhatsApp: +92-XXX-XXXXXXX
- Facebook: @smartenergypk
- Instagram: @smartenergypk
- Twitter: @smartenergypk

Please respond to the customer at: {email}
"""
        
        # Send email to support team
        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=['support@smartenergy.com'],  # Replace with your actual support email
                fail_silently=False,
            )
            
            # Send confirmation email to customer
            confirmation_subject = "Smart Energy - Support Request Received"
            confirmation_message = f"""
Dear {name},

Thank you for contacting Smart Energy Support!

We have received your support request and our team will get back to you within 24-48 hours.

Your Request Details:
- Issue: {issue}
- Preferred Contact: {contact_preference}
- Reference ID: SE-{datetime.now().strftime('%Y%m%d%H%M%S')}

Our Contact Information:
- Email: support@smartenergy.com
- WhatsApp: +92-XXX-XXXXXXX
- Phone: +92-XXX-XXXXXXX

Best regards,
Smart Energy Support Team
"""
            
            send_mail(
                subject=confirmation_subject,
                message=confirmation_message,
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[email],
                fail_silently=True,  # Don't fail if customer email fails
            )
            
            return JsonResponse({
                'success': True,
                'message': 'Support request submitted successfully!',
                'reference_id': f"SE-{datetime.now().strftime('%Y%m%d%H%M%S')}"
            })
            
        except Exception as email_error:
            print(f"Email sending error: {email_error}")
            return JsonResponse({
                'success': True,
                'message': 'Support request received! We will contact you soon.',
                'note': 'Email notification may be delayed'
            })
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    except Exception as e:
        print(f"Support request error: {e}")
        return JsonResponse({'error': 'Failed to process support request'}, status=500)

@csrf_exempt
def chatbot_response(request):
    """
    Handle chatbot queries (placeholder for Sonnet 4 integration)
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        message = data.get('message', '').strip()
        language = data.get('language', 'en')
        
        if not message:
            return JsonResponse({'error': 'Message is required'}, status=400)
        
        # Placeholder responses (replace with actual Sonnet 4 API integration)
        responses = {
            'en': {
                'greeting': "Hello! I'm your Smart Energy Assistant. How can I help you today?",
                'models': "Our system uses 5 AI models: Linear Regression (LR), LSTM Neural Network, RNN Neural Network, Gradient Boosting (GB), and Random Forest (RF) for accurate energy predictions.",
                'ocr': "Our OCR system can scan LESCO bills and automatically extract Consumer ID, units consumed, bill amount, and billing date. Just upload your bill image!",
                'prediction': "We provide energy consumption predictions from 2025-2030 using LESCO 2025 tariff rates, helping you plan your energy usage and save money.",
                'setup': "To use the system: 1) Upload bill or enter data manually, 2) Set your appliances, 3) Click 'Get Prediction', 4) View recommendations and future forecasts.",
                'login': "Create an account with your Gmail, verify with OTP, then access the prediction dashboard. Your data is saved for future sessions.",
                'troubleshoot': "For technical issues: Check your internet connection, refresh the page, or contact support. Common errors are usually network-related.",
                'default': "I can help you with: System features, ML models, bill scanning, predictions, login process, troubleshooting, and general guidance. What would you like to know?"
            }
        }
        
        # Simple keyword matching (replace with Sonnet 4 API)
        msg_lower = message.lower()
        lang_responses = responses.get(language, responses['en'])
        
        if any(word in msg_lower for word in ['model', 'ai', 'ml', 'algorithm']):
            response_text = lang_responses['models']
        elif any(word in msg_lower for word in ['ocr', 'bill', 'scan', 'upload']):
            response_text = lang_responses['ocr']
        elif any(word in msg_lower for word in ['prediction', 'forecast', 'future']):
            response_text = lang_responses['prediction']
        elif any(word in msg_lower for word in ['setup', 'how', 'use', 'start']):
            response_text = lang_responses['setup']
        elif any(word in msg_lower for word in ['login', 'account', 'signup', 'register']):
            response_text = lang_responses['login']
        elif any(word in msg_lower for word in ['error', 'problem', 'issue', 'trouble']):
            response_text = lang_responses['troubleshoot']
        elif any(word in msg_lower for word in ['hello', 'hi', 'hey', 'salam']):
            response_text = lang_responses['greeting']
        else:
            response_text = lang_responses['default']
        
        return JsonResponse({
            'success': True,
            'response': response_text,
            'timestamp': datetime.now().isoformat()
        })
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    except Exception as e:
        print(f"Chatbot error: {e}")
        return JsonResponse({'error': 'Failed to process message'}, status=500) 