#!/usr/bin/env python3
"""
Test script to verify Render deployment readiness.
"""

import os
import sys
from dotenv import load_dotenv

def test_environment():
    """Test environment variables"""
    load_dotenv()
    
    print("=== Environment Test ===")
    
    # Check required variables
    database_url = os.getenv('DATABASE_URL')
    flask_env = os.getenv('FLASK_ENV', 'development')
    sender_email = os.getenv('SENDER_EMAIL')
    sender_password = os.getenv('SENDER_PASSWORD')
    secret_key = os.getenv('SECRET_KEY')
    cors_origins = os.getenv('CORS_ORIGINS')
    
    print(f"FLASK_ENV: {flask_env}")
    print(f"DATABASE_URL: {database_url}")
    print(f"SENDER_EMAIL: {'✅ Set' if sender_email else '❌ Missing'}")
    print(f"SENDER_PASSWORD: {'✅ Set' if sender_password else '❌ Missing'}")
    print(f"SECRET_KEY: {'✅ Set' if secret_key else '❌ Missing'}")
    print(f"CORS_ORIGINS: {cors_origins}")
    
    return True

def test_database():
    """Test database connection"""
    print("\n=== Database Test ===")
    
    try:
        from database import db_config
        
        print(f"Database type: {db_config.db_type}")
        print(f"Database URL: {db_config.database_url}")
        
        # Test connection
        conn = db_config.get_connection()
        print("✅ Database connection successful")
        
        # Test table creation
        db_config.init_database()
        print("✅ Database initialization successful")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Database test failed: {e}")
        return False

def test_imports():
    """Test all required imports"""
    print("\n=== Import Test ===")
    
    try:
        import flask
        print("✅ Flask imported")
        
        import flask_cors
        print("✅ Flask-CORS imported")
        
        import requests
        print("✅ Requests imported")
        
        import sqlite3
        print("✅ SQLite3 imported")
        
        from database import db_config
        print("✅ Database config imported")
        
        return True
        
    except ImportError as e:
        print(f"❌ Import failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Render Deployment Readiness Test")
    print("=" * 40)
    
    tests = [
        ("Environment", test_environment),
        ("Imports", test_imports),
        ("Database", test_database)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} test crashed: {e}")
            results.append((test_name, False))
    
    print("\n" + "=" * 40)
    print("📊 Test Results:")
    
    all_passed = True
    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{test_name}: {status}")
        if not passed:
            all_passed = False
    
    if all_passed:
        print("\n🎉 All tests passed! Ready for Render deployment.")
        return 0
    else:
        print("\n⚠️  Some tests failed. Fix issues before deploying.")
        return 1

if __name__ == '__main__':
    sys.exit(main())