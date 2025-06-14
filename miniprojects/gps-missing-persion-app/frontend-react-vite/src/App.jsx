// App.js  (React 18+)
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

// Fix Leaflet’s missing default icon issue in many bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const API = process.env.REACT_APP_API || 'http://192.168.1.22:5000';

export default function App() {
  /* ─────────────────── state ─────────────────── */
  const [markers, setMarkers] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', lat: '', lon: '' });
  const [filter, setFilter] = useState({ text: '', minAge: '', maxAge: '' });
  const [loading, setLoading] = useState(false);

  /* ─────────────────── fetch helpers ─────────────────── */
  const fetchMarkers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/missing`);
      setMarkers(data);
    } catch (err) {
      console.error(err);
      alert('Could not load reports.');
    } finally {
      setLoading(false);
    }
  };

  /* initial load + polling */
  useEffect(() => {
    fetchMarkers();                       // first run
    const id = setInterval(fetchMarkers, 30_000); // every 30 s
    return () => clearInterval(id);
  }, []);

  /* derived list after filtering */
  const filteredMarkers = useMemo(() => {
    return markers.filter((m) => {
      const nameMatch = m.name
        .toLowerCase()
        .includes(filter.text.toLowerCase());
      const ageMatch =
        (!filter.minAge || m.age >= filter.minAge) &&
        (!filter.maxAge || m.age <= filter.maxAge);
      return nameMatch && ageMatch;
    });
  }, [markers, filter]);

  /* ─────────────────── handlers ─────────────────── */
  const validate = ({ name, age, lat, lon }) =>
    name && age && lat && lon && !isNaN(age) && !isNaN(lat) && !isNaN(lon);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate(form)) {
      alert('Please fill every field with valid data.');
      return;
    }
    try {
      await axios.post(`${API}/report`, form);
      alert('Reported successfully');
      setMarkers((prev) => [...prev, form]);
      setForm({ name: '', age: '', lat: '', lon: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to submit');
    }
  };

  const handleRefresh = () => fetchMarkers();

  const handleUseLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported.');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        setForm((f) => ({ ...f, lat: coords.latitude, lon: coords.longitude })),
      () => alert('Could not retrieve location.')
    );
  };

  /* ─────────────────── UI ─────────────────── */
  return (
    <div className="container">
      <h1>Missing Person Tracker</h1>

      {/* ---------- report form ---------- */}
      <form onSubmit={handleSubmit} className="report-form">
        <input
          value={form.name}
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          value={form.age}
          placeholder="Age"
          type="number"
          min="0"
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />
        <input
          value={form.lat}
          placeholder="Latitude"
          type="number"
          step="any"
          onChange={(e) => setForm({ ...form, lat: e.target.value })}
        />
        <input
          value={form.lon}
          placeholder="Longitude"
          type="number"
          step="any"
          onChange={(e) => setForm({ ...form, lon: e.target.value })}
        />
        <span className="link" onClick={handleUseLocation}>
          Use my location
        </span>
        <button type="submit">Submit</button>
      </form>

      {/* ---------- filter section ---------- */}
      <div className="filters">
        <input
          placeholder="Search name…"
          value={filter.text}
          onChange={(e) => setFilter({ ...filter, text: e.target.value })}
        />
        <input
          placeholder="Min age"
          type="number"
          value={filter.minAge}
          onChange={(e) => setFilter({ ...filter, minAge: e.target.value })}
        />
        <input
          placeholder="Max age"
          type="number"
          value={filter.maxAge}
          onChange={(e) => setFilter({ ...filter, maxAge: e.target.value })}
        />
        <button onClick={handleRefresh}>Refresh</button>
        {loading && <span className="loading">loading…</span>}
      </div>

      {/* ---------- map ---------- */}
      <MapContainer
        center={[37.8, -96]} // USA centroid; adjust to your region
        zoom={4}
        scrollWheelZoom
        className="map"
      >
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filteredMarkers.map((m, i) => (
          <Marker key={i} position={[m.lat, m.lon]}>
            <Popup>
              <strong>{m.name}</strong>
              <br />
              Age {m.age}
              <br />
              ({m.lat.toFixed(4)}, {m.lon.toFixed(4)})
            </Popup>
          </Marker>
        ))}
        <AutoFitBounds data={filteredMarkers} />
      </MapContainer>

      {/* ---------- fallback list for screen readers ---------- */}
      <ul className="sr-only">
        {filteredMarkers.map((m, i) => (
          <li key={i}>
            {m.name} (Age {m.age}) @ ({m.lat}, {m.lon})
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------- helper to zoom/fit markers -------- */
function AutoFitBounds({ data }) {
  const map = useMap();
  useEffect(() => {
    if (data.length === 0) return;
    const group = L.featureGroup(
      data.map((d) => L.marker([d.lat, d.lon]))
    ).addTo(map);
    map.fitBounds(group.getBounds().pad(0.2));
    return () => map.removeLayer(group);
  }, [data, map]);
  return null;
}
