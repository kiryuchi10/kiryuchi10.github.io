/**
 * React Hook for API Status Monitoring
 * Provides real-time API connectivity status for components
 */

import { useState, useEffect, useCallback } from 'react';
import { checkApiStatus } from '../services/apiService';

/**
 * Hook for monitoring API status
 * @param {Object} options - Configuration options
 * @returns {Object} API status information and controls
 */
export const useApiStatus = (options = {}) => {
  const {
    checkInterval = 30000, // Check every 30 seconds
    checkOnMount = true,
    autoCheck = false
  } = options;

  const [status, setStatus] = useState({
    isOnline: true,
    isChecking: false,
    lastChecked: null,
    error: null
  });

  const checkStatus = useCallback(async () => {
    setStatus(prev => ({ ...prev, isChecking: true }));
    
    try {
      const result = await checkApiStatus();
      setStatus({
        isOnline: result.isOnline,
        isChecking: false,
        lastChecked: result.lastChecked,
        error: result.error || null
      });
      return result.isOnline;
    } catch (error) {
      setStatus({
        isOnline: false,
        isChecking: false,
        lastChecked: new Date(),
        error: error.message
      });
      return false;
    }
  }, []);

  useEffect(() => {
    if (checkOnMount) {
      checkStatus();
    }
  }, [checkOnMount, checkStatus]);

  useEffect(() => {
    if (!autoCheck) return;

    const interval = setInterval(checkStatus, checkInterval);
    return () => clearInterval(interval);
  }, [autoCheck, checkInterval, checkStatus]);

  return {
    ...status,
    checkStatus,
    refresh: checkStatus
  };
};

export default useApiStatus;