import React from "react";
import Hero from "./Hero";
import Scene3D from "./3D/Scene3D";
import InteractiveCard3D from "./3D/InteractiveCard3D";
import ParticleSystem from "./3D/ParticleSystem";
import BuyMeACoffee from "./BuyMeACoffee";
import { motion } from "framer-motion";

function Home() {
  const handleCardClick = (card) => {
    console.log("Card clicked:", card);
    // Add navigation logic here
  };

  return (
    <div style={{ minHeight: '100vh', padding: '20px 0' }}>
      {/* Hero Section with 3D Background */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ marginBottom: '60px' }}
      >
        <Hero />
      </motion.section>

      {/* 3D Interactive Scene */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{ marginBottom: '60px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            color: '#333', 
            marginBottom: '10px',
            background: 'linear-gradient(135deg, #4a90e2 0%, #e24a4a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Welcome to My Digital Universe
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
            Explore interactive 3D experiences and discover what I can create for you
          </p>
        </div>
        <Scene3D 
          text="Interactive Portfolio" 
          showText={true}
          enableControls={true}
        />
      </motion.section>

      {/* Skills/Services Cards */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        style={{ marginBottom: '60px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '2.2rem', color: '#333', marginBottom: '10px' }}>
            What I Do
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#666' }}>
            Hover and click on the cards to learn more about my services
          </p>
        </div>
        <InteractiveCard3D onCardClick={handleCardClick} />
      </motion.section>

      {/* Particle System Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        style={{ marginBottom: '60px' }}
      >
        <ParticleSystem 
          particleCount={800}
          showConnections={true}
          color="#4a90e2"
          height="400px"
        />
      </motion.section>

      {/* Support Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        style={{ marginBottom: '40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '2.2rem', color: '#333', marginBottom: '10px' }}>
            Support My Work
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '500px', margin: '0 auto' }}>
            If you like what you see and want to support my continued development of open-source projects
          </p>
        </div>
        <BuyMeACoffee showFloating={false} showInline={false} />
      </motion.section>

      {/* Floating Buy Me a Coffee Button */}
      <BuyMeACoffee showFloating={true} showInline={false} />
    </div>
  );
}

export default Home;
