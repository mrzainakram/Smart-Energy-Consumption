const express = require('express');
const cors = require('cors');
const app = express();

// CORS configuration for your frontend
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001', 
    'http://localhost:5173',
    'https://smart-energy-consumption-frontend-onuz.vercel.app',
    'https://*.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Health check endpoint
app.get('/api/health/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Smart Energy Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Auth endpoints
app.post('/api/auth/signup/', (req, res) => {
  const { email, password, username } = req.body;
  
  if (!email || !password || !username) {
    return res.status(400).json({
      error: 'Email, password, and username are required'
    });
  }
  
  res.json({
    success: true,
    message: 'User registered successfully',
    user: {
      id: Math.floor(Math.random() * 1000),
      username: username,
      email: email
    }
  });
});

app.post('/api/auth/signin/', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password are required'
    });
  }
  
  res.json({
    success: true,
    message: 'Login successful',
    token: 'demo-jwt-token-' + Date.now(),
    user: {
      id: 1,
      username: 'demo_user',
      email: email
    }
  });
});

app.post('/api/auth/forgot-password/', (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({
      error: 'Email is required'
    });
  }
  
  res.json({
    success: true,
    message: 'Password reset email sent (demo mode)'
  });
});

app.post('/api/auth/reset-password/', (req, res) => {
  res.json({
    success: true,
    message: 'Password reset successful (demo mode)'
  });
});

app.post('/api/auth/verify-otp/', (req, res) => {
  res.json({
    success: true,
    message: 'OTP verified successfully (demo mode)'
  });
});

app.post('/api/auth/resend-otp/', (req, res) => {
  res.json({
    success: true,
    message: 'OTP resent successfully (demo mode)'
  });
});

// Energy prediction endpoints
app.post('/api/predict/energy/', (req, res) => {
  const prediction = Math.floor(Math.random() * 500) + 100;
  
  res.json({
    success: true,
    predicted_consumption: prediction,
    unit: 'kWh',
    estimated_cost: prediction * 0.15,
    recommendations: [
      'Use LED bulbs to save energy',
      'Optimize AC usage during peak hours',
      'Consider solar panels for long-term savings'
    ]
  });
});

app.post('/api/appliance-prediction/', (req, res) => {
  res.json({
    success: true,
    appliances: [
      { name: 'Air Conditioner', consumption: 150, percentage: 35 },
      { name: 'Refrigerator', consumption: 80, percentage: 20 },
      { name: 'Lighting', consumption: 60, percentage: 15 },
      { name: 'TV', consumption: 40, percentage: 10 },
      { name: 'Others', consumption: 70, percentage: 20 }
    ]
  });
});

app.post('/api/compare-houses/', (req, res) => {
  res.json({
    success: true,
    comparison: {
      your_house: { consumption: 450, cost: 67.5 },
      similar_houses: { avg_consumption: 380, avg_cost: 57 },
      savings_potential: 70
    }
  });
});

app.post('/api/ocr/scan-bill/', (req, res) => {
  res.json({
    success: true,
    extracted_data: {
      bill_amount: Math.floor(Math.random() * 1000) + 500,
      units_consumed: Math.floor(Math.random() * 500) + 200,
      billing_month: 'Current Month',
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
  });
});

app.get('/api/seasonal-factors/', (req, res) => {
  res.json({
    success: true,
    factors: {
      summer: 1.3,
      winter: 1.1,
      spring: 0.9,
      autumn: 0.8
    }
  });
});

app.post('/api/enhanced-compare-houses/', (req, res) => {
  res.json({
    success: true,
    enhanced_comparison: {
      efficiency_score: Math.floor(Math.random() * 40) + 60,
      ranking: Math.floor(Math.random() * 100) + 1,
      recommendations: [
        'Your house is performing well',
        'Consider upgrading to energy-efficient appliances',
        'Monitor peak hour usage'
      ]
    }
  });
});

// Default route
app.get('/', (req, res) => {
  res.json({
    message: 'Smart Energy Consumption Backend API',
    version: '1.0.0',
    endpoints: [
      '/api/health/',
      '/api/auth/signup/',
      '/api/auth/signin/',
      '/api/predict/energy/',
      '/api/appliance-prediction/',
      '/api/compare-houses/',
      '/api/ocr/scan-bill/'
    ]
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Smart Energy Backend API running on port ${PORT}`);
});

module.exports = app;