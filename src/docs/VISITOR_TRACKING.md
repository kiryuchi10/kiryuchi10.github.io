# Visitor Tracking Implementation

## Overview

This document describes the visitor tracking implementation for the portfolio website. The system automatically tracks page visits and sends visitor data to the backend for analytics purposes.

## Features

### Automatic Tracking
- **Page Load Tracking**: Automatically tracks when users visit any page
- **Route Change Tracking**: Tracks navigation between pages in the SPA
- **Browser Navigation**: Handles back/forward button navigation
- **Error Handling**: Gracefully handles tracking failures without affecting user experience

### Data Collection
The system collects the following visitor information:
- Page visited (pathname)
- Referrer URL
- User agent string
- Browser language
- Timezone
- Screen resolution
- Viewport size
- Timestamp
- Connection information (if available)
- Performance metrics (page load time)

### Enhanced Features
- **Bot Detection**: Identifies and flags bot traffic
- **Location Tracking**: Optional geolocation (with user consent)
- **Data Validation**: Validates and sanitizes all tracking data
- **Privacy Compliance**: Respects user privacy and tracking preferences

## Implementation

### Core Components

#### 1. useVisitorTracking Hook
```javascript
import { useVisitorTracking } from './hooks/useVisitorTracking';

function App() {
  useVisitorTracking({
    trackOnMount: true,
    trackPageChanges: true,
    enableDebug: process.env.NODE_ENV === 'development'
  });
}
```

#### 2. API Service Integration
```javascript
// Automatic tracking via apiService.trackVisit()
await apiService.trackVisit(visitData);
```

#### 3. Utility Functions
```javascript
import { 
  createEnhancedVisitorData,
  validateVisitorData,
  sanitizeVisitorData 
} from './utils/visitorTrackingUtils';
```

### Configuration

#### Environment Variables
```bash
# Development - disable tracking by default
REACT_APP_ENABLE_TRACKING=false

# Production - tracking enabled automatically
NODE_ENV=production
```

#### API Configuration
```javascript
// src/config/api.js
export const API_CONFIG = {
  ENDPOINTS: {
    TRACK_VISIT: '/api/track-visit'
  }
};
```

## Usage

### Basic Usage
The visitor tracking is automatically enabled when the app loads. No additional setup is required.

### Manual Tracking
```javascript
const { trackVisit, trackPageView } = useVisitorTracking();

// Track custom event
await trackVisit({ event: 'button_click', button: 'download' });

// Track specific page view
await trackPageView('/custom-page');
```

### Debug Mode
Enable debug mode in development to see tracking activity:
```javascript
useVisitorTracking({
  enableDebug: true
});
```

## Privacy and Compliance

### Data Collection
- No personally identifiable information (PII) is collected
- IP address is handled by the backend, not stored in frontend
- Location data requires explicit user consent
- All data is anonymized and aggregated

### User Control
- Tracking can be disabled via environment variables
- Bot traffic is automatically filtered
- Graceful degradation when tracking fails

### Data Retention
- Visitor data is stored for analytics purposes only
- Data retention policies are managed by the backend
- Users can request data deletion through contact form

## Error Handling

### Graceful Degradation
- Tracking failures do not affect user experience
- Silent error handling with optional debug logging
- Automatic retry logic for transient failures
- Fallback to basic tracking if enhanced features fail

### Common Issues
1. **Backend Unavailable**: Tracking fails silently, app continues normally
2. **Network Issues**: Requests timeout gracefully without blocking UI
3. **Invalid Data**: Data validation prevents sending malformed requests
4. **Bot Detection**: Automated traffic is flagged and can be filtered

## Testing

### Unit Tests
```bash
npm test -- visitorTracking.test.js
```

### Integration Testing
1. Enable debug mode in development
2. Navigate between pages
3. Check browser console for tracking logs
4. Verify data in backend analytics

### Debug Component
The `VisitorTracker` component provides real-time debugging:
- Shows current tracking status
- Displays collected data
- Manual tracking controls
- API connectivity status

## Performance

### Optimization
- Minimal performance impact on page loads
- Asynchronous tracking calls
- Data validation prevents oversized requests
- Efficient React Router integration

### Monitoring
- Track success/failure rates
- Monitor API response times
- Debug component for real-time status
- Error logging for troubleshooting

## Security

### Data Sanitization
- All user inputs are sanitized before transmission
- Field length limits prevent abuse
- Only allowed fields are transmitted
- XSS prevention through data validation

### Privacy Protection
- No sensitive data collection
- Optional location tracking with consent
- Bot detection and filtering
- Compliance with privacy regulations

## Future Enhancements

### Planned Features
- A/B testing integration
- Custom event tracking
- User session tracking
- Advanced analytics dashboard
- GDPR compliance tools

### Configuration Options
- Configurable tracking intervals
- Custom data fields
- Advanced filtering options
- Integration with analytics platforms

## Troubleshooting

### Common Issues
1. **Tracking Not Working**: Check API configuration and backend connectivity
2. **Debug Info Not Showing**: Ensure development environment and debug flag enabled
3. **Data Not Appearing**: Verify backend endpoint and database connectivity
4. **Performance Issues**: Check for excessive tracking calls or large data payloads

### Debug Steps
1. Enable debug mode: `enableDebug: true`
2. Check browser console for tracking logs
3. Verify API endpoints are accessible
4. Test with VisitorTracker debug component
5. Check backend logs for received data

## Support

For issues or questions about visitor tracking:
1. Check this documentation
2. Review debug logs
3. Test with debug component
4. Contact development team

---

*Last updated: July 2025*