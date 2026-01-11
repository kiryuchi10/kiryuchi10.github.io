# Netlify Setup Guide - Fix Analytics & Contact Form

This guide will help you fix the analytics and contact form issues on your Netlify-deployed portfolio.

## 🚨 Current Issue

Your portfolio is trying to connect to `localhost:5000` for the backend API, but Netlify doesn't have access to your local backend. This causes:
- ❌ Contact form failures
- ❌ Analytics not loading
- ❌ Visit tracking not working

## ✅ Solution: Netlify Functions + Optional Full Backend

I've set up **Netlify Functions** as a fallback solution that will work immediately, plus instructions for a full backend deployment.

## 🚀 Quick Fix (5 minutes)

### Step 1: Deploy with Netlify Functions

1. **Run the deployment script:**
   ```bash
   # On Windows
   deploy-netlify.bat
   
   # On Mac/Linux
   ./deploy-netlify.sh
   ```

2. **Set environment variables in Netlify:**
   - Go to your Netlify dashboard
   - Navigate to Site settings → Environment variables
   - Add these variables:
     ```
     SENDER_EMAIL = your-gmail@gmail.com
     SENDER_PASSWORD = your-gmail-app-password
     RECIPIENT_EMAIL = donghyeunlee1@gmail.com
     ```

### Step 2: Set up Gmail App Password

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Security → 2-Step Verification (enable if not already)
3. App passwords → Generate password for "Mail"
4. Use this password as `SENDER_PASSWORD`

### Step 3: Test Your Site

- ✅ Contact form should work
- ✅ Analytics should show basic data
- ✅ No more connection errors

## 🔧 What I've Fixed

### 1. Created Netlify Functions
- `netlify/functions/contact.js` - Handles contact form submissions
- `netlify/functions/analytics.js` - Provides basic analytics data
- `netlify/functions/track-visit.js` - Tracks page visits
- `netlify/functions/health.js` - Health check endpoint

### 2. Updated Configuration
- `netlify.toml` - Redirects API calls to functions
- `src/config/environment.js` - Uses Netlify Functions in production
- CORS headers properly configured

### 3. Added Deployment Scripts
- `deploy-netlify.bat` (Windows)
- `deploy-netlify.sh` (Mac/Linux)

## 🎯 Advanced Setup (Full Backend)

For complete functionality with database persistence:

### Option 1: Deploy to Render (Free)

1. **Follow the guide:** `BACKEND_DEPLOYMENT_GUIDE.md`
2. **Update environment:** Set `REACT_APP_API_URL` in Netlify
3. **Benefits:** Full database, advanced analytics, better performance

### Option 2: Use Railway/Heroku

Similar process to Render, just different platform.

## 🔍 Troubleshooting

### Contact Form Not Working
```bash
# Check Netlify function logs
netlify functions:log contact

# Common issues:
- Gmail credentials incorrect
- 2FA not enabled
- App password not generated
```

### Analytics Not Loading
```bash
# Check if functions are deployed
netlify functions:list

# Should show: contact, analytics, track-visit, health
```

### CORS Errors
- Ensure your domain matches exactly in CORS settings
- Check browser console for specific error messages

## 📊 Current Functionality

### ✅ Working Now (Netlify Functions)
- Contact form with email notifications
- Basic analytics display
- Visit tracking (logged to console)
- Health checks

### 🚀 Available with Full Backend
- Database persistence
- Advanced analytics
- User tracking
- Resume downloads
- A/B testing features

## 🎉 Success Checklist

- [ ] Netlify Functions deployed
- [ ] Environment variables set
- [ ] Gmail App Password configured
- [ ] Contact form tested
- [ ] Analytics page loads
- [ ] No console errors

## 📞 Support

If you encounter issues:
1. Check Netlify function logs
2. Verify environment variables
3. Test Gmail credentials
4. Check browser console for errors

Your portfolio should now work perfectly with the contact form and analytics! 🎉