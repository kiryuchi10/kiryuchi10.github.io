// ComputerCanvas.jsx
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import Loader from "../Loader";

// ASCII Art Map
const asciiMap = {
  DNA: `     CCC     WWW\n    C   C   W   W\n   C     C W     W\n    C   C   W   W\n     CCC     WWW`,
  Battery: `   _______\n  |_______|\n  |       |\n  |  ⚡⚡⚡  |\n  |_______|`,
  Pill: `     _________\n   /          \\\n  |   █████   |\n   \\__________/`,
  Flask: `     ___\n    /   \\\n   |     |\n   | (_) |\n   |_____| \n     |||`,
};

// Component to render each ASCII art block
const GridAsciiBox = ({ position, label }) => (
  <group position={position}>
    <Html center>
      <div style={{ textAlign: "center", fontFamily: "monospace", color: "white", fontSize: "0.9rem", whiteSpace: "pre" }}>
        <pre>{asciiMap[label]}</pre>
        <p>{label}</p>
      </div>
    </Html>
  </group>
);

const ComputerCanvas = () => {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
      <Suspense fallback={<Loader />}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 5, 5]} intensity={1} />
        <GridAsciiBox position={[-1.5, 1.5, 0]} label="DNA" />
        <GridAsciiBox position={[1.5, 1.5, 0]} label="Battery" />
        <GridAsciiBox position={[-1.5, -1.5, 0]} label="Pill" />
        <GridAsciiBox position={[1.5, -1.5, 0]} label="Flask" />
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
};

export default ComputerCanvas;
