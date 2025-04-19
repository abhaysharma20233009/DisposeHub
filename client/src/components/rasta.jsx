import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const ORS_API_KEY = "5b3ce3597851110001cf6248976fd365a133423bab235324a680ada8"; // Replace with your OpenRouteService API key
const ORS_URL = "https://api.openrouteservice.org/v2/directions/driving-car/geojson";

const origin = [8.681495, 49.41461];
const destination = [8.687872, 49.420318];

const RouteMap = () => {
  const [routeCoords, setRouteCoords] = useState([]);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await fetch(ORS_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: ORS_API_KEY,
          },
          body: JSON.stringify({
            coordinates: [origin, destination],
          }),
        });
        const data = await response.json();
        const coords = data.features[0].geometry.coordinates.map((c) => [c[1], c[0]]);
        setRouteCoords(coords);
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    fetchRoute();
  }, []);

  return (
    <MapContainer center={origin} zoom={14} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={origin} icon={L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png' })} />
      <Marker position={destination} icon={L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png' })} />
      {routeCoords.length > 0 && <Polyline positions={routeCoords} color="blue" />}
    </MapContainer>
  );
};

export default RouteMap;
