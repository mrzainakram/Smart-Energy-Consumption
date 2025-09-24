# Gmail SMTP Setup Guide for OTP Emails

## 🔧 **Step 1: Enable 2-Factor Authentication**
1. Go to your Google Account settings
2. Navigate to Security
3. Enable "2-Step Verification"

## 🔑 **Step 2: Generate App Password**
1. Go to Google Account settings
2. Navigate to Security → 2-Step Verification
3. Click on "App passwords"
4. Select "Mail" and "Other (Custom name)"
5. Enter "Smart Energy AI" as the name
6. Click "Generate"
7. Copy the 16-character password

## 📁 **Step 3: Create .env File**
Create a `.env` file in the `backend` directory with:

```env
# Gmail SMTP Configuration
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-16-character-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com

# Django Secret Key
SECRET_KEY=your-secret-key-here

# Debug Mode
DEBUG=True
```

## 🚀 **Step 4: Restart Backend Server**
After creating the `.env` file:
```bash
cd backend
python3 manage.py runserver 8001
```

## ✅ **Step 5: Test OTP**
1. Go to frontend signup page
2. Enter your email
3. Check both your email and console for OTP
4. OTP should now be sent to your email

## 🔍 **Troubleshooting**

### **If OTP still shows in console only:**
1. Check `.env` file exists in `backend` directory
2. Verify email credentials are correct
3. Make sure app password is 16 characters
4. Check Gmail account has 2FA enabled

### **Common Errors:**
- **"Invalid credentials"**: Check app password
- **"Connection refused"**: Check internet connection
- **"Authentication failed"**: Enable 2FA and use app password

## 📧 **Email Template**
The system will send beautiful HTML emails with:
- Smart Energy AI branding
- Clear OTP display
- Security warnings
- Professional styling

## 🎯 **Current Status**
- **Without .env**: OTP shows in console only ✅
- **With .env**: OTP sent to email ✅

## 🔒 **Security Notes**
- Never commit `.env` file to git
- Use app passwords, not your main password
- OTP expires in 30 seconds
- Maximum 3 attempts allowed 