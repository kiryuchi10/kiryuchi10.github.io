// src/components/Hero.jsx
import React from "react";
import ComputerCanvas from "./canvas/ComputerCanvas";
import avatar from "../assets/DHL_avatar.jpg";

const Hero = () => {
  return (
    <section style={{ backgroundColor: "#0f0f0f", padding: "4rem 2rem" }}>
      <h1
        style={{
          color: "#fff",
          fontSize: "2rem",
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        Welcome to My Flipbook Portfolio
      </h1>

      {/* Flex layout for 3D + Avatar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "2rem" }}>
        {/* Left: 3D Canvas */}
        <div style={{ width: "50%", height: "500px" }}>
          <ComputerCanvas />
        </div>

        {/* Right: Avatar + Info */}
        <div style={{ width: "40%", textAlign: "center" }}>
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
          <p style={{ color: "#eee", marginTop: "1rem", fontWeight: "bold" }}>
            Donghyeun Lee
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
