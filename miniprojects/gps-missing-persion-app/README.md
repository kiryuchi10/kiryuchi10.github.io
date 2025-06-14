# GPS Missing Person Tracker App

This project is a full-stack application to help track and predict missing persons using GPS data and AI. It includes:

- A **React Native frontend** for reporting and viewing missing people on a map
- A **Flask backend** for data handling, image serving, AI prediction, user authentication, and admin panel
- A **MySQL** or **PostgreSQL** database for storing person data and users
- AI module to predict next possible location using age and time missing
- Optional: Flask-Login auth and Flask-Admin interface

---

## 🚀 Quick Start

### 1. Clone or unzip the frontend and backend folders

### 2. Backend Setup

#### Environment setup

Copy `.env.template` to `.env` and fill in your DB credentials:

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=missing_app
```

#### Install dependencies

```bash
pip install -r requirements.txt
```

#### Run SQL setup

Use `sql/schema.sql` and `sql/users.sql` to set up database tables:

```bash
mysql -u root -p missing_app < sql/schema.sql
mysql -u root -p missing_app < sql/users.sql
```

#### Start the Flask app

```bash
python app.py
```

---

### 3. Frontend Setup (React Native)

Install dependencies:

```bash
npm install
```

Start Expo (React Native dev environment):

```bash
npx expo start
```

Make sure the API URL in `App.js` points to your machine’s IP address (e.g., `http://10.0.2.2:5000/` for Android emulator).

---

## 🔐 Authentication API

- `POST /register`: { username, password }
- `POST /login`: { username, password }

Session stored via Flask session.

---

## 🧠 AI Prediction

- `POST /predict`: { age, hours_missing }
- Returns: predicted latitude and longitude

---

## 🛠 Admin Panel

Run `admin_panel.py` for browser-based admin interface (CRUD for missing_persons).

```bash
python admin_panel.py
```

---

## 📦 Project Structure

```bash
backend/
├── app.py
├── auth.py
├── ai_predict.py
├── admin_panel.py
├── static/images/
├── sql/
│   ├── schema.sql
│   └── users.sql

frontend-react-native/
├── App.js
```

---

## ✅ Integration Instructions

1. **Mount auth system in app.py:**

```python
from auth import auth_bp
app.register_blueprint(auth_bp)
```

2. **Ensure CORS is enabled:**

```python
from flask_cors import CORS
CORS(app)
```

3. **Use `ai_predict.py` in `/predict` route already shown**

4. **Run admin panel with SQLAlchemy URI using your `.env`**

---

## 📬 Contact

Created for humanitarian use cases such as search and rescue and emergency tracking.

---

## 🌐 Full Setup and Deployment Guide

### ✅ Requirements
- Node.js + npm
- Expo CLI (for React Native)
- Python 3.10+
- MySQL or PostgreSQL
- Git (optional)
- Vercel/Render/Railway (for deployment, optional)

---

## ⚙️ Backend Setup

1. Create a `.env` file using `.env.template` with DB credentials.
2. Install backend requirements:
```bash
pip install -r requirements.txt
```
3. Run SQL to create tables:
```bash
mysql -u root -p missing_app < sql/schema.sql
mysql -u root -p missing_app < sql/users.sql
```
4. Run Flask API:
```bash
python app.py
```
5. For AI:
- Access `/predict` via `POST` with `{"age": 65, "hours_missing": 4}`

6. For Admin:
```bash
python admin_panel.py
```

---

## 📱 Frontend (React Native)

1. Install dependencies:
```bash
npm install
```
2. Start Expo:
```bash
npx expo start
```
3. Update URLs in `App.js` to point to your backend:
   - Android emulator: `http://10.0.2.2:5000`
   - Real device: `http://<your-ip>:5000`

---

## 🔐 Authentication

Use `auth.py` for:
- `/register` with `POST { username, password }`
- `/login` with `POST { username, password }`

---

## 🧪 Testing

### Backend:
Use `pytest` or `curl` for:
```bash
curl http://localhost:5000/missing
curl -X POST -H "Content-Type: application/json" -d '{"name": "Test", "age": 70, "lat": 37.77, "lon": -122.42}' http://localhost:5000/report
```

### Frontend:
- Run app in Expo
- Check map markers, test form submission
- Validate prediction responses via dev console

---

## 🚀 Deployment

### Flask Backend
- Use **Render**, **Railway**, or **Docker** to deploy
- Expose `/missing`, `/report`, `/predict`, `/images/`

### React Native App
- Build with `eas build`
- Publish via Expo or compile native apps

---

## 🧩 Final Notes

- All `.env` secrets must be kept secure
- You can add Firebase for auth or SMS alerts
- Contact local agencies for real-world deployment partnerships

---

## 🌐 Frontend Setup (React + Vite)

### Prerequisites
- Node.js >= 18
- npm or yarn

### Setup Instructions

1. Navigate to the frontend folder:
```bash
cd frontend-react-vite
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open in your browser:
```
http://localhost:5173
```

> 📌 Make sure your backend Flask API is running on `http://localhost:5000` or adjust the API URLs in `App.jsx`.

---

### 🔄 Features

- Report a missing person via form
- View all reported people in a list
- Connects to backend Flask API (`/missing`, `/report`)

> You can extend this by adding Leaflet.js or Google Maps API for interactive maps.

---

