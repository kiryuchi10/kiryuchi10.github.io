/**
 * Loading Spinner Component
 * Reusable loading indicator with customizable size and message
 */

import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  message = 'Loading...', 
  showMessage = true,
  className = '' 
}) => {
  const sizeClass = `loading-spinner--${size}`;
  
  return (
    <div className={`loading-spinner-container ${className}`}>
      <div className={`loading-spinner ${sizeClass}`}>
        <div className="spinner"></div>
      </div>
      {showMessage && (
        <div className="loading-message">
          {message}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;