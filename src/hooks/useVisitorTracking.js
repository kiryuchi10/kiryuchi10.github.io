import { useEffect } from 'react';

export const useVisitorTracking = (pageName) => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        await fetch('http://localhost:5000/api/track-visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: pageName,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.log('Visitor tracking failed:', error);
      }
    };

    trackVisit();
  }, [pageName]);
};