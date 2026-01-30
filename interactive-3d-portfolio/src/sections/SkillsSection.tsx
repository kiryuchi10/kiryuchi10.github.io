import React from 'react';
import { SectionContainer } from '../components/layout/SectionContainer';
import { skillIcons, type SkillIconItem } from '../config/skillIcons';

export function SkillsSection(): React.ReactElement {
  return (
    <SectionContainer id="skills" title="Skills">
      <div className="skills-section-inner">
        <div className="skills-icon-grid" role="list">
        {skillIcons.map((s: SkillIconItem) => {
          const Icon = s.Icon as React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
          return (
            <button
              key={s.key}
              className="skill-icon-tile"
              type="button"
              role="listitem"
              aria-label={s.label}
              title={s.label}
            >
              <Icon className="skill-icon" aria-hidden />
              <div className="skill-icon-label">{s.label}</div>
            </button>
          );
        })}
        </div>
      </div>
    </SectionContainer>
  );
}
