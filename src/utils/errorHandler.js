/**
 * Error Handling Utilities
 * Centralized error handling for API calls and user feedback
 */

// Error types for consistent handling
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  SERVER: 'SERVER_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  RATE_LIMIT: 'RATE_LIMIT_ERROR',
  NOT_FOUND: 'NOT_FOUND_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

// User-friendly error messages
export const ERROR_MESSAGES = {
  [ERROR_TYPES.NETWORK]: 'Unable to connect to the server. Please check your internet connection.',
  [ERROR_TYPES.TIMEOUT]: 'Request timed out. Please try again.',
  [ERROR_TYPES.SERVER]: 'Server error occurred. Please try again later.',
  [ERROR_TYPES.VALIDATION]: 'Please check your input and try again.',
  [ERROR_TYPES.RATE_LIMIT]: 'Too many requests. Please wait a moment before trying again.',
  [ERROR_TYPES.NOT_FOUND]: 'The requested resource was not found.',
  [ERROR_TYPES.UNKNOWN]: 'An unexpected error occurred. Please try again.'
};

/**
 * Parse error response and determine error type
 * @param {Error|Response} error - The error object or response
 * @returns {Object} Parsed error information
 */
export const parseError = (error) => {
  // Network/Connection errors
  if (!error.response && error.code) {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return {
        type: ERROR_TYPES.TIMEOUT,
        message: ERROR_MESSAGES[ERROR_TYPES.TIMEOUT],
        originalError: error
      };
    }
    return {
      type: ERROR_TYPES.NETWORK,
      message: ERROR_MESSAGES[ERROR_TYPES.NETWORK],
      originalError: error
    };
  }

  // HTTP Response errors
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        return {
          type: ERROR_TYPES.VALIDATION,
          message: data?.message || data?.error || ERROR_MESSAGES[ERROR_TYPES.VALIDATION],
          details: data?.details || null,
          originalError: error
        };
      
      case 404:
        return {
          type: ERROR_TYPES.NOT_FOUND,
          message: data?.message || ERROR_MESSAGES[ERROR_TYPES.NOT_FOUND],
          originalError: error
        };
      
      case 429:
        return {
          type: ERROR_TYPES.RATE_LIMIT,
          message: data?.message || ERROR_MESSAGES[ERROR_TYPES.RATE_LIMIT],
          originalError: error
        };
      
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          type: ERROR_TYPES.SERVER,
          message: data?.message || ERROR_MESSAGES[ERROR_TYPES.SERVER],
          originalError: error
        };
      
      default:
        return {
          type: ERROR_TYPES.UNKNOWN,
          message: data?.message || ERROR_MESSAGES[ERROR_TYPES.UNKNOWN],
          originalError: error
        };
    }
  }

  // Fetch API errors
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return {
      type: ERROR_TYPES.NETWORK,
      message: ERROR_MESSAGES[ERROR_TYPES.NETWORK],
      originalError: error
    };
  }

  // Default unknown error
  return {
    type: ERROR_TYPES.UNKNOWN,
    message: error.message || ERROR_MESSAGES[ERROR_TYPES.UNKNOWN],
    originalError: error
  };
};

/**
 * Log error for debugging purposes
 * @param {Object} errorInfo - Parsed error information
 * @param {string} context - Context where error occurred
 */
export const logError = (errorInfo, context = 'Unknown') => {
  console.error(`[${context}] Error:`, {
    type: errorInfo.type,
    message: errorInfo.message,
    details: errorInfo.details,
    originalError: errorInfo.originalError
  });
};

/**
 * Create user notification object for error display
 * @param {Object} errorInfo - Parsed error information
 * @returns {Object} Notification object
 */
export const createErrorNotification = (errorInfo) => {
  return {
    type: 'error',
    title: 'Error',
    message: errorInfo.message,
    details: errorInfo.details,
    duration: errorInfo.type === ERROR_TYPES.RATE_LIMIT ? 5000 : 4000
  };
};

/**
 * Handle API errors with consistent logging and user feedback
 * @param {Error} error - The error to handle
 * @param {string} context - Context where error occurred
 * @returns {Object} Parsed error information
 */
export const handleApiError = (error, context = 'API Call') => {
  const errorInfo = parseError(error);
  logError(errorInfo, context);
  return errorInfo;
};

/**
 * Retry utility for failed API calls
 * @param {Function} apiCall - The API call function to retry
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} delay - Delay between retries in milliseconds
 * @returns {Promise} The result of the API call
 */
export const retryApiCall = async (apiCall, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      const errorInfo = parseError(error);
      
      // Don't retry for certain error types
      if ([ERROR_TYPES.VALIDATION, ERROR_TYPES.RATE_LIMIT, ERROR_TYPES.NOT_FOUND].includes(errorInfo.type)) {
        throw error;
      }
      
      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        throw error;
      }
      
      console.warn(`API call attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Exponential backoff
      delay *= 2;
    }
  }
  
  throw lastError;
};

export default {
  ERROR_TYPES,
  ERROR_MESSAGES,
  parseError,
  logError,
  createErrorNotification,
  handleApiError,
  retryApiCall
};