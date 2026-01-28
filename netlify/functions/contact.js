/**
 * Netlify Function for Contact Form
 * Fallback contact form handler when backend is unavailable
 */

const nodemailer = require('nodemailer');
const { connectLambda, getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  // Enable Netlify Blobs in Lambda compatibility mode
  try {
    connectLambda(event);
  } catch (_) {
    // no-op: connectLambda only needed in some runtimes
  }

  // Get the origin from the request headers
  const origin = event.headers.origin || event.headers.Origin || '*';
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true'
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { name, email, subject, message } = JSON.parse(event.body);

    // Basic validation
    if (!name || !email || !subject || !message) {
      return {
        statusCode: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'All fields are required',
          status: 'error'
        })
      };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'Invalid email format',
          status: 'error'
        })
      };
    }

    // Check if email credentials are configured
    const hasGmailCreds = Boolean(process.env.SENDER_EMAIL && process.env.SENDER_PASSWORD);
    const hasSmtpCreds = Boolean(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS);

    if (!hasGmailCreds && !hasSmtpCreds) {
      console.warn('Contact form submission rejected: email not configured');
      return {
        statusCode: 503,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'error',
          error: 'Email service is not configured. Please use the email fallback button.',
          code: 'EMAIL_NOT_CONFIGURED'
        })
      };
    }

    // Configure email transporter
    const transporter = hasSmtpCreds
      ? nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT),
          secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        })
      : nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASSWORD
          }
        });

    // Email content
    const mailOptions = {
      from: process.env.SENDER_EMAIL || process.env.SMTP_USER,
      to: process.env.RECIPIENT_EMAIL || 'donghyeunlee1@gmail.com',
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Sent via Netlify Functions</small></p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Persist message count for analytics
    try {
      const store = getStore('portfolio-analytics');
      const current = (await store.get('messagesCount', { type: 'json' })) || { total: 0 };
      await store.setJSON('messagesCount', { total: Number(current.total || 0) + 1 });
    } catch (e) {
      // Don't fail the request if analytics persistence fails
      console.warn('Failed to persist messagesCount:', e?.message || e);
    }

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'success',
        message: 'Your message has been sent successfully!'
      })
    };

  } catch (error) {
    console.error('Contact form error:', error);
    
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Failed to send message. Please try again later or use the email fallback.',
        status: 'error'
      })
    };
  }
};