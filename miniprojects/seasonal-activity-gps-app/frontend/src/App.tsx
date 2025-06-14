import { useEffect, useState } from 'react';

interface Activity {
  id: number;
  name: string;
  lat: number;
  lon: number;
  description?: string;
  seasons: string[];
}

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        fetch(`/api/activities?lat=${latitude}&lon=${longitude}`)
          .then(r => r.json())
          .then(setActivities)
          .catch(e => setError(String(e)));
      },
      err => setError(err.message),
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Nearby Seasonal Activities</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {activities.map(act => (
          <li key={act.id}>
            {act.name} ({act.seasons.join(', ')})
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
