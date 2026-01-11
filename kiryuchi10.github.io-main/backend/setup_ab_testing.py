#!/usr/bin/env python3
"""
A/B Testing Setup Script
Initializes the database and creates sample experiments for testing
"""

import json
import uuid
from datetime import datetime, timedelta
from ab_testing_schema import init_ab_testing_tables
from database import db_config

def create_sample_experiments():
    """Create sample experiments for testing"""
    try:
        conn = db_config.get_connection()
        cursor = conn.cursor()
        
        # Sample experiments
        experiments = [
            {
                'id': str(uuid.uuid4()),
                'name': 'Hero Section CTA Test',
                'description': 'Testing different call-to-action buttons in the hero section',
                'variants': ['control', 'variant_a', 'variant_b'],
                'traffic_split': {'control': 34, 'variant_a': 33, 'variant_b': 33},
                'status': 'active'
            },
            {
                'id': str(uuid.uuid4()),
                'name': 'Contact Button Text Test',
                'description': 'Testing different text for the contact button',
                'variants': ['control', 'variant_a', 'variant_b'],
                'traffic_split': {'control': 50, 'variant_a': 25, 'variant_b': 25},
                'status': 'active'
            },
            {
                'id': str(uuid.uuid4()),
                'name': 'Project Showcase Layout Test',
                'description': 'Testing different layouts for the project showcase section',
                'variants': ['control', 'variant_a', 'variant_b'],
                'traffic_split': {'control': 40, 'variant_a': 30, 'variant_b': 30},
                'status': 'draft'
            },
            {
                'id': str(uuid.uuid4()),
                'name': 'Navigation Style Test',
                'description': 'Testing different navigation bar styles',
                'variants': ['control', 'variant_a', 'variant_b'],
                'traffic_split': {'control': 50, 'variant_a': 25, 'variant_b': 25},
                'status': 'active'
            }
        ]
        
        for experiment in experiments:
            if db_config.db_type == 'mysql':
                cursor.execute('''
                    INSERT INTO ab_experiments 
                    (id, name, description, variants, traffic_split, status)
                    VALUES (%s, %s, %s, %s, %s, %s)
                ''', (
                    experiment['id'],
                    experiment['name'],
                    experiment['description'],
                    json.dumps(experiment['variants']),
                    json.dumps(experiment['traffic_split']),
                    experiment['status']
                ))
            else:
                cursor.execute('''
                    INSERT INTO ab_experiments 
                    (id, name, description, variants, traffic_split, status)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (
                    experiment['id'],
                    experiment['name'],
                    experiment['description'],
                    json.dumps(experiment['variants']),
                    json.dumps(experiment['traffic_split']),
                    experiment['status']
                ))
        
        conn.commit()
        conn.close()
        
        print(f"Created {len(experiments)} sample experiments:")
        for exp in experiments:
            print(f"  - {exp['name']} ({exp['status']})")
        
        return True
        
    except Exception as e:
        print(f"Error creating sample experiments: {str(e)}")
        return False

def create_sample_data():
    """Create sample assignment and conversion data for testing"""
    try:
        conn = db_config.get_connection()
        cursor = conn.cursor()
        
        # Get active experiments
        if db_config.db_type == 'mysql':
            cursor.execute("SELECT id, variants, traffic_split FROM ab_experiments WHERE status = 'active'")
        else:
            cursor.execute("SELECT id, variants, traffic_split FROM ab_experiments WHERE status = 'active'")
        
        experiments = cursor.fetchall()
        
        if not experiments:
            print("No active experiments found. Skipping sample data creation.")
            return True
        
        # Generate sample users and assignments
        sample_users = [f"user_{i:04d}" for i in range(1, 101)]  # 100 sample users
        
        for experiment in experiments:
            if db_config.db_type == 'mysql':
                exp_id = experiment['id']
                variants = json.loads(experiment['variants'])
                traffic_split = json.loads(experiment['traffic_split'])
            else:
                exp_id = experiment[0]
                variants = json.loads(experiment[1])
                traffic_split = json.loads(experiment[2])
            
            # Assign users to variants based on traffic split
            assignments = []
            conversions = []
            
            for user_id in sample_users:
                # Simple hash-based assignment (similar to real implementation)
                hash_value = hash(f"{exp_id}:{user_id}") % 100
                cumulative = 0
                assigned_variant = 'control'
                
                for variant, split in traffic_split.items():
                    cumulative += split
                    if hash_value < cumulative:
                        assigned_variant = variant
                        break
                
                assignments.append((exp_id, user_id, assigned_variant, '127.0.0.1'))
                
                # Simulate conversions (random 10-20% conversion rate)
                import random
                if random.random() < 0.15:  # 15% conversion rate
                    conversion_value = random.uniform(1.0, 10.0)
                    conversions.append((exp_id, user_id, assigned_variant, 'default', conversion_value, '127.0.0.1'))
            
            # Insert assignments
            if db_config.db_type == 'mysql':
                cursor.executemany('''
                    INSERT INTO ab_assignments (experiment_id, user_id, variant, ip_address)
                    VALUES (%s, %s, %s, %s)
                ''', assignments)
                
                cursor.executemany('''
                    INSERT INTO ab_conversions 
                    (experiment_id, user_id, variant, conversion_type, conversion_value, ip_address)
                    VALUES (%s, %s, %s, %s, %s, %s)
                ''', conversions)
            else:
                cursor.executemany('''
                    INSERT INTO ab_assignments (experiment_id, user_id, variant, ip_address)
                    VALUES (?, ?, ?, ?)
                ''', assignments)
                
                cursor.executemany('''
                    INSERT INTO ab_conversions 
                    (experiment_id, user_id, variant, conversion_type, conversion_value, ip_address)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', conversions)
        
        conn.commit()
        conn.close()
        
        print(f"Created sample data for {len(experiments)} experiments")
        print(f"  - {len(sample_users)} user assignments per experiment")
        print(f"  - ~15% conversion rate simulation")
        
        return True
        
    except Exception as e:
        print(f"Error creating sample data: {str(e)}")
        return False

def setup_ab_testing():
    """Main setup function"""
    print("Setting up A/B Testing system...")
    print("=" * 50)
    
    # Initialize database tables
    print("1. Initializing database tables...")
    try:
        init_ab_testing_tables()
        print("   ✓ Database tables created successfully")
    except Exception as e:
        print(f"   ✗ Failed to create database tables: {str(e)}")
        return False
    
    # Create sample experiments
    print("\n2. Creating sample experiments...")
    if create_sample_experiments():
        print("   ✓ Sample experiments created successfully")
    else:
        print("   ✗ Failed to create sample experiments")
        return False
    
    # Create sample data
    print("\n3. Creating sample data...")
    if create_sample_data():
        print("   ✓ Sample data created successfully")
    else:
        print("   ✗ Failed to create sample data")
        return False
    
    print("\n" + "=" * 50)
    print("A/B Testing setup completed successfully!")
    print("\nNext steps:")
    print("1. Start your Flask backend server")
    print("2. Access the A/B Test Dashboard in your frontend")
    print("3. View experiment results and manage tests")
    print("4. Integrate A/B testing hooks in your React components")
    
    print("\nAPI Endpoints available:")
    print("- GET  /api/ab/experiments - List all experiments")
    print("- POST /api/ab/experiments - Create new experiment")
    print("- POST /api/ab/assign/<experiment_id> - Get variant assignment")
    print("- POST /api/ab/convert - Track conversion")
    print("- GET  /api/ab/results/<experiment_id> - Get experiment results")
    print("- PUT  /api/ab/experiments/<experiment_id>/status - Update experiment status")
    
    return True

if __name__ == '__main__':
    setup_ab_testing()