# Frontend API Configuration Guide

## Overview

This guide explains how to configure the frontend to use the production backend API URLs after the backend has been deployed to Render.

## Current Configuration Status

✅ **Completed:**
- API service layer with error handling and retry logic
- Environment-based URL configuration
- CORS handling for cross-origin requests
- Comprehensive error handling and fallback mechanisms
- API status monitoring and connection testing
- Production-ready request/response handling

⏳ **Pending Backend Deployment:**
- The backend needs to be deployed to Render first (Task 8)
- Once deployed, update the production URL in the configuration

## Configuration Files

### 1. Environment Configuration (`src/config/environment.js`)

This file contains the main backend URL configuration:

```javascript
export const BACKEND_URLS = {
  [ENV.DEVELOPMENT]: 'http://localhost:5000',
  [ENV.PRODUCTION]: 'https://portfolio-backend-1aqz.onrender.com', // Update this URL
  [ENV.TEST]: 'http://localhost:5000'
};
```

### 2. Environment Variables

#### Production (`.env.production`)
```
REACT_APP_API_URL=https://your-actual-backend-url.onrender.com
```

#### Development (`.env.development`)
```
REACT_APP_API_URL=http://localhost:5000
```

## How to Update After Backend Deployment

### Step 1: Get the Deployed Backend URL

After deploying the backend to Render (Task 8), you'll receive a URL like:
- `https://portfolio-backend-xyz123.onrender.com`

### Step 2: Update Configuration

**Option A: Update Environment Variable (Recommended)**
1. Update `.env.production`:
   ```
   REACT_APP_API_URL=https://your-actual-backend-url.onrender.com
   ```

**Option B: Update Configuration File**
1. Edit `src/config/environment.js`:
   ```javascript
   export const BACKEND_URLS = {
     [ENV.DEVELOPMENT]: 'http://localhost:5000',
     [ENV.PRODUCTION]: 'https://your-actual-backend-url.onrender.com',
     [ENV.TEST]: 'http://localhost:5000'
   };
   ```

### Step 3: Update Verification Script

Update `verify-api.js` with the actual backend URL:
```javascript
const API_BASE_URL = 'https://your-actual-backend-url.onrender.com';
```

### Step 4: Test the Configuration

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Run API verification:**
   ```bash
   node verify-api.js
   ```

3. **Test in browser:**
   - Open `public/test-api.html` in browser
   - Run all API tests
   - Verify all endpoints are working

## API Integration Status

### ✅ Implemented Features

1. **API Service Layer** (`src/services/apiService.js`)
   - Centralized API client with timeout handling
   - Automatic retry logic for failed requests
   - Proper error handling and user-friendly messages
   - Support for all required endpoints

2. **Error Handling** (`src/utils/errorHandler.js`)
   - Network error detection and handling
   - Timeout error handling
   - Rate limiting error handling
   - User-friendly error messages

3. **API Status Monitoring** (`src/hooks/useApiStatus.js`)
   - Real-time API connectivity monitoring
   - Automatic status checks
   - Connection health indicators

4. **Contact Form Integration** (`src/components/ContactForm.jsx`)
   - Real API integration with error handling
   - Fallback email option when API is unavailable
   - Form validation and user feedback

5. **Analytics Integration** (`src/components/Analytics.jsx`)
   - Real-time analytics data from backend
   - Graceful fallback when no data available
   - Loading states and error handling

6. **Visitor Tracking** (`src/components/VisitorTracker.jsx`)
   - Automatic visitor tracking on page loads
   - Manual tracking capabilities
   - Debug information for development

### 🧪 Testing Components

1. **API Status Checker** (`src/components/ApiStatusChecker.jsx`)
   - Visual API status indicator
   - Comprehensive endpoint testing
   - Real-time connection monitoring

2. **API Tester** (`src/utils/apiTester.js`)
   - Automated testing of all API endpoints
   - CORS configuration verification
   - Data structure validation

3. **Deployment Verifier** (`src/utils/deploymentVerifier.js`)
   - Complete deployment readiness check
   - Environment configuration validation
   - Production deployment verification

## CORS Configuration

The frontend is configured to work with the following CORS settings on the backend:

```python
# Backend CORS configuration
CORS_ORIGINS = "https://kiryuchi10.github.io"
```

Make sure the backend is configured with the correct frontend domain.

## Endpoints Used by Frontend

| Endpoint | Method | Purpose | Component |
|----------|--------|---------|-----------|
| `/api/health` | GET | Health check | API monitoring |
| `/api/analytics` | GET | Get visitor analytics | Analytics page |
| `/api/track-visit` | POST | Track page visits | Visitor tracking |
| `/api/contact` | POST | Send contact messages | Contact form |
| `/api/download-resume` | GET | Download resume file | Resume component |

## Error Handling Strategy

### Network Errors
- Display user-friendly messages
- Provide fallback options (e.g., email client for contact form)
- Show connection status indicators

### API Unavailable
- Graceful degradation to empty states
- Retry mechanisms with exponential backoff
- Clear messaging about service availability

### Rate Limiting
- Respect rate limits with appropriate delays
- Show rate limit messages to users
- Implement client-side throttling

## Testing Checklist

After updating the backend URL, verify:

- [ ] Health check endpoint responds correctly
- [ ] Analytics page loads real data (or shows empty state)
- [ ] Contact form sends emails successfully
- [ ] Visitor tracking works without errors
- [ ] CORS configuration allows frontend requests
- [ ] Error handling works for various scenarios
- [ ] Loading states display correctly
- [ ] Fallback mechanisms work when API is down

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Verify backend CORS_ORIGINS includes frontend domain
   - Check that requests include proper headers

2. **404 Errors**
   - Verify backend URL is correct and accessible
   - Check that all endpoints are properly configured

3. **Timeout Errors**
   - Backend may be slow to start (Render free tier)
   - Increase timeout values if necessary

4. **SSL/HTTPS Issues**
   - Ensure backend uses HTTPS in production
   - Verify SSL certificates are valid

### Debug Tools

1. **Browser Console**
   - Check for network errors
   - Monitor API request/response logs

2. **API Status Checker**
   - Use the built-in API status checker component
   - Available in development mode

3. **Verification Scripts**
   - Run `node verify-api.js` for command-line testing
   - Open `public/test-api.html` for browser-based testing

## Next Steps

1. **Complete Backend Deployment** (Task 8)
   - Deploy backend to Render
   - Configure environment variables
   - Test all endpoints

2. **Update Frontend Configuration**
   - Update production API URL
   - Test all integrations
   - Verify CORS configuration

3. **End-to-End Testing** (Task 10)
   - Test complete user workflows
   - Verify error scenarios
   - Validate production performance

## Support

If you encounter issues:
1. Check browser console for errors
2. Run the verification scripts
3. Test individual endpoints manually
4. Verify environment variables are set correctly
5. Check backend logs for server-side issues