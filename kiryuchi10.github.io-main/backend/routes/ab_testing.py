#!/usr/bin/env python3
"""
A/B Testing API routes for portfolio backend.
Provides comprehensive A/B testing functionality including experiment management,
variant assignment, conversion tracking, and statistical analysis.
"""

from flask import Blueprint, request, jsonify
from functools import wraps
import json
import time
import hashlib
import random
from datetime import datetime, timedelta
from database import db_config
import uuid

ab_testing_bp = Blueprint('ab_testing', __name__)

# Rate limiting decorator (reuse from main app)
def rate_limit(max_requests=30, window=60):
    """Simple rate limiting decorator"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            client_ip = request.remote_addr
            current_time = time.time()
            
            if not hasattr(rate_limit, 'requests'):
                rate_limit.requests = {}
            
            if client_ip not in rate_limit.requests:
                rate_limit.requests[client_ip] = []
            
            rate_limit.requests[client_ip] = [
                req_time for req_time in rate_limit.requests[client_ip]
                if current_time - req_time < window
            ]
            
            if len(rate_limit.requests[client_ip]) >= max_requests:
                return jsonify({
                    'error': 'Rate limit exceeded',
                    'status': 'error'
                }), 429
            
            rate_limit.requests[client_ip].append(current_time)
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def get_user_id(request):
    """Generate consistent user ID from IP and User-Agent"""
    ip = request.remote_addr
    user_agent = request.headers.get('User-Agent', '')
    combined = f"{ip}:{user_agent}"
    return hashlib.md5(combined.encode()).hexdigest()

def assign_variant(experiment_id, user_id, traffic_split):
    """Assign user to variant based on consistent hashing"""
    combined = f"{experiment_id}:{user_id}"
    hash_value = int(hashlib.md5(combined.encode()).hexdigest(), 16)
    percentage = (hash_value % 100) + 1
    
    cumulative = 0
    for variant, split in traffic_split.items():
        cumulative += split
        if percentage <= cumulative:
            return variant
    
    return 'control'  # Fallback

@ab_testing_bp.route('/experiments', methods=['GET'])
@rate_limit(max_requests=50, window=60)
def get_experiments():
    """Get all active experiments"""
    try:
        conn = db_config.get_connection()
        cursor = conn.cursor()
        
        if db_config.db_type == 'mysql':
            cursor.execute('''
                SELECT * FROM ab_experiments 
                WHERE status = 'active' 
                ORDER BY created_at DESC
            ''')
        else:
            cursor.execute('''
                SELECT * FROM ab_experiments 
                WHERE status = 'active' 
                ORDER BY created_at DESC
            ''')
        
        experiments = []
        for row in cursor.fetchall():
            if db_config.db_type == 'mysql':
                experiment = {
                    'id': row['id'],
                    'name': row['name'],
                    'description': row['description'],
                    'variants': json.loads(row['variants']),
                    'traffic_split': json.loads(row['traffic_split']),
                    'status': row['status'],
                    'created_at': str(row['created_at']),
                    'start_date': str(row['start_date']) if row['start_date'] else None,
                    'end_date': str(row['end_date']) if row['end_date'] else None
                }
            else:
                experiment = {
                    'id': row[0],
                    'name': row[1],
                    'description': row[2],
                    'variants': json.loads(row[3]),
                    'traffic_split': json.loads(row[4]),
                    'status': row[5],
                    'created_at': row[6],
                    'start_date': row[7],
                    'end_date': row[8]
                }
            experiments.append(experiment)
        
        conn.close()
        
        return jsonify({
            'status': 'success',
            'experiments': experiments
        }), 200
        
    except Exception as e:
        print(f"Error getting experiments: {str(e)}")
        return jsonify({
            'error': 'Failed to retrieve experiments',
            'status': 'error'
        }), 500

@ab_testing_bp.route('/experiments', methods=['POST'])
@rate_limit(max_requests=10, window=300)
def create_experiment():
    """Create a new A/B test experiment"""
    try:
        if not request.is_json:
            return jsonify({
                'error': 'Content-Type must be application/json',
                'status': 'error'
            }), 400
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'description', 'variants', 'traffic_split']
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'error': f'Missing required field: {field}',
                    'status': 'error'
                }), 400
        
        # Validate traffic split adds up to 100
        total_split = sum(data['traffic_split'].values())
        if total_split != 100:
            return jsonify({
                'error': 'Traffic split must add up to 100%',
                'status': 'error'
            }), 400
        
        # Validate variants match traffic split keys
        if set(data['variants']) != set(data['traffic_split'].keys()):
            return jsonify({
                'error': 'Variants must match traffic split keys',
                'status': 'error'
            }), 400
        
        experiment_id = str(uuid.uuid4())
        
        conn = db_config.get_connection()
        cursor = conn.cursor()
        
        if db_config.db_type == 'mysql':
            cursor.execute('''
                INSERT INTO ab_experiments 
                (id, name, description, variants, traffic_split, status, start_date, end_date)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ''', (
                experiment_id,
                data['name'],
                data['description'],
                json.dumps(data['variants']),
                json.dumps(data['traffic_split']),
                data.get('status', 'draft'),
                data.get('start_date'),
                data.get('end_date')
            ))
        else:
            cursor.execute('''
                INSERT INTO ab_experiments 
                (id, name, description, variants, traffic_split, status, start_date, end_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                experiment_id,
                data['name'],
                data['description'],
                json.dumps(data['variants']),
                json.dumps(data['traffic_split']),
                data.get('status', 'draft'),
                data.get('start_date'),
                data.get('end_date')
            ))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'status': 'success',
            'message': 'Experiment created successfully',
            'experiment_id': experiment_id
        }), 201
        
    except Exception as e:
        print(f"Error creating experiment: {str(e)}")
        return jsonify({
            'error': 'Failed to create experiment',
            'status': 'error'
        }), 500

@ab_testing_bp.route('/assign/<experiment_id>', methods=['POST'])
@rate_limit(max_requests=100, window=60)
def assign_user_to_variant(experiment_id):
    """Assign user to experiment variant"""
    try:
        user_id = get_user_id(request)
        
        # Check if user already assigned
        conn = db_config.get_connection()
        cursor = conn.cursor()
        
        if db_config.db_type == 'mysql':
            cursor.execute('''
                SELECT variant FROM ab_assignments 
                WHERE experiment_id = %s AND user_id = %s
            ''', (experiment_id, user_id))
        else:
            cursor.execute('''
                SELECT variant FROM ab_assignments 
                WHERE experiment_id = ? AND user_id = ?
            ''', (experiment_id, user_id))
        
        existing = cursor.fetchone()
        if existing:
            variant = existing['variant'] if db_config.db_type == 'mysql' else existing[0]
            conn.close()
            return jsonify({
                'status': 'success',
                'variant': variant,
                'user_id': user_id,
                'existing_assignment': True
            }), 200
        
        # Get experiment details
        if db_config.db_type == 'mysql':
            cursor.execute('''
                SELECT traffic_split, status FROM ab_experiments 
                WHERE id = %s AND status = 'active'
            ''', (experiment_id,))
        else:
            cursor.execute('''
                SELECT traffic_split, status FROM ab_experiments 
                WHERE id = ? AND status = 'active'
            ''', (experiment_id,))
        
        experiment = cursor.fetchone()
        if not experiment:
            conn.close()
            return jsonify({
                'error': 'Experiment not found or not active',
                'status': 'error'
            }), 404
        
        traffic_split = json.loads(experiment['traffic_split'] if db_config.db_type == 'mysql' else experiment[0])
        
        # Assign variant
        variant = assign_variant(experiment_id, user_id, traffic_split)
        
        # Store assignment
        if db_config.db_type == 'mysql':
            cursor.execute('''
                INSERT INTO ab_assignments (experiment_id, user_id, variant, ip_address)
                VALUES (%s, %s, %s, %s)
            ''', (experiment_id, user_id, variant, request.remote_addr))
        else:
            cursor.execute('''
                INSERT INTO ab_assignments (experiment_id, user_id, variant, ip_address)
                VALUES (?, ?, ?, ?)
            ''', (experiment_id, user_id, variant, request.remote_addr))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'status': 'success',
            'variant': variant,
            'user_id': user_id,
            'existing_assignment': False
        }), 200
        
    except Exception as e:
        print(f"Error assigning variant: {str(e)}")
        return jsonify({
            'error': 'Failed to assign variant',
            'status': 'error'
        }), 500

@ab_testing_bp.route('/convert', methods=['POST'])
@rate_limit(max_requests=100, window=60)
def track_conversion():
    """Track conversion event"""
    try:
        if not request.is_json:
            return jsonify({
                'error': 'Content-Type must be application/json',
                'status': 'error'
            }), 400
        
        data = request.get_json()
        
        if 'experiment_id' not in data:
            return jsonify({
                'error': 'experiment_id is required',
                'status': 'error'
            }), 400
        
        user_id = get_user_id(request)
        experiment_id = data['experiment_id']
        conversion_type = data.get('conversion_type', 'default')
        conversion_value = data.get('conversion_value', 1.0)
        
        conn = db_config.get_connection()
        cursor = conn.cursor()
        
        # Get user's variant assignment
        if db_config.db_type == 'mysql':
            cursor.execute('''
                SELECT variant FROM ab_assignments 
                WHERE experiment_id = %s AND user_id = %s
            ''', (experiment_id, user_id))
        else:
            cursor.execute('''
                SELECT variant FROM ab_assignments 
                WHERE experiment_id = ? AND user_id = ?
            ''', (experiment_id, user_id))
        
        assignment = cursor.fetchone()
        if not assignment:
            conn.close()
            return jsonify({
                'error': 'User not assigned to experiment',
                'status': 'error'
            }), 400
        
        variant = assignment['variant'] if db_config.db_type == 'mysql' else assignment[0]
        
        # Track conversion
        if db_config.db_type == 'mysql':
            cursor.execute('''
                INSERT INTO ab_conversions 
                (experiment_id, user_id, variant, conversion_type, conversion_value, ip_address)
                VALUES (%s, %s, %s, %s, %s, %s)
            ''', (experiment_id, user_id, variant, conversion_type, conversion_value, request.remote_addr))
        else:
            cursor.execute('''
                INSERT INTO ab_conversions 
                (experiment_id, user_id, variant, conversion_type, conversion_value, ip_address)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (experiment_id, user_id, variant, conversion_type, conversion_value, request.remote_addr))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'status': 'success',
            'message': 'Conversion tracked successfully',
            'variant': variant
        }), 200
        
    except Exception as e:
        print(f"Error tracking conversion: {str(e)}")
        return jsonify({
            'error': 'Failed to track conversion',
            'status': 'error'
        }), 500

@ab_testing_bp.route('/results/<experiment_id>', methods=['GET'])
@rate_limit(max_requests=30, window=60)
def get_experiment_results(experiment_id):
    """Get experiment results and statistics"""
    try:
        conn = db_config.get_connection()
        cursor = conn.cursor()
        
        # Get experiment details
        if db_config.db_type == 'mysql':
            cursor.execute('''
                SELECT * FROM ab_experiments WHERE id = %s
            ''', (experiment_id,))
        else:
            cursor.execute('''
                SELECT * FROM ab_experiments WHERE id = ?
            ''', (experiment_id,))
        
        experiment = cursor.fetchone()
        if not experiment:
            conn.close()
            return jsonify({
                'error': 'Experiment not found',
                'status': 'error'
            }), 404
        
        # Get assignment counts by variant
        if db_config.db_type == 'mysql':
            cursor.execute('''
                SELECT variant, COUNT(*) as count 
                FROM ab_assignments 
                WHERE experiment_id = %s 
                GROUP BY variant
            ''', (experiment_id,))
        else:
            cursor.execute('''
                SELECT variant, COUNT(*) as count 
                FROM ab_assignments 
                WHERE experiment_id = ? 
                GROUP BY variant
            ''', (experiment_id,))
        
        assignments = {}
        for row in cursor.fetchall():
            if db_config.db_type == 'mysql':
                assignments[row['variant']] = row['count']
            else:
                assignments[row[0]] = row[1]
        
        # Get conversion counts by variant
        if db_config.db_type == 'mysql':
            cursor.execute('''
                SELECT variant, COUNT(*) as conversions, 
                       SUM(conversion_value) as total_value,
                       AVG(conversion_value) as avg_value
                FROM ab_conversions 
                WHERE experiment_id = %s 
                GROUP BY variant
            ''', (experiment_id,))
        else:
            cursor.execute('''
                SELECT variant, COUNT(*) as conversions, 
                       SUM(conversion_value) as total_value,
                       AVG(conversion_value) as avg_value
                FROM ab_conversions 
                WHERE experiment_id = ? 
                GROUP BY variant
            ''', (experiment_id,))
        
        conversions = {}
        for row in cursor.fetchall():
            if db_config.db_type == 'mysql':
                conversions[row['variant']] = {
                    'count': row['conversions'],
                    'total_value': float(row['total_value'] or 0),
                    'avg_value': float(row['avg_value'] or 0)
                }
            else:
                conversions[row[0]] = {
                    'count': row[1],
                    'total_value': float(row[2] or 0),
                    'avg_value': float(row[3] or 0)
                }
        
        # Calculate conversion rates and statistics
        results = {}
        for variant in assignments.keys():
            assignment_count = assignments[variant]
            conversion_data = conversions.get(variant, {'count': 0, 'total_value': 0, 'avg_value': 0})
            conversion_count = conversion_data['count']
            
            conversion_rate = (conversion_count / assignment_count * 100) if assignment_count > 0 else 0
            
            results[variant] = {
                'assignments': assignment_count,
                'conversions': conversion_count,
                'conversion_rate': round(conversion_rate, 2),
                'total_value': conversion_data['total_value'],
                'avg_value': conversion_data['avg_value']
            }
        
        conn.close()
        
        return jsonify({
            'status': 'success',
            'experiment_id': experiment_id,
            'experiment_name': experiment['name'] if db_config.db_type == 'mysql' else experiment[1],
            'results': results,
            'total_assignments': sum(assignments.values()),
            'total_conversions': sum(conv['count'] for conv in conversions.values())
        }), 200
        
    except Exception as e:
        print(f"Error getting experiment results: {str(e)}")
        return jsonify({
            'error': 'Failed to get experiment results',
            'status': 'error'
        }), 500

@ab_testing_bp.route('/experiments/<experiment_id>/status', methods=['PUT'])
@rate_limit(max_requests=10, window=300)
def update_experiment_status(experiment_id):
    """Update experiment status (activate, pause, stop)"""
    try:
        if not request.is_json:
            return jsonify({
                'error': 'Content-Type must be application/json',
                'status': 'error'
            }), 400
        
        data = request.get_json()
        
        if 'status' not in data:
            return jsonify({
                'error': 'status is required',
                'status': 'error'
            }), 400
        
        valid_statuses = ['draft', 'active', 'paused', 'completed']
        if data['status'] not in valid_statuses:
            return jsonify({
                'error': f'Invalid status. Must be one of: {valid_statuses}',
                'status': 'error'
            }), 400
        
        conn = db_config.get_connection()
        cursor = conn.cursor()
        
        if db_config.db_type == 'mysql':
            cursor.execute('''
                UPDATE ab_experiments 
                SET status = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
            ''', (data['status'], experiment_id))
        else:
            cursor.execute('''
                UPDATE ab_experiments 
                SET status = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ''', (data['status'], experiment_id))
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({
                'error': 'Experiment not found',
                'status': 'error'
            }), 404
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'status': 'success',
            'message': f'Experiment status updated to {data["status"]}'
        }), 200
        
    except Exception as e:
        print(f"Error updating experiment status: {str(e)}")
        return jsonify({
            'error': 'Failed to update experiment status',
            'status': 'error'
        }), 500