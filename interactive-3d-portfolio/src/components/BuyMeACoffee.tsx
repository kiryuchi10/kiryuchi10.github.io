import React, { useState } from 'react';
import './BuyMeACoffee.css';

type BuyMeACoffeeProps = {
  username?: string;
  showFloating?: boolean;
  showInline?: boolean;
  showCard?: boolean;
  customMessage?: string;
  theme?: 'default' | 'dark' | 'minimal';
};

export function BuyMeACoffee({
  username = 'kiryuchi10',
  showFloating = true,
  showInline = false,
  showCard = false,
  customMessage = 'Support my work',
  theme = 'default',
}: BuyMeACoffeeProps): React.ReactElement | null {
  const [showTooltip, setShowTooltip] = useState(false);
  const buyMeACoffeeUrl = `https://coff.ee/${username}`;

  const FloatingButton = (): React.ReactElement => (
    <div
      className={`buymeacoffee-fab bmc-floating-button ${theme}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setTimeout(() => setShowTooltip(false), 200)}
    >
      <a
        href={buyMeACoffeeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bmc-link"
        aria-label="Buy me a coffee"
      >
        <div className="bmc-icon">☕</div>
        {showTooltip && <div className="bmc-tooltip">{customMessage}</div>}
      </a>
    </div>
  );

  const InlineButton = (): React.ReactElement => (
    <div className={`bmc-inline-button ${theme}`}>
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
    </div>
  );

  const CoffeeCard = (): React.ReactElement => (
    <div className={`bmc-card ${theme}`}>
      <div className="bmc-card-header">
        <div className="bmc-card-icon">☕</div>
        <h3>Support My Work</h3>
      </div>
      <div className="bmc-card-content">
        <p>
          If you enjoy my projects and want to support my work, consider buying me a coffee! Your
          support helps me continue creating and sharing open-source projects.
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
        <a
          href={buyMeACoffeeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bmc-card-button"
        >
          <span className="bmc-button-icon">☕</span>
          Buy me a coffee
        </a>
        <div className="bmc-card-note">
          <small>Secure payment via Buy Me a Coffee</small>
        </div>
      </div>
    </div>
  );

  const showAny = showFloating || showInline || showCard;
  if (!showAny) return null;

  return (
    <>
      {showFloating && <FloatingButton />}
      {showInline && <InlineButton />}
      {showCard && <CoffeeCard />}
    </>
  );
}
