import React from 'react';
import { hero, basics } from '../config/content';
import { Typewriter } from '../components/effects/Typewriter';

const HERO_PHOTO = '/assets/DongHyeunLee/Photo/KakaoTalk_20250708_231845951.jpg';
const HERO_BG = '/assets/DongHyeunLee/Effect/falling-stars-stars.gif';

export function HeroSection(): React.ReactElement {
  return (
    <section id="home" className="hero">
      <div className="hero-inner">
        {/* Profile block: image with falling-stars background */}
        <div className="hero-profile-wrap">
          <div
            className="hero-profile-bg"
            style={{ backgroundImage: `url(${HERO_BG})` }}
          />
          <img
            src={HERO_PHOTO}
            alt={basics.fullName}
            className="hero-profile-img"
            loading="eager"
          />
        </div>
        <h1 className="hero-title">
          <Typewriter
            text={`I'm ${hero?.nameHighlight ?? 'Dong Hyeun Lee'}`}
            typingSpeedMs={85}
            holdMs={2000}
            loop
            className="hero-name"
          />
        </h1>
        <p className="hero-intro">{hero.intro}</p>
        <div className="hero-cta">
          <a href={hero.ctaResume.href} className="btn btn-primary" download target="_blank" rel="noopener noreferrer">
            {hero.ctaResume.label}
          </a>
          <a href={hero.ctaCv.href} className="btn btn-secondary" download target="_blank" rel="noopener noreferrer">
            {hero.ctaCv.label}
          </a>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => document.getElementById(hero.ctaProjects.scrollToId)?.scrollIntoView({ behavior: 'smooth' })}
          >
            {hero.ctaProjects.label}
          </button>
        </div>
      </div>
    </section>
  );
}
