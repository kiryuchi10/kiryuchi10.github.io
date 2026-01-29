import React from 'react';
import { SectionContainer } from '../components/layout/SectionContainer';
import { resume, coverLetter } from '../config/content';

export function ResumeSection(): React.ReactElement {
  return (
    <SectionContainer id="resume" title="Resume">
      <p className="resume-summary">{resume.summary}</p>
      <div className="resume-downloads">
        <a href={resume.pdfUrl} className="btn btn-primary" download target="_blank" rel="noopener noreferrer">
          Download Resume (PDF)
        </a>
        <a href={coverLetter.pdfUrl} className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
          Download Cover Letter (PDF)
        </a>
      </div>
      <p className="resume-summary-note">{resume.summaryNote}</p>
      <p className="resume-target-role">{coverLetter.targetRole}</p>
      <h3 className="resume-subtitle">Certifications</h3>
      <ul className="resume-cert-list">
        {resume.certifications.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
    </SectionContainer>
  );
}
