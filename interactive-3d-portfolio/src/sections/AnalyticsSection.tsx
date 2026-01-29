import React, { useState, useEffect, useCallback } from 'react';
import { getAnalytics, type AnalyticsData } from '../services/apiService';
import { useApiStatus } from '../hooks/useApiStatus';
import { SectionContainer } from '../components/layout/SectionContainer';
import '../styles/Analytics.css';

const emptyAnalytics: AnalyticsData = {
  total_visitors: 0,
  github_users: 0,
  total_messages: 0,
  visitors_by_country: [],
  visitors_by_page: [],
  recent_visitors: [],
};

export function AnalyticsSection(): React.ReactElement {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { isOnline, checkStatus } = useApiStatus({ checkOnMount: true, autoCheck: false });

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAnalytics();
      if (response?.data) {
        setAnalytics({
          total_visitors: response.data.total_visitors ?? 0,
          github_users: response.data.github_users ?? 0,
          total_messages: response.data.total_messages ?? 0,
          visitors_by_country: response.data.visitors_by_country ?? [],
          visitors_by_page: response.data.visitors_by_page ?? [],
          recent_visitors: response.data.recent_visitors ?? [],
        });
      } else {
        setAnalytics(emptyAnalytics);
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      const e = err as Error & { code?: string; response?: { status: number } };
      let msg = 'Failed to load analytics data';
      if (e.code === 'ECONNABORTED') msg = 'Request timed out. Please check your connection.';
      else if (e.message?.includes('fetch')) msg = 'Unable to connect to analytics service';
      else if (e.response?.status === 503) msg = 'Analytics service is temporarily unavailable';
      setError(msg);
      setAnalytics(emptyAnalytics);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRetry = useCallback(async () => {
    await checkStatus();
    setRetryCount((c) => c + 1);
    fetchAnalytics();
  }, [checkStatus, fetchAnalytics]);

  useEffect(() => {
    fetchAnalytics();
  }, [retryCount, fetchAnalytics]);

  useEffect(() => {
    const interval = setInterval(fetchAnalytics, 10000);
    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  const currentTime = new Date().toLocaleString();

  if (loading && !analytics) {
    return (
      <SectionContainer id="analytics" title="Visitor Analytics">
        <div className="analytics-loading">
          <div className="analytics-spinner" />
          <p>Loading analytics…</p>
        </div>
      </SectionContainer>
    );
  }

  if (error && !analytics) {
    return (
      <SectionContainer id="analytics" title="Visitor Analytics">
        <div className="analytics-error">
          <p>{error}</p>
          <button type="button" className="btn btn-primary" onClick={handleRetry} disabled={loading}>
            {loading ? 'Retrying…' : 'Try Again'}
          </button>
        </div>
      </SectionContainer>
    );
  }

  const data = analytics ?? emptyAnalytics;
  const hasData =
    data.total_visitors > 0 ||
    data.visitors_by_country.length > 0 ||
    data.visitors_by_page.length > 0 ||
    data.recent_visitors.length > 0;

  return (
    <SectionContainer id="analytics" title="Visitor Analytics">
      <div className="analytics-section" data-time={currentTime}>
        <div className={`analytics-connection ${isOnline ? 'online' : 'offline'}`}>
          <span className="analytics-connection-dot" />
          {isOnline ? 'Connected' : 'Offline'}
        </div>
        {error && (
          <div className="analytics-banner">
            <span>Some data may be outdated.</span>
            <button type="button" className="btn btn-secondary" onClick={handleRetry}>
              Refresh
            </button>
          </div>
        )}
        <p className="analytics-updated">Last updated: {currentTime}</p>
        <div className="analytics-cards">
          <div className="analytics-card">
            <h3>Total Visitors</h3>
            <div className="analytics-number">{data.total_visitors}</div>
          </div>
          <div className="analytics-card">
            <h3>GitHub Users</h3>
            <div className="analytics-number">{data.github_users}</div>
          </div>
          <div className="analytics-card">
            <h3>Messages</h3>
            <div className="analytics-number">{data.total_messages}</div>
          </div>
        </div>
        {!hasData ? (
          <div className="analytics-empty">
            <p>No analytics data yet. Explore the site to generate stats.</p>
            <button type="button" className="btn btn-secondary" onClick={handleRetry}>
              Check for Updates
            </button>
          </div>
        ) : (
          <div className="analytics-tables">
            <div className="analytics-block">
              <h3>Visitors by Country</h3>
              <div className="analytics-rows">
                {data.visitors_by_country.length > 0
                  ? data.visitors_by_country.map(([country, count], i) => (
                      <div key={i} className="analytics-row">
                        <span>{country}</span>
                        <span className="analytics-count">{count}</span>
                      </div>
                    ))
                  : <p className="analytics-empty-text">No country data</p>}
              </div>
            </div>
            <div className="analytics-block">
              <h3>Popular Pages</h3>
              <div className="analytics-rows">
                {data.visitors_by_page.length > 0
                  ? data.visitors_by_page.map(([page, count], i) => (
                      <div key={i} className="analytics-row">
                        <span>{page || 'Home'}</span>
                        <span className="analytics-count">{count}</span>
                      </div>
                    ))
                  : <p className="analytics-empty-text">No page data</p>}
              </div>
            </div>
            <div className="analytics-block analytics-block-full">
              <h3>Recent Visitors</h3>
              <div className="analytics-rows">
                {data.recent_visitors.length > 0 ? (
                  <>
                    <div className="analytics-header">
                      <span>IP</span>
                      <span>Country</span>
                      <span>City</span>
                      <span>Page</span>
                      <span>Time</span>
                    </div>
                    {(data.recent_visitors as unknown[][]).slice(0, 10).map((v, i) => (
                      <div key={i} className="analytics-row">
                        <span>{(v[1] as string)?.substring(0, 12) ?? '—'}…</span>
                        <span>{String(v[3] ?? '—')}</span>
                        <span>{String(v[4] ?? '—')}</span>
                        <span>{String(v[7] ?? 'Home')}</span>
                        <span>{v[2] ? new Date(v[2] as string).toLocaleDateString() : '—'}</span>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="analytics-empty-text">No recent visitors</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
