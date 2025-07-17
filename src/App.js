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
import { useVisitorTracking } from './hooks';

function App() {
  useVisitorTracking(window.location.pathname);

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
    </div>
  );
}

export default App;
