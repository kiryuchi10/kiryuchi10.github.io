import mysql.connector
import pandas as pd
from sklearn.neighbors import KNeighborsRegressor
import os

def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", ""),
        database=os.getenv("DB_NAME", "missing_app")
    )

def predict_location(age, hours_missing):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT age, last_seen_lat, last_seen_lon, TIMESTAMPDIFF(HOUR, NOW() - INTERVAL hours_missing HOUR, NOW()) AS hours_missing FROM missing_persons WHERE status = 'found'")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()

    if not rows:
        return None

    df = pd.DataFrame(rows)
    X = df[['age', 'hours_missing']]
    y = df[['last_seen_lat', 'last_seen_lon']]

    model = KNeighborsRegressor(n_neighbors=1)
    model.fit(X, y)

    prediction = model.predict([[age, hours_missing]])
    return {"predicted_lat": prediction[0][0], "predicted_lon": prediction[0][1]}
