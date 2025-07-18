/**
 * API Services Index
 * Central export point for all API-related services and utilities
 */

// Main API service
export { default as apiService, apiUtils, checkApiStatus } from './apiService';

// Configuration
export { API_CONFIG, DEFAULT_REQUEST_CONFIG, ENV_INFO } from '../config/api';

// Error handling utilities
export {
  ERROR_TYPES,
  ERROR_MESSAGES,
  parseError,
  logError,
  createErrorNotification,
  handleApiError,
  retryApiCall
} from '../utils/errorHandler';

// React hooks
export { default as useApiStatus } from '../hooks/useApiStatus';
export { default as useNotifications } from '../hooks/useNotifications';
export { default as useContactForm } from '../hooks/useContactForm';
export { default as useAnalytics } from '../hooks/useAnalytics';
export { default as useVisitorTracking } from '../hooks/useVisitorTracking';

// Components
export { default as LoadingSpinner } from '../components/common/LoadingSpinner';
export { default as ErrorBoundary } from '../components/common/ErrorBoundary';
export { default as Notification, NotificationContainer } from '../components/common/Notification';