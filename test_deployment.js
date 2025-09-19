#!/usr/bin/env node

/**
 * Test Script for Smart Energy Deployment
 * Tests all critical endpoints and functionality
 */

const https = require('https');
const http = require('http');

// Configuration
const VERCEL_URL = 'https://smart-energy-backend-api.vercel.app';
const LOCAL_URL = 'http://localhost:3000';

// Test configuration
const USE_LOCAL = process.argv.includes('--local');
const BASE_URL = USE_LOCAL ? LOCAL_URL : VERCEL_URL;

console.log(`🧪 Testing Smart Energy Deployment`);
console.log(`📡 Base URL: ${BASE_URL}`);
console.log(`🌍 Environment: ${USE_LOCAL ? 'Local' : 'Production'}`);
console.log('─'.repeat(50));

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.request(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

// Test functions
async function testHealthCheck() {
  console.log('🏥 Testing Health Check...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/health/`);
    if (response.status === 200) {
      console.log('✅ Health check passed');
      console.log(`   Status: ${response.data.status}`);
      console.log(`   Message: ${response.data.message}`);
      return true;
    } else {
      console.log(`❌ Health check failed with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Health check error: ${error.message}`);
    return false;
  }
}

async function testSignup() {
  console.log('📝 Testing User Signup...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/auth/signup/`, {
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'testpass123',
        username: 'testuser'
      }
    });
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Signup test passed');
      console.log(`   Message: ${response.data.message}`);
      return true;
    } else {
      console.log(`❌ Signup test failed`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Data:`, response.data);
      return false;
    }
  } catch (error) {
    console.log(`❌ Signup test error: ${error.message}`);
    return false;
  }
}

async function testSignin() {
  console.log('🔐 Testing User Signin...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/auth/signin/`, {
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'testpass123'
      }
    });
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Signin test passed');
      console.log(`   Message: ${response.data.message}`);
      return true;
    } else {
      console.log(`❌ Signin test failed`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Data:`, response.data);
      return false;
    }
  } catch (error) {
    console.log(`❌ Signin test error: ${error.message}`);
    return false;
  }
}

async function testOTPVerification() {
  console.log('🔢 Testing OTP Verification...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/auth/verify-otp/`, {
      method: 'POST',
      body: {
        email: 'test@example.com',
        otp: '123456'
      }
    });
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ OTP verification test passed');
      console.log(`   Message: ${response.data.message}`);
      console.log(`   Token: ${response.data.token ? 'Present' : 'Missing'}`);
      return true;
    } else {
      console.log(`❌ OTP verification test failed`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Data:`, response.data);
      return false;
    }
  } catch (error) {
    console.log(`❌ OTP verification test error: ${error.message}`);
    return false;
  }
}

async function testEnergyPrediction() {
  console.log('⚡ Testing Energy Prediction...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/predict/energy/`, {
      method: 'POST',
      body: {
        appliances: ['AC', 'Refrigerator', 'TV'],
        house_size: 'medium',
        occupants: 4
      }
    });
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Energy prediction test passed');
      console.log(`   Predicted consumption: ${response.data.predicted_consumption} kWh`);
      console.log(`   Estimated cost: $${response.data.estimated_cost}`);
      return true;
    } else {
      console.log(`❌ Energy prediction test failed`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Data:`, response.data);
      return false;
    }
  } catch (error) {
    console.log(`❌ Energy prediction test error: ${error.message}`);
    return false;
  }
}

async function testAppliancePrediction() {
  console.log('🏠 Testing Appliance Prediction...');
  try {
    const response = await makeRequest(`${BASE_URL}/api/appliance-prediction/`, {
      method: 'POST',
      body: {
        house_type: 'medium',
        appliances: ['AC', 'Refrigerator', 'TV', 'Washer']
      }
    });
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Appliance prediction test passed');
      console.log(`   Appliances analyzed: ${response.data.appliances.length}`);
      return true;
    } else {
      console.log(`❌ Appliance prediction test failed`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Data:`, response.data);
      return false;
    }
  } catch (error) {
    console.log(`❌ Appliance prediction test error: ${error.message}`);
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting comprehensive deployment tests...\n');
  
  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'User Signup', fn: testSignup },
    { name: 'User Signin', fn: testSignin },
    { name: 'OTP Verification', fn: testOTPVerification },
    { name: 'Energy Prediction', fn: testEnergyPrediction },
    { name: 'Appliance Prediction', fn: testAppliancePrediction }
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      results.push({ name: test.name, passed: result });
      console.log(''); // Add spacing
    } catch (error) {
      console.log(`❌ ${test.name} crashed: ${error.message}\n`);
      results.push({ name: test.name, passed: false });
    }
  }
  
  // Summary
  console.log('📊 Test Summary');
  console.log('─'.repeat(50));
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach(result => {
    console.log(`${result.passed ? '✅' : '❌'} ${result.name}`);
  });
  
  console.log('─'.repeat(50));
  console.log(`📈 Results: ${passed}/${total} tests passed (${Math.round(passed/total*100)}%)`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Your deployment is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.');
  }
  
  return passed === total;
}

// Run tests
if (require.main === module) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('💥 Test runner crashed:', error);
    process.exit(1);
  });
}

module.exports = { runAllTests };