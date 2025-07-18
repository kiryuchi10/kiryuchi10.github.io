# API Configuration and Services

This directory contains the frontend API configuration, service layer, and utilities for communicating with the backend.

## Overview

The API configuration provides:
- Environment-based URL configuration
- Centralized API service layer
- Error handling utilities
- React hooks for common API operations
- Reusable UI components for loading and error states

## Quick Start

### Basic API Usage

```javascript
import { apiService } from './services';

// Send contact form
try {
  const response = await apiService.sendContactMessage({
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Hello',
    message: 'Test message'
  });
  console.log('Message sent successfully');
} catch (error) {
  console.error('Failed to send message:', error.message);
}

// Get analytics data
try {
  const analytics = await apiService.getAnalytics();
  console.log('Analytics:', analytics);
} catch (error) {
  console.error('Failed to fetch analytics:', error.message);
}
```

### Using React Hooks

```javascript
import { useAnalytics, useContactForm, useNotifications } from './services';

function MyComponent() {
  const { data, loading, error, refresh } = useAnalytics();
  const { showSuccess, showError } = useNotifications();
  
  const contactForm = useContactForm(
    (response) => showSuccess('Message sent successfully!'),
    (error) => showError(error.message)
  );

  // Component logic...
}
```

## Configuration

### Environment Variables

Set these environment variables for different environments:

```bash
# Development
REACT_APP_API_URL=http://localhost:5000

# Production
REACT_APP_API_URL=https://your-backend.onrender.com
```

### API Configuration

The API configuration automatically detects the environment and uses appropriate URLs:

```javascript
import { API_CONFIG } from './config/api';

console.log('API Base URL:', API_CONFIG.BASE_URL);
console.log('Available endpoints:', API_CONFIG.ENDPOINTS);
```

## Services

### apiService

Main service for API communication:

- `sendContactMessage(data)` - Send contact form
- `getAnalytics()` - Fetch analytics data
- `trackVisit(data)` - Track visitor information
- `downloadResume()` - Download resume file
- `healthCheck()` - Check API health
- `testConnection()` - Test API connectivity

### Error Handling

Automatic error handling with user-friendly messages:

```javascript
import { handleApiError, ERROR_TYPES } from './utils/errorHandler';

try {
  await apiService.getAnalytics();
} catch (error) {
  const errorInfo = handleApiError(error, 'Analytics Fetch');
  // Error is automatically logged and parsed
}
```

## React Hooks

### useAnalytics

Manages analytics data fetching:

```javascript
const {
  data,           // Formatted analytics data
  loading,        // Loading state
  error,          // Error state
  lastFetched,    // Last fetch timestamp
  refresh,        // Manual refresh function
  isEmpty         // True if no data available
} = useAnalytics({
  autoFetch: true,        // Fetch on mount
  refreshInterval: 30000, // Auto-refresh every 30s
  onError: (error) => console.error(error)
});
```

### useContactForm

Manages contact form state and submission:

```javascript
const {
  formData,       // Form field values
  errors,         // Validation errors
  isSubmitting,   // Submission state
  updateField,    // Update field function
  submitForm,     // Submit function
  resetForm,      // Reset function
  isValid         // Form validity
} = useContactForm(
  (response) => console.log('Success:', response),
  (error) => console.error('Error:', error)
);
```

### useVisitorTracking

Automatic visitor tracking:

```javascript
const { trackVisit, trackPageView } = useVisitorTracking({
  trackOnMount: true,      // Track on component mount
  trackPageChanges: true,  // Track SPA navigation
  enableDebug: false       // Debug logging
});

// Manual tracking
trackVisit({ customData: 'value' });
trackPageView('/custom-page');
```

### useNotifications

Notification management:

```javascript
const {
  notifications,        // Current notifications
  showSuccess,         // Show success message
  showError,           // Show error message
  showWarning,         // Show warning message
  showInfo,            // Show info message
  showApiError,        // Show API error
  removeNotification,  // Remove specific notification
  clearNotifications   // Clear all notifications
} = useNotifications();
```

### useApiStatus

API connectivity monitoring:

```javascript
const {
  isOnline,       // API connectivity status
  isChecking,     // Currently checking status
  lastChecked,    // Last check timestamp
  error,          // Connection error
  checkStatus,    // Manual status check
  refresh         // Alias for checkStatus
} = useApiStatus({
  checkInterval: 30000,  // Check every 30s
  checkOnMount: true,    // Check on mount
  autoCheck: false       // Enable automatic checking
});
```

## Components

### LoadingSpinner

Reusable loading indicator:

```javascript
import { LoadingSpinner } from './services';

<LoadingSpinner 
  size="large" 
  message="Loading analytics..." 
  showMessage={true}
/>
```

### ErrorBoundary

Error boundary for graceful error handling:

```javascript
import { ErrorBoundary } from './services';

<ErrorBoundary fallback={<div>Custom error UI</div>}>
  <MyComponent />
</ErrorBoundary>
```

### Notification

Display notifications to users:

```javascript
import { Notification, NotificationContainer } from './services';

<NotificationContainer 
  notifications={notifications}
  onRemove={removeNotification}
/>
```

## Error Handling

The system provides comprehensive error handling:

1. **Network Errors** - Connection issues, timeouts
2. **Server Errors** - 5xx status codes
3. **Validation Errors** - 400 status codes with details
4. **Rate Limiting** - 429 status codes
5. **Not Found** - 404 status codes

All errors are automatically:
- Logged to console with context
- Parsed into user-friendly messages
- Categorized by type for appropriate handling

## Best Practices

1. **Always handle errors gracefully**
2. **Use loading states for better UX**
3. **Implement fallback UI when API is unavailable**
4. **Don't let visitor tracking errors break the app**
5. **Use environment variables for configuration**
6. **Test both online and offline scenarios**

## Testing

Test API integration:

```javascript
import { apiService } from './services';

// Test API connectivity
const isOnline = await apiService.testConnection();
console.log('API is online:', isOnline);

// Test specific endpoints
try {
  await apiService.healthCheck();
  console.log('Health check passed');
} catch (error) {
  console.error('Health check failed:', error);
}
```