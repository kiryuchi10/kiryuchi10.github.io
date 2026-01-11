#!/usr/bin/env python3
"""
Backend Connection Test Script
Tests if the backend API is accessible and functioning
"""

import requests
import json
from datetime import datetime

def test_backend_connection(url):
    """Test if the backend API is accessible"""
    print(f"Testing backend connection to: {url}")
    print("=" * 60)
    
    endpoints = {
        "root": "/",
        "health": "/api/health",
        "analytics": "/api/analytics",
        "track-visit": "/api/track-visit"
    }
    
    results = {}
    
    for name, path in endpoints.items():
        try:
            if name == "track-visit":
                # POST request for track-visit
                data = {
                    "page": "/test",
                    "referrer": "test_script"
                }
                response = requests.post(f"{url}{path}", json=data, timeout=10)
            else:
                # GET request for other endpoints
                response = requests.get(f"{url}{path}", timeout=10)
            
            status_code = response.status_code
            try:
                response_data = response.json()
            except:
                response_data = {"error": "Not JSON response"}
            
            results[name] = {
                "status_code": status_code,
                "success": 200 <= status_code < 300,
                "data": response_data
            }
            
            if results[name]["success"]:
                print(f"✅ {name} ({path}): SUCCESS - Status {status_code}")
            else:
                print(f"❌ {name} ({path}): FAILED - Status {status_code}")
                
        except requests.exceptions.ConnectionError:
            print(f"❌ {name} ({path}): FAILED - Connection Error")
            results[name] = {
                "status_code": None,
                "success": False,
                "error": "Connection Error"
            }
        except requests.exceptions.Timeout:
            print(f"❌ {name} ({path}): FAILED - Timeout")
            results[name] = {
                "status_code": None,
                "success": False,
                "error": "Timeout"
            }
        except Exception as e:
            print(f"❌ {name} ({path}): FAILED - {str(e)}")
            results[name] = {
                "status_code": None,
                "success": False,
                "error": str(e)
            }
    
    # Print summary
    print("\n" + "=" * 60)
    print("📊 CONNECTION TEST RESULTS")
    print("=" * 60)
    
    success_count = sum(1 for result in results.values() if result["success"])
    total_count = len(results)
    success_rate = (success_count / total_count) * 100 if total_count > 0 else 0
    
    print(f"✅ Successful endpoints: {success_count}/{total_count} ({success_rate:.1f}%)")
    
    if success_rate >= 75:
        print("\n🎉 Backend connection test PASSED!")
        print(f"   Backend at {url} is accessible and functioning")
        return True
    else:
        print("\n⚠️ Backend connection test FAILED")
        print(f"   Backend at {url} is not accessible or has issues")
        return False

if __name__ == "__main__":
    # Test production backend
    production_url = "https://portfolio-backend-1aqz.onrender.com"
    production_result = test_backend_connection(production_url)
    
    # Test local backend
    print("\nTesting local backend...")
    local_url = "http://localhost:5000"
    local_result = test_backend_connection(local_url)
    
    print("\n" + "=" * 60)
    print("🎯 OVERALL ASSESSMENT")
    print("=" * 60)
    
    if production_result:
        print("✅ Production backend is accessible")
        print("   Frontend should be configured to use:", production_url)
    else:
        print("❌ Production backend is NOT accessible")
        print("   You need to deploy the backend to Render or check the deployment")
        
    if local_result:
        print("✅ Local backend is accessible")
        print("   You can use local backend for development")
    else:
        print("❌ Local backend is NOT accessible")
        print("   Start local backend with: python backend/app.py")