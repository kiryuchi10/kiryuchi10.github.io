/**
 * Netlify Function for Visit Tracking
 * Fallback visit tracking when backend is unavailable
 */

exports.handler = async (event, context) => {
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
    const data = JSON.parse(event.body || '{}');
    
    // Log visit data (in production, you'd store this in a database)
    console.log('Visit tracked:', {
      page: data.page || '/',
      referrer: data.referrer || 'direct',
      timestamp: new Date().toISOString(),
      ip: event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown',
      userAgent: event.headers['user-agent'] || 'unknown'
    });

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'success',
        message: 'Visit tracked successfully'
      })
    };

  } catch (error) {
    console.error('Visit tracking error:', error);
    
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Failed to track visit',
        status: 'error'
      })
    };
  }
};