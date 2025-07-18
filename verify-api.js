/**
 * Simple API Verification Script
 * Tests the deployed backend API connectivity
 */

const https = require('https');
const http = require('http');

// Configuration
const API_BASE_URL = 'https://portfolio-backend-1aqz.onrender.com';
const ENDPOINTS = {
  HEALTH: '/api/health',
  ANALYTICS: '/api/analytics'
};

// Utility function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'API-Verifier/1.0'
      },
      timeout: 10000,
      ...options
    }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    
    req.end();
  });
}

// Test functions
async function testConnection() {
  console.log('🔗 Testing API Connection...');
  console.log(`Backend URL: ${API_BASE_URL}`);
  
  try {
    const response = await makeRequest(`${API_BASE_URL}${ENDPOINTS.HEALTH}`);
    
    if (response.status === 200) {
      console.log('✅ Connection successful!');
      console.log('Response:', JSON.stringify(response.data, null, 2));
      return true;
    } else {
      console.log(`❌ Connection failed with status: ${response.status}`);
      console.log('Response:', response.data);
      return false;
    }
  } catch (error) {
    console.log(`❌ Connection error: ${error.message}`);
    return false;
  }
}

async function testAnalytics() {
  console.log('\n📊 Testing Analytics Endpoint...');
  
  try {
    const response = await makeRequest(`${API_BASE_URL}${ENDPOINTS.ANALYTICS}`);
    
    if (response.status === 200 && response.data.data) {
      console.log('✅ Analytics endpoint working!');
      console.log('Analytics Summary:');
      console.log(`- Total Visitors: ${response.data.data.total_visitors || 0}`);
      console.log(`- GitHub Users: ${response.data.data.github_users || 0}`);
      console.log(`- Total Messages: ${response.data.data.total_messages || 0}`);
      console.log(`- Countries: ${response.data.data.visitors_by_country?.length || 0}`);
      console.log(`- Pages: ${response.data.data.visitors_by_page?.length || 0}`);
      return true;
    } else {
      console.log(`❌ Analytics failed with status: ${response.status}`);
      console.log('Response:', response.data);
      return false;
    }
  } catch (error) {
    console.log(`❌ Analytics error: ${error.message}`);
    return false;
  }
}

async function testCors() {
  console.log('\n🌐 Testing CORS Configuration...');
  
  try {
    const response = await makeRequest(`${API_BASE_URL}${ENDPOINTS.HEALTH}`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://kiryuchi10.github.io',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    const corsHeaders = {
      'access-control-allow-origin': response.headers['access-control-allow-origin'],
      'access-control-allow-methods': response.headers['access-control-allow-methods'],
      'access-control-allow-headers': response.headers['access-control-allow-headers']
    };
    
    if (corsHeaders['access-control-allow-origin']) {
      console.log('✅ CORS is configured!');
      console.log('CORS Headers:', corsHeaders);
      return true;
    } else {
      console.log('⚠️ CORS headers not found');
      console.log('Response status:', response.status);
      return false;
    }
  } catch (error) {
    console.log(`❌ CORS test error: ${error.message}`);
    return false;
  }
}

// Main verification function
async function runVerification() {
  console.log('🚀 Starting API Verification...\n');
  console.log('⚠️  Note: This test assumes the backend is already deployed to Render.');
  console.log('   If the backend is not deployed yet, all tests will fail with 404 errors.');
  console.log('   Complete Task 8 (Deploy backend to Render) first.\n');
  
  const tests = [
    { name: 'Connection', fn: testConnection },
    { name: 'Analytics', fn: testAnalytics },
    { name: 'CORS', fn: testCors }
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const result = await test.fn();
      results.push({ name: test.name, success: result });
    } catch (error) {
      console.log(`❌ ${test.name} test failed: ${error.message}`);
      results.push({ name: test.name, success: false, error: error.message });
    }
  }
  
  // Summary
  console.log('\n📋 Verification Summary:');
  console.log('========================');
  
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  results.forEach(result => {
    console.log(`${result.success ? '✅' : '❌'} ${result.name}: ${result.success ? 'PASSED' : 'FAILED'}`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });
  
  console.log(`\nTotal Tests: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${total - passed}`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
  
  const deploymentReady = passed === total;
  console.log(`\n🚀 Deployment Ready: ${deploymentReady ? 'YES' : 'NO'}`);
  
  if (!deploymentReady) {
    console.log('\n⚠️ Issues found:');
    if (results.every(r => !r.success && r.error?.includes('404'))) {
      console.log('   - Backend appears to not be deployed yet');
      console.log('   - Complete Task 8: Deploy backend to Render');
      console.log('   - Update API_BASE_URL in this script with the actual deployed URL');
    } else {
      console.log('   - Check individual test failures above');
      console.log('   - Verify backend is running and accessible');
    }
  }
  
  return deploymentReady;
}

// Run verification if this script is executed directly
if (require.main === module) {
  runVerification()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Verification failed:', error);
      process.exit(1);
    });
}

module.exports = {
  runVerification,
  testConnection,
  testAnalytics,
  testCors
};