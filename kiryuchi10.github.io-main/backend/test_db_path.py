#!/usr/bin/env python3
"""
Test script to verify database path and directory creation works correctly.
"""

import os
import sqlite3
from dotenv import load_dotenv

def test_database_path():
    """Test database path creation and connection"""
    load_dotenv()
    
    # Get database URL from environment or use default
    database_url = os.getenv('DATABASE_URL', './test_portfolio.db')
    print(f"Raw database URL: {database_url}")
    
    # Convert SQLite URL to file path if needed
    if database_url.startswith('sqlite:///'):
        database_path = database_url[10:]  # Remove 'sqlite:///'
        # On Windows, if it's a relative path, make it relative to current directory
        if os.name == 'nt' and not (len(database_path) > 1 and database_path[1] == ':'):
            database_path = './' + database_path.lstrip('/')
    elif database_url.startswith('sqlite://'):
        database_path = database_url[9:]  # Remove 'sqlite://'
    else:
        database_path = database_url
        
    print(f"Database file path: {database_path}")
    
    # Ensure the data directory exists
    db_dir = os.path.dirname(database_path)
    if not db_dir:  # Handle case where file is in current directory
        db_dir = '.'
    print(f"Database directory: {db_dir}")
    
    if not os.path.exists(db_dir):
        try:
            os.makedirs(db_dir, exist_ok=True)
            print(f"✅ Created database directory: {db_dir}")
        except Exception as e:
            print(f"❌ Failed to create directory: {e}")
            return False
    else:
        print(f"✅ Database directory already exists: {db_dir}")
    
    # Test database connection
    try:
        conn = sqlite3.connect(database_path, timeout=30)
        cursor = conn.cursor()
        
        # Test table creation
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS test_table (
                id INTEGER PRIMARY KEY,
                test_data TEXT
            )
        ''')
        
        # Test insert
        cursor.execute('INSERT INTO test_table (test_data) VALUES (?)', ('test_value',))
        
        # Test select
        cursor.execute('SELECT * FROM test_table')
        result = cursor.fetchone()
        
        conn.commit()
        conn.close()
        
        print(f"✅ Database connection successful")
        print(f"✅ Test data: {result}")
        return True
        
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

if __name__ == '__main__':
    print("=== Database Path Test ===")
    success = test_database_path()
    
    if success:
        print("✅ All tests passed!")
    else:
        print("❌ Tests failed!")
        exit(1)