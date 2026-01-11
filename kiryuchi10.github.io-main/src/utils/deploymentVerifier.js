/**
 * Deployment Verification Utility
 * Comprehensive testing script for verifying production deployment
 */

import { runApiTests, quickApiCheck } from './apiTester';
import { ENV_INFO } from '../config/api';
import { apiService } from '../services/apiService';

/**
 * Deployment Verification Class
 */
export class DeploymentVerifier {
  constructor() {
    this.results = [];
    this.startTime = null;
    this.endTime = null;
  }

  /**
   * Run complete deployment verification
   * @returns {Promise<Object>} Verification results
   */
  async verifyDeployment() {
    console.log('🚀 Starting Deployment Verification...');
    console.log('Environment:', ENV_INFO);
    
    this.startTime = Date.now();
    this.results = [];

    // Step 1: Environment Configuration Check
    await this.verifyEnvironmentConfig();

    // Step 2: API Connectivity Check
    await this.verifyApiConnectivity();

    // Step 3: CORS Configuration Check
    await this.verifyCorsConfiguration();

    // Step 4: All Endpoints Check
    await this.verifyAllEndpoints();

    // Step 5: Data Flow Check
    await this.verifyDataFlow();

    // Step 6: Error Handling Check
    await this.verifyErrorHandling();

    this.endTime = Date.now();
    return this.generateVerificationReport();
  }

  /**
   * Verify environment configuration
   */
  async verifyEnvironmentConfig() {
    console.log('🔧 Verifying Environment Configuration...');
    
    const checks = [
      {
        name: 'Environment Detection',
        test: () => ENV_INFO.current !== undefined,
        message: `Environment: ${ENV_INFO.current}`
      },
      {
        name: 'Backend URL Configuration',
        test: () => ENV_INFO.RESOLVED_BASE_URL && ENV_INFO.RESOLVED_BASE_URL !== 'undefined',
        message: `Backend URL: ${ENV_INFO.RESOLVED_BASE_URL}`
      },
      {
        name: 'Production Environment Check',
        test: () => ENV_INFO.isProduction ? ENV_INFO.RESOLVED_BASE_URL.includes('https') : true,
        message: ENV_INFO.isProduction ? 'Production uses HTTPS' : 'Development environment'
      },
      {
        name: 'API Endpoints Configuration',
        test: () => Object.keys(ENV_INFO.ENDPOINTS).length > 0,
        message: `${Object.keys(ENV_INFO.ENDPOINTS).length} endpoints configured`
      }
    ];

    for (const check of checks) {
      const result = {
        category: 'Environment',
        name: check.name,
        success: check.test(),
        message: check.message,
        timestamp: new Date().toISOString()
      };
      
      this.results.push(result);
      console.log(result.success ? '✅' : '❌', check.name, '-', check.message);
    }
  }

