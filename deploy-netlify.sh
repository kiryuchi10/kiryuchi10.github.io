#!/bin/bash

# Netlify Deployment Script for Portfolio
echo "🚀 Deploying Portfolio to Netlify..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install Netlify Functions dependencies
echo "📦 Installing Netlify Functions dependencies..."
cd netlify/functions
npm install
cd ../..

# Build the project
echo "🔨 Building project..."
npm run build

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "📥 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
netlify deploy --prod --dir=build

echo "✅ Deployment complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Set environment variables in Netlify dashboard:"
echo "   - SENDER_EMAIL: your-gmail@gmail.com"
echo "   - SENDER_PASSWORD: your-gmail-app-password"
echo "   - RECIPIENT_EMAIL: donghyeunlee1@gmail.com"
echo ""
echo "2. Test the contact form and analytics"
echo "3. Consider deploying the full backend for advanced features"
echo ""
echo "📖 See BACKEND_DEPLOYMENT_GUIDE.md for full backend deployment"