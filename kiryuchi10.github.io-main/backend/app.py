from flask import Flask, request, jsonify, send_file, make_response
from flask_cors import CORS
from functools import wraps
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from datetime import datetime
import json
import requests
import re
import html
import time
from functools import wraps
from dotenv import load_dotenv
from database import db_config
from routes.ab_testing import ab_testing_bp
from ab_testing_schema import init_ab_testing_tables

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Register A/B testing blueprint
app.register_blueprint(ab_testing_bp, url_prefix='/api/ab')

# Production configuration
class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///portfolio.db')
    SENDER_EMAIL = os.getenv('SENDER_EMAIL')
    SENDER_PASSWORD = os.getenv('SENDER_PASSWORD')
    RECIPIENT_EMAIL = os.getenv('RECIPIENT_EMAIL', 'donghyeunlee1@gmail.com')
    # Parse CORS origins properly, handling both comma-separated list and single values
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*')
    if CORS_ORIGINS != '*' and ',' in CORS_ORIGINS:
        CORS_ORIGINS = [origin.strip() for origin in CORS_ORIGINS.split(',')]
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')

app.config.from_object(Config)

# Environment variable validation
def validate_environment():
    """Validate required environment variables for production"""
    required_vars = []
    
    if app.config['FLASK_ENV'] == 'production':
        if not app.config['SENDER_EMAIL']:
            required_vars.append('SENDER_EMAIL')
        if not app.config['SENDER_PASSWORD']:
            required_vars.append('SENDER_PASSWORD')
        if app.config['CORS_ORIGINS'] == ['*']:
            print("WARNING: CORS_ORIGINS is set to '*' in production. Consider setting specific domains.")
    
    if required_vars:
        error_msg = f"Missing required environment variables: {', '.join(required_vars)}"
        print(f"ERROR: {error_msg}")
        if app.config['FLASK_ENV'] == 'production':
            raise ValueError(error_msg)
        else:
            print("WARNING: Running in development mode with missing variables")
    
    return True

# Configure CORS with specific origins for production
if app.config['FLASK_ENV'] == 'production':
    # Ensure CORS is properly configured with explicit origins and credentials support
    CORS(app, 
         resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}},
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         expose_headers=["Content-Type", "Authorization"])
    print(f"CORS configured with origins: {app.config['CORS_ORIGINS']}")
else:
    CORS(app)  # Allow all origins in development
    print("CORS configured to allow all origins in development mode")

# Database connection handling with retry logic
def get_db_connection(max_retries=3, retry_delay=1):
    """Get database connection with retry logic for cloud environments"""
    return db_config.get_connection(max_retries, retry_delay)

# Input validation and sanitization utilities
def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def sanitize_input(text, max_length=None):
    """Sanitize user input to prevent XSS and other attacks"""
    if not text:
        return ""
    
    # Remove HTML tags and escape special characters
    sanitized = html.escape(str(text).strip())
    
    # Limit length if specified
    if max_length and len(sanitized) > max_length:
        sanitized = sanitized[:max_length]
    
    return sanitized

def validate_contact_data(data):
    """Validate contact form data"""
    errors = []
    
    # Check required fields
    required_fields = ['name', 'email', 'subject', 'message']
    for field in required_fields:
        if not data.get(field) or not data.get(field).strip():
            errors.append(f"{field.capitalize()} is required")
    
    # Validate email format
    if data.get('email') and not validate_email(data.get('email')):
        errors.append("Invalid email format")
    
    # Validate field lengths
    if data.get('name') and len(data.get('name')) > 100:
        errors.append("Name must be less than 100 characters")
    
    if data.get('subject') and len(data.get('subject')) > 200:
        errors.append("Subject must be less than 200 characters")
    
    if data.get('message') and len(data.get('message')) > 2000:
        errors.append("Message must be less than 2000 characters")
    
    return errors

