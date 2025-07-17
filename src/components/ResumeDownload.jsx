import React, { useState } from 'react';
import './ResumeDownload.css';

const ResumeDownload = () => {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch('http://localhost:5000/api/download-resume');
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
      } else {
        alert('Resume download failed. Please try again.');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Resume download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="resume-download">
      <button 
        className="download-btn" 
        onClick={handleDownload}
        disabled={downloading}
      >
        <i className="fas fa-download"></i>
        {downloading ? 'Downloading...' : 'Download Resume'}
      </button>
    </div>
  );
};

export default ResumeDownload;