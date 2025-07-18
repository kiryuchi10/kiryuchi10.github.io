/**
 * API Status Checker Component
 * Development tool for testing API integrations with live backend
 */

import React, { useState, useEffect } from 'react';
import { runApiTests, quickApiCheck } from '../utils/apiTester';
import { useApiStatus } from '../hooks/useApiStatus';
import { ENV_INFO } from '../config/api';
import './ApiStatusChecker.css';

const ApiStatusChecker = ({ showInProduction = false }) => {
  const [testResults, setTestResults] = useState(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const apiStatus = useApiStatus({ checkOnMount: true, autoCheck: true });

  // Don't show in production unless explicitly enabled
  if (ENV_INFO.isProduction && !showInProduction) {
    return null;
  }

  const runTests = async () => {
    setIsRunningTests(true);
    try {
      const results = await runApiTests();
      setTestResults(results);
    } catch (error) {
      console.error('Failed to run API tests:', error);
    } finally {
      setIsRunningTests(false);
    }
  };

  const quickCheck = async () => {
    const status = await quickApiCheck();
    console.log('Quick check result:', status);
  };

  const getStatusColor = (isOnline) => {
    return isOnline ? '#4CAF50' : '#f44336';
  };

  const getStatusText = (isOnline) => {
    return isOnline ? 'Online' : 'Offline';
  };

  return (
    <div className="api-status-checker">
      <div className="api-status-header">
        <h3>API Status Monitor</h3>
        <div className="api-status-indicator">
          <div 
            className="status-dot"
            style={{ backgroundColor: getStatusColor(apiStatus.isOnline) }}
          />
          <span className="status-text">
            {apiStatus.isChecking ? 'Checking...' : getStatusText(apiStatus.isOnline)}
          </span>
        </div>
      </div>

      <div className="api-info">
        <div className="info-row">
          <strong>Environment:</strong> {ENV_INFO.current}
        </div>
        <div className="info-row">
          <strong>Backend URL:</strong> {ENV_INFO.RESOLVED_BASE_URL}
        </div>
        <div className="info-row">
          <strong>Last Checked:</strong> {
            apiStatus.lastChecked 
              ? new Date(apiStatus.lastChecked).toLocaleTimeString()
              : 'Never'
          }
        </div>
        {apiStatus.error && (
          <div className="info-row error">
            <strong>Error:</strong> {apiStatus.error}
          </div>
        )}
      </div>

      <div className="api-actions">
        <button 
          onClick={quickCheck}
          disabled={apiStatus.isChecking}
          className="btn btn-secondary"
        >
          Quick Check
        </button>
        <button 
          onClick={runTests}
          disabled={isRunningTests}
          className="btn btn-primary"
        >
          {isRunningTests ? 'Running Tests...' : 'Run Full Tests'}
        </button>
        <button 
          onClick={apiStatus.refresh}
          disabled={apiStatus.isChecking}
          className="btn btn-secondary"
        >
          Refresh Status
        </button>
      </div>

      {testResults && (
        <div className="test-results">
          <div className="results-header">
            <h4>Test Results</h4>
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="btn btn-link"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
          
          <div className="results-summary">
            <div className="summary-item">
              <span className="label">Total Tests:</span>
              <span className="value">{testResults.totalTests}</span>
            </div>
            <div className="summary-item">
              <span className="label">Passed:</span>
              <span className="value success">{testResults.passedTests}</span>
            </div>
            <div className="summary-item">
              <span className="label">Failed:</span>
              <span className="value error">{testResults.failedTests}</span>
            </div>
            <div className="summary-item">
              <span className="label">Success Rate:</span>
              <span className="value">{testResults.successRate}%</span>
            </div>
            <div className="summary-item">
              <span className="label">Duration:</span>
              <span className="value">{testResults.duration}</span>
            </div>
          </div>

          {showDetails && (
            <div className="results-details">
              {testResults.results.map((result, index) => (
                <div 
                  key={index} 
                  className={`result-item ${result.success ? 'success' : 'error'}`}
                >
                  <div className="result-header">
                    <span className="result-name">{result.name}</span>
                    <span className={`result-status ${result.success ? 'success' : 'error'}`}>
                      {result.success ? '✅' : '❌'}
                    </span>
                  </div>
                  <div className="result-message">{result.message}</div>
                  {result.error && (
                    <div className="result-error">Error: {result.error}</div>
                  )}
                  {result.data && (
                    <details className="result-data">
                      <summary>Data</summary>
                      <pre>{JSON.stringify(result.data, null, 2)}</pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="api-endpoints">
        <h4>Available Endpoints</h4>
        <ul>
          {Object.entries(ENV_INFO.ENDPOINTS).map(([name, path]) => (
            <li key={name}>
              <strong>{name}:</strong> {ENV_INFO.RESOLVED_BASE_URL}{path}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ApiStatusChecker;