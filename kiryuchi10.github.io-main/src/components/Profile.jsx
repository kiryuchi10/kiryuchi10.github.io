import React from "react";
import "./Profile.css";
import profileImage from "../assets/KakaoTalk_20250708_231845951.jpg";
import backgroundGif from "../assets/falling-stars-stars.gif";
import TechIcons from "./TechIcons";


function Profile() {
  return (
    <div className="profile-container">
      {/* Profile Hero */}
      <div className="profile-hero">
        {/* Local falling stars background */}
        <img
          src={backgroundGif}
          alt="Falling Stars"
          className="background-gif"
        />

        {/* Enlarged profile image */}
        <div className="profile-pic-wrapper">
          <img className="profile-pic" src={profileImage} alt="Donghyeun Lee" />
        </div>
      </div>
      {/* Tech Icons Section */}
      <div className="tech-section">
        <h3>Technical Expertise</h3>
        <TechIcons />
      </div>
    
      {/* Basic Info */}
      <div className="profile-content">
        <h1>Donghyeun Lee</h1>
        <h4>FULL STACK DEVELOPER</h4>

        <div className="profile-icons">
          <a
            href="https://github.com/kiryuchi10"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fab fa-github"></i>
          </a>
          <a
            href="https://www.linkedin.com/in/dong-hyeun-lee-47a3b813a"
            target="_blank"
            rel="noreferrer"
          >
            <i className="fab fa-linkedin"></i>
          </a>
        </div>

        <p className="profile-description">
          Full Stack Developer with 4+ years of biotech R&D experience,
          specializing in React, Flask, Spring Boot, and AI integration. Created
          web apps for manufacturing analytics and nanopore chip defect
          prediction using Python and ML.
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

  
    </div>
  );
}

export default Profile;
