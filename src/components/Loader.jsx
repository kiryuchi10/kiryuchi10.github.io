// src/components/Loader.jsx
import React from "react";

const Loader = () => {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "1.5rem",
      backgroundColor: "#0f0f0f"
    }}>
      Loading 3D Scene...
    </div>
  );
};

export default Loader;
