/**
 * Environment Configuration
 * Centralized environment detection and configuration
 */

// Environment detection
export const ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test'
};

// Get current environment
export const getCurrentEnvironment = () => {
  return process.env.NODE_ENV || ENV.DEVELOPMENT;
};

// Check if we're in specific environments
export const isDevelopment = () => getCurrentEnvironment() === ENV.DEVELOPMENT;
export const isProduction = () => getCurrentEnvironment() === ENV.PRODUCTION;
export const isTest = () => getCurrentEnvironment() === ENV.TEST;

// Backend URL configuration for different environments
export const BACKEND_URLS = {
  [ENV.DEVELOPMENT]: 'http://localhost:5000',
  [ENV.PRODUCTION]: 'http://localhost:5000', // Using local backend until production is deployed
  [ENV.TEST]: 'http://localhost:5000'
};

// Get backend URL with fallback logic
export const getBackendUrl = () => {
  // First priority: Environment variable
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Second priority: Environment-specific default
  const currentEnv = getCurrentEnvironment();
  if (BACKEND_URLS[currentEnv]) {
    return BACKEND_URLS[currentEnv];
  }
  
  // Fallback to production URL
  return BACKEND_URLS[ENV.PRODUCTION];
};

// Frontend URL configuration
export const FRONTEND_URLS = {
  [ENV.DEVELOPMENT]: 'http://localhost:3000',
  [ENV.PRODUCTION]: 'https://kiryuchi10.github.io',
  [ENV.TEST]: 'http://localhost:3000'
};

// Get frontend URL
export const getFrontendUrl = () => {
  const currentEnv = getCurrentEnvironment();
  return FRONTEND_URLS[currentEnv] || FRONTEND_URLS[ENV.PRODUCTION];
};

// Environment configuration object
export const ENV_CONFIG = {
  current: getCurrentEnvironment(),
  isDevelopment: isDevelopment(),
  isProduction: isProduction(),
  isTest: isTest(),
  backendUrl: getBackendUrl(),
  frontendUrl: getFrontendUrl(),
  apiUrl: process.env.REACT_APP_API_URL,
  buildTime: new Date().toISOString()
};

export default ENV_CONFIG;