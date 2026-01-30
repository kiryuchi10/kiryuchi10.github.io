import React from 'react';
import { SectionContainer } from '../components/layout/SectionContainer';
import { resume, coverLetter } from '../config/content';

export function ResumeSection(): React.ReactElement {
  return (
    <SectionContainer id="resume" title="Resume">
      <div className="resume-card">
        <p className="resume-summary">{resume.summary}</p>
        <p className="resume-summary-note">{resume.summaryNote}</p>
        <p className="resume-target-role">{coverLetter.targetRole}</p>
      </div>
      <div className="resume-card">
        <h3 className="resume-subtitle">Certifications</h3>
        <ul className="resume-cert-list">
          {resume.certifications.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>
    </SectionContainer>
  );
}
