import React, { useState } from 'react';
import { SectionContainer } from '../components/layout/SectionContainer';
import { presentationVideos } from '../config/content';

export function VideoCarouselSection(): React.ReactElement {
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoLoadErrors, setVideoLoadErrors] = useState<Record<string, boolean>>({});
  const videoCount = presentationVideos.length;
  const activeVideo = presentationVideos[activeIndex];
  const isActiveVideoUnavailable = Boolean(videoLoadErrors[activeVideo.src]);

  const goPrev = (): void => {
    setActiveIndex((prev) => (prev - 1 + videoCount) % videoCount);
  };

  const goNext = (): void => {
    setActiveIndex((prev) => (prev + 1) % videoCount);
  };

  if (!videoCount) return <></>;

  return (
    <SectionContainer id="presentations" title="Presentation Topics">
      <div className="presentation-carousel-card">
        {isActiveVideoUnavailable ? (
          <div className="presentation-video-frame presentation-video-placeholder" role="status">
            <p className="presentation-placeholder-title">Video will appear after upload.</p>
            <p className="presentation-placeholder-desc">
              Please upload this file to continue: <code>{activeVideo.src}</code>
            </p>
          </div>
        ) : (
          <div className="presentation-video-frame">
            <video
              key={activeVideo.src}
              className="presentation-video"
              controls
              preload="metadata"
              playsInline
              poster={activeVideo.poster}
              onError={() =>
                setVideoLoadErrors((prev) => ({
                  ...prev,
                  [activeVideo.src]: true,
                }))
              }
            >
              <source src={activeVideo.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <div className="presentation-meta">
          <h3 className="presentation-title">{activeVideo.title}</h3>
          <p className="presentation-description">{activeVideo.description}</p>
          <p className="presentation-counter">
            {activeIndex + 1} / {videoCount}
          </p>
        </div>

        <div className="presentation-controls">
          <button type="button" className="btn presentation-btn" onClick={goPrev}>
            Previous
          </button>
          <button type="button" className="btn presentation-btn" onClick={goNext}>
            Next
          </button>
        </div>

        <div className="presentation-dots" role="tablist" aria-label="Presentation videos">
          {presentationVideos.map((video, index) => (
            <button
              key={video.src}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Show ${video.title}`}
              className={`presentation-dot ${index === activeIndex ? 'is-active' : ''}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
