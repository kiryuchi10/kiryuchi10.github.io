# 🚨 Deployment Fix Guide

## Critical Issues Found

Based on your `.env` file and Render dashboard, here are the issues that need immediate attention:

## 1. 📧 Email Configuration (CRITICAL)

### Current Issues:
```env
SENDER_EMAIL=your-email@gmail.com  # ❌ Placeholder email
SENDER_PASSWORD=nshszkgtucjhason   # ❌ Invalid app password
```

### ✅ How to Fix:

#### Step 1: Get Gmail App Password
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click "Security" → "2-Step Verification" (enable if not already)
3. Click "App passwords"
4. Generate new app password for "Mail"
5. Copy the 16-character password (like: `abcd efgh ijkl mnop`)

#### Step 2: Update Your .env File
```env
SENDER_EMAIL=donghyeunlee1@gmail.com
SENDER_PASSWORD=your-16-character-app-password
```

#### Step 3: Set in Render Dashboard
1. Go to your Render service dashboard
2. Click "Environment" tab
3. Add these variables:
   - `SENDER_EMAIL` = `donghyeunlee1@gmail.com`
   - `SENDER_PASSWORD` = `your-16-character-app-password`

## 2. 🔧 Render Service Configuration

### Current Issues:
- **Runtime**: Node (should be Python)
- **Status**: Failed deploy
- **Build**: Not configured for Python backend

### ✅ How to Fix:

#### Check Your render.yaml:
```yaml
services:
  - type: web
    name: portfolio-backend
    env: python  # ✅ Should be python, not node
    region: oregon
    plan: free
    buildCommand: pip install -r backend/requirements.txt
    startCommand: python backend/start.py
    
    envVars:
      - key: FLASK_ENV
        value: production
      - key: DATABASE_URL
        value: sqlite:////opt/render/project/data/portfolio.db
      - key: SENDER_EMAIL
        sync: false  # Set manually in dashboard
      - key: SENDER_PASSWORD
        sync: false  # Set manually in dashboard
      - key: RECIPIENT_EMAIL
        value: donghyeunlee1@gmail.com
      - key: SECRET_KEY
        generateValue: true
      - key: CORS_ORIGINS
        value: https://kiryuchi10.github.io
    
    disk:
      name: portfolio-data
      mountPath: /opt/render/project/data
      sizeGB: 1
```

## 3. 🗂️ File Structure Check

### Ensure these files exist:
```
kiryuchi10.github.io/
├── render.yaml                    # ✅ Root level
├── backend/
│   ├── requirements.txt           # ✅ Must exist
│   ├── start.py                   # ✅ Entry point
│   ├── app.py                     # ✅ Flask app
│   ├── database.py                # ✅ DB config
│   └── .env                       # ✅ Local config
```

## 4. 📦 Dependencies Check

### Verify requirements.txt:
```txt
Flask==2.3.3
Flask-CORS==4.0.0
requests==2.31.0
python-dotenv==1.0.0
gunicorn==21.2.0
PyMySQL==1.1.0
```

## 5. 🔐 Environment Variables Checklist

### Required in Render Dashboard:

| Variable | Value | Status |
|----------|-------|--------|
| `FLASK_ENV` | `production` | ✅ Set in render.yaml |
| `DATABASE_URL` | `sqlite:////opt/render/project/data/portfolio.db` | ✅ Set in render.yaml |
| `SENDER_EMAIL` | `donghyeunlee1@gmail.com` | ❌ **MUST SET MANUALLY** |
| `SENDER_PASSWORD` | `your-app-password` | ❌ **MUST SET MANUALLY** |
| `RECIPIENT_EMAIL` | `donghyeunlee1@gmail.com` | ✅ Set in render.yaml |
| `SECRET_KEY` | Auto-generated | ✅ Set in render.yaml |
| `CORS_ORIGINS` | `https://kiryuchi10.github.io` | ✅ Set in render.yaml |

## 6. 🚀 Deployment Steps

### Step-by-Step Fix:

1. **Fix Gmail App Password** (see section 1 above)

2. **Update Render Environment Variables**:
   ```bash
   # Go to Render Dashboard → Your Service → Environment
   # Add these manually:
   SENDER_EMAIL=donghyeunlee1@gmail.com
   SENDER_PASSWORD=your-16-character-app-password
   ```

3. **Verify render.yaml** (should be in root directory):
   ```yaml
   services:
     - type: web
       name: portfolio-backend
       env: python  # ← Make sure this is python, not node
   ```

4. **Test Locally First**:
   ```bash
   cd kiryuchi10.github.io/backend
   python test_render_deployment.py
   # Should show: 🎉 All tests passed! Ready for Render deployment.
   ```

5. **Deploy to Render**:
   ```bash
   git add .
   git commit -m "Fix deployment configuration"
   git push origin main
   ```

6. **Monitor Deployment**:
   - Watch Render dashboard for build logs
   - Check for any error messages
   - Verify service starts successfully

## 7. 🔍 Troubleshooting Common Issues

### Issue: "No module named 'flask'"
**Solution**: Check `requirements.txt` exists in `backend/` folder

### Issue: "Database connection failed"
**Solution**: Verify `DATABASE_URL` points to persistent disk path

### Issue: "CORS error"
**Solution**: Verify `CORS_ORIGINS=https://kiryuchi10.github.io`

### Issue: "Email sending failed"
**Solution**: 
1. Verify Gmail App Password is correct
2. Check 2-Step Verification is enabled
3. Use actual Gmail address, not placeholder

## 8. 📋 Pre-Deployment Checklist

- [ ] Gmail App Password generated and copied
- [ ] `SENDER_EMAIL` updated in Render dashboard
- [ ] `SENDER_PASSWORD` updated in Render dashboard
- [ ] `render.yaml` has `env: python`
- [ ] `requirements.txt` exists in `backend/` folder
- [ ] Local tests pass: `python test_render_deployment.py`
- [ ] All files committed and pushed to GitHub
- [ ] Render service configured with persistent disk

## 9. 🎯 Expected Results After Fix

### Successful Deployment Should Show:
```
==> Build successful 🎉
==> Deploying...
==> Running 'python backend/start.py'
=== Portfolio Backend Startup ===
Starting in production mode...
Environment validation completed successfully
Database initialized successfully
* Running on all addresses (0.0.0.0)
* Running on https://your-app.render.com
```

### Your API Should Respond:
- `https://your-app.render.com/api/health` → 200 OK
- `https://your-app.render.com/api/analytics` → 200 OK
- Contact form should send emails successfully

## 10. 🆘 If Still Failing

### Check Render Logs:
1. Go to Render Dashboard → Your Service → Logs
2. Look for specific error messages
3. Common issues:
   - Import errors → Check `requirements.txt`
   - Database errors → Check persistent disk configuration
   - Email errors → Check Gmail App Password

### Get Help:
1. Copy the exact error message from Render logs
2. Check the `BACKEND_DEBUGGING_GUIDE.md` for similar issues
3. Run local tests to isolate the problem

---

## 🎉 Success Indicators

When everything is working correctly, you should see:
- ✅ Render deployment status: "Live"
- ✅ Your frontend can call backend APIs
- ✅ Contact form sends emails successfully
- ✅ Database stores visitor data
- ✅ All API endpoints respond correctly

**Remember**: The most critical fix is getting a real Gmail App Password and setting it in Render's environment variables!