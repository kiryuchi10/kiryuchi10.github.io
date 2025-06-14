import React from 'react';
import './Resume.css'; // 선택 사항

function Resume() {
  return (
    <div className="resume-container">
      <h2>📄 Resume</h2>
      <p>You can download my resume as a PDF below:</p>

      <a
        href="/resume/DONG_HYEUN_LEE_Resume.pdf"
        download="Donghyeun_Lee_Resume.pdf"
        className="download-btn"
      >
        ⬇️ Download Resume
      </a>
    </div>
  );
}

export default Resume;
