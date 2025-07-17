import React from 'react';
import './TechIcons.css';

const TechIcons = () => {
  return (
    <div className="tech-icons-container">
      <div className="tech-icon dna-icon">
        <div className="dna-helix">
          <div className="dna-strand strand-1"></div>
          <div className="dna-strand strand-2"></div>
          <div className="dna-base base-1"></div>
          <div className="dna-base base-2"></div>
          <div className="dna-base base-3"></div>
          <div className="dna-base base-4"></div>
        </div>
        <span>Bioinformatics</span>
      </div>

      <div className="tech-icon battery-icon">
        <div className="battery">
          <div className="battery-body">
            <div className="battery-level"></div>
            <div className="battery-spark">⚡</div>
          </div>
          <div className="battery-tip"></div>
        </div>
        <span>IoT & Sensors</span>
      </div>

      <div className="tech-icon pill-icon">
        <div className="pill">
          <div className="pill-half pill-left"></div>
          <div className="pill-half pill-right"></div>
          <div className="pill-content"></div>
        </div>
        <span>Drug Discovery</span>
      </div>

      <div className="tech-icon flask-icon">
        <div className="flask">
          <div className="flask-neck"></div>
          <div className="flask-body">
            <div className="flask-liquid"></div>
            <div className="flask-bubble bubble-1"></div>
            <div className="flask-bubble bubble-2"></div>
          </div>
        </div>
        <span>Chemistry</span>
      </div>
    </div>
  );
};

export default TechIcons;