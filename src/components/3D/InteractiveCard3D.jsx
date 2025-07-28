import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, RoundedBox, Html } from '@react-three/drei';
import { motion } from 'framer-motion';

// 3D Card Component
const Card3D = ({ position, rotation, color, title, description, onClick, isHovered }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      
      // Hover effect
      if (isHovered) {
        meshRef.current.scale.setScalar(1.05);
        meshRef.current.rotation.y += 0.02;
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} onClick={onClick}>
      {/* Card Background */}
      <RoundedBox args={[3, 4, 0.2]} radius={0.1} smoothness={4}>
        <meshStandardMaterial 
          color={isHovered ? '#ffffff' : color} 
          transparent 
          opacity={0.9}
        />
      </RoundedBox>
      
      {/* Card Content */}
      <Text
        position={[0, 1, 0.11]}
        fontSize={0.3}
        color={isHovered ? '#333333' : '#ffffff'}
        anchorX="center"
        anchorY="middle"
        maxWidth={2.5}
        font="/fonts/helvetiker_bold.typeface.json"
      >
        {title}
      </Text>
      
      <Text
        position={[0, 0, 0.11]}
        fontSize={0.15}
        color={isHovered ? '#666666' : '#cccccc'}
        anchorX="center"
        anchorY="middle"
        maxWidth={2.5}
        textAlign="center"
      >
        {description}
      </Text>
      
      {/* Interactive HTML overlay */}
      <Html
        position={[0, -1.5, 0.11]}
        transform
        occlude
        style={{
          width: '200px',
          textAlign: 'center',
          pointerEvents: isHovered ? 'auto' : 'none',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4a90e2',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick && onClick();
          }}
        >
          Learn More
        </motion.button>
      </Html>
    </group>
  );
};

// Interactive 3D Cards Container
const InteractiveCard3D = ({ cards = [], onCardClick }) => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const defaultCards = [
    {
      id: 1,
      title: "Frontend Development",
      description: "React, Vue.js, Angular\nModern UI/UX Design",
      color: "#4a90e2",
      position: [-4, 0, 0],
      rotation: [0, 0.2, 0]
    },
    {
      id: 2,
      title: "Backend Development",
      description: "Node.js, Python, Java\nAPI Design & Databases",
      color: "#e24a4a",
      position: [0, 0, 0],
      rotation: [0, 0, 0]
    },
    {
      id: 3,
      title: "3D & Animation",
      description: "Three.js, WebGL\nInteractive Experiences",
      color: "#4ae24a",
      position: [4, 0, 0],
      rotation: [0, -0.2, 0]
    }
  ];

  const cardsToRender = cards.length > 0 ? cards : defaultCards;

  return (
    <div style={{ width: '100%', height: '500px', borderRadius: '10px', overflow: 'hidden' }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
        style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4a90e2" />
        
        {/* Render Cards */}
        {cardsToRender.map((card) => (
          <Card3D
            key={card.id}
            position={card.position}
            rotation={card.rotation}
            color={card.color}
            title={card.title}
            description={card.description}
            isHovered={hoveredCard === card.id}
            onClick={() => {
              setHoveredCard(hoveredCard === card.id ? null : card.id);
              onCardClick && onCardClick(card);
            }}
          />
        ))}
      </Canvas>
    </div>
  );
};

export default InteractiveCard3D;