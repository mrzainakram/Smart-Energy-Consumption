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
    'https://*.vercel.app',
    '*' // Allow all origins for demo (remove in production)
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
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: 'production'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Smart Energy Backend API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: 'production'
  });
});

// Auth endpoints
app.post('/api/auth/signup/', (req, res) => {
  const { email, password, username } = req.body;
  
  console.log('Signup attempt:', { email, username });
  
  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password are required'
    });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Please enter a valid email address'
    });
  }
  
  // For demo purposes, we'll simulate OTP requirement
  res.json({
    success: true,
    message: 'OTP sent to your email! Use 123456 for demo.',
    requiresOTP: true,
    user: {
      id: Math.floor(Math.random() * 1000),
      username: username || email.split('@')[0],
      email: email
    }
  });
});

app.post('/api/auth/signin/', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Signin attempt:', { email });
  
  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password are required'
    });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      error: 'Please enter a valid email address'
    });
  }
  
  // For demo purposes, simulate OTP requirement
  res.json({
    success: true,
    message: 'OTP sent to your email! Use 123456 for demo.',
    requiresOTP: true,
    user: {
      id: Math.floor(Math.random() * 1000),
      username: email.split('@')[0],
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
  const { email, otp } = req.body;
  
  console.log('OTP verification:', { email, otp });
  
  if (!email || !otp) {
    return res.status(400).json({
      error: 'Email and OTP are required'
    });
  }
  
  // For demo, accept 123456 as valid OTP
  if (otp === '123456' || otp === 'demo') {
    res.json({
      success: true,
      message: 'Login successful!',
      token: 'demo-jwt-token-' + Date.now(),
      user: {
        id: Math.floor(Math.random() * 1000),
        username: email.split('@')[0],
        email: email,
        isVerified: true
      }
    });
  } else {
    res.status(400).json({
      error: 'Invalid OTP. Use 123456 for demo.'
    });
  }
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
    status: 'running',
    environment: 'production',
    endpoints: [
      '/api/health/',
      '/api/auth/signup/',
      '/api/auth/signin/',
      '/api/auth/verify-otp/',
      '/api/predict/energy/',
      '/api/appliance-prediction/',
      '/api/compare-houses/',
      '/api/ocr/scan-bill/'
    ],
    documentation: 'https://github.com/your-repo/smart-energy-chatbot'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Smart Energy Backend API running on port ${PORT}`);
});

module.exports = app;