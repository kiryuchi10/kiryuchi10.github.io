import React from 'react';
import { SectionContainer } from '../components/layout/SectionContainer';
import { projects } from '../config/content';

/** Animated orb GIF at bottom of Projects section (public/ is web root → use /assets/...) */
const PROJECT_ORB_GIF =
  '/assets/DongHyeunLee/Project/Video/AIx-decision-second-20260115%20(1).gif';

export function ProjectsSection(): React.ReactElement {
  return (
    <SectionContainer id="projects" title="Projects">
      <div className="projects-grid">
        {projects.map((p, i) => (
          <a
            key={i}
            href={p.link}
            target="_blank"
            rel="noopener noreferrer"
            className="project-card"
          >
            <div className="project-image-wrap">
              <img src={p.image} alt={p.title} className="project-image" />
            </div>
            <h3 className="project-title">{p.title}</h3>
            <p className="project-desc">{p.description}</p>
            <div className="project-badges">
              {p.badges.map((b, j) => (
                <span key={j} className="badge">
                  {b}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
      {/* Decorative orb */}
      <div className="projects-video-wrap" aria-hidden>
        <img
          src={PROJECT_ORB_GIF}
          className="projects-orb-gif"
          alt=""
          loading="lazy"
        />
      </div>
    </SectionContainer>
  );
}
