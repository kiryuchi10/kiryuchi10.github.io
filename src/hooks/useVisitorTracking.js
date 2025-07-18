/**
 * Visitor Tracking Hook
 * Automatically tracks page visits and provides manual tracking utilities
 */

import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { apiService, apiUtils } from '../services/apiService';
import { 
  shouldTrackVisitor, 
  isTrackingSupported, 
  createEnhancedVisitorData,
  validateVisitorData,
  sanitizeVisitorData
} from '../utils/visitorTrackingUtils';

export const useVisitorTracking = (options = {}) => {
  const {
    trackOnMount = true,
    trackPageChanges = true,
    enableDebug = false,
    enhancedTracking = true
  } = options;

  const location = useLocation();
  const hasTrackedInitialRef = useRef(false);
  const lastTrackedPathRef = useRef('');
  const trackingEnabledRef = useRef(shouldTrackVisitor() && isTrackingSupported());

  const trackVisit = useCallback(async (customData = {}) => {
    // Skip tracking if disabled or not supported
    if (!trackingEnabledRef.current) {
      if (enableDebug) {
        console.log('Visitor tracking is disabled or not supported');
      }
      return;
    }

    try {
      // Create base visitor data
      let visitData = {
        ...apiUtils.createVisitData(),
        ...customData
      };

      // Enhance data if enabled
      if (enhancedTracking) {
        visitData = await createEnhancedVisitorData(visitData);
      }

      // Validate and sanitize data
      const validation = validateVisitorData(visitData);
      if (!validation.isValid) {
        if (enableDebug) {
          console.warn('Invalid visitor data:', validation.errors);
        }
        return;
      }

      visitData = sanitizeVisitorData(visitData);

      if (enableDebug) {
        console.log('Tracking visit:', visitData);
      }

      await apiService.trackVisit(visitData);
      
      if (enableDebug) {
        console.log('Visit tracked successfully');
      }
    } catch (error) {
      // Visitor tracking errors are handled silently to not disrupt user experience
      if (enableDebug) {
        console.warn('Failed to track visit:', error);
      }
      
      // Don't throw error - tracking failures should not break the app
    }
  }, [enableDebug, enhancedTracking]);

  const trackPageView = useCallback((page = window.location.pathname) => {
    return trackVisit({ page });
  }, [trackVisit]);

  // Track initial page load
  useEffect(() => {
    if (trackOnMount && !hasTrackedInitialRef.current && trackingEnabledRef.current) {
      // Small delay to ensure page is fully loaded
      const timer = setTimeout(() => {
        trackVisit();
        hasTrackedInitialRef.current = true;
        lastTrackedPathRef.current = location.pathname;
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [trackOnMount, trackVisit, location.pathname]);

  // Track page changes using React Router location
  useEffect(() => {
    if (!trackPageChanges || !trackingEnabledRef.current) return;

    // Only track if the path has actually changed and we've already tracked the initial visit
    if (hasTrackedInitialRef.current && location.pathname !== lastTrackedPathRef.current) {
      trackPageView(location.pathname);
      lastTrackedPathRef.current = location.pathname;
    }
  }, [location.pathname, trackPageChanges, trackPageView]);

  // Also listen for browser navigation (back/forward buttons)
  useEffect(() => {
    if (!trackPageChanges || !trackingEnabledRef.current) return;

    const handlePopState = () => {
      // Small delay to ensure location has updated
      setTimeout(() => {
        const currentPath = window.location.pathname;
        if (currentPath !== lastTrackedPathRef.current) {
          trackPageView(currentPath);
          lastTrackedPathRef.current = currentPath;
        }
      }, 100);
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [trackPageChanges, trackPageView]);

  return {
    trackVisit,
    trackPageView,
    isTrackingEnabled: trackingEnabledRef.current
  };
};

export default useVisitorTracking;