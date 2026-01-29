import React, { useMemo } from 'react';
import { SectionContainer } from '../components/layout/SectionContainer';
import { resume } from '../config/content';
import { useTimelineOrbPosition } from '../hooks/useTimelineOrbPosition';
import '../styles/timeline.css';

const JOURNEY_ORB_GIF = '/assets/DongHyeunLee/Project/GIF/7bk3%20(2).gif';

/** Parse end year from "2021 – 2023", "2020–2021", "Start: TBA" for sorting (newest first). */
function parseEndYear(dates: string): number {
  const tba = /TBA|tba/i.test(dates);
  if (tba) return -1;
  const match = dates.match(/\d{4}/g);
  if (!match?.length) return 0;
  const years = match.map((y) => parseInt(y, 10));
  return Math.max(...years);
}

export function JourneySection(): React.ReactElement {
  const { top } = useTimelineOrbPosition({
    selector: '[data-timeline]',
    paddingTop: 24,
    paddingBottom: 24,
  });

  const allItems = useMemo(() => {
    const experienceItems = resume.experience.map((item) => ({
      type: 'job' as const,
      period: item.dates,
      title: item.role,
      subtitle: `${item.company} · ${item.location}`,
      bullets: item.bullets,
      sortYear: parseEndYear(item.dates),
    }));
    const educationItems = resume.education.map((e) => ({
      type: 'edu' as const,
      period: e.dates,
      title: e.school,
      subtitle: `${e.degree}${e.extra ? ` · ${e.extra}` : ''}`,
      bullets: [] as string[],
      sortYear: parseEndYear(e.dates),
    }));
    const combined = [...experienceItems, ...educationItems];
    combined.sort((a, b) => b.sortYear - a.sortYear);
    return combined.map(({ sortYear, ...rest }) => rest);
  }, []);

  return (
    <SectionContainer id="journey" title="Journey">
      <div className="journey-section-inner">
        <div className="timeline-wrap" data-timeline>
          <div className="timeline-line" aria-hidden />
          <div
            className="timeline-orb"
            style={{
              top: `${top}px`,
              backgroundImage: `url(${JOURNEY_ORB_GIF})`,
            }}
            aria-hidden
          />
          <div className="timeline-items">
            {allItems.map((item, idx) => (
              <article
                key={idx}
                className={`timeline-item timeline-item--${idx % 2 === 0 ? 'left' : 'right'}`}
              >
                <div className="timeline-card">
                  <div className="timeline-period">{item.period}</div>
                  <h3 className="timeline-title">{item.title}</h3>
                  <p className="timeline-desc">{item.subtitle}</p>
                  {item.bullets.length > 0 && (
                    <ul className="timeline-bullets">
                      {item.bullets.map((b, j) => (
                        <li key={j}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
