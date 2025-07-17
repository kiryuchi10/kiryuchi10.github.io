import React, { useState, useEffect } from 'react';
import './Analytics.css';

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock analytics data for demonstration
  const mockAnalytics = {
    total_visitors: 1247,
    github_users: 89,
    total_messages: 23,
    visitors_by_country: [
      ['South Korea', 456],
      ['United States', 234],
      ['Japan', 178],
      ['Germany', 123],
      ['Canada', 89],
      ['United Kingdom', 67],
      ['Australia', 45],
      ['France', 34],
      ['Singapore', 21]
    ],
    visitors_by_page: [
      ['/', 567],
      ['/projects', 289],
      ['/profile', 234],
      ['/blog', 89],
      ['/contact', 68]
    ],
    recent_visitors: [
      ['visitor1', '192.168.1.1', new Date().toISOString(), 'Seoul', 'South Korea', null, '/', 'https://google.com'],
      ['visitor2', '10.0.0.1', new Date(Date.now() - 3600000).toISOString(), 'Tokyo', 'Japan', 'GitHub User', '/projects', 'https://github.com'],
      ['visitor3', '172.16.0.1', new Date(Date.now() - 7200000).toISOString(), 'New York', 'United States', null, '/profile', 'direct'],
      ['visitor4', '203.0.113.1', new Date(Date.now() - 10800000).toISOString(), 'London', 'United Kingdom', null, '/blog', 'https://linkedin.com'],
      ['visitor5', '198.51.100.1', new Date(Date.now() - 14400000).toISOString(), 'Berlin', 'Germany', 'GitHub User', '/contact', 'https://twitter.com']
    ]
  };

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setAnalytics(mockAnalytics);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div className="analytics-container" data-time={currentTime}>
      <div className="demo-badge">Demo Mode</div>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ 
          background: '#f8f9fa', 
          padding: '0.75rem 1.5rem', 
          borderRadius: '25px', 
          display: 'inline-block',
          color: '#666',
          fontSize: '0.9rem',
          marginBottom: '1rem'
        }}>
          📅 Last updated: {currentTime}
        </div>
      </div>
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