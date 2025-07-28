#!/usr/bin/env python3
"""
Test script to verify MySQL connection and database setup.
"""

import os
import sys
from dotenv import load_dotenv
from database import db_config

def test_mysql_connection():
    """Test MySQL connection and basic operations"""
    load_dotenv()
    
    print("=== MySQL Connection Test ===")
    print(f"Database URL: {db_config.database_url}")
    print(f"Database Type: {db_config.db_type}")
    
    try:
        # Test connection
        print("\n1. Testing database connection...")
        conn = db_config.get_connection()
        print("✅ Database connection successful")
        
        # Test table creation
        print("\n2. Testing database initialization...")
        db_config.init_database()
        print("✅ Database tables created/verified")
        
        # Test basic operations
        print("\n3. Testing basic database operations...")
        cursor = conn.cursor()
        
        # Insert test visitor
        if db_config.db_type == 'mysql':
            cursor.execute('''
                INSERT INTO visitors (ip_address, user_agent, country, city, page_visited)
                VALUES (%s, %s, %s, %s, %s)
            ''', ('127.0.0.1', 'Test Agent', 'Test Country', 'Test City', '/test'))
        else:
            cursor.execute('''
                INSERT INTO visitors (ip_address, user_agent, country, city, page_visited)
                VALUES (?, ?, ?, ?, ?)
            ''', ('127.0.0.1', 'Test Agent', 'Test Country', 'Test City', '/test'))
        
        conn.commit()
        print("✅ Test data inserted successfully")
        
        # Query test data
        cursor.execute('SELECT COUNT(*) as count FROM visitors')
        result = cursor.fetchone()
        count = result['count'] if db_config.db_type == 'mysql' else result[0]
        print(f"✅ Total visitors in database: {count}")
        
        # Clean up test data
        cursor.execute("DELETE FROM visitors WHERE ip_address = '127.0.0.1'")
        conn.commit()
        print("✅ Test data cleaned up")
        
        conn.close()
        print("\n🎉 All tests passed! MySQL connection is working correctly.")
        return True
        
    except Exception as e:
        print(f"\n❌ Test failed: {str(e)}")
        return False

if __name__ == '__main__':
    success = test_mysql_connection()
    if not success:
        sys.exit(1)