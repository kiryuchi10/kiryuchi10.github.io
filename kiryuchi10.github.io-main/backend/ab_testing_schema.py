#!/usr/bin/env python3
"""
A/B Testing database schema initialization.
Creates the necessary tables for A/B testing functionality.
"""

from database import db_config

def init_ab_testing_tables():
    """Initialize A/B testing database tables"""
    try:
        conn = db_config.get_connection()
        
        if db_config.db_type == 'mysql':
            _init_mysql_ab_tables(conn)
        else:
            _init_sqlite_ab_tables(conn)
        
        conn.close()
        print("A/B testing tables initialized successfully")
        return True
        
    except Exception as e:
        print(f"ERROR: Failed to initialize A/B testing tables: {str(e)}")
        raise

def _init_mysql_ab_tables(conn):
    """Initialize MySQL A/B testing tables"""
    cursor = conn.cursor()
    
    # Experiments table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ab_experiments (
            id VARCHAR(36) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            variants JSON NOT NULL,
            traffic_split JSON NOT NULL,
            status ENUM('draft', 'active', 'paused', 'completed') DEFAULT 'draft',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            start_date TIMESTAMP NULL,
            end_date TIMESTAMP NULL,
            INDEX idx_status (status),
            INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ''')
    
    # User assignments table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ab_assignments (
            id INT AUTO_INCREMENT PRIMARY KEY,
            experiment_id VARCHAR(36) NOT NULL,
            user_id VARCHAR(32) NOT NULL,
            variant VARCHAR(100) NOT NULL,
            assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ip_address VARCHAR(45),
            UNIQUE KEY unique_assignment (experiment_id, user_id),
            INDEX idx_experiment_id (experiment_id),
            INDEX idx_user_id (user_id),
            INDEX idx_variant (variant),
            FOREIGN KEY (experiment_id) REFERENCES ab_experiments(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ''')
    
    # Conversions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ab_conversions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            experiment_id VARCHAR(36) NOT NULL,
            user_id VARCHAR(32) NOT NULL,
            variant VARCHAR(100) NOT NULL,
            conversion_type VARCHAR(100) DEFAULT 'default',
            conversion_value DECIMAL(10,2) DEFAULT 1.00,
            converted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ip_address VARCHAR(45),
            INDEX idx_experiment_id (experiment_id),
            INDEX idx_user_id (user_id),
            INDEX idx_variant (variant),
            INDEX idx_conversion_type (conversion_type),
            INDEX idx_converted_at (converted_at),
            FOREIGN KEY (experiment_id) REFERENCES ab_experiments(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ''')
    
    # Events table for detailed tracking
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ab_events (
            id INT AUTO_INCREMENT PRIMARY KEY,
            experiment_id VARCHAR(36) NOT NULL,
            user_id VARCHAR(32) NOT NULL,
            variant VARCHAR(100) NOT NULL,
            event_type VARCHAR(100) NOT NULL,
            event_data JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ip_address VARCHAR(45),
            INDEX idx_experiment_id (experiment_id),
            INDEX idx_user_id (user_id),
            INDEX idx_event_type (event_type),
            INDEX idx_created_at (created_at),
            FOREIGN KEY (experiment_id) REFERENCES ab_experiments(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ''')
    
    conn.commit()

def _init_sqlite_ab_tables(conn):
    """Initialize SQLite A/B testing tables"""
    cursor = conn.cursor()
    
    # Experiments table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ab_experiments (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT,
            variants TEXT NOT NULL,
            traffic_split TEXT NOT NULL,
            status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'active', 'paused', 'completed')),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            start_date DATETIME,
            end_date DATETIME
        )
    ''')
    
    # User assignments table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ab_assignments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            experiment_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            variant TEXT NOT NULL,
            assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            ip_address TEXT,
            UNIQUE(experiment_id, user_id),
            FOREIGN KEY (experiment_id) REFERENCES ab_experiments(id) ON DELETE CASCADE
        )
    ''')
    
    # Conversions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ab_conversions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            experiment_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            variant TEXT NOT NULL,
            conversion_type TEXT DEFAULT 'default',
            conversion_value REAL DEFAULT 1.0,
            converted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            ip_address TEXT,
            FOREIGN KEY (experiment_id) REFERENCES ab_experiments(id) ON DELETE CASCADE
        )
    ''')
    
    # Events table for detailed tracking
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ab_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            experiment_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            variant TEXT NOT NULL,
            event_type TEXT NOT NULL,
            event_data TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            ip_address TEXT,
            FOREIGN KEY (experiment_id) REFERENCES ab_experiments(id) ON DELETE CASCADE
        )
    ''')
    
    # Create indexes for better performance
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_ab_experiments_status ON ab_experiments(status)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_ab_experiments_created_at ON ab_experiments(created_at)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_ab_assignments_experiment_id ON ab_assignments(experiment_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_ab_assignments_user_id ON ab_assignments(user_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_ab_assignments_variant ON ab_assignments(variant)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_ab_conversions_experiment_id ON ab_conversions(experiment_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_ab_conversions_user_id ON ab_conversions(user_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_ab_conversions_variant ON ab_conversions(variant)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_ab_conversions_type ON ab_conversions(conversion_type)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_ab_conversions_converted_at ON ab_conversions(converted_at)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_ab_events_experiment_id ON ab_events(experiment_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_ab_events_user_id ON ab_events(user_id)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_ab_events_type ON ab_events(event_type)')
    cursor.execute('CREATE INDEX IF NOT EXISTS idx_ab_events_created_at ON ab_events(created_at)')
    
    conn.commit()

if __name__ == '__main__':
    init_ab_testing_tables()