# Rate limiting decorator
def rate_limit(max_requests=10, window=60):
    """Simple rate limiting decorator"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Simple in-memory rate limiting (for production, use Redis or similar)
            client_ip = request.remote_addr
            current_time = time.time()
            
            # Clean up old entries (simple cleanup)
            if not hasattr(rate_limit, 'requests'):
                rate_limit.requests = {}
            
            if client_ip not in rate_limit.requests:
                rate_limit.requests[client_ip] = []
            
            # Remove old requests outside the window
            rate_limit.requests[client_ip] = [
                req_time for req_time in rate_limit.requests[client_ip]
                if current_time - req_time < window
            ]
            
            # Check if rate limit exceeded
            if len(rate_limit.requests[client_ip]) >= max_requests:
                return jsonify({
                    'error': 'Rate limit exceeded. Please try again later.',
                    'status': 'error'
                }), 429
            
            # Add current request
            rate_limit.requests[client_ip].append(current_time)
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

# Error handler for consistent error responses
@app.errorhandler(400)
def bad_request(error):
    return jsonify({
        'error': 'Bad request',
        'status': 'error',
        'message': 'The request could not be understood by the server'
    }), 400

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'error': 'Not found',
        'status': 'error',
        'message': 'The requested resource was not found'
    }), 404

@app.errorhandler(429)
def rate_limit_exceeded(error):
    return jsonify({
        'error': 'Rate limit exceeded',
        'status': 'error',
        'message': 'Too many requests. Please try again later.'
    }), 429

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'error': 'Internal server error',
        'status': 'error',
        'message': 'An unexpected error occurred'
    }), 500

# Database setup
def init_db():
    """Initialize database with proper error handling"""
    return db_config.init_database()

# Get visitor info from IP
def get_visitor_info(ip_address):
    try:
        response = requests.get(f'http://ip-api.com/json/{ip_address}', timeout=5)
        data = response.json()
        return {
            'country': data.get('country', 'Unknown'),
            'city': data.get('city', 'Unknown')
        }
    except:
        return {'country': 'Unknown', 'city': 'Unknown'}

# Check if visitor is a GitHub user
def check_github_user(user_agent):
    # Simple heuristic - you can enhance this
    if 'github' in user_agent.lower():
        return 'GitHub User'
    return None

@app.route('/api/track-visit', methods=['POST'])
@rate_limit(max_requests=20, window=60)  # Allow more requests for tracking
def track_visit():
    try:
        # Validate request content type
        if not request.is_json:
            return jsonify({
                'error': 'Content-Type must be application/json',
                'status': 'error'
            }), 400
        
        data = request.get_json()
        if not data:
            data = {}
        
        ip_address = request.remote_addr
        user_agent = request.headers.get('User-Agent', '')
        
        # Sanitize input data
        page_visited = sanitize_input(data.get('page', '/'), max_length=500)
        referrer = sanitize_input(data.get('referrer', ''), max_length=500)
        
        # Get location info with error handling
        try:
            location_info = get_visitor_info(ip_address)
        except Exception as e:
            print(f"Failed to get location info: {str(e)}")
            location_info = {'country': 'Unknown', 'city': 'Unknown'}
        
        github_user = check_github_user(user_agent)
        
        # Use improved database connection
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if db_config.db_type == 'mysql':
            cursor.execute('''
                INSERT INTO visitors (ip_address, user_agent, country, city, github_user, page_visited, referrer)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            ''', (
                ip_address,
                user_agent,
                location_info['country'],
                location_info['city'],
                github_user,
                page_visited,
                referrer
            ))
        else:
            cursor.execute('''
                INSERT INTO visitors (ip_address, user_agent, country, city, github_user, page_visited, referrer)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                ip_address,
                user_agent,
                location_info['country'],
                location_info['city'],
                github_user,
                page_visited,
                referrer
            ))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'status': 'success',
            'message': 'Visit tracked successfully'
        }), 200
        
    except Exception as e:
        if 'database' in str(e).lower() or 'mysql' in str(e).lower() or 'sqlite' in str(e).lower():
            print(f"Database error in track_visit: {str(e)}")
            return jsonify({
                'error': 'Database error occurred',
                'status': 'error'
            }), 500
    except Exception as e:
        print(f"Unexpected error in track_visit: {str(e)}")
        return jsonify({
            'error': 'An unexpected error occurred',
            'status': 'error'
        }), 500

@app.route('/api/contact', methods=['POST'])
@rate_limit(max_requests=10, window=300)  # 10 requests per 5 minutes for contact form
def send_contact_email():
    try:
        # Validate request content type
        if not request.is_json:
            return jsonify({
                'error': 'Content-Type must be application/json',
                'status': 'error'
            }), 400
        
        data = request.get_json()
        if not data:
            return jsonify({
                'error': 'Request body is required',
                'status': 'error'
            }), 400
        
        # Validate contact form data
        validation_errors = validate_contact_data(data)
        if validation_errors:
            return jsonify({
                'error': 'Validation failed',
                'status': 'error',
                'details': validation_errors
            }), 400
        
        # Sanitize input data
        name = sanitize_input(data.get('name'), max_length=100)
        email = sanitize_input(data.get('email'), max_length=254)
        subject = sanitize_input(data.get('subject'), max_length=200)
        message = sanitize_input(data.get('message'), max_length=2000)
        
        # Store in database with improved connection handling
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if db_config.db_type == 'mysql':
            cursor.execute('''
                INSERT INTO contact_messages (name, email, subject, message, ip_address)
                VALUES (%s, %s, %s, %s, %s)
            ''', (name, email, subject, message, request.remote_addr))
        else:
            cursor.execute('''
                INSERT INTO contact_messages (name, email, subject, message, ip_address)
                VALUES (?, ?, ?, ?, ?)
            ''', (name, email, subject, message, request.remote_addr))
        
        conn.commit()
        conn.close()
        
        # Send email using configuration
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        sender_email = app.config['SENDER_EMAIL']
        sender_password = app.config['SENDER_PASSWORD']
        recipient_email = app.config['RECIPIENT_EMAIL']
        
        # Validate email configuration
        if not sender_email or not sender_password:
            print(f"Email configuration missing - SENDER_EMAIL: {bool(sender_email)}, SENDER_PASSWORD: {bool(sender_password)}")
            return jsonify({
                'error': 'Email service temporarily unavailable',
                'status': 'error'
            }), 503
        
        # Check for placeholder values
        if sender_email == 'your-gmail@gmail.com' or sender_password == 'your-app-password':
            print("Email credentials are still set to placeholder values")
            return jsonify({
                'error': 'Email service not configured',
                'status': 'error'
            }), 503
        
        try:
            msg = MIMEMultipart()
            msg['From'] = sender_email
            msg['To'] = recipient_email
            msg['Subject'] = f"Portfolio Contact: {subject}"
            
            body = f"""
            New contact form submission:
            
            Name: {name}
            Email: {email}
            Subject: {subject}
            
            Message:
            {message}
            
            Sent from: {request.remote_addr}
            Time: {datetime.now()}
            """
            
            msg.attach(MIMEText(body, 'plain'))
            
            server = smtplib.SMTP(smtp_server, smtp_port)
            server.starttls()
            server.login(sender_email, sender_password)
            text = msg.as_string()
            server.sendmail(sender_email, recipient_email, text)
            server.quit()
            
            print(f"Email sent successfully from {sender_email} to {recipient_email}")
            return jsonify({
                'status': 'success',
                'message': 'Your message has been sent successfully!'
            }), 200
            
        except smtplib.SMTPAuthenticationError as e:
            print(f"SMTP Authentication Error: {str(e)}")
            return jsonify({
                'error': 'Email authentication failed',
                'status': 'error'
            }), 503
        except smtplib.SMTPException as e:
            print(f"SMTP Error: {str(e)}")
            return jsonify({
                'error': 'Failed to send email. Please try again later.',
                'status': 'error'
            }), 503
        except Exception as e:
            print(f"Unexpected error sending email: {str(e)}")
            return jsonify({
                'error': 'An unexpected error occurred while sending email',
                'status': 'error'
            }), 500
    
    except Exception as e:
        if 'database' in str(e).lower() or 'mysql' in str(e).lower() or 'sqlite' in str(e).lower():
            print(f"Database error in send_contact_email: {str(e)}")
            return jsonify({
                'error': 'Database error occurred',
                'status': 'error'
            }), 500
    except Exception as e:
        print(f"Unexpected error in send_contact_email: {str(e)}")
        return jsonify({
            'error': 'An unexpected error occurred',
            'status': 'error'
        }), 500

@app.route('/api/download-resume')
@rate_limit(max_requests=10, window=60)  # Reasonable limit for resume downloads
def download_resume():
    try:
        resume_path = '../resume/Donghyeun_Lee_Resume.pdf'  # Adjust path as needed
        
        # Check if file exists
        if not os.path.exists(resume_path):
            return jsonify({
                'error': 'Resume not found',
                'status': 'error'
            }), 404
        
        return send_file(resume_path, as_attachment=True, download_name='Donghyeun_Lee_Resume.pdf')
    except FileNotFoundError:
        return jsonify({
            'error': 'Resume file not found',
            'status': 'error'
        }), 404
    except Exception as e:
        print(f"Error downloading resume: {str(e)}")
        return jsonify({
            'error': 'Failed to download resume',
            'status': 'error'
        }), 500

@app.route('/api/analytics')
@rate_limit(max_requests=30, window=60)  # Allow frequent analytics requests
def get_analytics():
    try:
        # Use improved database connection
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Total visitors
        cursor.execute('SELECT COUNT(*) FROM visitors')
        result = cursor.fetchone()
        total_visitors = result[0] if db_config.db_type == 'sqlite' else result['COUNT(*)']
        
        # Visitors by country
        cursor.execute('SELECT country, COUNT(*) as count FROM visitors GROUP BY country ORDER BY count DESC LIMIT 10')
        visitors_by_country = []
        for row in cursor.fetchall():
            if db_config.db_type == 'mysql':
                visitors_by_country.append([row['country'], row['count']])
            else:
                visitors_by_country.append([row[0], row[1]])
        
        # Visitors by page
        cursor.execute('SELECT page_visited, COUNT(*) as count FROM visitors GROUP BY page_visited ORDER BY count DESC')
        visitors_by_page = []
        for row in cursor.fetchall():
            if db_config.db_type == 'mysql':
                visitors_by_page.append([row['page_visited'], row['count']])
            else:
                visitors_by_page.append([row[0], row[1]])
        
        # Recent visitors
        cursor.execute('SELECT * FROM visitors ORDER BY timestamp DESC LIMIT 20')
        recent_visitors = []
        for row in cursor.fetchall():
            if db_config.db_type == 'mysql':
                recent_visitors.append([
                    row['id'], row['ip_address'], row['user_agent'], 
                    str(row['timestamp']), row['country'], row['city'],
                    row['github_user'], row['page_visited'], row['referrer']
                ])
            else:
                recent_visitors.append(list(row))
        
        # GitHub users
        cursor.execute('SELECT COUNT(*) FROM visitors WHERE github_user IS NOT NULL')
        result = cursor.fetchone()
        github_users = result[0] if db_config.db_type == 'sqlite' else result['COUNT(*)']
        
        # Contact messages
        cursor.execute('SELECT COUNT(*) FROM contact_messages')
        result = cursor.fetchone()
        total_messages = result[0] if db_config.db_type == 'sqlite' else result['COUNT(*)']
        
        conn.close()
        
        return jsonify({
            'status': 'success',
            'data': {
                'total_visitors': total_visitors,
                'visitors_by_country': visitors_by_country,
                'visitors_by_page': visitors_by_page,
                'recent_visitors': recent_visitors,
                'github_users': github_users,
                'total_messages': total_messages
            }
        }), 200
    
    except Exception as e:
        if 'database' in str(e).lower() or 'mysql' in str(e).lower() or 'sqlite' in str(e).lower():
            print(f"Database error in get_analytics: {str(e)}")
            return jsonify({
                'error': 'Database error occurred',
                'status': 'error'
            }), 500
    except Exception as e:
        print(f"Unexpected error in get_analytics: {str(e)}")
        return jsonify({
            'error': 'An unexpected error occurred',
            'status': 'error'
        }), 500

# Root path handler
@app.route('/')
def root():
    """Root path handler to provide API information"""
    return jsonify({
        'name': 'Portfolio Backend API',
        'status': 'online',
        'version': '1.0.0',
        'endpoints': {
            'health': '/api/health',
            'contact': '/api/contact',
            'analytics': '/api/analytics',
            'track-visit': '/api/track-visit',
            'download-resume': '/api/download-resume'
        },
        'documentation': 'See README for API documentation'
    }), 200

# Health check endpoint for deployment monitoring
@app.route('/api/health')
def health_check():
    """Health check endpoint for monitoring"""
    try:
        # Test database connection
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT 1')
        conn.close()
        
        # Add CORS headers directly to this response for better debugging
        response = jsonify({
            'status': 'healthy',
            'timestamp': datetime.now().isoformat(),
            'version': '1.0.0',
            'cors_config': {
                'origins': app.config['CORS_ORIGINS'],
                'env': app.config['FLASK_ENV']
            }
        })
        
        # Add CORS headers directly to ensure they're present
        response.headers.add('Access-Control-Allow-Origin', 'https://kiryuchi10.github.io')
        response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        
        return response, 200
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 503

# CORS preflight handler for all API routes
@app.route('/api/<path:path>', methods=['OPTIONS'])
def handle_preflight(path):
    """Handle CORS preflight requests explicitly"""
    response = jsonify({'status': 'ok'})
    response.headers.add('Access-Control-Allow-Origin', 'https://kiryuchi10.github.io')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    response.headers.add('Access-Control-Max-Age', '3600')  # Cache preflight for 1 hour
    return response, 200

if __name__ == '__main__':
    # Validate environment variables
    validate_environment()
    
    # Initialize database
    init_db()
    
    # Initialize A/B testing tables
    try:
        init_ab_testing_tables()
        print("A/B testing functionality initialized successfully")
    except Exception as e:
        print(f"Warning: Failed to initialize A/B testing tables: {str(e)}")
    
    # Run app with environment-specific configuration
    debug_mode = app.config['FLASK_ENV'] != 'production'
    port = int(os.getenv('PORT', 5000))
    
    app.run(debug=debug_mode, host='0.0.0.0', port=port)