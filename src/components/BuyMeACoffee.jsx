import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './BuyMeACoffee.css';

const BuyMeACoffee = ({ 
  username = "kiryuchi10", // Replace with your Buy Me a Coffee username
  showFloating = true,
  showInline = false,
  customMessage = "Support my work",
  theme = "default" // default, dark, minimal
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Buy Me a Coffee URL
  const buyMeACoffeeUrl = `https://coff.ee/${username}`;

  // Floating Button Component
  const FloatingButton = () => (
    <motion.div
      className={`bmc-floating-button ${theme}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => {
        setIsHovered(true);
        setShowTooltip(true);
      }}
      onHoverEnd={() => {
        setIsHovered(false);
        setTimeout(() => setShowTooltip(false), 200);
      }}
    >
      <a
        href={buyMeACoffeeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bmc-link"
      >
        <div className="bmc-icon">
          ☕
        </div>
        
        {/* Tooltip */}
        <motion.div
          className="bmc-tooltip"
          initial={{ opacity: 0, x: 10 }}
          animate={{ 
            opacity: showTooltip ? 1 : 0,
            x: showTooltip ? 0 : 10
          }}
          transition={{ duration: 0.2 }}
        >
          {customMessage}
        </motion.div>
      </a>
    </motion.div>
  );

  // Inline Button Component
  const InlineButton = () => (
    <motion.div
      className={`bmc-inline-button ${theme}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <a
        href={buyMeACoffeeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bmc-inline-link"
      >
        <div className="bmc-inline-content">
          <span className="bmc-inline-icon">☕</span>
          <span className="bmc-inline-text">Buy me a coffee</span>
        </div>
      </a>
    </motion.div>
  );

  // Card Component with Animation
  const CoffeeCard = () => (
    <motion.div
      className={`bmc-card ${theme}`}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -5 }}
    >
      <div className="bmc-card-header">
        <div className="bmc-card-icon">☕</div>
        <h3>Support My Work</h3>
      </div>
      
      <div className="bmc-card-content">
        <p>
          If you enjoy my projects and want to support my work, 
          consider buying me a coffee! Your support helps me continue 
          creating and sharing open-source projects.
        </p>
        
        <div className="bmc-benefits">
          <div className="bmc-benefit">
            <span className="bmc-benefit-icon">🚀</span>
            <span>More projects</span>
          </div>
          <div className="bmc-benefit">
            <span className="bmc-benefit-icon">⚡</span>
            <span>Faster updates</span>
          </div>
          <div className="bmc-benefit">
            <span className="bmc-benefit-icon">💡</span>
            <span>New ideas</span>
          </div>
        </div>
      </div>
      
      <div className="bmc-card-footer">
        <motion.a
          href={buyMeACoffeeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bmc-card-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="bmc-button-icon">☕</span>
          Buy me a coffee
        </motion.a>
        
        <div className="bmc-card-note">
          <small>Secure payment via Buy Me a Coffee</small>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      {showFloating && <FloatingButton />}
      {showInline && <InlineButton />}
      {!showFloating && !showInline && <CoffeeCard />}
    </>
  );
};

// Widget for embedding in other components
export const BuyMeACoffeeWidget = ({ compact = false, username = "kiryuchi10" }) => {
  const buyMeACoffeeUrl = `https://coff.ee/${username}`;

  if (compact) {
    return (
      <motion.div
        className="bmc-widget-compact"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <a
          href={buyMeACoffeeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bmc-widget-link"
        >
          <span className="bmc-widget-icon">☕</span>
          <span className="bmc-widget-text">Support</span>
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="bmc-widget"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bmc-widget-header">
        <span className="bmc-widget-title">☕ Like my work?</span>
      </div>
      <motion.a
        href={buyMeACoffeeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bmc-widget-button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Buy me a coffee
      </motion.a>
    </motion.div>
  );
};

export default BuyMeACoffee;