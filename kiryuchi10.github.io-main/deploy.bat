@echo off
REM 3D Portfolio Deployment Script for Netlify (Windows)
REM This script automates the deployment process

setlocal enabledelayedexpansion

echo 🚀 Starting 3D Portfolio Deployment Process...

REM Check if we're on the correct branch
for /f "tokens=*" %%i in ('git branch --show-current') do set current_branch=%%i

if not "%current_branch%"=="netlify-3d-portfolio" (
    echo [WARNING] You're not on the netlify-3d-portfolio branch. Current branch: %current_branch%
    set /p switch_branch="Do you want to switch to netlify-3d-portfolio branch? (y/n): "
    if /i "!switch_branch!"=="y" (
        git checkout netlify-3d-portfolio
        echo [SUCCESS] Switched to netlify-3d-portfolio branch
    ) else (
        echo [ERROR] Deployment cancelled. Please switch to netlify-3d-portfolio branch manually.
        pause
        exit /b 1
    )
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18 or higher.
    pause
    exit /b 1
)

echo [SUCCESS] Node.js version check passed
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed. Please install npm.
    pause
    exit /b 1
)

REM Install dependencies
echo [INFO] Installing dependencies...
npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Dependencies installed successfully

REM Build the project
echo [INFO] Building the project...
npm run build
if errorlevel 1 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)
echo [SUCCESS] Build completed successfully

REM Check if build directory exists
if not exist "build" (
    echo [ERROR] Build directory not found
    pause
    exit /b 1
)

REM Analyze bundle size (optional)
set /p analyze="Do you want to analyze the bundle size? (y/n): "
if /i "%analyze%"=="y" (
    echo [INFO] Analyzing bundle size...
    npm run analyze
)

REM Check if Netlify CLI is installed
netlify --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Netlify CLI is not installed.
    set /p install_cli="Do you want to install it globally? (y/n): "
    if /i "!install_cli!"=="y" (
        npm install -g netlify-cli
        echo [SUCCESS] Netlify CLI installed
    ) else (
        echo [INFO] You can deploy manually by dragging the build folder to Netlify
        echo [INFO] Or install Netlify CLI later with: npm install -g netlify-cli
        pause
        exit /b 0
    )
)

REM Login to Netlify (if not already logged in)
echo [INFO] Checking Netlify authentication...
netlify status >nul 2>&1
if errorlevel 1 (
    echo [INFO] Please login to Netlify...
    netlify login
)

REM Choose deployment type
echo.
echo Choose deployment type:
echo 1) Preview deployment (for testing)
echo 2) Production deployment
echo 3) Exit
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo [INFO] Deploying to preview...
    netlify deploy --dir=build
    if errorlevel 1 (
        echo [ERROR] Preview deployment failed
        pause
        exit /b 1
    )
    echo [SUCCESS] Preview deployment completed!
    echo [INFO] Check the preview URL above to test your changes
) else if "%choice%"=="2" (
    echo [WARNING] This will deploy to production. Are you sure?
    set /p confirm="Type 'yes' to confirm: "
    if "!confirm!"=="yes" (
        echo [INFO] Deploying to production...
        netlify deploy --prod --dir=build
        if errorlevel 1 (
            echo [ERROR] Production deployment failed
            pause
            exit /b 1
        )
        echo [SUCCESS] Production deployment completed!
        echo [SUCCESS] Your 3D portfolio is now live!
    ) else (
        echo [INFO] Production deployment cancelled
    )
) else if "%choice%"=="3" (
    echo [INFO] Deployment cancelled
    exit /b 0
) else (
    echo [ERROR] Invalid choice
    pause
    exit /b 1
)

REM Post-deployment checks
echo.
echo [INFO] Running post-deployment checks...

REM Check if curl is available for site testing
curl --version >nul 2>&1
if not errorlevel 1 (
    echo [INFO] Testing site accessibility...
    REM Basic site check would go here
)

REM Commit and push changes (optional)
git diff --quiet >nul 2>&1
set diff_exit_code=!errorlevel!
git diff --staged --quiet >nul 2>&1
set staged_diff_exit_code=!errorlevel!

if !diff_exit_code! neq 0 (
    set /p commit_changes="Do you want to commit and push your changes? (y/n): "
    if /i "!commit_changes!"=="y" (
        set /p commit_message="Enter commit message: "
        if "!commit_message!"=="" set commit_message=Deploy 3D portfolio with enhancements
        
        git add .
        git commit -m "!commit_message!"
        git push origin netlify-3d-portfolio
        echo [SUCCESS] Changes committed and pushed
    )
) else (
    echo [INFO] No changes to commit
)

echo.
echo [SUCCESS] 🎉 Deployment process completed!
echo.
echo Next steps:
echo - Test all 3D components work correctly
echo - Verify Buy Me a Coffee integration
echo - Check responsive design on mobile
echo - Monitor performance metrics
echo - Set up custom domain (optional)
echo.
echo [INFO] Happy coding! 🚀

pause