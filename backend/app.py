from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sqlite3
import os
from datetime import datetime
import json
import requests

app = Flask(__name__)
CORS(app)

# Database setup
def init_db():
    conn = sqlite3.connect('portfolio.db')
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
    
    conn.commit()
    conn.close()

# Get visitor info from IP
def get_visitor_info(ip_address):
    try:
        response = requests.get(f'http://ip-api.com/json/{ip_address}')
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
def track_visit():
    try:
        data = request.get_json()
        ip_address = request.remote_addr
        user_agent = request.headers.get('User-Agent', '')
        
        # Get location info
        location_info = get_visitor_info(ip_address)
        github_user = check_github_user(user_agent)
        
        conn = sqlite3.connect('portfolio.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO visitors (ip_address, user_agent, country, city, github_user, page_visited, referrer)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            ip_address,
            user_agent,
            location_info['country'],
            location_info['city'],
            github_user,
            data.get('page', '/'),
            data.get('referrer', '')
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({'status': 'success'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/contact', methods=['POST'])
def send_contact_email():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')
        
        # Store in database
        conn = sqlite3.connect('portfolio.db')
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO contact_messages (name, email, subject, message, ip_address)
            VALUES (?, ?, ?, ?, ?)
        ''', (name, email, subject, message, request.remote_addr))
        
        conn.commit()
        conn.close()
        
        # Send email
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        sender_email = os.getenv('SENDER_EMAIL', 'your-email@gmail.com')
        sender_password = os.getenv('SENDER_PASSWORD', 'your-app-password')
        recipient_email = "donghyeunlee1@gmail.com"
        
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
        
        return jsonify({'status': 'success', 'message': 'Email sent successfully!'})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download-resume')
def download_resume():
    try:
        resume_path = '../resume/Donghyeun_Lee_Resume.pdf'  # Adjust path as needed
        return send_file(resume_path, as_attachment=True, download_name='Donghyeun_Lee_Resume.pdf')
    except Exception as e:
        return jsonify({'error': 'Resume not found'}), 404

@app.route('/api/analytics')
def get_analytics():
    try:
        conn = sqlite3.connect('portfolio.db')
        cursor = conn.cursor()
        
        # Total visitors
        cursor.execute('SELECT COUNT(*) FROM visitors')
        total_visitors = cursor.fetchone()[0]
        
        # Visitors by country
        cursor.execute('SELECT country, COUNT(*) FROM visitors GROUP BY country ORDER BY COUNT(*) DESC LIMIT 10')
        visitors_by_country = cursor.fetchall()
        
        # Visitors by page
        cursor.execute('SELECT page_visited, COUNT(*) FROM visitors GROUP BY page_visited ORDER BY COUNT(*) DESC')
        visitors_by_page = cursor.fetchall()
        
        # Recent visitors
        cursor.execute('SELECT * FROM visitors ORDER BY timestamp DESC LIMIT 20')
        recent_visitors = cursor.fetchall()
        
        # GitHub users
        cursor.execute('SELECT COUNT(*) FROM visitors WHERE github_user IS NOT NULL')
        github_users = cursor.fetchone()[0]
        
        # Contact messages
        cursor.execute('SELECT COUNT(*) FROM contact_messages')
        total_messages = cursor.fetchone()[0]
        
        conn.close()
        
        return jsonify({
            'total_visitors': total_visitors,
            'visitors_by_country': visitors_by_country,
            'visitors_by_page': visitors_by_page,
            'recent_visitors': recent_visitors,
            'github_users': github_users,
            'total_messages': total_messages
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    init_db()
    app.run(debug=True, port=5000)