import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Individual Particle Component
const Particles = ({ count = 1000, color = '#4a90e2' }) => {
  const meshRef = useRef();
  // NOTE: keep refs minimal to avoid unused-vars lint failures in CI

  // Generate random particle positions
  const particlePositions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Random positions in a sphere
      const radius = Math.random() * 20 + 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Random colors with slight variation
      const baseColor = new THREE.Color(color);
      const hsl = {};
      baseColor.getHSL(hsl);
      
      const newColor = new THREE.Color().setHSL(
        hsl.h + (Math.random() - 0.5) * 0.1,
        hsl.s,
        hsl.l + (Math.random() - 0.5) * 0.3
      );
      
      colors[i * 3] = newColor.r;
      colors[i * 3 + 1] = newColor.g;
      colors[i * 3 + 2] = newColor.b;
    }
    
    return { positions, colors };
  }, [count, color]);

  // Animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.001;
      meshRef.current.rotation.y += 0.002;
      
      // Update particle positions for floating effect
      const positions = meshRef.current.geometry.attributes.position.array;
      
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(state.clock.elapsedTime + i * 0.01) * 0.01;
      }
      
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlePositions.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particlePositions.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  );
};

// Animated Connection Lines
const ConnectionLines = ({ particleCount = 100 }) => {
  const linesRef = useRef();
  
  const linePositions = useMemo(() => {
    const positions = [];
    const connections = Math.min(particleCount / 2, 50); // Limit connections for performance
    
    for (let i = 0; i < connections; i++) {
      // Random start and end points
      const start = [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ];
      const end = [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ];
      
      positions.push(...start, ...end);
    }
    
    return new Float32Array(positions);
  }, [particleCount]);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y += 0.001;
      
      // Animate line opacity
      linesRef.current.material.opacity = 0.3 + Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={linePositions.length / 3}
          array={linePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#4a90e2" transparent opacity={0.3} />
    </lineSegments>
  );
};

// Main Particle System Component
const ParticleSystem = ({ 
  particleCount = 1000, 
  showConnections = true, 
  color = '#4a90e2',
  backgroundColor = '#0a0a0a',
  height = '300px'
}) => {
  return (
    <div style={{ 
      width: '100%', 
      height: height, 
      borderRadius: '10px', 
      overflow: 'hidden',
      position: 'relative'
    }}>
      <Canvas
        camera={{ position: [0, 0, 30], fov: 75 }}
        style={{ background: backgroundColor }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        
        {/* Particle System */}
        <Particles count={particleCount} color={color} />
        
        {/* Connection Lines */}
        {showConnections && <ConnectionLines particleCount={particleCount} />}
      </Canvas>
      
      {/* Overlay content */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        color: 'white',
        zIndex: 10,
        pointerEvents: 'none'
      }}>
        <h2 style={{ 
          fontSize: '2rem', 
          margin: '0 0 10px 0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}>
          Interactive Experience
        </h2>
        <p style={{ 
          fontSize: '1rem', 
          margin: 0,
          opacity: 0.8,
          textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
        }}>
          Explore the possibilities
        </p>
      </div>
    </div>
  );
};

export default ParticleSystem;