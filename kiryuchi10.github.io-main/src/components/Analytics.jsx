import React, { useState, useEffect } from "react";
import "./Analytics.css";
import { apiService } from "../services/apiService";
import { useApiStatus } from "../hooks/useApiStatus";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  // Monitor API status for better error handling
  const { isOnline, checkStatus } = useApiStatus({
    checkOnMount: true,
    autoCheck: false
  });

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getAnalytics();
      
      if (response && response.data) {
        // Ensure all expected fields exist with defaults
        setAnalytics({
          total_visitors: response.data.total_visitors || 0,
          github_users: response.data.github_users || 0,
          total_messages: response.data.total_messages || 0,
          visitors_by_country: response.data.visitors_by_country || [],
          visitors_by_page: response.data.visitors_by_page || [],
          recent_visitors: response.data.recent_visitors || []
        });
      } else {
        // Handle empty response
        setAnalytics({
          total_visitors: 0,
          github_users: 0,
          total_messages: 0,
          visitors_by_country: [],
          visitors_by_page: [],
          recent_visitors: []
        });
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      
      // Determine error type for better user messaging
      let errorMessage = 'Failed to load analytics data';
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please check your connection.';
      } else if (err.message?.includes('fetch')) {
        errorMessage = 'Unable to connect to analytics service';
      } else if (err.response?.status === 503) {
        errorMessage = 'Analytics service is temporarily unavailable';
      }
      
      setError(errorMessage);
      
      // Set empty state on error
      setAnalytics({
        total_visitors: 0,
        github_users: 0,
        total_messages: 0,
        visitors_by_country: [],
        visitors_by_page: [],
        recent_visitors: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    // Check API status first
    await checkStatus();
    setRetryCount(prev => prev + 1);
    fetchAnalytics();
  };

  useEffect(() => {
    fetchAnalytics();
  }, [retryCount]);

  if (loading) {
    return (
      <div className="analytics-container">
        <div className="analytics-loading">
          <div className="loading-spinner"></div>
          <h2>Loading Analytics Dashboard...</h2>
          <p>Gathering visitor insights and statistics</p>
        </div>
      </div>
    );
  }

  const currentTime = new Date().toLocaleString();

  // Show error state with retry option
  if (error && !analytics) {
    return (
      <div className="analytics-container">
        <div className="analytics-error">
          <div className="error-icon">⚠️</div>
          <h2>Unable to Load Analytics</h2>
          <p>{error}</p>
          <button 
            className="retry-button" 
            onClick={handleRetry}
            disabled={loading}
          >
            {loading ? 'Retrying...' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  // Ensure analytics is available
  if (!analytics) {
    return (
      <div className="analytics-container">
        <div className="analytics-loading">
          <div className="loading-spinner"></div>
          <h2>Loading Analytics Dashboard...</h2>
          <p>Gathering visitor insights and statistics</p>
        </div>
      </div>
    );
  }

  const hasData = analytics.total_visitors > 0 || 
                  analytics.visitors_by_country.length > 0 || 
                  analytics.visitors_by_page.length > 0 || 
                  analytics.recent_visitors.length > 0;

  return (
    <div className="analytics-container" data-time={currentTime}>
      {/* Connection Status Indicator */}
      <div className={`connection-status ${isOnline ? 'online' : 'offline'}`}>
        <span className="status-dot"></span>
        <span>{isOnline ? 'Connected' : 'Offline'}</span>
      </div>

      {error && (
        <div className="error-banner">
          <span>⚠️ Some data may be outdated due to connection issues</span>
          <button className="retry-button-small" onClick={handleRetry}>
            Refresh
          </button>
        </div>
      )}
      
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div
          style={{
            background: "#f8f9fa",
            padding: "0.75rem 1.5rem",
            borderRadius: "25px",
            display: "inline-block",
            color: "#666",
            fontSize: "0.9rem",
            marginBottom: "1rem",
          }}
        >
          📅 Last updated: {currentTime}
        </div>
      </div>
      <h1>Visitor Analytics Dashboard</h1>

      <div className="analytics-grid">
        {/* Summary Cards */}
        <div className="analytics-card">
          <h3>Total Visitors</h3>
          <div className="analytics-number">{analytics.total_visitors || 0}</div>
        </div>

        <div className="analytics-card">
          <h3>GitHub Users</h3>
          <div className="analytics-number">{analytics.github_users || 0}</div>
        </div>

        <div className="analytics-card">
          <h3>Contact Messages</h3>
          <div className="analytics-number">{analytics.total_messages || 0}</div>
        </div>
      </div>

      {!hasData ? (
        <div className="empty-state">
          <div className="empty-icon">📊</div>
          <h3>No Analytics Data Available</h3>
          <p>Start exploring the website to generate visitor analytics!</p>
          <button className="retry-button" onClick={handleRetry}>
            Check for Updates
          </button>
        </div>
      ) : (
        <div className="analytics-sections">
          {/* Visitors by Country */}
          <div className="analytics-section">
            <h3>Visitors by Country</h3>
            <div className="analytics-table">
              {analytics.visitors_by_country && analytics.visitors_by_country.length > 0 ? (
                analytics.visitors_by_country.map(([country, count], index) => (
                  <div key={index} className="analytics-row">
                    <span>{country}</span>
                    <span className="analytics-count">{count}</span>
                  </div>
                ))
              ) : (
                <div className="empty-section">
                  <p>No country data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Visitors by Page */}
          <div className="analytics-section">
            <h3>Popular Pages</h3>
            <div className="analytics-table">
              {analytics.visitors_by_page && analytics.visitors_by_page.length > 0 ? (
                analytics.visitors_by_page.map(([page, count], index) => (
                  <div key={index} className="analytics-row">
                    <span>{page || "Home"}</span>
                    <span className="analytics-count">{count}</span>
                  </div>
                ))
              ) : (
                <div className="empty-section">
                  <p>No page visit data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Visitors */}
          <div className="analytics-section full-width">
            <h3>Recent Visitors</h3>
            <div className="analytics-table">
              {analytics.recent_visitors && analytics.recent_visitors.length > 0 ? (
                <>
                  <div className="analytics-header">
                    <span>IP</span>
                    <span>Country</span>
                    <span>City</span>
                    <span>Page</span>
                    <span>Time</span>
                  </div>
                  {analytics.recent_visitors.slice(0, 10).map((visitor, index) => (
                    <div key={index} className="analytics-row">
                      <span>{visitor[1]?.substring(0, 12) || 'Unknown'}...</span>
                      <span>{visitor[3] || "Unknown"}</span>
                      <span>{visitor[4] || "Unknown"}</span>
                      <span>{visitor[7] || "Home"}</span>
                      <span>{visitor[2] ? new Date(visitor[2]).toLocaleDateString() : 'Unknown'}</span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="empty-section">
                  <p>No recent visitor data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;
