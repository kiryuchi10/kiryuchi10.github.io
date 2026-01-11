# Backend Deployment Guide

This guide will help you deploy your Flask backend to get full analytics and contact form functionality.

## Option 1: Deploy to Render (Recommended - Free Tier Available)

### Step 1: Prepare Backend for Deployment

1. Create a `requirements.txt` file in the `backend` directory:
```txt
Flask==2.3.3
Flask-CORS==4.0.0
python-dotenv==1.0.0
requests==2.31.0
PyMySQL==1.1.0
```

2. Create a `start.py` file in the `backend` directory:
```python
from app import app
import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
```

### Step 2: Deploy to Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `portfolio-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python start.py`
   - **Root Directory**: `backend`

### Step 3: Set Environment Variables

In Render dashboard, add these environment variables:
- `FLASK_ENV`: `production`
- `SENDER_EMAIL`: `your-gmail@gmail.com`
- `SENDER_PASSWORD`: `your-app-password` (Gmail App Password)
- `RECIPIENT_EMAIL`: `donghyeunlee1@gmail.com`
- `CORS_ORIGINS`: `https://kiryuchi10.github.io`
- `SECRET_KEY`: `your-secret-key-here`

### Step 4: Update Frontend Configuration

1. Get your Render service URL (e.g., `https://portfolio-backend-xyz.onrender.com`)
2. Update `src/config/environment.js`:
```javascript
export const BACKEND_URLS = {
  [ENV.DEVELOPMENT]: 'http://localhost:5000',
  [ENV.PRODUCTION]: 'https://your-render-url.onrender.com',
  [ENV.TEST]: 'http://localhost:5000'
};
```

### Step 5: Set Netlify Environment Variables

In your Netlify dashboard, add:
- `REACT_APP_API_URL`: `https://your-render-url.onrender.com`

## Option 2: Use Netlify Functions (Current Fallback)

The current setup uses Netlify Functions as a fallback. To configure:

### Step 1: Set Netlify Environment Variables

In your Netlify dashboard, add:
- `SENDER_EMAIL`: `your-gmail@gmail.com`
- `SENDER_PASSWORD`: `your-app-password`
- `RECIPIENT_EMAIL`: `donghyeunlee1@gmail.com`

### Step 2: Enable Gmail App Passwords

1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password for "Mail"
4. Use this password in `SENDER_PASSWORD`

## Testing Your Deployment

1. **Contact Form**: Fill out and submit the contact form
2. **Analytics**: Check if the analytics page loads
3. **Visit Tracking**: Navigate between pages to test tracking

## Troubleshooting

### Contact Form Issues
- Check Netlify function logs
- Verify email credentials
- Test with a simple email first

### Analytics Issues
- Check if backend is deployed and accessible
- Verify CORS configuration
- Check browser console for errors

### CORS Issues
- Ensure `CORS_ORIGINS` matches your domain exactly
- Check that all API endpoints return proper CORS headers

## Current Status

✅ **Netlify Functions**: Basic contact form and analytics fallback
⏳ **Full Backend**: Deploy to Render for complete functionality
⏳ **Database**: Set up MySQL/PostgreSQL for persistent data

## Next Steps

1. Deploy backend to Render
2. Set up production database
3. Update environment variables
4. Test all functionality
5. Monitor performance and errors