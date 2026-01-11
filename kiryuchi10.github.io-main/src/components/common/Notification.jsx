/**
 * Notification Component
 * Displays success, error, and info messages to users
 */

import React, { useState, useEffect, useCallback } from 'react';
import './Notification.css';

const Notification = ({ 
  type = 'info', 
  title, 
  message, 
  details,
  duration = 4000,
  onClose,
  autoClose = true,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300); // Animation duration
  }, [onClose]);

  useEffect(() => {
    if (autoClose && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, handleClose]);

  if (!isVisible) return null;

  const typeClass = `notification--${type}`;
  const closingClass = isClosing ? 'notification--closing' : '';

  return (
    <div className={`notification ${typeClass} ${closingClass} ${className}`}>
      <div className="notification-content">
        {title && <div className="notification-title">{title}</div>}
        <div className="notification-message">{message}</div>
        {details && (
          <div className="notification-details">
            {Array.isArray(details) ? (
              <ul>
                {details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            ) : (
              <p>{details}</p>
            )}
          </div>
        )}
      </div>
      <button 
        className="notification-close"
        onClick={handleClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

/**
 * Notification Container for managing multiple notifications
 */
export const NotificationContainer = ({ notifications = [], onRemove }) => {
  return (
    <div className="notification-container">
      {notifications.map((notification, index) => (
        <Notification
          key={notification.id || index}
          {...notification}
          onClose={() => onRemove && onRemove(notification.id || index)}
        />
      ))}
    </div>
  );
};

export default Notification;