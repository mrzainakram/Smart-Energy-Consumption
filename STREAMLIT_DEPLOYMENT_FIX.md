# 🚀 Streamlit SECPARS Deployment Fix

## ❌ **Problem:**
- "File does not exist" error when using `secpars_app.py`
- Streamlit Cloud can't find the main file

## ✅ **Solutions (Choose One):**

---

## **Option 1: Use Correct Path (Recommended)**

### **In Streamlit Cloud:**
1. **Repository**: `mrzainakram/Smart-Energy-Consumption`
2. **Branch**: `main`
3. **Main file path**: `secpars_app/app.py`
4. **Python version**: 3.9+

### **Requirements file**: `secpars_app/requirements.txt`

---

## **Option 2: Use Root Entry Point**

### **In Streamlit Cloud:**
1. **Repository**: `mrzainakram/Smart-Energy-Consumption`
2. **Branch**: `main`  
3. **Main file path**: `secpars_app.py` (root level)
4. **Python version**: 3.9+

### **Requirements file**: `requirements_secpars.txt`

---

## **Option 3: Multiple Streamlit Apps**

You can deploy multiple Streamlit apps from same repository:

### **App 1: Backend API**
- **Main file**: `streamlit_backend.py`
- **Requirements**: `requirements.txt`

### **App 2: SECPARS Chatbot**  
- **Main file**: `secpars_app/app.py`
- **Requirements**: `secpars_app/requirements.txt`

### **App 3: Simple Chatbot**
- **Main file**: `streamlit_chatbot.py`
- **Requirements**: `requirements_chatbot.txt`

---

## 🔧 **Environment Variables (Streamlit Secrets):**

### **In Streamlit Cloud App Settings:**

Add these secrets:
```toml
[secrets]
GEMINI_API_KEY = "your-gemini-api-key"
OPENAI_API_KEY = "your-openai-api-key"
PROJECT_DATA_DIR = "/app/secpars_app"
CHROMA_DIR = "/app/secpars_app/chroma_db"
```

---

## 📋 **Step by Step Deployment:**

### **Step 1: Go to Streamlit Cloud**
- Visit: https://share.streamlit.io
- Sign in with GitHub

### **Step 2: Create New App**
- Click "New app"
- **Repository**: `mrzainakram/Smart-Energy-Consumption`
- **Branch**: `main`
- **Main file path**: `secpars_app/app.py`

### **Step 3: Advanced Settings**
- **Python version**: 3.9
- **Requirements file**: `secpars_app/requirements.txt`

### **Step 4: Add Secrets**
- Go to app settings
- Add environment variables as shown above

### **Step 5: Deploy**
- Click "Deploy!"
- Wait for deployment to complete

---

## 🎯 **Expected URLs:**

After successful deployment:

### **SECPARS App**: 
`https://your-secpars-app.streamlit.app`

### **Backend API**: 
`https://your-backend-api.streamlit.app`

### **Simple Chatbot**: 
`https://your-chatbot.streamlit.app`

---

## 🔍 **Troubleshooting:**

### **If "File not found" error:**
1. **Check path**: Ensure `secpars_app/app.py` exists
2. **Check requirements**: Use correct requirements file
3. **Check imports**: Ensure all dependencies are listed

### **If import errors:**
1. **Check requirements.txt** has all packages
2. **Check Python version** compatibility
3. **Check package versions** are compatible

### **If runtime errors:**
1. **Check Streamlit secrets** are properly set
2. **Check file paths** in the code
3. **Check logs** in Streamlit Cloud dashboard

---

## 📁 **File Structure Summary:**

```
/workspace/
├── secpars_app/
│   ├── app.py                 ← Main SECPARS app
│   ├── requirements.txt       ← SECPARS dependencies
│   ├── llm_providers.py
│   ├── rag_utils.py
│   └── chroma_db/
├── secpars_app.py            ← Root entry point (Option 2)
├── streamlit_backend.py      ← Backend API app
├── streamlit_chatbot.py      ← Simple chatbot app
├── requirements_secpars.txt  ← Root SECPARS requirements
└── requirements.txt          ← General requirements
```

---

## 🎉 **Success Criteria:**

✅ **SECPARS app loads** without file errors
✅ **All dependencies** install correctly  
✅ **Environment variables** work properly
✅ **RAG system** functions correctly
✅ **LLM providers** connect successfully

---

## 💡 **Pro Tips:**

### **For Multiple Apps:**
- Deploy each app separately
- Use different app names
- Share same repository
- Use different main file paths

### **For Environment Variables:**
- Always use Streamlit secrets for production
- Never commit API keys to repository
- Test locally with .env files first

---

## 🚀 **Quick Deploy Command:**

**Use this exact configuration in Streamlit Cloud:**

```
Repository: mrzainakram/Smart-Energy-Consumption
Branch: main
Main file path: secpars_app/app.py
Python version: 3.9
Requirements file: secpars_app/requirements.txt
```

**Your SECPARS app will deploy successfully!** ✅