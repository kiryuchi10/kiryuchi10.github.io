/**
 * Visitor Tracker Component
 * Debug component to test and monitor visitor tracking functionality
 */

import React, { useState, useEffect } from 'react';
import { useVisitorTracking } from '../hooks/useVisitorTracking';
import { useApiStatus } from '../hooks/useApiStatus';
import { apiUtils } from '../services/apiService';

const VisitorTracker = ({ showDebugInfo = false }) => {
  const [trackingData, setTrackingData] = useState(null);
  const [lastTrackTime, setLastTrackTime] = useState(null);
  const [trackingCount, setTrackingCount] = useState(0);

  // Initialize visitor tracking with debug enabled
  const { trackVisit, trackPageView } = useVisitorTracking({
    trackOnMount: true,
    trackPageChanges: true,
    enableDebug: showDebugInfo
  });

  // Monitor API status
  const { isOnline, isChecking, lastChecked, error } = useApiStatus({
    checkInterval: 60000, // Check every minute
    checkOnMount: true,
    autoCheck: true
  });

  // Update tracking data when component mounts
  useEffect(() => {
    const data = apiUtils.createVisitData();
    setTrackingData(data);
  }, []);

  // Manual tracking test function
  const handleManualTrack = async () => {
    try {
      await trackVisit({ manual: true, test: true });
      setLastTrackTime(new Date());
      setTrackingCount(prev => prev + 1);
    } catch (error) {
      console.error('Manual tracking failed:', error);
    }
  };

  // Manual page view tracking
  const handleTrackPageView = async () => {
    try {
      await trackPageView();
      setLastTrackTime(new Date());
      setTrackingCount(prev => prev + 1);
    } catch (error) {
      console.error('Page view tracking failed:', error);
    }
  };

  if (!showDebugInfo) {
    return null; // Hidden component when not in debug mode
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: '#f8f9fa',
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      padding: '16px',
      maxWidth: '400px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 1000,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#495057' }}>
        Visitor Tracking Debug
      </h4>
      
      {/* API Status */}
      <div style={{ marginBottom: '12px' }}>
        <strong>API Status:</strong>{' '}
        <span style={{ 
          color: isOnline ? '#28a745' : '#dc3545',
          fontWeight: 'bold'
        }}>
          {isChecking ? 'Checking...' : (isOnline ? 'Online' : 'Offline')}
        </span>
        {error && (
          <div style={{ color: '#dc3545', fontSize: '11px', marginTop: '4px' }}>
            Error: {error}
          </div>
        )}
        {lastChecked && (
          <div style={{ color: '#6c757d', fontSize: '11px' }}>
            Last checked: {lastChecked.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Tracking Stats */}
      <div style={{ marginBottom: '12px' }}>
        <strong>Tracking Stats:</strong>
        <div>Tracks sent: {trackingCount}</div>
        {lastTrackTime && (
          <div>Last track: {lastTrackTime.toLocaleTimeString()}</div>
        )}
      </div>

      {/* Current Page Data */}
      {trackingData && (
        <div style={{ marginBottom: '12px' }}>
          <strong>Current Page Data:</strong>
          <div style={{ 
            background: '#e9ecef', 
            padding: '8px', 
            borderRadius: '4px',
            marginTop: '4px',
            maxHeight: '120px',
            overflow: 'auto'
          }}>
            <div>Page: {trackingData.page}</div>
            <div>Referrer: {trackingData.referrer}</div>
            <div>Language: {trackingData.language}</div>
            <div>Timezone: {trackingData.timezone}</div>
            <div>Viewport: {trackingData.viewport_size}</div>
            <div>Screen: {trackingData.screen_resolution}</div>
          </div>
        </div>
      )}

      {/* Manual Controls */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={handleManualTrack}
          style={{
            padding: '4px 8px',
            fontSize: '11px',
            border: '1px solid #007bff',
            background: '#007bff',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Manual Track
        </button>
        <button
          onClick={handleTrackPageView}
          style={{
            padding: '4px 8px',
            fontSize: '11px',
            border: '1px solid #28a745',
            background: '#28a745',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Track Page View
        </button>
        <button
          onClick={() => setTrackingData(apiUtils.createVisitData())}
          style={{
            padding: '4px 8px',
            fontSize: '11px',
            border: '1px solid #6c757d',
            background: '#6c757d',
            color: 'white',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default VisitorTracker;