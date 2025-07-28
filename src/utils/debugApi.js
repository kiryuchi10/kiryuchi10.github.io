/**
 * Debug utilities for API testing
 */

export const debugApiCall = async (url, options = {}) => {
  console.log('🔍 API Debug:', {
    url,
    method: options.method || 'GET',
    headers: options.headers,
    body: options.body
  });

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    console.log('✅ API Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data
    });
    
    return { response, data };
  } catch (error) {
    console.error('❌ API Error:', error);
    throw error;
  }
};

export const testApiEndpoints = async () => {
  const baseUrl = window.location.origin;
  
  console.log('🧪 Testing API endpoints from:', baseUrl);
  
  try {
    // Test health
    await debugApiCall(`${baseUrl}/api/health`);
    
    // Test analytics
    await debugApiCall(`${baseUrl}/api/analytics`);
    
    console.log('✅ All endpoints tested successfully');
  } catch (error) {
    console.error('❌ Endpoint test failed:', error);
  }
};

// Make available globally for debugging
if (typeof window !== 'undefined') {
  window.debugApiCall = debugApiCall;
  window.testApiEndpoints = testApiEndpoints;
}