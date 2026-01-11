# Portfolio Website Setup Guide

This guide will help you set up your enhanced portfolio website with backend functionality.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Git

### 1. Install Frontend Dependencies
```bash
npm install
```

### 2. Setup Backend
```bash
npm run setup-backend
```

### 3. Configure Email (Important!)
Edit `backend/.env` file with your Gmail credentials:
```
SENDER_EMAIL=your-gmail@gmail.com
SENDER_PASSWORD=your-app-password
RECIPIENT_EMAIL=donghyeunlee1@gmail.com
```

**Gmail Setup:**
1. Enable 2-factor authentication on your Gmail account
2. Go to Google Account Settings > Security > App passwords
3. Generate a new app password for "Mail"
4. Use this app password (not your regular password) in the `.env` file

### 4. Add Your Resume
Place your resume PDF file in the `resume/` folder as `Donghyeun_Lee_Resume.pdf`

### 5. Run Development Server
```bash
npm run dev
```

This will start both frontend (http://localhost:3000) and backend (http://localhost:5000)

## 🎯 New Features

### ✅ Backend Implementation
- **Contact Form**: Now sends real emails to your inbox
- **Resume Download**: Visitors can download your resume PDF
- **Visitor Analytics**: Track visitor statistics and demographics

### ✅ Visitor Analytics Dashboard
- Total visitor count
- Visitors by country and city
- Popular pages tracking
- GitHub user detection
- Recent visitor activity
- Contact form submissions tracking

### ✅ Enhanced UI/UX
- **Fixed Project Images**: No more unnecessary whitespace
- **Animated Tech Icons**: Replaced ASCII art with beautiful animated icons
  - DNA helix for bioinformatics
  - Animated battery for IoT/sensors
  - Pill animation for drug discovery
  - Flask with bubbles for chemistry
- **Resume Download Button**: Professional download functionality
- **Improved Contact Form**: Real-time status messages

### ✅ Professional Styling
- Gradient backgrounds and modern design
- Hover animations and transitions
- Responsive design for all devices
- Loading states and error handling

## 📊 Analytics Dashboard

Visit `/analytics` to see:
- Visitor statistics
- Geographic distribution
- Page popularity
- Recent visitor activity
- Contact form submissions

## 🛠️ Development Commands

```bash
# Start frontend only
npm start

# Start backend only
npm run backend

# Start both frontend and backend
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy

# Setup backend
npm run setup-backend
```

## 📁 Project Structure

```
kiryuchi10.github.io/
├── src/
│   ├── components/
│   │   ├── Analytics.jsx          # Visitor analytics dashboard
│   │   ├── ContactForm.jsx        # Enhanced contact form
│   │   ├── TechIcons.jsx          # Animated tech icons
│   │   ├── ResumeDownload.jsx     # Resume download button
│   │   └── ...
│   ├── hooks/
│   │   └── useVisitorTracking.js  # Visitor tracking hook
│   └── ...
├── backend/
│   ├── app.py                     # Flask backend server
│   ├── requirements.txt           # Python dependencies
│   ├── setup.py                   # Backend setup script
│   └── .env                       # Email configuration
├── resume/
│   └── Donghyeun_Lee_Resume.pdf   # Your resume file
└── ...
```

## 🔧 Troubleshooting

### Email Not Sending
1. Check your `.env` file has correct credentials
2. Ensure you're using an App Password, not your regular Gmail password
3. Verify 2-factor authentication is enabled on Gmail

### Backend Not Starting
1. Make sure Python is installed: `python --version`
2. Install requirements: `pip install -r backend/requirements.txt`
3. Check for port conflicts (port 5000)

### Analytics Not Loading
1. Ensure backend is running on port 5000
2. Check browser console for CORS errors
3. Verify database was created successfully

## 🚀 Deployment Notes

### Frontend (GitHub Pages)
```bash
npm run deploy
```

### Backend (Production)
For production deployment, consider:
- Using environment variables instead of `.env` files
- Implementing rate limiting
- Adding authentication for analytics endpoint
- Using a production database (PostgreSQL/MySQL)
- Setting up HTTPS

## 📧 Support

If you encounter any issues, check the browser console and backend logs for error messages.

Happy coding! 🎉