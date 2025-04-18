import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMapEvents } from 'react-leaflet';
import Openrouteservice from 'openrouteservice-js'
import 'leaflet/dist/leaflet.css';

const ClickHandler = ({ setClickedCoords }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setClickedCoords({ lat, lng });
      console.log("Clicked Coordinates:", lat, lng);
    },
  });
  return null;
};

const LeafletMap = () => {
  const [route, setRoute] = useState([]);
  const [clickedCoords, setClickedCoords] = useState(null);

  const start = [77.2090, 28.6139];
  const end = [77.3910, 28.5355];  

  useEffect(() => {
    const fetchRoute = async () => {
      const apiKey = import.meta.env.VITE_ORS_API_KEY;
      const url = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coordinates: [start, end],
        }),
      });

      const data = await response.json();
      const coordinates = data.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      setRoute(coordinates);
    };

    fetchRoute();
  }, []);

  return (
    <div className="w-full h-[500px]">
      <MapContainer center={[28.6, 77.3]} zoom={11} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Start and End Markers */}
        <Marker position={[28.6139, 77.2090]}>
          <Popup>Start (Delhi)</Popup>
        </Marker>
        <Marker position={[28.5355, 77.3910]}>
          <Popup>End (Noida)</Popup>
        </Marker>

        {route.length > 0 && <Polyline positions={route} color="blue" />}

        <ClickHandler setClickedCoords={setClickedCoords} />

        {clickedCoords && (
          <Marker position={[clickedCoords.lat, clickedCoords.lng]}>
            <Popup>
              Clicked Location<br />
              Lat: {clickedCoords.lat.toFixed(5)}<br />
              Lng: {clickedCoords.lng.toFixed(5)}
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {clickedCoords && (
        <div className="mt-4 text-center">
          <p>🧭 You clicked at: <strong>Lat:</strong> {clickedCoords.lat}, <strong>Lng:</strong> {clickedCoords.lng}</p>
        </div>
      )}
    </div>
  );
};

export default LeafletMap;
