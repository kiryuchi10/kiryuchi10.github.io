#!/bin/bash

# 3D Portfolio Deployment Script for Netlify
# This script automates the deployment process

set -e  # Exit on any error

echo "🚀 Starting 3D Portfolio Deployment Process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're on the correct branch
current_branch=$(git branch --show-current)
if [ "$current_branch" != "netlify-3d-portfolio" ]; then
    print_warning "You're not on the netlify-3d-portfolio branch. Current branch: $current_branch"
    read -p "Do you want to switch to netlify-3d-portfolio branch? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git checkout netlify-3d-portfolio
        print_success "Switched to netlify-3d-portfolio branch"
    else
        print_error "Deployment cancelled. Please switch to netlify-3d-portfolio branch manually."
        exit 1
    fi
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version check passed: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi

# Install dependencies
print_status "Installing dependencies..."
npm install
if [ $? -eq 0 ]; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Run tests (if they exist)
if [ -f "src/App.test.js" ]; then
    print_status "Running tests..."
    npm test -- --coverage --watchAll=false
    if [ $? -eq 0 ]; then
        print_success "All tests passed"
    else
        print_warning "Some tests failed, but continuing with deployment"
    fi
fi

# Build the project
print_status "Building the project..."
npm run build
if [ $? -eq 0 ]; then
    print_success "Build completed successfully"
else
    print_error "Build failed"
    exit 1
fi

# Check if build directory exists
if [ ! -d "build" ]; then
    print_error "Build directory not found"
    exit 1
fi

# Analyze bundle size (optional)
read -p "Do you want to analyze the bundle size? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Analyzing bundle size..."
    npm run analyze
fi

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    print_warning "Netlify CLI is not installed."
    read -p "Do you want to install it globally? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm install -g netlify-cli
        print_success "Netlify CLI installed"
    else
        print_status "You can deploy manually by dragging the build folder to Netlify"
        print_status "Or install Netlify CLI later with: npm install -g netlify-cli"
        exit 0
    fi
fi

# Login to Netlify (if not already logged in)
print_status "Checking Netlify authentication..."
netlify status > /dev/null 2>&1
if [ $? -ne 0 ]; then
    print_status "Please login to Netlify..."
    netlify login
fi

# Choose deployment type
echo
echo "Choose deployment type:"
echo "1) Preview deployment (for testing)"
echo "2) Production deployment"
echo "3) Exit"
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        print_status "Deploying to preview..."
        netlify deploy --dir=build
        if [ $? -eq 0 ]; then
            print_success "Preview deployment completed!"
            print_status "Check the preview URL above to test your changes"
        else
            print_error "Preview deployment failed"
            exit 1
        fi
        ;;
    2)
        print_warning "This will deploy to production. Are you sure?"
        read -p "Type 'yes' to confirm: " confirm
        if [ "$confirm" = "yes" ]; then
            print_status "Deploying to production..."
            netlify deploy --prod --dir=build
            if [ $? -eq 0 ]; then
                print_success "Production deployment completed!"
                print_success "Your 3D portfolio is now live!"
            else
                print_error "Production deployment failed"
                exit 1
            fi
        else
            print_status "Production deployment cancelled"
        fi
        ;;
    3)
        print_status "Deployment cancelled"
        exit 0
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

# Post-deployment checks
echo
print_status "Running post-deployment checks..."

# Check if site is accessible (basic check)
if command -v curl &> /dev/null; then
    site_url=$(netlify status --json | grep -o '"url":"[^"]*' | cut -d'"' -f4)
    if [ ! -z "$site_url" ]; then
        print_status "Testing site accessibility..."
        response=$(curl -s -o /dev/null -w "%{http_code}" "$site_url")
        if [ "$response" = "200" ]; then
            print_success "Site is accessible at: $site_url"
        else
            print_warning "Site returned HTTP $response. Please check manually."
        fi
    fi
fi

# Commit and push changes (optional)
if git diff --quiet && git diff --staged --quiet; then
    print_status "No changes to commit"
else
    read -p "Do you want to commit and push your changes? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter commit message: " commit_message
        if [ -z "$commit_message" ]; then
            commit_message="Deploy 3D portfolio with enhancements"
        fi
        
        git add .
        git commit -m "$commit_message"
        git push origin netlify-3d-portfolio
        print_success "Changes committed and pushed"
    fi
fi

echo
print_success "🎉 Deployment process completed!"
echo
echo "Next steps:"
echo "- Test all 3D components work correctly"
echo "- Verify Buy Me a Coffee integration"
echo "- Check responsive design on mobile"
echo "- Monitor performance metrics"
echo "- Set up custom domain (optional)"
echo
print_status "Happy coding! 🚀"