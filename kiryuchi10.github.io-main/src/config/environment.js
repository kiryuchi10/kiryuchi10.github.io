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
  [ENV.PRODUCTION]: 'https://your-backend-url.onrender.com', // Will be updated with actual deployment URL
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
  
  /**
   * Production default:
   * - When deployed on Netlify, we use same-origin `/api/*` routes
   *   and let `netlify.toml` redirects forward to `/.netlify/functions/*`.
   * - This avoids building URLs like `/.netlify/functions/api/analytics` (404).
   *
   * If you deploy a separate backend (Render/Fly/etc), set REACT_APP_API_URL
   * to that origin (e.g. https://my-api.onrender.com).
   */
  if (currentEnv === ENV.PRODUCTION) {
    return '';
  }
  
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
  buildTime: new Date().toISOString(),
  buildVersion: '0.1.1-' + Date.now()
};

export default ENV_CONFIG;