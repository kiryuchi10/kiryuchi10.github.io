/**
 * Netlify Function for Basic Analytics
 * Fallback analytics handler when backend is unavailable
 */

const { connectLambda, getStore } = require('@netlify/blobs');

exports.handler = async (event, context) => {
  // Enable Netlify Blobs in Lambda compatibility mode
  try {
    connectLambda(event);
  } catch (_) {
    // no-op
  }

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
    let visits = [];
    let messagesCount = { total: 0 };

    try {
      const store = getStore('portfolio-analytics');
      visits = (await store.get('visits', { type: 'json' })) || [];
      messagesCount = (await store.get('messagesCount', { type: 'json' })) || { total: 0 };
    } catch (e) {
      // Local/dev fallback where Netlify Blobs context isn't present
      console.warn('Netlify Blobs unavailable for analytics:', e?.message || e);
    }

    // Compute totals
    const uniqueIps = new Set();
    const byCountry = new Map();
    const byPage = new Map();

    for (const v of visits) {
      if (v?.ip) uniqueIps.add(v.ip);
      const country = v?.country || 'Unknown';
      byCountry.set(country, (byCountry.get(country) || 0) + 1);
      const page = v?.page || '/';
      byPage.set(page, (byPage.get(page) || 0) + 1);
    }

    const visitors_by_country = Array.from(byCountry.entries()).sort((a, b) => b[1] - a[1]);
    const visitors_by_page = Array.from(byPage.entries()).sort((a, b) => b[1] - a[1]);

    // Format recent visitors similar to your UI's expectations: [id, ip, timestamp, country, city, ..., page]
    const recent_visitors = visits.slice(0, 25).map((v, idx) => ([
      String(idx + 1),
      v.ip || 'unknown',
      v.timestamp || new Date().toISOString(),
      v.country || 'Unknown',
      v.city || 'Unknown',
      '', // placeholder
      '', // placeholder
      v.page || '/'
    ]));

    const analytics = {
      total_visitors: uniqueIps.size,
      github_users: 0,
      total_messages: Number(messagesCount.total || 0),
      visitors_by_country,
      visitors_by_page,
      recent_visitors
    };

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'success',
        data: analytics,
        note: visits.length === 0 ? 'No persisted analytics yet (or Blobs not configured in this environment).' : undefined
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