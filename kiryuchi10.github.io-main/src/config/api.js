/**
 * API Configuration
 * Environment-based URL configuration for backend communication
 */

import { getBackendUrl, ENV_CONFIG } from './environment';

// API Configuration object
export const API_CONFIG = {
  BASE_URL: getBackendUrl(),
  ENDPOINTS: {
    CONTACT: '/api/contact',
    ANALYTICS: '/api/analytics',
    TRACK_VISIT: '/api/track-visit',
    DOWNLOAD_RESUME: '/api/download-resume',
    HEALTH: '/api/health'
  },
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  // Connection test configuration
  CONNECTION_TEST: {
    TIMEOUT: 5000, // 5 seconds for connection tests
    MAX_RETRIES: 2
  }
};

// Request configuration defaults
export const DEFAULT_REQUEST_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_CONFIG.TIMEOUT
};

// Environment info for debugging
export const ENV_INFO = {
  ...ENV_CONFIG,
  RESOLVED_BASE_URL: API_CONFIG.BASE_URL,
  ENDPOINTS: API_CONFIG.ENDPOINTS
};

export default API_CONFIG;