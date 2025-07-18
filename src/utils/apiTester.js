/**
 * API Testing Utility
 * Comprehensive testing for all API integrations with live backend
 */

import { apiService, checkApiStatus } from '../services/apiService';
import { ENV_INFO } from '../config/api';

/**
 * Test results structure
 */
const createTestResult = (name, success, message, data = null, error = null) => ({
  name,
  success,
  message,
  data,
  error: error ? error.message : null,
  timestamp: new Date().toISOString()
});

/**
 * API Integration Tester
 */
export class ApiTester {
  constructor() {
    this.results = [];
    this.startTime = null;
    this.endTime = null;
  }

  /**
   * Run all API tests
   * @returns {Promise<Object>} Test results summary
   */
  async runAllTests() {
    this.startTime = Date.now();
    this.results = [];

    console.log('🚀 Starting API Integration Tests...');
    console.log('Environment Info:', ENV_INFO);

    // Test 1: API Connection
    await this.testApiConnection();

    // Test 2: Health Check
    await this.testHealthCheck();

    // Test 3: Analytics Endpoint
    await this.testAnalytics();

    // Test 4: Visitor Tracking
    await this.testVisitorTracking();

    // Test 5: Contact Form (with test data)
    await this.testContactForm();

    // Test 6: CORS Configuration
    await this.testCorsConfiguration();

    this.endTime = Date.now();
    return this.generateSummary();
  }

  /**
   * Test API connection
   */
  async testApiConnection() {
    try {
      console.log('🔗 Testing API connection...');
      const isConnected = await apiService.testConnection();
      
      if (isConnected) {
        this.results.push(createTestResult(
          'API Connection',
          true,
          'Successfully connected to backend API'
        ));
        console.log('✅ API connection successful');
      } else {
        this.results.push(createTestResult(
          'API Connection',
          false,
          'Failed to connect to backend API'
        ));
        console.log('❌ API connection failed');
      }
    } catch (error) {
      this.results.push(createTestResult(
        'API Connection',
        false,
        'API connection test threw an error',
        null,
        error
      ));
      console.log('❌ API connection error:', error.message);
    }
  }

  /**
   * Test health check endpoint
   */
  async testHealthCheck() {
    try {
      console.log('🏥 Testing health check endpoint...');
      const healthData = await apiService.healthCheck();
      
      this.results.push(createTestResult(
        'Health Check',
        true,
        'Health check endpoint responded successfully',
        healthData
      ));
      console.log('✅ Health check successful:', healthData);
    } catch (error) {
      this.results.push(createTestResult(
        'Health Check',
        false,
        'Health check endpoint failed',
        null,
        error
      ));
      console.log('❌ Health check failed:', error.message);
    }
  }

  /**
   * Test analytics endpoint
   */
  async testAnalytics() {
    try {
      console.log('📊 Testing analytics endpoint...');
      const analyticsData = await apiService.getAnalytics();
      
      // Validate analytics data structure
      const hasRequiredFields = analyticsData?.data && 
        typeof analyticsData.data.total_visitors === 'number' &&
        Array.isArray(analyticsData.data.visitors_by_country);

      if (hasRequiredFields) {
        this.results.push(createTestResult(
          'Analytics Endpoint',
          true,
          'Analytics endpoint returned valid data structure',
          {
            totalVisitors: analyticsData.data.total_visitors,
            countriesCount: analyticsData.data.visitors_by_country.length,
            pagesCount: analyticsData.data.visitors_by_page?.length || 0
          }
        ));
        console.log('✅ Analytics test successful');
      } else {
        this.results.push(createTestResult(
          'Analytics Endpoint',
          false,
          'Analytics endpoint returned invalid data structure',
          analyticsData
        ));
        console.log('❌ Analytics data structure invalid');
      }
    } catch (error) {
      this.results.push(createTestResult(
        'Analytics Endpoint',
        false,
        'Analytics endpoint failed',
        null,
        error
      ));
      console.log('❌ Analytics test failed:', error.message);
    }
  }

