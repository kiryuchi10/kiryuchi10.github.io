/**
 * Netlify Function for Visit Tracking
 * Fallback visit tracking when backend is unavailable
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
    
    const nowIso = new Date().toISOString();
    const ip =
      (event.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
      event.headers['x-real-ip'] ||
      'unknown';

    // Netlify geo headers (available on Netlify CDN)
    const country =
      event.headers['x-nf-country'] ||
      event.headers['x-country'] ||
      data.country ||
      null;
    const city =
      event.headers['x-nf-city'] ||
      event.headers['x-city'] ||
      data.city ||
      null;

    const visit = {
      page: data.page || '/',
      referrer: data.referrer || 'direct',
      timestamp: data.timestamp || nowIso,
      ip,
      user_agent: data.user_agent || event.headers['user-agent'] || 'unknown',
      country,
      city
    };

    // Persist in Netlify Blobs so analytics can read it
    try {
      const store = getStore('portfolio-analytics');
      const existing = (await store.get('visits', { type: 'json' })) || [];
      existing.unshift(visit);
      // Keep the list bounded
      const bounded = existing.slice(0, 2000);
      await store.setJSON('visits', bounded);
    } catch (e) {
      // If Blobs isn't configured (e.g., local runs), still return success.
      console.warn('Netlify Blobs unavailable for visit persistence:', e?.message || e);
    }

    // Log for observability (still helpful)
    console.log('Visit tracked:', {
      page: visit.page,
      referrer: visit.referrer,
      timestamp: visit.timestamp,
      country: visit.country,
      city: visit.city
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