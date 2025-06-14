import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Loader from "../Loader"; // adjust path

const ComputersCanvas = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <Suspense fallback={<Loader />}>
        <ambientLight />
        <directionalLight position={[0, 5, 5]} intensity={1} />
        <mesh>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color={"#915EFF"} />
        </mesh>
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
};

export default ComputersCanvas;
