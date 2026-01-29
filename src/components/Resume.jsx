import React from 'react';
import { getProfile } from '../data/profile.config';
import ResumeDownload from './ResumeDownload';
import './Resume.css';

function Resume() {
  const profile = getProfile();
  const pdfUrl = profile?.resume?.pdfUrl || '/resume/DONG_HYEUN_LEE_Resume_250603.pdf';

  return (
    <div className="resume-container">
      <h2>📄 Resume</h2>
      <p>You can download my resume as a PDF below.</p>
      <ResumeDownload />
      <p className="resume-view-link">
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
          Open in new tab
        </a>
      </p>
    </div>
  );
}

export default Resume;
