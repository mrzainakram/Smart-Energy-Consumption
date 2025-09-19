# 🚀 Smart Energy Chatbot Deployment Guide

## Overview
This guide will help you deploy your Smart Energy Chatbot system with:
- **Frontend**: React app on Vercel
- **Backend API**: Node.js serverless functions on Vercel  
- **Chatbot**: Streamlit app on Streamlit Cloud
- **Backend Dashboard**: Streamlit app on Streamlit Cloud

## 📋 Prerequisites
- GitHub account
- Vercel account  
- Streamlit Cloud account

## 🎯 Deployment Steps

### 1. Deploy Frontend + Backend API to Vercel

#### Step 1.1: Push to GitHub
```bash
git add .
git commit -m "Fix deployment configuration"
git push origin main
```

#### Step 1.2: Deploy on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Other
   - **Root Directory**: Leave empty (uses root)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `cd frontend && npm install && cd ../api && npm install`

#### Step 1.3: Set Environment Variables in Vercel
Add these environment variables in Vercel dashboard:
- `VITE_BACKEND_API_URL`: `https://your-vercel-app.vercel.app`
- `VITE_ENVIRONMENT`: `production`

### 2. Deploy Streamlit Chatbot

#### Step 2.1: Create Streamlit Cloud App
1. Go to [Streamlit Cloud](https://streamlit.io/cloud)
2. Click "New app"
3. Connect your GitHub repository
4. Set these configurations:
   - **Main file path**: `streamlit_chatbot.py`
   - **Python version**: 3.9
   - **Requirements file**: `requirements.txt`

#### Step 2.2: The app will auto-deploy from your GitHub repo

### 3. Deploy Backend Streamlit Dashboard

#### Step 3.1: Create Another Streamlit Cloud App
1. Go to [Streamlit Cloud](https://streamlit.io/cloud)
2. Click "New app"
3. Connect your GitHub repository
4. Set these configurations:
   - **Main file path**: `backend/streamlit_app.py`
   - **Python version**: 3.9
   - **Requirements file**: `backend/requirements_streamlit.txt`

## 🔧 Configuration Files

### ✅ Fixed Files:
- `vercel.json` - Updated for proper routing
- `requirements.txt` - Added for Streamlit chatbot
- `backend/requirements_streamlit.txt` - Simplified dependencies
- `backend/streamlit_app.py` - New simplified backend dashboard
- `frontend/.env` - Environment variables
- All API endpoints updated to use production URLs

## 🌐 URLs After Deployment

After deployment, you'll have these URLs:
- **Frontend**: `https://your-app-name.vercel.app`
- **Backend API**: `https://your-app-name.vercel.app/api/`
- **Chatbot**: `https://your-chatbot-app.streamlit.app`
- **Backend Dashboard**: `https://your-backend-app.streamlit.app`

## 🔍 Testing Your Deployment

### Test Frontend
1. Visit your Vercel frontend URL
2. Try to sign up/login
3. Check if API calls work

### Test Backend API
1. Visit `https://your-app-name.vercel.app/api/health/`
2. Should return JSON with status "ok"

### Test Streamlit Apps
1. Visit your Streamlit chatbot URL
2. Test the chat functionality
3. Visit your backend dashboard URL
4. Test API connections

## 🚨 Common Issues & Solutions

### Issue 1: Frontend Build Fails
**Solution**: Check that all dependencies are in `frontend/package.json`

### Issue 2: API Calls Fail
**Solution**: 
- Check CORS settings in `api/index.js`
- Verify environment variables in Vercel
- Check API endpoints are correct

### Issue 3: Streamlit Apps Won't Start
**Solution**:
- Check `requirements.txt` files
- Ensure Python version is 3.9
- Check for import errors

### Issue 4: Authentication Not Working
**Solution**:
- Check API endpoints in frontend
- Verify backend API is responding
- Check browser console for errors

## 📱 Mobile Responsiveness
All apps are now mobile-responsive with:
- Responsive CSS
- Touch-friendly buttons
- Mobile-optimized layouts
- Proper viewport settings

## 🔐 Security Features
- CORS properly configured
- Input validation
- Secure headers
- Environment variables for sensitive data

## 📊 Monitoring
- Health check endpoints
- Error handling
- Loading states
- Connection status indicators

## 🎉 Success!
If everything is deployed correctly, you should have:
1. ✅ Working frontend with login system
2. ✅ Functional backend API
3. ✅ Interactive chatbot
4. ✅ Backend monitoring dashboard
5. ✅ Mobile-responsive design
6. ✅ Proper error handling

## 🆘 Need Help?
If you encounter issues:
1. Check browser console for errors
2. Check Vercel function logs
3. Check Streamlit app logs
4. Verify all URLs and environment variables

---
**Last Updated**: January 2025
**Version**: 2.0.0