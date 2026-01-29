import React, { useState } from 'react';
import { getBackendUrl } from '../config/environment';
import { getProfile } from '../data/profile.config';
import './ResumeDownload.css';

const ResumeDownload = () => {
  const [downloading, setDownloading] = useState(false);
  const profile = getProfile();
  const pdfUrl = profile?.resume?.pdfUrl || '/resume/DONG_HYEUN_LEE_Resume_250603.pdf';
  const backendUrl = getBackendUrl();

  const handleDownload = async () => {
    setDownloading(true);
    try {
      if (backendUrl) {
        const response = await fetch(`${backendUrl}/api/download-resume`);
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'Donghyeun_Lee_Resume.pdf';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          return;
        }
      }
      // Fallback: open static PDF (same tab or download via link)
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = 'DONG_HYEUN_LEE_Resume_250603.pdf';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      window.open(pdfUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="resume-download">
      <button
        type="button"
        className="download-btn"
        onClick={handleDownload}
        disabled={downloading}
      >
        <i className="fas fa-download" />
        {downloading ? 'Downloading...' : 'Download Resume'}
      </button>
    </div>
  );
};

export default ResumeDownload;
