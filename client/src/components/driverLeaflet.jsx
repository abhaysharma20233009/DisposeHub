import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';
import io from 'socket.io-client';

// Custom red marker
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const socket = io('http://localhost:3000'); // your backend socket URL

const DriverLeafletMap = ({ locations }) => {
  const mapRef = useRef(null);
  const routeControlRef = useRef(null);
  const [location, setLocation] = useState(null);

  // Create map only once
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([20.59, 78.96], 5); // fallback location

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);
    }
  }, []);

  // Geolocation tracking
  useEffect(() => {
    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const coords = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            };
            setLocation(coords);
            socket.emit('location', coords);

            // Animate map to user location
            if (mapRef.current) {
              mapRef.current.flyTo([coords.lat, coords.lng], 15);
            }
          },
          (err) => console.error('Geolocation error:', err),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      }
    };

    updateLocation();
    const interval = setInterval(updateLocation, 10000);
    return () => clearInterval(interval);
  }, []);

  // Add user's marker
  useEffect(() => {
    if (location && mapRef.current) {
      const userMarker = L.marker([location.lat, location.lng], { icon: redIcon }).addTo(mapRef.current);
      return () => mapRef.current.removeLayer(userMarker);
    }
  }, [location]);

  // Add static markers with routing on click
  useEffect(() => {
    if (mapRef.current && location) {
      const markerLayers = [];

      locations.filter(loc => loc.active).forEach((loc) => {
        const marker = L.marker([loc.lat, loc.long]).addTo(mapRef.current);

        marker.on('click', () => {
          // Remove previous route
          if (routeControlRef.current) {
            mapRef.current.removeControl(routeControlRef.current);
          }

          // Create new route
          routeControlRef.current = L.Routing.control({
            waypoints: [
              L.latLng(location.lat, location.lng),
              L.latLng(loc.lat, loc.long),
            ],
            routeWhileDragging: false,
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            show: true,
          }).addTo(mapRef.current);
        });

        markerLayers.push(marker);
      });

      // Clean up markers on unmount or rerender
      return () => {
        markerLayers.forEach(m => mapRef.current.removeLayer(m));
      };
    }
  }, [location, locations]);

  return (
    <div className="p-4 h-full">
      {!location && (
        <div className="text-center text-gray-600 font-medium mb-2">
          Fetching location...
        </div>
      )}
      <div
        id="map"
        className="rounded-2xl shadow-lg border border-gray-300"
        style={{ height: '100%', minHeight: '92vh', width: '100%' }}
      ></div>
    </div>

  );
};

export default DriverLeafletMap;
