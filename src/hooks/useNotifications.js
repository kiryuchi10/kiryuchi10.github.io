/**
 * Notifications Hook
 * Manages notification state and provides utilities for showing/hiding notifications
 */

import { useState, useCallback } from 'react';
import { createErrorNotification } from '../utils/errorHandler';

let notificationId = 0;

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = ++notificationId;
    const newNotification = {
      id,
      ...notification,
      timestamp: Date.now()
    };

    setNotifications(prev => [...prev, newNotification]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Convenience methods for different notification types
  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({
      type: 'success',
      title: 'Success',
      message,
      duration: 3000,
      ...options
    });
  }, [addNotification]);

  const showError = useCallback((message, options = {}) => {
    return addNotification({
      type: 'error',
      title: 'Error',
      message,
      duration: 5000,
      ...options
    });
  }, [addNotification]);

  const showWarning = useCallback((message, options = {}) => {
    return addNotification({
      type: 'warning',
      title: 'Warning',
      message,
      duration: 4000,
      ...options
    });
  }, [addNotification]);

  const showInfo = useCallback((message, options = {}) => {
    return addNotification({
      type: 'info',
      title: 'Info',
      message,
      duration: 4000,
      ...options
    });
  }, [addNotification]);

  // Show error from API error object
  const showApiError = useCallback((errorInfo) => {
    const notification = createErrorNotification(errorInfo);
    return addNotification(notification);
  }, [addNotification]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showApiError
  };
};

export default useNotifications;