  /**
   * Test visitor tracking endpoint
   */
  async testVisitorTracking() {
    try {
      console.log('👥 Testing visitor tracking endpoint...');
      
      const testVisitData = {
        page: '/test-page',
        referrer: 'api-test',
        timestamp: new Date().toISOString(),
        user_agent: 'API-Tester/1.0',
        url: window.location.href,
        test: true // Mark as test data
      };

      const result = await apiService.trackVisit(testVisitData);
      
      // Visitor tracking should not throw errors even if it fails
      this.results.push(createTestResult(
        'Visitor Tracking',
        true,
        'Visitor tracking completed without errors',
        result
      ));
      console.log('✅ Visitor tracking test successful');
    } catch (error) {
      // This shouldn't happen as trackVisit catches errors
      this.results.push(createTestResult(
        'Visitor Tracking',
        false,
        'Visitor tracking threw unexpected error',
        null,
        error
      ));
      console.log('❌ Visitor tracking test failed:', error.message);
    }
  }

  /**
   * Test contact form endpoint (with test data)
   */
  async testContactForm() {
    try {
      console.log('📧 Testing contact form endpoint...');
      
      const testContactData = {
        name: 'API Test User',
        email: 'test@example.com',
        subject: 'API Integration Test',
        message: 'This is a test message from the API integration tester. Please ignore.'
      };

      // Note: This will actually send an email in production
      // Consider adding a test flag to the backend to prevent actual emails
      console.log('⚠️  Note: This test will send a real email if backend is configured');
      
      const result = await apiService.sendContactMessage(testContactData);
      
      this.results.push(createTestResult(
        'Contact Form',
        true,
        'Contact form submission successful',
        result
      ));
      console.log('✅ Contact form test successful');
    } catch (error) {
      this.results.push(createTestResult(
        'Contact Form',
        false,
        'Contact form submission failed',
        null,
        error
      ));
      console.log('❌ Contact form test failed:', error.message);
    }
  }

  /**
   * Test CORS configuration
   */
  async testCorsConfiguration() {
    try {
      console.log('🌐 Testing CORS configuration...');
      
      // Test if we can make a cross-origin request
      const response = await fetch(`${ENV_INFO.RESOLVED_BASE_URL}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        this.results.push(createTestResult(
          'CORS Configuration',
          true,
          'CORS is properly configured - cross-origin requests work'
        ));
        console.log('✅ CORS configuration test successful');
      } else {
        this.results.push(createTestResult(
          'CORS Configuration',
          false,
          `CORS test failed with status: ${response.status}`
        ));
        console.log('❌ CORS configuration test failed');
      }
    } catch (error) {
      // CORS errors typically show as network errors
      if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
        this.results.push(createTestResult(
          'CORS Configuration',
          false,
          'CORS configuration error detected',
          null,
          error
        ));
        console.log('❌ CORS configuration error:', error.message);
      } else {
        this.results.push(createTestResult(
          'CORS Configuration',
          false,
          'CORS test failed with network error',
          null,
          error
        ));
        console.log('❌ CORS test network error:', error.message);
      }
    }
  }

  /**
   * Generate test summary
   */
  generateSummary() {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    const duration = this.endTime - this.startTime;

    const summary = {
      totalTests,
      passedTests,
      failedTests,
      successRate: totalTests > 0 ? (passedTests / totalTests * 100).toFixed(1) : 0,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      environment: ENV_INFO,
      results: this.results
    };

    console.log('\n📋 Test Summary:');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Success Rate: ${summary.successRate}%`);
    console.log(`Duration: ${summary.duration}`);

    if (failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.filter(r => !r.success).forEach(result => {
        console.log(`- ${result.name}: ${result.message}`);
        if (result.error) {
          console.log(`  Error: ${result.error}`);
        }
      });
    }

    return summary;
  }

  /**
   * Get detailed test results
   */
  getResults() {
    return {
      results: this.results,
      summary: this.generateSummary()
    };
  }
}

/**
 * Quick API status check
 * @returns {Promise<Object>} API status
 */
export const quickApiCheck = async () => {
  console.log('🔍 Quick API status check...');
  
  try {
    const status = await checkApiStatus();
    console.log('API Status:', status);
    return status;
  } catch (error) {
    console.error('Quick API check failed:', error);
    return {
      isOnline: false,
      error: error.message,
      timestamp: Date.now()
    };
  }
};

/**
 * Run comprehensive API tests
 * @returns {Promise<Object>} Test results
 */
export const runApiTests = async () => {
  const tester = new ApiTester();
  return await tester.runAllTests();
};

export default ApiTester;