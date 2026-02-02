import React, { useState, useEffect } from 'react';
import DriverLeafletMap from '../../components/driverLeaflet';
import DriverNavbar from '../../components/navbarDriver';
import { getActiveLocations } from '../../apis/garbageApi';

const DriverIntegrate = ({ driver }) => {
  const [locations, setLocations] = useState([]);

  const fetchLocations = async () => {
    try {
      const locations = await getActiveLocations();
      const named = (locations || []).map((loc) => ({
        ...loc,
        name: loc.locationName || 'Unnamed Garbage',
      }));

      setLocations(named);
    } catch (err) {
      console.error("Error fetching active locations:", err);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <div className="flex w-full h-screen bg-gradient-to-br from-slate-100 to-blue-100">
      <div className="w-[340px] h-full border-r border-gray-200 bg-white">
        <DriverNavbar locations={locations} setLocations={setLocations} />
      </div>
      <div className="flex-1 h-full overflow-hidden">
        <DriverLeafletMap 
          driver={driver} 
          locations={locations} 
          setLocations={setLocations}
        />
      </div>
    </div>
  );
};

export default DriverIntegrate;