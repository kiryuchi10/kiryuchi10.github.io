#!/usr/bin/env python3
"""
Startup script for portfolio backend deployment.
Handles database initialization and environment validation before starting the Flask app.
"""

import os
import sys
from dotenv import load_dotenv
from database import db_config

def validate_environment():
    """Validate required environment variables for production"""
    load_dotenv()
    
    required_vars = []
    flask_env = os.getenv('FLASK_ENV', 'development')
    
    print(f"Starting in {flask_env} mode...")
    
    if flask_env == 'production':
        # Check critical production variables
        if not os.getenv('SENDER_EMAIL'):
            required_vars.append('SENDER_EMAIL')
        if not os.getenv('SENDER_PASSWORD'):
            required_vars.append('SENDER_PASSWORD')
        if not os.getenv('SECRET_KEY'):
            required_vars.append('SECRET_KEY')
        
        cors_origins = os.getenv('CORS_ORIGINS', '*')
        if cors_origins == '*':
            print("WARNING: CORS_ORIGINS is set to '*' in production. Consider setting specific domains.")
    
    if required_vars:
        error_msg = f"Missing required environment variables: {', '.join(required_vars)}"
        print(f"ERROR: {error_msg}")
        if flask_env == 'production':
            sys.exit(1)
        else:
            print("WARNING: Running in development mode with missing variables")
    
    print("Environment validation completed successfully")
    return True

def init_database():
    """Initialize database with proper error handling"""
    try:
        return db_config.init_database()
    except Exception as e:
        print(f"ERROR: Failed to initialize database: {str(e)}")
        sys.exit(1)

def start_application():
    """Start the Flask application"""
    try:
        print("Starting Flask application...")
        
        # Import and run the Flask app
        from app import app
        
        # Get configuration
        debug_mode = os.getenv('FLASK_ENV', 'development') != 'production'
        port = int(os.getenv('PORT', 5000))
        host = '0.0.0.0'
        
        print(f"Server starting on {host}:{port} (debug={debug_mode})")
        
        app.run(debug=debug_mode, host=host, port=port)
        
    except Exception as e:
        print(f"ERROR: Failed to start application: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    print("=== Portfolio Backend Startup ===")
    
    # Step 1: Validate environment
    validate_environment()
    
    # Step 2: Initialize database
    init_database()
    
    # Step 3: Start application
    start_application()