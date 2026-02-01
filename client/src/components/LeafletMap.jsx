import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
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

function getAreaCode(lat, lng) {
  if (lat > 28 && lng > 76 && lng < 78) return "DEL";
  if (lat > 18 && lat < 20 && lng > 72 && lng < 73) return "MUM";
  if (lat > 12 && lat < 14 && lng > 77 && lng < 78) return "BLR";
  return "GEN";
}

function generateDustbinName(lat, lng) {
  const area = getAreaCode(lat, lng);
  const seq = Date.now().toString().slice(-4); // last 4 digits
  return `GB-IND-${area}-${seq}`;
}

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

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: markerShadow,
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
          async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            try {
              // Try to get location name using reverse geocoding
              const response = await fetch(
                `https://api.openrouteservice.org/geocode/reverse?api_key=5b3ce3597851110001cf6248976fd365a133423bab235324a680ada8&point.lat=${lat}&point.lon=${lng}`
              );
              const data = await response.json();
              const name = data.features?.[0]?.properties?.name || 'My Current Location';
              
              const location = {
                lat,
                lng,
                name,
              };
              
              // Call the parent's onSetLocation
              onSetLocation(location);
              
              // Save to backend
              const firebaseUID = localStorage.getItem("firebaseUID");
              if (firebaseUID) {
                const generatedName = generateDustbinName(lat, lng);
                
                await fetch("http://localhost:3000/api/location/save", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    firebaseUID,
                    name: generatedName,
                    lat,
                    long: lng,
                    active: true,
                  }),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    if (data.success) {
                      console.log("Location saved:", data.location.name);
                      alert(`Location marked as: ${generatedName}`);
                    } else {
                      console.error("Failed:", data.message);
                    }
                  })
                  .catch((error) => {
                    console.error("Backend error:", error);
                  });
              } else {
                console.log("Firebase UID not found.");
                alert("Please login again. Firebase UID not found.");
              }
            } catch (error) {
              console.error('Reverse geocoding failed:', error);
              const location = {
                lat,
                lng,
                name: 'My Current Location',
              };
              
              onSetLocation(location);
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

const LeafletMap = ({ user, selectedLocation, onMapClick, garbageDumps }) => {
  const [myLocation, setMyLocation] = useState(null);
  const [clickedLocation, setClickedLocation] = useState(null);
  const [pathPositions, setPathPositions] = useState([]);
 
  useEffect(() => {
    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setMyLocation({ lat, lng });
        },
        (error) => {
          console.error("Geolocation error:", error.message);
          // Default to MNNIT Prayagraj
          const lat = 25.4745;
          const lng = 81.8787;
          setMyLocation({ lat, lng });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
      }
    };
  
    if (user?.role !== 'user') return;

    updateLocation();
    const interval = setInterval(updateLocation, 20000);

    return () => {
      clearInterval(interval);
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
      const response = await fetch(
        `https://api.openrouteservice.org/geocode/reverse?api_key=5b3ce3597851110001cf6248976fd365a133423bab235324a680ada8&point.lat=${lat}&point.lon=${lng}`
      );
      const data = await response.json();
      const name = data.features?.[0]?.properties?.name || 'Unknown Location';
      const location = { lat, lng, name };
  
      const confirmPickup = window.confirm(
        `Are you sure you want to set "${name}" as your pickup location?`
      );
  
      if (confirmPickup) {
        setClickedLocation(location);
        onMapClick(location);
  
        const firebaseUID = localStorage.getItem("firebaseUID");
  
        if (firebaseUID) {
          const name = generateDustbinName(lat, lng);
          await fetch("http://localhost:3000/api/location/save", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firebaseUID,
              name,
              lat,
              long: lng,
              active: true, 
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                console.log("Location saved successfully:", data.location);
                alert(`Location saved as: ${name}`);
              } else {
                console.error("Failed to save location:", data.message);
              }
            })
            .catch((error) => {
              console.error("Error sending location to backend:", error);
            });
        } else {
          console.log("Firebase UID not found in localStorage.");
          alert("Please login again. Firebase UID not found.");
        }
      }
  
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      const location = { lat, lng, name: 'Unnamed Location' };
  
      const confirmPickup = window.confirm(
        `Are you sure you want to set this location as your pickup point?`
      );
      if (confirmPickup) {
        setClickedLocation(location);
        onMapClick(location);
  
        const firebaseUID = localStorage.getItem("firebaseUID");
  
        if (firebaseUID) {
          const name = generateDustbinName(lat, lng);
          await fetch("http://localhost:3000/api/location/save", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firebaseUID,
              name,
              lat,
              long: lng,
              active: true,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                console.log("Location saved successfully:", data.location);
                alert(`Location saved as: ${name}`);
              } else {
                console.error("Failed to save location:", data.message);
              }
            })
            .catch((error) => {
              console.error("Error sending location to backend:", error);
            });
        } else {
          console.log("Firebase UID not found in localStorage.");
          alert("Please login again. Firebase UID not found.");
        }
      }
    }
  };

  const handleMarkerClick = async (dumpData) => {
    if (!myLocation) return;
  
    try {
      // Fetch route from OSRM API
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${myLocation.lng},${myLocation.lat};${dumpData.long},${dumpData.lat}?overview=full&geometries=geojson`
      );
      
      const data = await response.json();
      
      if (data.routes && data.routes[0]) {
        const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        setPathPositions(coords);
      } else {
        setPathPositions([
          [myLocation.lat, myLocation.lng],
          [dumpData.lat, dumpData.long],
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch route:", error);
      setPathPositions([
        [myLocation.lat, myLocation.lng],
        [dumpData.lat, dumpData.long],
      ]);
    }
  };
  
  if (user?.role !== 'user' || !myLocation) {
    return <div className="text-center mt-4">🛑 Only User can access the live map.</div>;
  }

  return (
    <div className="w-full h-full">
      <MapContainer
        center={[myLocation.lat, myLocation.lng]}
        zoom={14}
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

        {pathPositions.length > 0 && (
          <Polyline
            positions={pathPositions}
            color="#2563eb" 
            weight={2}      
            opacity={1.0}   
            lineCap="round"  
            lineJoin="round" 
            smoothFactor={1} 
          />
        )}

        {myLocation && (
          <Marker
            position={[myLocation.lat, myLocation.lng]}
            icon={userIcon('red')}
          >
            <Popup>My Current Location</Popup>
          </Marker>
        )}

        {selectedLocation && (
          <RecenterMap lat={selectedLocation.lat} lng={selectedLocation.lng} />
        )}

        {garbageDumps.data?.map((dump, index) => (
        <Marker
          key={`dump-${index}`}
          position={[dump.lat, dump.long]}
          icon={greenIcon}
          eventHandlers={{
              click: () => {
                console.log(dump.lat, dump.long);
                  handleMarkerClick(dump);
              }
          }}
        >
          <Popup>
            <div>
              <strong>{dump.name || 'Garbage Dump'}</strong>
              {dump.address && <p>{dump.address}</p>}
            </div>
          </Popup>
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