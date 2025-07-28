#!/usr/bin/env python3
"""
Database configuration and connection handling for portfolio backend.
Supports both SQLite (development) and MySQL (production).
"""

import os
import sqlite3
import pymysql
import time
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv()

class DatabaseConfig:
    """Database configuration handler"""
    
    def __init__(self):
        self.database_url = os.getenv('DATABASE_URL', 'sqlite:///portfolio.db')
        self.db_type = self._detect_db_type()
        
    def _detect_db_type(self):
        """Detect database type from URL"""
        if self.database_url.startswith('mysql'):
            return 'mysql'
        elif self.database_url.startswith('sqlite'):
            return 'sqlite'
        else:
            # Default to sqlite for file paths
            return 'sqlite'
    
    def get_connection(self, max_retries=3, retry_delay=1):
        """Get database connection with retry logic"""
        for attempt in range(max_retries):
            try:
                if self.db_type == 'mysql':
                    return self._get_mysql_connection()
                else:
                    return self._get_sqlite_connection()
            except Exception as e:
                if attempt < max_retries - 1:
                    print(f"Database connection attempt {attempt + 1} failed: {str(e)}. Retrying in {retry_delay} seconds...")
                    time.sleep(retry_delay)
                    retry_delay *= 2  # Exponential backoff
                else:
                    print(f"Database connection failed after {max_retries} attempts: {str(e)}")
                    raise
    
    def _get_mysql_connection(self):
        """Get MySQL connection"""
        parsed = urlparse(self.database_url)
        
        connection = pymysql.connect(
            host=parsed.hostname,
            port=parsed.port or 3306,
            user=parsed.username,
            password=parsed.password,
            database=parsed.path.lstrip('/'),
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor,
            autocommit=False
        )
        return connection
    
    def _get_sqlite_connection(self):
        """Get SQLite connection"""
        # Handle SQLite URL format
        if self.database_url.startswith('sqlite:///'):
            db_path = self.database_url.replace('sqlite:///', '/')
            # On Windows, handle absolute paths
            if os.name == 'nt' and not (len(db_path) > 1 and db_path[1] == ':'):
                db_path = './' + db_path.lstrip('/')
        elif self.database_url.startswith('sqlite://'):
            db_path = self.database_url.replace('sqlite://', '')
        else:
            db_path = self.database_url
        
        # Ensure directory exists
        db_dir = os.path.dirname(db_path)
        if db_dir and not os.path.exists(db_dir):
            os.makedirs(db_dir, exist_ok=True)
        
        conn = sqlite3.connect(
            db_path,
            timeout=30,
            check_same_thread=False
        )
        conn.row_factory = sqlite3.Row  # Enable dict-like access
        return conn
    
    def init_database(self):
        """Initialize database tables"""
        try:
            conn = self.get_connection()
            
            if self.db_type == 'mysql':
                self._init_mysql_tables(conn)
            else:
                self._init_sqlite_tables(conn)
            
            conn.close()
            print("Database initialized successfully")
            return True
            
        except Exception as e:
            print(f"ERROR: Failed to initialize database: {str(e)}")
            raise
    
    def _init_mysql_tables(self, conn):
        """Initialize MySQL tables"""
        cursor = conn.cursor()
        
        # Visitors table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS visitors (
                id INT AUTO_INCREMENT PRIMARY KEY,
                ip_address VARCHAR(45),
                user_agent TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                country VARCHAR(100),
                city VARCHAR(100),
                github_user VARCHAR(100),
                page_visited VARCHAR(500),
                referrer VARCHAR(500),
                INDEX idx_timestamp (timestamp),
                INDEX idx_country (country)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ''')
        
        # Contact messages table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS contact_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(254) NOT NULL,
                subject VARCHAR(200) NOT NULL,
                message TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                ip_address VARCHAR(45),
                INDEX idx_timestamp (timestamp)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ''')
        
        conn.commit()
    
    def _init_sqlite_tables(self, conn):
        """Initialize SQLite tables"""
        cursor = conn.cursor()
        
        # Visitors table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS visitors (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ip_address TEXT,
                user_agent TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                country TEXT,
                city TEXT,
                github_user TEXT,
                page_visited TEXT,
                referrer TEXT
            )
        ''')
        
        # Contact messages table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS contact_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                subject TEXT NOT NULL,
                message TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                ip_address TEXT
            )
        ''')
        
        # Create indexes for better performance
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_visitors_timestamp ON visitors(timestamp)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_visitors_country ON visitors(country)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_contact_timestamp ON contact_messages(timestamp)')
        
        conn.commit()

# Global database instance
db_config = DatabaseConfig()