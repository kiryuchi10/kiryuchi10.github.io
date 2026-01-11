#!/usr/bin/env python3
"""
Test script to verify backend deployment on Render.
Run this script after deploying to test all endpoints.
"""

import requests
import json
import sys
from datetime import datetime

def test_endpoint(base_url, endpoint, method='GET', data=None, expected_status=200):
    """Test a single endpoint"""
    url = f"{base_url}{endpoint}"
    print(f"\n🧪 Testing {method} {endpoint}")
    
    try:
        if method == 'GET':
            response = requests.get(url, timeout=10)
        elif method == 'POST':
            response = requests.post(url, json=data, timeout=10)
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code == expected_status:
            print("   ✅ PASS")
            try:
                json_response = response.json()
                if 'status' in json_response:
                    print(f"   Response status: {json_response['status']}")
                return True
            except:
                print("   Response: Non-JSON response")
                return True
        else:
            print("   ❌ FAIL")
            print(f"   Expected: {expected_status}, Got: {response.status_code}")
            try:
                print(f"   Response: {response.json()}")
            except:
                print(f"   Response: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ FAIL - Connection Error: {str(e)}")
        return False

def main():
    if len(sys.argv) != 2:
        print("Usage: python test_deployment.py <backend_url>")
        print("Example: python test_deployment.py https://portfolio-backend-xxxx.onrender.com")
        sys.exit(1)
    
    base_url = sys.argv[1].rstrip('/')
    print(f"🚀 Testing backend deployment at: {base_url}")
    print(f"⏰ Test started at: {datetime.now()}")
    
    tests_passed = 0
    total_tests = 0
    
    # Test 1: Health Check
    total_tests += 1
    if test_endpoint(base_url, '/api/health'):
        tests_passed += 1
    
    # Test 2: Analytics
    total_tests += 1
    if test_endpoint(base_url, '/api/analytics'):
        tests_passed += 1
    
    # Test 3: Track Visit
    total_tests += 1
    visit_data = {
        'page': '/test',
        'referrer': 'test-script'
    }
    if test_endpoint(base_url, '/api/track-visit', 'POST', visit_data):
        tests_passed += 1
    
    # Test 4: Contact Form (this might fail if email is not configured)
    total_tests += 1
    contact_data = {
        'name': 'Test User',
        'email': 'test@example.com',
        'subject': 'Test Message',
        'message': 'This is a test message from deployment verification script.'
    }
    print(f"\n🧪 Testing POST /api/contact")
    print("   Note: This test might fail if email credentials are not configured")
    if test_endpoint(base_url, '/api/contact', 'POST', contact_data):
        tests_passed += 1
    else:
        print("   ⚠️  Contact form test failed - this is expected if email is not configured")
    
    # Summary
    print(f"\n📊 Test Results:")
    print(f"   Passed: {tests_passed}/{total_tests}")
    print(f"   Success Rate: {(tests_passed/total_tests)*100:.1f}%")
    
    if tests_passed >= 3:  # Health, Analytics, and Track Visit should work
        print("   ✅ Backend deployment appears successful!")
        print("   🔧 Configure email credentials if contact form is not working")
    else:
        print("   ❌ Backend deployment has issues")
        print("   🔍 Check Render logs for more details")
    
    print(f"⏰ Test completed at: {datetime.now()}")

if __name__ == '__main__':
    main()