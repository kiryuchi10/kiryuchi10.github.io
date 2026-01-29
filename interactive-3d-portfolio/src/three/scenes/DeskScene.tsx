import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/** Placeholder until desk.glb is added. Replace with <DeskModel /> when ready. */
function PlaceholderDesk(): React.ReactElement {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.scale.lerp(
        new THREE.Vector3(hovered ? 1.1 : 1, hovered ? 1.1 : 1, hovered ? 1.1 : 1),
        0.1
      );
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[2, 0.4, 1]} />
        <meshStandardMaterial
          color={hovered ? '#6b4c9a' : '#3d2b5a'}
          emissive={hovered ? '#2a1a4a' : '#0a0a12'}
          emissiveIntensity={hovered ? 0.4 : 0}
        />
      </mesh>
    </Float>
  );
}

export function DeskScene(): React.ReactElement {
  return <PlaceholderDesk />;
}
