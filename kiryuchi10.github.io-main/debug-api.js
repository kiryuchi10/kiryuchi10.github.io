/**
 * Debug script to test API endpoints
 */

const BASE_URL = 'https://kiryuchi10-portfolio-3d.netlify.app';

async function testEndpoint(path, method = 'GET', data = null) {
  console.log(`\n🧪 Testing ${method} ${path}`);
  
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

    const response = await fetch(`${BASE_URL}${path}`, options);
    const result = await response.json();
    
    console.log(`✅ Status: ${response.status}`);
    console.log(`📄 Response:`, result);
    
    return { success: response.ok, status: response.status, data: result };
  } catch (error) {
    console.error(`❌ Error:`, error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 Testing Portfolio API Endpoints...\n');

  // Test direct Netlify Functions
  await testEndpoint('/.netlify/functions/health');
  await testEndpoint('/.netlify/functions/analytics');
  
  // Test API redirects
  await testEndpoint('/api/health');
  await testEndpoint('/api/analytics');
  
  // Test contact form
  await testEndpoint('/api/contact', 'POST', {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'Test message'
  });

  console.log('\n🎉 Tests completed!');
}

// Run tests
runTests();