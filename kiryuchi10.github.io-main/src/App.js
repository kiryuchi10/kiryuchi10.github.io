import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import Home from './components/Home';
import Cover from './components/Cover';
import Profile from './components/Profile';
import Resume from './components/Resume';
import ContactForm from './components/ContactForm';
import Works from './components/Works';
import Analytics from './components/Analytics';
import Blog from './components/Blog';
import VisitorTracker from './components/VisitorTracker';
import ApiStatusChecker from './components/ApiStatusChecker';
import { useVisitorTracking } from './hooks';

function App() {
  // Initialize visitor tracking with automatic page tracking enabled
  useVisitorTracking({
    trackOnMount: true,
    trackPageChanges: true,
    enableDebug: process.env.NODE_ENV === 'development'
  });

  return (
    <div style={{ display: 'flex' }}>
      <NavigationBar />
      <div style={{ marginLeft: '180px', padding: '2rem', flex: 1 }}>
        <Routes>
          {/* Default route */}
          <Route path="/" element={<Home />} />

          {/* Page routes */}
          <Route path="/cover" element={<Cover />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/projects" element={<Works />} />
          <Route path="/contact" element={<ContactForm />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/analytics" element={<Analytics />} />

          {/* Optional fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      
      {/* Debug Components - only show in development */}
      <VisitorTracker showDebugInfo={process.env.NODE_ENV === 'development'} />
      
      {/* API Status Checker for testing - shows in development and can be enabled in production */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1001 }}>
          <ApiStatusChecker showInProduction={false} />
        </div>
      )}
    </div>
  );
}

export default App;