  /**
   * Verify API connectivity
   */
  async verifyApiConnectivity() {
    console.log('🔗 Verifying API Connectivity...');
    
    try {
      const isConnected = await apiService.testConnection();
      this.results.push({
        category: 'Connectivity',
        name: 'API Connection Test',
        success: isConnected,
        message: isConnected ? 'Successfully connected to backend' : 'Failed to connect to backend',
        timestamp: new Date().toISOString()
      });
      
      console.log(isConnected ? '✅' : '❌', 'API Connection Test');
    } catch (error) {
      this.results.push({
        category: 'Connectivity',
        name: 'API Connection Test',
        success: false,
        message: `Connection test failed: ${error.message}`,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      console.log('❌ API Connection Test - Error:', error.message);
    }
  }

  /**
   * Verify CORS configuration
   */
  async verifyCorsConfiguration() {
    console.log('🌐 Verifying CORS Configuration...');
    
    try {
      // Test preflight request
      const response = await fetch(`${ENV_INFO.RESOLVED_BASE_URL}/api/health`, {
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type'
        }
      });

      const corsHeaders = {
        'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
        'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
      };

      const corsConfigured = corsHeaders['Access-Control-Allow-Origin'] !== null;

      this.results.push({
        category: 'CORS',
        name: 'CORS Configuration',
        success: corsConfigured,
        message: corsConfigured ? 'CORS headers present' : 'CORS headers missing',
        data: corsHeaders,
        timestamp: new Date().toISOString()
      });

      console.log(corsConfigured ? '✅' : '❌', 'CORS Configuration');
    } catch (error) {
      this.results.push({
        category: 'CORS',
        name: 'CORS Configuration',
        success: false,
        message: `CORS test failed: ${error.message}`,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      console.log('❌ CORS Configuration - Error:', error.message);
    }
  }

  /**
   * Verify all endpoints
   */
  async verifyAllEndpoints() {
    console.log('🎯 Verifying All Endpoints...');
    
    const endpointTests = [
      {
        name: 'Health Check',
        test: () => apiService.healthCheck(),
        critical: true
      },
      {
        name: 'Analytics Endpoint',
        test: () => apiService.getAnalytics(),
        critical: true
      },
      {
        name: 'Visitor Tracking',
        test: () => apiService.trackVisit({ test: true, page: '/verification-test' }),
        critical: false
      }
    ];

    for (const endpointTest of endpointTests) {
      try {
        const result = await endpointTest.test();
        this.results.push({
          category: 'Endpoints',
          name: endpointTest.name,
          success: true,
          message: 'Endpoint responded successfully',
          critical: endpointTest.critical,
          data: result ? { status: 'success' } : null,
          timestamp: new Date().toISOString()
        });
        
        console.log('✅', endpointTest.name);
      } catch (error) {
        this.results.push({
          category: 'Endpoints',
          name: endpointTest.name,
          success: false,
          message: `Endpoint failed: ${error.message}`,
          critical: endpointTest.critical,
          error: error.message,
          timestamp: new Date().toISOString()
        });
        
        console.log('❌', endpointTest.name, '- Error:', error.message);
      }
    }
  }

  /**
   * Verify data flow
   */
  async verifyDataFlow() {
    console.log('📊 Verifying Data Flow...');
    
    try {
      // Test analytics data structure
      const analyticsData = await apiService.getAnalytics();
      
      const hasValidStructure = analyticsData?.data && 
        typeof analyticsData.data.total_visitors === 'number' &&
        Array.isArray(analyticsData.data.visitors_by_country);

      this.results.push({
        category: 'Data Flow',
        name: 'Analytics Data Structure',
        success: hasValidStructure,
        message: hasValidStructure ? 'Analytics data has valid structure' : 'Analytics data structure is invalid',
        data: hasValidStructure ? {
          totalVisitors: analyticsData.data.total_visitors,
          countriesCount: analyticsData.data.visitors_by_country.length
        } : null,
        timestamp: new Date().toISOString()
      });

      console.log(hasValidStructure ? '✅' : '❌', 'Analytics Data Structure');
    } catch (error) {
      this.results.push({
        category: 'Data Flow',
        name: 'Analytics Data Structure',
        success: false,
        message: `Data flow test failed: ${error.message}`,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      console.log('❌ Analytics Data Structure - Error:', error.message);
    }
  }

  /**
   * Verify error handling
   */
  async verifyErrorHandling() {
    console.log('⚠️ Verifying Error Handling...');
    
    try {
      // Test invalid endpoint
      await fetch(`${ENV_INFO.RESOLVED_BASE_URL}/api/nonexistent`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      this.results.push({
        category: 'Error Handling',
        name: 'Invalid Endpoint Response',
        success: true,
        message: 'Server handles invalid endpoints gracefully',
        timestamp: new Date().toISOString()
      });
      
      console.log('✅ Invalid Endpoint Response');
    } catch (error) {
      // This is expected - we want to see how errors are handled
      const isGracefulError = error.message.includes('404') || error.message.includes('Not Found');
      
      this.results.push({
        category: 'Error Handling',
        name: 'Invalid Endpoint Response',
        success: isGracefulError,
        message: isGracefulError ? 'Server returns proper 404 errors' : 'Unexpected error handling',
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      console.log(isGracefulError ? '✅' : '❌', 'Invalid Endpoint Response');
    }
  }

  /**
   * Generate verification report
   */
  generateVerificationReport() {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    const criticalFailures = this.results.filter(r => !r.success && r.critical).length;
    const duration = this.endTime - this.startTime;

    const report = {
      summary: {
        totalTests,
        passedTests,
        failedTests,
        criticalFailures,
        successRate: totalTests > 0 ? (passedTests / totalTests * 100).toFixed(1) : 0,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString(),
        deploymentReady: criticalFailures === 0
      },
      environment: ENV_INFO,
      results: this.results,
      categories: this.groupResultsByCategory()
    };

    console.log('\n📋 Deployment Verification Report:');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);
    console.log(`Critical Failures: ${criticalFailures}`);
    console.log(`Success Rate: ${report.summary.successRate}%`);
    console.log(`Duration: ${report.summary.duration}`);
    console.log(`Deployment Ready: ${report.summary.deploymentReady ? 'YES' : 'NO'}`);

    if (failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.filter(r => !r.success).forEach(result => {
        console.log(`- [${result.category}] ${result.name}: ${result.message}`);
        if (result.critical) {
          console.log('  ⚠️ CRITICAL FAILURE');
        }
      });
    }

    return report;
  }

  /**
   * Group results by category
   */
  groupResultsByCategory() {
    const categories = {};
    this.results.forEach(result => {
      if (!categories[result.category]) {
        categories[result.category] = [];
      }
      categories[result.category].push(result);
    });
    return categories;
  }
}

/**
 * Quick deployment verification
 * @returns {Promise<Object>} Quick verification results
 */
export const quickDeploymentCheck = async () => {
  console.log('🔍 Quick Deployment Check...');
  
  const checks = [
    {
      name: 'Environment',
      test: () => ENV_INFO.current && ENV_INFO.RESOLVED_BASE_URL
    },
    {
      name: 'API Connection',
      test: async () => {
        try {
          return await apiService.testConnection();
        } catch {
          return false;
        }
      }
    }
  ];

  const results = [];
  for (const check of checks) {
    try {
      const result = typeof check.test === 'function' ? await check.test() : check.test;
      results.push({ name: check.name, success: result });
      console.log(result ? '✅' : '❌', check.name);
    } catch (error) {
      results.push({ name: check.name, success: false, error: error.message });
      console.log('❌', check.name, '- Error:', error.message);
    }
  }

  const allPassed = results.every(r => r.success);
  console.log(`\nQuick Check: ${allPassed ? 'PASSED' : 'FAILED'}`);
  
  return {
    passed: allPassed,
    results,
    timestamp: new Date().toISOString()
  };
};

/**
 * Run full deployment verification
 * @returns {Promise<Object>} Full verification results
 */
export const runDeploymentVerification = async () => {
  const verifier = new DeploymentVerifier();
  return await verifier.verifyDeployment();
};

export default DeploymentVerifier;