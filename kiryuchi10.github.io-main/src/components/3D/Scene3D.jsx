import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Box, Sphere, Torus } from '@react-three/drei';

// Animated floating objects
const FloatingBox = ({ position, color, speed = 1 }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01 * speed;
      meshRef.current.rotation.y += 0.01 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.2;
    }
  });

  return (
    <Box ref={meshRef} position={position} args={[1, 1, 1]}>
      <meshStandardMaterial color={color} />
    </Box>
  );
};

const FloatingSphere = ({ position, color, speed = 1 }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005 * speed;
      meshRef.current.rotation.z += 0.005 * speed;
      meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * speed) * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed * 0.8) * 0.2;
    }
  });

  return (
    <Sphere ref={meshRef} position={position} args={[0.8, 32, 32]}>
      <meshStandardMaterial color={color} wireframe />
    </Sphere>
  );
};

const FloatingTorus = ({ position, color, speed = 1 }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.02 * speed;
      meshRef.current.rotation.y += 0.01 * speed;
      meshRef.current.position.z = position[2] + Math.sin(state.clock.elapsedTime * speed * 1.2) * 0.5;
    }
  });

  return (
    <Torus ref={meshRef} position={position} args={[1, 0.4, 16, 100]}>
      <meshStandardMaterial color={color} />
    </Torus>
  );
};

// Main 3D Scene Component
const Scene3D = ({ 
  showText = true, 
  text = "Welcome to My Portfolio", 
  cameraPosition = [0, 0, 10],
  enableControls = true,
  backgroundColor = "#0a0a0a"
}) => {
  return (
    <div style={{ width: '100%', height: '400px', borderRadius: '10px', overflow: 'hidden' }}>
      <Canvas
        camera={{ position: cameraPosition, fov: 75 }}
        style={{ background: backgroundColor }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4a90e2" />
          
          {/* Stars background */}
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
          
          {/* 3D Text */}
          {showText && (
            <Text
              position={[0, 2, 0]}
              fontSize={1}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              font="/fonts/helvetiker_regular.typeface.json"
            >
              {text}
            </Text>
          )}
          
          {/* Floating Objects */}
          <FloatingBox position={[-3, 0, 0]} color="#4a90e2" speed={1.2} />
          <FloatingSphere position={[3, 0, 0]} color="#e24a4a" speed={0.8} />
          <FloatingTorus position={[0, -2, 0]} color="#4ae24a" speed={1.5} />
          
          {/* Additional decorative elements */}
          <FloatingBox position={[-2, 3, -2]} color="#e2a04a" speed={0.6} />
          <FloatingSphere position={[2, -3, -1]} color="#a04ae2" speed={1.1} />
          
          {/* Controls */}
          {enableControls && (
            <OrbitControls
              enableZoom={true}
              enablePan={false}
              enableRotate={true}
              autoRotate={true}
              autoRotateSpeed={0.5}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 3}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene3D;