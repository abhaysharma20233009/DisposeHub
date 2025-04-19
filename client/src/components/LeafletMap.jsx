import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const userIcon = (color = 'blue') =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng], 13);
  }, [lat, lng]);
  return null;
};

const MapClickHandler = ({ onClick }) => {
  const map = useMap();
  useEffect(() => {
    map.on('click', onClick);
    return () => {
      map.off('click', onClick);
    };
  }, [map, onClick]);
  return null;
};

const CurrentLocationButton = ({ onSetLocation }) => {
  const map = useMap();
  const controlRef = useRef(null);
  const socket = useRef(null); 

  useEffect(() => {
    socket.current = io('http://localhost:3000');

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (controlRef.current) return;

    const button = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom');
    button.innerHTML = '📍';
    button.title = 'Mark My Location';
    button.style.backgroundColor = 'white';
    button.style.width = '34px';
    button.style.height = '34px';
    button.style.border = 'none';
    button.style.cursor = 'pointer';

    button.onclick = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              const location = {
                lat,
                lng,
                name: 'My Current Location',
              };
              
              onSetLocation(location);
      
              if (socket.current) {
                socket.current.emit('location', { lat, lng });
              }
      
              const firebaseUID = localStorage.getItem("firebaseUID");
      
              if (firebaseUID) {
                fetch("http://localhost:3000/api/location/save", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    firebaseUID,
                    lat,
                    long: lng,
                    active: true, 
                  }),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    if (data.success) {
                      console.log("Location saved successfully:", data.location);
                    } else {
                      console.error("Failed to save location:", data.message);
                    }
                  })
                  .catch((error) => {
                    console.error("Error sending location to backend:", error);
                  });
              } else {
                console.log("Firebase UID not found in localStorage.");
              }
            },
            (error) => {
              console.error('Geolocation error:', error);
              alert('Failed to get your current location.');
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            }
          );
        } else {
          alert('Geolocation is not supported by this browser.');
        }
      };
      
    const control = L.control({ position: 'topright' });
    control.onAdd = () => button;
    control.addTo(map);
    controlRef.current = control;
  }, [map, onSetLocation]);

  return null;
};

const LeafletMap = ({ user, selectedLocation, onMapClick }) => {
  const [users, setUsers] = useState({});
  const [myLocation, setMyLocation] = useState(null);
  const [clickedLocation, setClickedLocation] = useState(null);

  useEffect(() => {
    if (user?.role !== 'driver') return;

    const socket = io('http://localhost:3000');

    const updateLocation = () => {
      if (navigator.geolocation && user.role === 'driver') {
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMyLocation({ lat, lng });
          socket.emit('location', { lat, lng });
        });
      }
    };

    updateLocation();
    const interval = setInterval(updateLocation, 20000);

    socket.on('users-locations', (data) => {
      setUsers(data);
    });

    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (selectedLocation) {
      setClickedLocation(selectedLocation);
    }
  }, [selectedLocation]);

  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
  
    try {
      // Reverse geocoding to get the location name
      const response = await fetch(
        `https://api.openrouteservice.org/geocode/reverse?api_key=5b3ce3597851110001cf6248976fd365a133423bab235324a680ada8&point.lat=${lat}&point.lon=${lng}`
      );
      const data = await response.json();
      const name = data.features?.[0]?.properties?.name || 'Unknown Location';
      const location = { lat, lng, name };
  
      // Ask for confirmation to set the location
      const confirmPickup = window.confirm(
        `Are you sure you want to set "${name}" as your pickup location?`
      );
  
      if (confirmPickup) {
        setClickedLocation(location);
        onMapClick(location);
  
        // Save the location to the backend
        const firebaseUID = localStorage.getItem("firebaseUID"); // Get firebaseUID from localStorage
  
        if (firebaseUID) {
          // Send the location data to the backend for saving/updating
          await fetch("http://localhost:3000/api/location/save", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firebaseUID,
              lat,
              long: lng,
              active: true, 
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                console.log("Location saved successfully:", data.location);
              } else {
                console.error("Failed to save location:", data.message);
              }
            })
            .catch((error) => {
              console.error("Error sending location to backend:", error);
            });
        } else {
          console.log("Firebase UID not found in localStorage.");
        }
      }
  
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      const location = { lat, lng, name: 'Unnamed Location' };
  
      // Confirm and save the unnamed location
      const confirmPickup = window.confirm(
        `Are you sure you want to set this location as your pickup point?`
      );
      if (confirmPickup) {
        setClickedLocation(location);
        onMapClick(location);
  
        // Save the unnamed location to the backend
        const firebaseUID = localStorage.getItem("firebaseUID");
  
        if (firebaseUID) {
          await fetch("http://localhost:3000/api/location/save", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firebaseUID,
              lat,
              long: lng,
              active: true,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                console.log("Location saved successfully:", data.location);
              } else {
                console.error("Failed to save location:", data.message);
              }
            })
            .catch((error) => {
              console.error("Error sending location to backend:", error);
            });
        } else {
          console.log("Firebase UID not found in localStorage.");
        }
      }
    }
  };
  

  if (user?.role !== 'driver' || !myLocation) {
    return <div className="text-center mt-4">🛑 Only drivers can access the live map.</div>;
  }

  return (
    <div className="w-full h-full">
      <MapContainer
        center={[myLocation.lat, myLocation.lng]}
        zoom={16}
        style={{ height: '100%', width: '100%' }}
      >
        <MapClickHandler onClick={handleMapClick} />

        <CurrentLocationButton
          onSetLocation={(location) => {
            setClickedLocation(location);
            onMapClick(location);
          }}
        />

        <TileLayer
          attribution="&copy; DisposeHub"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {selectedLocation && (
          <RecenterMap lat={selectedLocation.lat} lng={selectedLocation.lng} />
        )}

        {Object.entries(users).map(([id, loc], index) => (
          <Marker
            key={id}
            position={[loc.lat, loc.lng]}
            icon={userIcon(index % 2 === 0 ? 'blue' : 'red')}
          >
            <Popup>User ID: {id}</Popup>
          </Marker>
        ))}

        {clickedLocation && (
          <Marker
            position={[clickedLocation.lat, clickedLocation.lng]}
            icon={userIcon('yellow')}
          >
            <Popup>{clickedLocation.name}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
