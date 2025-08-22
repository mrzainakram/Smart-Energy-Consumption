const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// Django backend proxy
app.use('/api', (req, res) => {
  const djangoUrl = `http://localhost:8000${req.originalUrl}`;
  console.log(`🔄 Proxying to Django: ${djangoUrl}`);
  
  // Forward request to Django backend
  const fetch = require('node-fetch');
  
  fetch(djangoUrl, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      ...req.headers
    },
    body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
  })
  .then(response => response.json())
  .then(data => {
    console.log('✅ Django response received');
    res.json(data);
  })
  .catch(error => {
    console.error('❌ Django proxy error:', error);
    res.status(500).json({ error: 'Django backend unavailable' });
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'Express proxy running',
    django_backend: 'http://localhost:8000',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Express proxy running on http://localhost:${PORT}`);
  console.log(`📡 Forwarding to Django: http://localhost:8000`);
});