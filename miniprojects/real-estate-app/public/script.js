// /public/script.js

const map = L.map('map').setView([40.730610, -73.935242], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let markers = L.markerClusterGroup();
let properties = [];

const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

const drawControl = new L.Control.Draw({
    draw: {
        polygon: true,
        rectangle: true,
        circle: false,
        marker: false
    },
    edit: {
        featureGroup: drawnItems
    }
});
map.addControl(drawControl);

let currentPolygon = null;

map.on('draw:created', (e) => {
    drawnItems.clearLayers();
    drawnItems.addLayer(e.layer);
    currentPolygon = e.layer;
    updateMarkers();
});

function getIcon(price) {
    const iconPath = price > 800000 ? "icons/house-high.png" : "icons/house-low.png";
    return L.icon({
        iconUrl: iconPath,
        iconSize: [35, 35],
        iconAnchor: [17, 34],
        popupAnchor: [0, -30]
    });
}

function updateMarkers() {
    markers.clearLayers();
    const budget = +document.getElementById('budget').value;

    properties.forEach(d => {
        if (d.price <= budget) {
            const marker = L.marker([d.lat, d.lon], { icon: getIcon(d.price) });
            if (!currentPolygon || currentPolygon.getBounds().contains(marker.getLatLng())) {
                marker.bindPopup(`<b>${d.bedrooms} Bedroom</b><br>Price: $${d.price}`);
                markers.addLayer(marker);
            }
        }
    });

    map.addLayer(markers);
}

// Load properties
fetch('/api/properties')
    .then(response => response.json())
    .then(data => {
        properties = data;
        updateMarkers();
    });

// Update markers when filter changes
document.getElementById('budget').addEventListener('input', () => {
    document.getElementById('budget-value').textContent = document.getElementById('budget').value;
    updateMarkers();
});

// Signup
function signup() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => alert(data.message))
    .catch(err => console.error(err));
}

// Login
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        localStorage.setItem('token', data.token);
        alert("Login successful!");
    })
    .catch(err => console.error(err));
}
