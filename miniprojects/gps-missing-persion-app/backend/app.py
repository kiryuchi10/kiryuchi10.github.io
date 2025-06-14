from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from ai_predict import predict_location
import mysql.connector
import os

app = Flask(__name__)
CORS(app)

def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "missing_app")
    )

@app.route("/missing")
def get_missing():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT name, age, last_seen_lat AS lat, last_seen_lon AS lon, image_url FROM missing_persons WHERE status = 'missing'")
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(results)

@app.route("/report", methods=["POST"])
def report_person():
    data = request.json
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO missing_persons (name, age, last_seen_lat, last_seen_lon, status)
        VALUES (%s, %s, %s, %s, 'missing')
    """, (data['name'], data['age'], data['lat'], data['lon']))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({"message": "Person reported"}), 201

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    age = data.get("age")
    hours = data.get("hours_missing")
    result = predict_location(age, hours)
    return jsonify(result)

@app.route("/images/<filename>")
def serve_image(filename):
    return send_from_directory("static/images", filename)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
