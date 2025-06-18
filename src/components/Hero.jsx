// Hero.jsx
import React from "react";
import ComputerCanvas from "./canvas/ComputerCanvas";
import avatar from "../assets/DHL_avatar.jpg"; // Make sure this exists

const Hero = () => {
  return (
    <section style={{ backgroundColor: "#0f0f0f", padding: "4rem 2rem" }}>
      <h1 style={{ color: "#fff", fontSize: "2rem", textAlign: "center", marginBottom: "2rem" }}>
        Welcome to My Flipbook Portfolio
      </h1>
      <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
        {/* Left: Canvas */}
        <div style={{ width: "600px", height: "500px", flexShrink: 0 }}>
          <ComputerCanvas />
        </div>

        {/* Right: Avatar */}
        <div style={{ width: "300px", textAlign: "center" }}>
          <img
            src={avatar}
            alt="Donghyeun Lee"
            style={{
              width: "100%",
              maxWidth: "300px",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          />
          <p style={{ color: "#eee", marginTop: "1rem", fontWeight: "bold" }}>Donghyeun Lee</p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
