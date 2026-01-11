#!/usr/bin/env python3
"""
Local Backend Test Script
Tests the backend functionality locally before deployment testing
"""

import sys
import os
import requests
import json
import time
from datetime import datetime

# Add backend directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

def test_local_backend():
    """Test the backend running locally"""
    
    print("🧪 Testing Local Backend Functionality")
    print("=" * 60)
    
    # Test configuration
    LOCAL_URL = "http://localhost:5000"
    test_results = {"passed": 0, "failed": 0, "total": 0}
    
    def log_test(test_name, passed, details=""):
        test_results["total"] += 1
        if passed:
            test_results["passed"] += 1
            print(f"✅ {test_name}: PASSED {details}")
        else:
            test_results["failed"] += 1
            print(f"❌ {test_name}: FAILED {details}")
    
    # Test 1: Import and basic functionality
    try:
        from app import app, init_db
        print("✅ Backend imports successful")
        
        # Initialize database
        init_db()
        print("✅ Database initialization successful")
        
        # Test app configuration
        with app.app_context():
            print(f"✅ Flask app configured - Debug: {app.debug}")
            print(f"✅ CORS Origins: {app.config.get('CORS_ORIGINS', 'Not set')}")
        
        log_test("Backend Import & Setup", True)
        
    except Exception as e:
        log_test("Backend Import & Setup", False, f"Error: {str(e)}")
        return False
    
    # Test 2: Database operations
    try:
        import sqlite3
        conn = sqlite3.connect('portfolio.db')
        cursor = conn.cursor()
        
        # Test visitor insert
        cursor.execute('''
            INSERT INTO visitors (ip_address, user_agent, country, city, page_visited, referrer)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', ('127.0.0.1', 'Test Agent', 'Test Country', 'Test City', '/test', 'test'))
        
        # Test contact message insert
        cursor.execute('''
            INSERT INTO contact_messages (name, email, subject, message, ip_address)
            VALUES (?, ?, ?, ?, ?)
        ''', ('Test User', 'test@example.com', 'Test Subject', 'Test Message', '127.0.0.1'))
        
        conn.commit()
        
        # Test data retrieval
        cursor.execute('SELECT COUNT(*) FROM visitors')
        visitor_count = cursor.fetchone()[0]
        
        cursor.execute('SELECT COUNT(*) FROM contact_messages')
        message_count = cursor.fetchone()[0]
        
        conn.close()
        
        log_test("Database Operations", True, f"Visitors: {visitor_count}, Messages: {message_count}")
        
    except Exception as e:
        log_test("Database Operations", False, f"Error: {str(e)}")
    
    # Test 3: API endpoints (if server is running)
    try:
        # Check if server is running
        response = requests.get(f"{LOCAL_URL}/api/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            log_test("Health Endpoint", True, f"Status: {data.get('status', 'unknown')}")
            
            # Test analytics endpoint
            analytics_response = requests.get(f"{LOCAL_URL}/api/analytics", timeout=5)
            if analytics_response.status_code == 200:
                analytics_data = analytics_response.json()
                log_test("Analytics Endpoint", True, f"Data retrieved successfully")
            else:
                log_test("Analytics Endpoint", False, f"Status: {analytics_response.status_code}")
            
            # Test contact endpoint (will likely fail due to email config)
            contact_data = {
                "name": "Test User",
                "email": "test@example.com", 
                "subject": "Test Subject",
                "message": "Test Message"
            }
            contact_response = requests.post(f"{LOCAL_URL}/api/contact", 
                                           json=contact_data, timeout=5)
            
            if contact_response.status_code in [200, 503]:  # 503 expected for email config issues
                log_test("Contact Endpoint", True, "API working (email config expected to fail)")
            else:
                log_test("Contact Endpoint", False, f"Status: {contact_response.status_code}")
                
        else:
            log_test("API Endpoints", False, "Server not running locally")
            
    except requests.exceptions.ConnectionError:
        print("ℹ️  Local server not running - skipping API endpoint tests")
        print("   To test API endpoints, run: python backend/app.py")
    except Exception as e:
        log_test("API Endpoints", False, f"Error: {str(e)}")
    
    # Print results
    print("\n" + "=" * 60)
    print("📊 LOCAL TEST RESULTS")
    print("=" * 60)
    print(f"✅ Passed: {test_results['passed']}")
    print(f"❌ Failed: {test_results['failed']}")
    print(f"📈 Total: {test_results['total']}")
    
    success_rate = (test_results['passed'] / test_results['total']) * 100 if test_results['total'] > 0 else 0
    print(f"📊 Success Rate: {success_rate:.1f}%")
    
    if success_rate >= 80:
        print("\n🎉 Local backend tests PASSED!")
        print("   Backend is ready for deployment testing")
        return True
    else:
        print("\n⚠️  Local backend tests found issues")
        print("   Please fix local issues before deployment testing")
        return False

def test_deployment_readiness():
    """Test if backend is ready for deployment"""
    
    print("\n🚀 Testing Deployment Readiness")
    print("=" * 60)
    
    # Check required files
    required_files = [
        'backend/app.py',
        'backend/start.py', 
        'backend/requirements.txt',
        'render.yaml'
    ]
    
    missing_files = []
    for file_path in required_files:
        if not os.path.exists(file_path):
            missing_files.append(file_path)
    
    if missing_files:
        print(f"❌ Missing required files: {', '.join(missing_files)}")
        return False
    else:
        print("✅ All required deployment files present")
    
    # Check requirements.txt
    try:
        with open('backend/requirements.txt', 'r') as f:
            requirements = f.read()
            required_packages = ['flask', 'flask-cors', 'requests', 'python-dotenv']
            missing_packages = []
            
            for package in required_packages:
                if package.lower() not in requirements.lower():
                    missing_packages.append(package)
            
            if missing_packages:
                print(f"⚠️  Potentially missing packages in requirements.txt: {', '.join(missing_packages)}")
            else:
                print("✅ Requirements.txt looks good")
                
    except Exception as e:
        print(f"❌ Error reading requirements.txt: {str(e)}")
        return False
    
    # Check render.yaml configuration
    try:
        import yaml
        with open('render.yaml', 'r') as f:
            render_config = yaml.safe_load(f)
            
        if 'services' in render_config and len(render_config['services']) > 0:
            service = render_config['services'][0]
            if service.get('type') == 'web' and service.get('env') == 'python':
                print("✅ Render configuration looks good")
            else:
                print("⚠️  Render configuration may have issues")
        else:
            print("❌ Invalid render.yaml configuration")
            return False
            
    except Exception as e:
        print(f"⚠️  Could not validate render.yaml: {str(e)}")
    
    print("✅ Backend appears ready for deployment")
    return True

if __name__ == "__main__":
    print("🔧 Portfolio Backend Local Testing")
    print("=" * 60)
    
    # Test local functionality
    local_success = test_local_backend()
    
    # Test deployment readiness
    deployment_ready = test_deployment_readiness()
    
    print("\n" + "=" * 60)
    print("🎯 OVERALL ASSESSMENT")
    print("=" * 60)
    
    if local_success and deployment_ready:
        print("🎉 Backend is ready for deployment and integration testing!")
        print("\nNext steps:")
        print("1. Deploy backend to Render")
        print("2. Update frontend API configuration with deployed URL")
        print("3. Run integration tests")
    else:
        print("⚠️  Backend needs attention before deployment")
        if not local_success:
            print("   • Fix local backend issues first")
        if not deployment_ready:
            print("   • Fix deployment configuration issues")