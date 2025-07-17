# Portfolio Backend

This backend provides API endpoints for:
- Contact form email sending
- Resume download functionality
- Visitor analytics tracking
- Admin dashboard for visitor statistics

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Email Settings
Create a `.env` file with your email credentials:
```
SENDER_EMAIL=your-gmail@gmail.com
SENDER_PASSWORD=your-app-password
RECIPIENT_EMAIL=donghyeunlee1@gmail.com
```

**Note**: For Gmail, you need to:
1. Enable 2-factor authentication
2. Generate an "App Password" (not your regular password)
3. Use the app password in the `.env` file

### 3. Run Setup Script
```bash
python setup.py
```

### 4. Start the Server
```bash
python app.py
```

The backend will be available at `http://localhost:5000`

## API Endpoints

- `POST /api/contact` - Send contact form emails
- `GET /api/download-resume` - Download resume PDF
- `POST /api/track-visit` - Track visitor analytics
- `GET /api/analytics` - Get visitor statistics (admin)

## Database

The backend uses SQLite to store:
- Visitor information (IP, location, user agent, etc.)
- Contact form submissions
- Page visit statistics

## Security Notes

- Never commit your `.env` file to version control
- Use environment variables in production
- Consider rate limiting for production deployment
- Implement proper authentication for analytics endpoint in production