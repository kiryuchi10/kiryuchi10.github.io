// src/components/canvas/ComputerCanvas.jsx
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import Loader from "../Loader";

const GridAsciiBox = ({ position, label }) => (
  <group>
    <mesh position={position}>
      <boxGeometry args={[1.5, 1.5, 1.5]} />
      <meshStandardMaterial color="#915EFF" />
    </mesh>
    <Text
      position={[position[0], position[1] - 1.2, position[2]]}
      fontSize={0.3}
      color="white"
      anchorX="center"
      anchorY="middle"
      maxWidth={4}
    >
      {label}
    </Text>
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
