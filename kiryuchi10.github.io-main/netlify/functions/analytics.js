/**
 * Netlify Function for Basic Analytics
 * Fallback analytics handler when backend is unavailable
 */

exports.handler = async (event, context) => {
  // Get the origin from the request headers
  const origin = event.headers.origin || event.headers.Origin || '*';
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Return mock analytics data when backend is unavailable
    // In a real implementation, you'd connect to a database or analytics service
    const mockAnalytics = {
      total_visitors: 0,
      github_users: 0,
      total_messages: 0,
      visitors_by_country: [],
      visitors_by_page: [
        ['/', 1],
        ['/projects', 1],
        ['/contact', 1]
      ],
      recent_visitors: []
    };

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'success',
        data: mockAnalytics,
        note: 'Using fallback analytics data. Deploy backend for full functionality.'
      })
    };

  } catch (error) {
    console.error('Analytics error:', error);
    
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Failed to fetch analytics data',
        status: 'error'
      })
    };
  }
};