/**
 * Analytics Hook
 * Manages analytics data fetching and state
 */

import { useState, useEffect, useCallback } from 'react';
import { apiService, apiUtils } from '../services/apiService';

export const useAnalytics = (options = {}) => {
  const {
    autoFetch = true,
    refreshInterval = 0, // 0 means no auto-refresh
    onError
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getAnalytics();
      const formattedData = apiUtils.formatAnalyticsData(response);
      
      setData(formattedData);
      setLastFetched(new Date());
      return formattedData;
    } catch (err) {
      setError(err);
      if (onError) {
        onError(err);
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [onError]);

  const refresh = useCallback(() => {
    return fetchAnalytics();
  }, [fetchAnalytics]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchAnalytics();
    }
  }, [autoFetch, fetchAnalytics]);

  // Auto-refresh interval
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(fetchAnalytics, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, fetchAnalytics]);

  return {
    data,
    loading,
    error,
    lastFetched,
    fetchAnalytics,
    refresh,
    isEmpty: data && Object.values(data).every(value => 
      Array.isArray(value) ? value.length === 0 : value === 0
    )
  };
};

export default useAnalytics;