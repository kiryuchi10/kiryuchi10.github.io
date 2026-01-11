/**
 * Test script for Netlify Functions
 * Run this to test if your functions are working correctly
 */

const BASE_URL = 'https://kiryuchi10-portfolio-3d.netlify.app';

async function testFunction(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const result = await response.json();
    
    console.log(`✅ ${method} ${endpoint}:`, {
      status: response.status,
      data: result
    });
    
    return { success: true, status: response.status, data: result };
  } catch (error) {
    console.error(`❌ ${method} ${endpoint}:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🧪 Testing Netlify Functions...\n');

  // Test health endpoint
  await testFunction('/api/health');

  // Test analytics endpoint
  await testFunction('/api/analytics');

  // Test track-visit endpoint
  await testFunction('/api/track-visit', 'POST', {
    page: '/test',
    referrer: 'test-script'
  });

  // Test contact endpoint (with test data)
  await testFunction('/api/contact', 'POST', {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Message',
    message: 'This is a test message from the test script.'
  });

  console.log('\n🎉 Test completed!');
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  runTests();
} else {
  // Browser environment
  window.testNetlifyFunctions = runTests;
  console.log('Run testNetlifyFunctions() in the console to test the functions');
}