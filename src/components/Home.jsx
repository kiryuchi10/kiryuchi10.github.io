import React from 'react';
import Hero from './Hero'; // 👈 Add this line

function Home() {
  return (
    <div>
      <Hero /> {/* 👈 Add Hero component here */}

      <div style={{ padding: '2rem' }}>
        <h1>📘 Welcome to My Flipbook Portfolio</h1>
        <p>This is the home page of your interactive portfolio.</p>
        <p>Use the navigation bar to explore your resume, projects, and contact form.</p>
      </div>
    </div>
  );
}

export default Home;
