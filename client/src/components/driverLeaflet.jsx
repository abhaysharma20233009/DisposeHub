import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom red marker (driver)
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom blue marker for garbage locations
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DriverLeafletMap = ({ driver, locations, setLocations }) => {
  const mapRef = useRef(null);
  const polylineRef = useRef(null);
  const routeInfoControlRef = useRef(null);
  const startMarkerRef = useRef(null);
  const endMarkerRef = useRef(null);
  const driverMarkerRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [socket, setSocket] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [isZooming, setIsZooming] = useState(false);

  // Initialize socket
  useEffect(() => {
    // Dynamic import for socket.io-client to avoid SSR issues
    import('socket.io-client').then((module) => {
      const socketIo = module.default;
      const newSocket = socketIo('http://localhost:3000');
      setSocket(newSocket);
    }).catch(err => {
      console.error('Failed to load socket.io-client:', err);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  // Create map once
  useEffect(() => {
    if (!mapRef.current && typeof window !== 'undefined') {
      mapRef.current = L.map('map').setView([20.59, 78.96], 5);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);
    }
  }, []);

  // Track driver location - with zoom prevention
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
            if (socket) {
              socket.emit('location', coords);
            }

            // Update driver marker position
            if (driverMarkerRef.current && mapRef.current) {
              driverMarkerRef.current.setLatLng([coords.lat, coords.lng]);
            } else if (mapRef.current) {
              // Create driver marker if it doesn't exist
              driverMarkerRef.current = L.marker([coords.lat, coords.lng], { 
                icon: redIcon 
              })
                .addTo(mapRef.current)
                .bindPopup('<b>Driver Location</b>')
                .openPopup();
            }

            // Only zoom if not already zooming and no route is displayed
            if (mapRef.current && !isZooming && !polylineRef.current) {
              setIsZooming(true);
              mapRef.current.flyTo([coords.lat, coords.lng], 15, {
                duration: 1,
                onEnd: () => setIsZooming(false)
              });
            }
          },
          (err) => {
            console.error('Geolocation error:', err);
            // Set default location if geolocation fails
            const defaultCoords = { lat: 20.59, lng: 78.96 };
            setLocation(defaultCoords);
            if (socket) {
              socket.emit('location', defaultCoords);
            }
            
            // Create driver marker at default location
            if (mapRef.current && !driverMarkerRef.current) {
              driverMarkerRef.current = L.marker([defaultCoords.lat, defaultCoords.lng], { 
                icon: redIcon 
              })
                .addTo(mapRef.current)
                .bindPopup('<b>Driver Location</b>')
                .openPopup();
            }
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      } else {
        // Fallback for browsers without geolocation
        const defaultCoords = { lat: 20.59, lng: 78.96 };
        setLocation(defaultCoords);
        if (socket) {
          socket.emit('location', defaultCoords);
        }
        
        // Create driver marker at default location
        if (mapRef.current && !driverMarkerRef.current) {
          driverMarkerRef.current = L.marker([defaultCoords.lat, defaultCoords.lng], { 
            icon: redIcon 
          })
            .addTo(mapRef.current)
            .bindPopup('<b>Driver Location</b>')
            .openPopup();
        }
      }
    };

    updateLocation();
    const interval = setInterval(updateLocation, 10000);
    
    return () => {
      clearInterval(interval);
    };
  }, [socket, isZooming]);

  // Clear all route elements (but not the permanent driver marker)
  const clearRouteElements = () => {
    if (polylineRef.current && mapRef.current) {
      mapRef.current.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }
    
    if (routeInfoControlRef.current && mapRef.current) {
      mapRef.current.removeControl(routeInfoControlRef.current);
      routeInfoControlRef.current = null;
    }
    
    if (startMarkerRef.current && mapRef.current) {
      mapRef.current.removeLayer(startMarkerRef.current);
      startMarkerRef.current = null;
    }
    
    if (endMarkerRef.current && mapRef.current) {
      mapRef.current.removeLayer(endMarkerRef.current);
      endMarkerRef.current = null;
    }
  };

  // Clear route function
  const clearRoute = () => {
    clearRouteElements();
  };

  // Clear route when locations change (e.g., when a location is marked as thrown)
  useEffect(() => {
    clearRouteElements();
  }, [locations]);

  // Function to calculate and display route using OSRM API
  const calculateRoute = async (startLat, startLng, endLat, endLng) => {
    if (!mapRef.current) return;
    
    setLoadingRoute(true);
    clearRouteElements();

    try {
      // Use OSRM API directly
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`
      );

      if (!response.ok) {
        throw new Error(`OSRM API error: ${response.status}`);
      }

      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);

        // Create polyline for the route
        polylineRef.current = L.polyline(coordinates, {
          color: '#2563eb',
          weight: 5,
          opacity: 0.8,
          lineJoin: 'round',
        }).addTo(mapRef.current);

        // Add start marker (route start - same as driver but separate for route visualization)
        startMarkerRef.current = L.marker([startLat, startLng], { icon: redIcon })
          .addTo(mapRef.current)
          .bindPopup('<b>Route Start</b>');

        // Add end marker
        endMarkerRef.current = L.marker([endLat, endLng], { icon: blueIcon })
          .addTo(mapRef.current)
          .bindPopup('<b>Destination</b>');

        // Fit map to show the entire route - only once
        setIsZooming(true);
        const bounds = L.latLngBounds(coordinates);
        mapRef.current.fitBounds(bounds, { 
          padding: [50, 50],
          maxZoom: 15,
          duration: 1,
          onEnd: () => setIsZooming(false)
        });

        // Calculate distance and duration
        const distance = (route.distance / 1000).toFixed(1); // km
        const duration = Math.round(route.duration / 60); // minutes

        // Remove existing route info if any
        if (routeInfoControlRef.current && mapRef.current) {
          mapRef.current.removeControl(routeInfoControlRef.current);
        }

        // Create and add route info control
        const RouteInfoControl = L.Control.extend({
          onAdd: function() {
            const container = L.DomUtil.create('div', 'leaflet-control leaflet-bar route-info-control');
            container.style.backgroundColor = 'white';
            container.style.padding = '10px';
            container.style.borderRadius = '5px';
            container.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
            container.style.fontFamily = 'sans-serif';
            container.style.fontSize = '14px';
            container.style.minWidth = '200px';
            
            container.innerHTML = `
              <div style="margin-bottom: 5px;">
                <strong style="color: #2563eb;">Route Information</strong>
              </div>
              <div style="margin-bottom: 3px;">
                <span style="color: #666;">Distance:</span> 
                <span style="font-weight: bold; margin-left: 5px;">${distance} km</span>
              </div>
              <div style="margin-bottom: 8px;">
                <span style="color: #666;">Duration:</span> 
                <span style="font-weight: bold; margin-left: 5px;">${duration} min</span>
              </div>
              <button 
                id="clear-route-btn"
                style="
                  background: #dc2626;
                  color: white;
                  border: none;
                  padding: 6px 12px;
                  border-radius: 4px;
                  cursor: pointer;
                  width: 100%;
                  font-size: 13px;
                  font-weight: 500;
                "
              >
                Clear Route
              </button>
            `;
            
            // Add click event to the button
            L.DomEvent.on(container.querySelector('#clear-route-btn'), 'click', (e) => {
              L.DomEvent.stopPropagation(e);
              clearRouteElements();
            });
            
            L.DomEvent.disableClickPropagation(container);
            return container;
          }
        });

        // Add route info control to map
        routeInfoControlRef.current = new RouteInfoControl({ position: 'bottomleft' });
        routeInfoControlRef.current.addTo(mapRef.current);

      } else {
        throw new Error('No route found');
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      
      // Fallback: Draw straight line if API fails
      const coordinates = [[startLat, startLng], [endLat, endLng]];
      polylineRef.current = L.polyline(coordinates, {
        color: '#dc2626',
        weight: 3,
        opacity: 0.6,
        dashArray: '10, 10',
      }).addTo(mapRef.current);

      // Add start and end markers for fallback route
      startMarkerRef.current = L.marker([startLat, startLng], { icon: redIcon })
        .addTo(mapRef.current)
        .bindPopup('<b>Route Start</b>');

      endMarkerRef.current = L.marker([endLat, endLng], { icon: blueIcon })
        .addTo(mapRef.current)
        .bindPopup('<b>Destination</b>');

      // Show error info
      const ErrorControl = L.Control.extend({
        onAdd: function() {
          const container = L.DomUtil.create('div', 'leaflet-control leaflet-bar error-info-control');
          container.style.backgroundColor = '#fee2e2';
          container.style.padding = '10px';
          container.style.borderRadius = '5px';
          container.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
          container.style.fontFamily = 'sans-serif';
          container.style.fontSize = '14px';
          container.style.minWidth = '200px';
          container.style.border = '1px solid #fca5a5';
          
          container.innerHTML = `
            <div style="margin-bottom: 5px;">
              <strong style="color: #dc2626;">⚠️ Route Calculation Failed</strong>
            </div>
            <div style="margin-bottom: 8px; color: #7f1d1d; font-size: 12px;">
              Using straight line route. OSRM service unavailable.
            </div>
            <button 
              id="clear-error-route-btn"
              style="
                background: #dc2626;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                width: 100%;
                font-size: 13px;
                font-weight: 500;
              "
            >
              Clear Route
            </button>
          `;
          
          L.DomEvent.on(container.querySelector('#clear-error-route-btn'), 'click', (e) => {
            L.DomEvent.stopPropagation(e);
            clearRouteElements();
          });
          
          L.DomEvent.disableClickPropagation(container);
          return container;
        }
      });

      routeInfoControlRef.current = new ErrorControl({ position: 'bottomleft' });
      routeInfoControlRef.current.addTo(mapRef.current);
    } finally {
      setLoadingRoute(false);
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      // Clean up driver marker on unmount
      if (driverMarkerRef.current && mapRef.current) {
        mapRef.current.removeLayer(driverMarkerRef.current);
      }
      clearRouteElements();
    };
  }, []);

  // Garbage markers - with proper cleanup
  useEffect(() => {
    if (!mapRef.current || !location) return;

    const markers = [];
    const activeLocations = Array.isArray(locations) 
      ? locations.filter(loc => loc && loc.active) 
      : [];

    activeLocations.forEach((loc) => {
      if (!loc.lat || !loc.long) return;

      const marker = L.marker([loc.lat, loc.long], { 
        icon: blueIcon 
      }).addTo(mapRef.current);

      // Tooltip on hover
      marker.bindTooltip(loc.name || 'Garbage Location', {
        permanent: false,
        direction: 'top',
        offset: [0, -10],
        className: 'bg-white text-black px-2 py-1 rounded shadow border border-gray-300',
      });

      // Click handler for the marker itself
      marker.on('click', () => {
        calculateRoute(location.lat, location.lng, loc.lat, loc.long);
      });

      markers.push(marker);
    });

    return () => {
      markers.forEach(marker => {
        if (mapRef.current && marker) {
          mapRef.current.removeLayer(marker);
        }
      });
    };
  }, [location, locations]);

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div className="text-gray-700">
          {location ? (
            <>
              <span className="font-semibold">Driver Location:</span> 
              {' '}{location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </>
          ) : (
            <span className="text-yellow-600">Fetching location...</span>
          )}
        </div>
        <div className="flex gap-2">
          {loadingRoute && (
            <span className="text-blue-600 animate-pulse">Calculating route...</span>
          )}
          <button
            onClick={clearRoute}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Clear Route
          </button>
        </div>
      </div>
      
      <div
        id="map"
        className="rounded-2xl shadow-lg border border-gray-300 flex-grow"
        style={{ height: '100%', minHeight: '80vh', width: '100%' }}
      />
      
      <div className="mt-4 text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span>Driver Location</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <span>Garbage Dumps</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-300 rounded-full mr-2"></div>
            <span>Route Path</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-400">
          Click on any garbage dump marker to calculate route from your current location.
        </div>
      </div>
    </div>
  );
};

export default DriverLeafletMap;