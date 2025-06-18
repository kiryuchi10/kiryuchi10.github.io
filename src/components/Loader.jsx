// Loader.jsx (valid fallback inside <Canvas>)
import React from "react";

const Loader = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
};

export default Loader;
