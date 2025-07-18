/**
 * API Service Layer
 * Centralized service for backend communication with error handling and retry logic
 */

import { API_CONFIG, DEFAULT_REQUEST_CONFIG } from '../config/api';
import { handleApiError, retryApiCall } from '../utils/errorHandler';

/**
 * Base API client with timeout and error handling
 */
class ApiClient {
  constructor(baseURL = API_CONFIG.BASE_URL) {
    this.baseURL = baseURL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  /**
   * Make HTTP request with timeout and error handling
   * @param {string} url - Request URL
   * @param {Object} options - Request options
   * @returns {Promise} Response data
   */
  async request(url, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        ...DEFAULT_REQUEST_CONFIG,
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // Handle non-JSON responses (like file downloads)
      const contentType = response.headers.get('content-type');
      if (contentType && !contentType.includes('application/json')) {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response;
      }

      // Parse JSON response
      const data = await response.json();

      if (!response.ok) {
        const error = new Error(data.message || `HTTP ${response.status}`);
        error.response = { status: response.status, data };
        throw error;
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Handle abort/timeout errors
      if (error.name === 'AbortError') {
        const timeoutError = new Error('Request timeout');
        timeoutError.code = 'ECONNABORTED';
        throw timeoutError;
      }
      
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * PUT request
   */
  async put(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * DELETE request
   */
  async delete(url, options = {}) {
    return this.request(url, { ...options, method: 'DELETE' });
  }
}

// Create API client instance
const apiClient = new ApiClient();

/**
 * API Service functions with error handling and retry logic
 */
export const apiService = {
  /**
   * Send contact form message
   * @param {Object} contactData - Contact form data
   * @returns {Promise} Response data
   */
  async sendContactMessage(contactData) {
    try {
      return await retryApiCall(
        () => apiClient.post(API_CONFIG.ENDPOINTS.CONTACT, contactData),
        2, // Retry only once for contact form
        2000 // 2 second delay
      );
    } catch (error) {
      throw handleApiError(error, 'Contact Form Submission');
    }
  },

  /**
   * Get analytics data
   * @returns {Promise} Analytics data
   */
  async getAnalytics() {
    try {
      return await retryApiCall(
        () => apiClient.get(API_CONFIG.ENDPOINTS.ANALYTICS),
        API_CONFIG.RETRY_ATTEMPTS,
        API_CONFIG.RETRY_DELAY
      );
    } catch (error) {
      throw handleApiError(error, 'Analytics Data Fetch');
    }
  },

  /**
   * Track visitor information
   * @param {Object} visitData - Visit tracking data
   * @returns {Promise} Response data
   */
  async trackVisit(visitData) {
    try {
      // Don't retry visit tracking to avoid duplicate entries
      return await apiClient.post(API_CONFIG.ENDPOINTS.TRACK_VISIT, visitData);
    } catch (error) {
      // Log error but don't throw - visitor tracking shouldn't break the app
      handleApiError(error, 'Visitor Tracking');
      return null;
    }
  },

  /**
   * Download resume file
   * @returns {Promise} File blob
   */
  async downloadResume() {
    try {
      const response = await retryApiCall(
        () => apiClient.get(API_CONFIG.ENDPOINTS.DOWNLOAD_RESUME),
        2,
        1000
      );
      
      // Return the response for file download handling
      return response;
    } catch (error) {
      throw handleApiError(error, 'Resume Download');
    }
  },

  /**
   * Health check
   * @returns {Promise} Health status
   */
  async healthCheck() {
    try {
      return await apiClient.get(API_CONFIG.ENDPOINTS.HEALTH);
    } catch (error) {
      throw handleApiError(error, 'Health Check');
    }
  },

  /**
   * Test API connectivity with production-specific timeout
   * @returns {Promise<boolean>} True if API is reachable
   */
  async testConnection() {
    try {
      // Use shorter timeout for connection tests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.CONNECTION_TEST.TIMEOUT);

      const response = await fetch(`${apiClient.baseURL}${API_CONFIG.ENDPOINTS.HEALTH}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.warn('API connection test failed:', error.message);
      return false;
    }
  }
};

/**
 * API status checker utility
 * @returns {Promise<Object>} API status information
 */
export const checkApiStatus = async () => {
  try {
    const online = await apiService.testConnection();
    return {
      isOnline: online,
      lastChecked: new Date(),
      timestamp: Date.now()
    };
  } catch (error) {
    return {
      isOnline: false,
      lastChecked: new Date(),
      timestamp: Date.now(),
      error: error.message
    };
  }
};

/**
 * Utility functions for common API operations
 */
export const apiUtils = {
  /**
   * Create visitor tracking data from current page
   * @returns {Object} Visit data
   */
  createVisitData() {
    const data = {
      page: window.location.pathname,
      referrer: document.referrer || 'direct',
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      url: window.location.href,
      search: window.location.search,
      hash: window.location.hash
    };

    // Add screen information if available
    if (window.screen) {
      data.screen_resolution = `${window.screen.width}x${window.screen.height}`;
    }

    // Add viewport information
    data.viewport_size = `${window.innerWidth}x${window.innerHeight}`;

    // Add language information
    data.language = navigator.language || navigator.userLanguage;

    // Add timezone information
    try {
      data.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
      // Fallback if Intl is not supported
      data.timezone = 'Unknown';
    }

    return data;
  },

  /**
   * Validate contact form data before sending
   * @param {Object} data - Contact form data
   * @returns {Object} Validation result
   */
  validateContactData(data) {
    const errors = [];
    
    if (!data.name?.trim()) errors.push('Name is required');
    if (!data.email?.trim()) errors.push('Email is required');
    if (!data.subject?.trim()) errors.push('Subject is required');
    if (!data.message?.trim()) errors.push('Message is required');
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
      errors.push('Please enter a valid email address');
    }
    
    // Length validations
    if (data.name && data.name.length > 100) errors.push('Name must be less than 100 characters');
    if (data.subject && data.subject.length > 200) errors.push('Subject must be less than 200 characters');
    if (data.message && data.message.length > 2000) errors.push('Message must be less than 2000 characters');
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Format analytics data for display
   * @param {Object} rawData - Raw analytics data from API
   * @returns {Object} Formatted analytics data
   */
  formatAnalyticsData(rawData) {
    if (!rawData?.data) return null;
    
    const { data } = rawData;
    
    return {
      totalVisitors: data.total_visitors || 0,
      githubUsers: data.github_users || 0,
      totalMessages: data.total_messages || 0,
      visitorsByCountry: data.visitors_by_country || [],
      visitorsByPage: data.visitors_by_page || [],
      recentVisitors: data.recent_visitors || []
    };
  }
};

export default apiService;