#!/usr/bin/env python3
"""
Test Gmail SMTP Configuration
"""
import os
import django
from django.conf import settings
from django.core.mail import send_mail

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'smart_energy.settings')
django.setup()

def test_gmail_smtp():
    """Test Gmail SMTP configuration"""
    try:
        print("🔧 Testing Gmail SMTP Configuration...")
        print(f"📧 From Email: {settings.DEFAULT_FROM_EMAIL}")
        print(f"🔑 SMTP Host: {settings.EMAIL_HOST}")
        print(f"🔑 SMTP Port: {settings.EMAIL_PORT}")
        print(f"🔑 SMTP User: {settings.EMAIL_HOST_USER}")
        print(f"🔑 TLS Enabled: {settings.EMAIL_USE_TLS}")
        
        # Test email
        subject = "Smart Energy AI - SMTP Test"
        message = "This is a test email from Smart Energy AI system."
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = ["mrzainakram01@gmail.com"]
        
        print(f"\n📤 Sending test email to: {recipient_list[0]}")
        
        # Send email
        result = send_mail(
            subject=subject,
            message=message,
            from_email=from_email,
            recipient_list=recipient_list,
            fail_silently=False,
        )
        
        if result:
            print("✅ SMTP Test Successful!")
            print("📧 Test email sent successfully!")
            return True
        else:
            print("❌ SMTP Test Failed!")
            return False
            
    except Exception as e:
        print(f"❌ SMTP Error: {e}")
        return False

if __name__ == "__main__":
    test_gmail_smtp() 