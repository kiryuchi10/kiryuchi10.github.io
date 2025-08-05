/**
 * Frontend Debug Script
 * Run this in browser console to debug API issues
 */

// Debug configuration
const DEBUG_CONFIG = {
  baseUrl: window.location.origin,
  endpoints: ['/api/health', '/api/analytics', '/api/contact'],
  testData: {
    name: 'Debug Test',
    email: 'debug@test.com',
    subject: 'Debug Test Subject',
    message: 'This is a debug test message'
  }
};

// Enhanced logging
function debugLog(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  
  console.log(`%c${logMessage}`, `color: ${
    level === 'error' ? 'red' : 
    level === 'warn' ? 'orange' : 
    level === 'success' ? 'green' : 'blue'
  }`);
  
  if (data) {
    console.log(data);
  }
}

// Test individual endpoint
async function testEndpoint(endpoint, method = 'GET', data = null) {
  debugLog('info', `Testing ${method} ${endpoint}`);
  
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

    const startTime = performance.now();
    const response = await fetch(`${DEBUG_CONFIG.baseUrl}${endpoint}`, options);
    const endTime = performance.now();
    const responseTime = Math.round(endTime - startTime);

    const responseData = await response.json();
    
    if (response.ok) {
      debugLog('success', `✅ ${method} ${endpoint} - ${response.status} (${responseTime}ms)`, responseData);
    } else {
      debugLog('error', `❌ ${method} ${endpoint} - ${response.status} (${responseTime}ms)`, responseData);
    }
    
    return { success: response.ok, status: response.status, data: responseData, responseTime };
  } catch (error) {
    debugLog('error', `💥 ${method} ${endpoint} - Network Error`, error);
    return { success: false, error: error.message };
  }
}

// Check environment configuration
function checkEnvironment() {
  debugLog('info', 'Checking environment configuration...');
  
  // Check if environment config is available
  if (typeof window !== 'undefined' && window.ENV_CONFIG) {
    debugLog('info', 'Environment config found:', window.ENV_CONFIG);
  } else {
    debugLog('warn', 'Environment config not found in window.ENV_CONFIG');
  }
  
  // Check current URL and expected API base
  debugLog('info', 'Current location:', {
    origin: window.location.origin,
    pathname: window.location.pathname,
    search: window.location.search
  });
}

// Check network connectivity
async function checkNetworkConnectivity() {
  debugLog('info', 'Checking network connectivity...');
  
  try {
    // Test basic connectivity
    const response = await fetch('https://httpbin.org/get', { 
      method: 'GET',
      mode: 'cors'
    });
    
    if (response.ok) {
      debugLog('success', '✅ Internet connectivity is working');
    } else {
      debugLog('warn', '⚠️ Internet connectivity issues detected');
    }
  } catch (error) {
    debugLog('error', '❌ No internet connectivity', error);
  }
}

// Test CORS headers
async function testCORS() {
  debugLog('info', 'Testing CORS configuration...');
  
  try {
    const response = await fetch(`${DEBUG_CONFIG.baseUrl}/api/health`, {
      method: 'OPTIONS'
    });
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
    };
    
    debugLog('info', 'CORS Headers:', corsHeaders);
    
    if (corsHeaders['Access-Control-Allow-Origin']) {
      debugLog('success', '✅ CORS is properly configured');
    } else {
      debugLog('error', '❌ CORS headers missing');
    }
  } catch (error) {
    debugLog('error', '❌ CORS test failed', error);
  }
}

// Main debug function
async function runFullDebug() {
  debugLog('info', '🚀 Starting comprehensive frontend debug...');
  
  // Environment check
  checkEnvironment();
  
  // Network connectivity
  await checkNetworkConnectivity();
  
  // CORS test
  await testCORS();
  
  // Test all endpoints
  debugLog('info', '🧪 Testing API endpoints...');
  
  // Health check
  await testEndpoint('/api/health');
  
  // Analytics
  await testEndpoint('/api/analytics');
  
  // Contact form
  await testEndpoint('/api/contact', 'POST', DEBUG_CONFIG.testData);
  
  // Direct Netlify function tests
  debugLog('info', '🔧 Testing direct Netlify functions...');
  await testEndpoint('/.netlify/functions/health');
  await testEndpoint('/.netlify/functions/analytics');
  await testEndpoint('/.netlify/functions/contact', 'POST', DEBUG_CONFIG.testData);
  
  debugLog('success', '🎉 Debug completed! Check the logs above for issues.');
}

// Browser cache check
function checkBrowserCache() {
  debugLog('info', 'Checking browser cache status...');
  
  // Check if service worker is registered
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      if (registrations.length > 0) {
        debugLog('warn', '⚠️ Service workers detected - may cause caching issues', registrations);
      } else {
        debugLog('info', '✅ No service workers registered');
      }
    });
  }
  
  // Check localStorage and sessionStorage
  const localStorageSize = JSON.stringify(localStorage).length;
  const sessionStorageSize = JSON.stringify(sessionStorage).length;
  
  debugLog('info', 'Storage usage:', {
    localStorage: `${localStorageSize} bytes`,
    sessionStorage: `${sessionStorageSize} bytes`
  });
}

// Export functions for manual testing
window.debugPortfolio = {
  runFullDebug,
  testEndpoint,
  checkEnvironment,
  checkNetworkConnectivity,
  testCORS,
  checkBrowserCache,
  clearCache: () => {
    localStorage.clear();
    sessionStorage.clear();
    debugLog('success', '✅ Browser storage cleared');
  }
};

// Auto-run debug
console.log('%c🔍 Portfolio Debug Tools Loaded!', 'color: blue; font-size: 16px; font-weight: bold;');
console.log('%cRun debugPortfolio.runFullDebug() to start debugging', 'color: green;');
console.log('%cOr use individual functions like debugPortfolio.testEndpoint("/api/health")', 'color: green;');

// Auto-run if not in production
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  setTimeout(() => {
    debugLog('info', 'Auto-running debug in development mode...');
    runFullDebug();
  }, 1000);
}