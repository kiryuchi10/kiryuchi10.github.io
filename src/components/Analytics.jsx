import React, { useState, useEffect } from 'react';
import './Analytics.css';

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
      } else {
        setError('Failed to fetch analytics');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="analytics-loading">Loading analytics...</div>;
  if (error) return <div className="analytics-error">Error: {error}</div>;
  if (!analytics) return <div className="analytics-error">No data available</div>;

  return (
    <div className="analytics-container">
      <h1>Visitor Analytics Dashboard</h1>
      
      <div className="analytics-grid">
        {/* Summary Cards */}
        <div className="analytics-card">
          <h3>Total Visitors</h3>
          <div className="analytics-number">{analytics.total_visitors}</div>
        </div>
        
        <div className="analytics-card">
          <h3>GitHub Users</h3>
          <div className="analytics-number">{analytics.github_users}</div>
        </div>
        
        <div className="analytics-card">
          <h3>Contact Messages</h3>
          <div className="analytics-number">{analytics.total_messages}</div>
        </div>
      </div>

      <div className="analytics-sections">
        {/* Visitors by Country */}
        <div className="analytics-section">
          <h3>Visitors by Country</h3>
          <div className="analytics-table">
            {analytics.visitors_by_country.map(([country, count], index) => (
              <div key={index} className="analytics-row">
                <span>{country}</span>
                <span className="analytics-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visitors by Page */}
        <div className="analytics-section">
          <h3>Popular Pages</h3>
          <div className="analytics-table">
            {analytics.visitors_by_page.map(([page, count], index) => (
              <div key={index} className="analytics-row">
                <span>{page || 'Home'}</span>
                <span className="analytics-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Visitors */}
        <div className="analytics-section full-width">
          <h3>Recent Visitors</h3>
          <div className="analytics-table">
            <div className="analytics-header">
              <span>IP</span>
              <span>Country</span>
              <span>City</span>
              <span>Page</span>
              <span>Time</span>
            </div>
            {analytics.recent_visitors.slice(0, 10).map((visitor, index) => (
              <div key={index} className="analytics-row">
                <span>{visitor[1]?.substring(0, 12)}...</span>
                <span>{visitor[4] || 'Unknown'}</span>
                <span>{visitor[5] || 'Unknown'}</span>
                <span>{visitor[7] || 'Home'}</span>
                <span>{new Date(visitor[3]).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;