import React, { useState, useEffect } from 'react';

import DriverLeafletMap from '../../components/driverLeaflet';
import axios from 'axios';
import DriverNavbar from '../../components/navbarDriver';
import DriverMapPlain from '../../components/driverLeaflet';

const DriverDashboard = ({ driver }) => {
  const [locations, setLocations] = useState([]);

  const fetchLocations = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/location/active-locations");
      const locations = res.data.locations || [];

      // Assign names like "Garbage 1", "Garbage 2"
      const namedLocations = locations.map((loc, index) => ({
        ...loc,
        name: `Garbage ${index + 1}`,
      }));

      setLocations(namedLocations);
    } catch (err) {
      console.error("Error fetching active locations:", err);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <div className="flex w-full h-screen">
      <div className="w-[320px]">
        <DriverNavbar locations={locations} setLocations={setLocations} />
      </div>
      <div className="flex-1">
        <DriverMapPlain driver={driver} locations={locations} />
      </div>
    </div>
  );
};

export default DriverDashboard;
