# 🚀 Quick Deployment Fix Guide

## Problem: Frontend deployed but backend not connecting

## ✅ Solution: Deploy these 2 services immediately

### 1. Backend API (Express.js on Vercel)

**Deploy the API folder:**
1. Go to [Vercel](https://vercel.com)
2. Import project from GitHub
3. **Root Directory**: Set to `api`
4. Deploy

**Expected URL**: `https://your-api-name.vercel.app`

### 2. Chatbot (Streamlit Cloud)

**Deploy the chatbot:**
1. Go to [Streamlit Cloud](https://share.streamlit.io)
2. Create new app
3. **Repository**: `mrzainakram/Smart-Energy-Consumption`
4. **Main file**: `streamlit_chatbot.py`
5. Deploy

**Expected URL**: `https://your-chatbot-name.streamlit.app`

### 3. Update Frontend Environment Variables

In your **Vercel frontend project settings**, update these variables:

```
VITE_BACKEND_API_URL = https://your-api-name.vercel.app
VITE_STREAMLIT_CHATBOT_URL = https://your-chatbot-name.streamlit.app
```

### 4. Redeploy Frontend

Click **Redeploy** in Vercel frontend dashboard.

## 🎯 Result

✅ Authentication will work  
✅ All API calls will connect  
✅ Chatbot will be accessible  
✅ No more network errors  

## 📞 Test URLs

After deployment, test these endpoints:

- **Backend Health**: `https://your-api-name.vercel.app/api/health/`
- **Login Test**: `https://your-api-name.vercel.app/api/auth/signin/`
- **Chatbot**: `https://your-chatbot-name.streamlit.app`

## ⚡ Quick Alternative

If you want to test immediately, you can also use:

**Backend**: `https://jsonplaceholder.typicode.com` (for testing)
**Chatbot**: Keep existing Streamlit URL

But the proper solution is to deploy the API folder I created for you.