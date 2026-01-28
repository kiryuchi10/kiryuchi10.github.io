/**
 * Visitor Tracking Utilities
 * Helper functions for visitor tracking functionality
 */

/**
 * Check if visitor tracking should be enabled
 * @returns {boolean} True if tracking should be enabled
 */
export const shouldTrackVisitor = () => {
  // Don't track in development unless explicitly enabled
  if (process.env.NODE_ENV === 'development') {
    return process.env.REACT_APP_ENABLE_TRACKING === 'true';
  }
  
  // Always track in production
  return true;
};

/**
 * Check if the current environment supports visitor tracking
 * @returns {boolean} True if tracking is supported
 */
export const isTrackingSupported = () => {
  // Check for required browser APIs
  return (
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    typeof fetch !== 'undefined'
  );
};

/**
 * Get visitor's approximate location from browser (if available)
 * @returns {Promise<Object|null>} Location data or null
 */
export const getBrowserLocation = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    // Avoid triggering a browser permission prompt automatically.
    // Only attempt geolocation if permission is already granted.
    if (navigator.permissions?.query) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((status) => {
          if (status.state !== 'granted') {
            resolve(null);
            return;
          }

          const options = {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 300000 // 5 minutes
          };

          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
              });
            },
            () => resolve(null),
            options
          );
        })
        .catch(() => resolve(null));

      return;
    }

    const options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 300000 // 5 minutes
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      () => {
        // Silently fail - location is optional
        resolve(null);
      },
      options
    );
  });
};

/**
 * Detect if the visitor is likely a bot
 * @returns {boolean} True if likely a bot
 */
export const isLikelyBot = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const botPatterns = [
    'bot', 'crawler', 'spider', 'scraper', 'facebook', 'twitter',
    'linkedin', 'whatsapp', 'telegram', 'googlebot', 'bingbot'
  ];
  
  return botPatterns.some(pattern => userAgent.includes(pattern));
};

/**
 * Get connection information if available
 * @returns {Object|null} Connection info or null
 */
export const getConnectionInfo = () => {
  if (!navigator.connection && !navigator.mozConnection && !navigator.webkitConnection) {
    return null;
  }

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  return {
    effectiveType: connection.effectiveType,
    downlink: connection.downlink,
    rtt: connection.rtt,
    saveData: connection.saveData
  };
};

/**
 * Create enhanced visitor data with additional browser information
 * @param {Object} baseData - Base visitor data
 * @returns {Promise<Object>} Enhanced visitor data
 */
export const createEnhancedVisitorData = async (baseData) => {
  const enhancedData = { ...baseData };

  // Add bot detection
  enhancedData.is_bot = isLikelyBot();

  // Add connection info if available
  const connectionInfo = getConnectionInfo();
  if (connectionInfo) {
    enhancedData.connection = connectionInfo;
  }

  // Add location if available and user consents
  try {
    const location = await getBrowserLocation();
    if (location) {
      enhancedData.location = location;
    }
  } catch (error) {
    // Silently ignore location errors
  }

  // Add performance timing if available
  if (window.performance && window.performance.timing) {
    const timing = window.performance.timing;
    enhancedData.page_load_time = timing.loadEventEnd - timing.navigationStart;
  }

  return enhancedData;
};

/**
 * Validate visitor data before sending
 * @param {Object} data - Visitor data to validate
 * @returns {Object} Validation result
 */
export const validateVisitorData = (data) => {
  const errors = [];
  
  if (!data.page) errors.push('Page is required');
  if (!data.timestamp) errors.push('Timestamp is required');
  if (!data.user_agent) errors.push('User agent is required');
  
  // Check for reasonable data sizes
  if (data.user_agent && data.user_agent.length > 1000) {
    errors.push('User agent too long');
  }
  
  if (data.referrer && data.referrer.length > 2000) {
    errors.push('Referrer too long');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize visitor data to prevent potential issues
 * @param {Object} data - Raw visitor data
 * @returns {Object} Sanitized data
 */
export const sanitizeVisitorData = (data) => {
  const sanitized = {};
  
  // Only include allowed fields
  const allowedFields = [
    'page', 'referrer', 'timestamp', 'user_agent', 'url', 'search', 'hash',
    'screen_resolution', 'viewport_size', 'language', 'timezone', 'is_bot',
    'connection', 'location', 'page_load_time'
  ];
  
  allowedFields.forEach(field => {
    if (data[field] !== undefined) {
      // Truncate string fields to reasonable lengths
      if (typeof data[field] === 'string') {
        sanitized[field] = data[field].substring(0, 2000);
      } else {
        sanitized[field] = data[field];
      }
    }
  });
  
  return sanitized;
};

const visitorTrackingUtils = {
  shouldTrackVisitor,
  isTrackingSupported,
  getBrowserLocation,
  isLikelyBot,
  getConnectionInfo,
  createEnhancedVisitorData,
  validateVisitorData,
  sanitizeVisitorData
};

export default visitorTrackingUtils;