@echo off
echo 🚀 Deploying Portfolio to Netlify...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Run this script from the project root.
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Install Netlify Functions dependencies
echo 📦 Installing Netlify Functions dependencies...
cd netlify\functions
call npm install
cd ..\..

REM Build the project
echo 🔨 Building project...
call npm run build

REM Check if Netlify CLI is installed
netlify --version >nul 2>&1
if errorlevel 1 (
    echo 📥 Installing Netlify CLI...
    call npm install -g netlify-cli
)

REM Deploy to Netlify
echo 🌐 Deploying to Netlify...
call netlify deploy --prod --dir=build

echo ✅ Deployment complete!
echo.
echo 📋 Next Steps:
echo 1. Set environment variables in Netlify dashboard:
echo    - SENDER_EMAIL: your-gmail@gmail.com
echo    - SENDER_PASSWORD: your-gmail-app-password
echo    - RECIPIENT_EMAIL: donghyeunlee1@gmail.com
echo.
echo 2. Test your functions at: https://your-site.netlify.app/test-functions.html
echo 3. Check your live site analytics and contact form
echo.
echo 🔧 Troubleshooting:
echo - If contact form fails, check Gmail App Password setup
echo - If CORS errors occur, check browser console
echo - Functions logs available in Netlify dashboard
echo.
echo 📖 See NETLIFY_SETUP_GUIDE.md for detailed instructions

pause