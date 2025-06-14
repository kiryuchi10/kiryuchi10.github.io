import React from 'react';
import './Profile.css';
import profileImage from '../assets/반명함.jpg';
import About from './About'; //About section
import Works from './Works'; //Works section

function Profile() {
  return (
    <div className="profile-container">
      {/* Profile Hero */}
      <div className="profile-hero">
        <img
          className="profile-bg"
          src="https://images.unsplash.com/photo-1499346030926-9a72daac6c63"
          alt="background"
        />
        <img className="profile-pic" src={profileImage} alt="Donghyeun Lee" />
      </div>

      {/* Basic Info */}
      <div className="profile-content">
        <h1>Donghyeun Lee</h1>
        <h4>FULL STACK DEVELOPER</h4>

        <div className="profile-icons">
          <a href="https://github.com/kiryuchi10" target="_blank" rel="noreferrer">
            <i className="fab fa-github"></i>
          </a>
          <a href="https://www.linkedin.com/in/dong-hyeun-lee-47a3b813a" target="_blank" rel="noreferrer">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>

        <p className="profile-description">
          Full Stack Developer with 4+ years of biotech R&D experience, specializing in React, Flask, Spring Boot, and AI integration. 
          Created web apps for manufacturing analytics and nanopore chip defect prediction using Python and ML.
        </p>

        <div className="profile-buttons">
          <a href="#works" className="profile-button active">
            <i className="fas fa-code"></i>
            <span>Projects</span>
          </a>
          <a href="#about" className="profile-button">
            <i className="fas fa-certificate"></i>
            <span>About</span>
          </a>
        </div>
      </div>

      {/* 🧠 About Section */}
      <section id="about" className="profile-section">
        <About />
      </section>

      {/* 🧠 Works / Projects Section */}
      <section id="works" className="profile-section">
        <Works />
      </section>
    </div>
  );
}

export default Profile;
