import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Button, Divider } from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';

const Sidebar = styled(Paper)(({ theme }) => ({
  width: '320px',
  height: '100vh',
  background: 'linear-gradient(180deg, #2E3B55 0%, #1F2A40 100%)',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '4px 0 12px rgba(0,0,0,0.15)',
  paddingTop: theme.spacing(4),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(2),
  overflowY: 'auto',
  borderTopRightRadius: '24px',
  borderBottomRightRadius: '24px',
}));

const LocationBox = styled(Box)(({ theme, disabled }) => ({
  backgroundColor: disabled ? '#999' : '#fff',
  color: disabled ? '#ccc' : '#333',
  padding: theme.spacing(2),
  borderRadius: '16px',
  marginBottom: theme.spacing(2),
  transition: 'all 0.3s ease',
  boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
  opacity: disabled ? 0.5 : 1,
}));

const DriverNavbar = () => {
  const [locations, setLocations] = useState([]);
  const [passed, setPassed] = useState({});

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/location/active-locations");
        setLocations(res.data.locations || []);
      } catch (err) {
        console.error("Error fetching active locations:", err);
      }
    };

    fetchLocations();
  }, []);

  const handlePass = (uid) => {
    setPassed((prev) => ({ ...prev, [uid]: true }));
  };

  const handleTake = (uid) => {
    alert(`You took the task of UID: ${uid}`);
  };

  const handleThrown = async (id) => {
    const confirm = window.confirm("Have you thrown it?");
    if (!confirm) return;

    try {
      await axios.patch(`http://localhost:3000/api/location/${id}/deactivate`, {
        active: false,
      });

      setLocations((prev) => prev.filter((loc) => loc._id !== id));
    } catch (error) {
      console.error("Failed to deactivate location:", error);
    }
  };

  return (
    <Box className="flex h-screen bg-gradient-to-br from-gray-100 to-blue-100">
      <Sidebar elevation={4}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          Active Requests
        </Typography>

        {locations.map((loc) => (
          <LocationBox key={loc._id} disabled={passed[loc.firebaseUID]}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Garbage
            </Typography>
            <Typography variant="body2">Latitude: {loc.lat}</Typography>
            <Typography variant="body2">Longitude: {loc.long}</Typography>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleTake(loc.firebaseUID)}
                disabled={passed[loc.firebaseUID]}
              >
                Take
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handlePass(loc.firebaseUID)}
              >
                Pass
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleThrown(loc._id)}
              >
                Thrown
              </Button>
            </Box>
          </LocationBox>
        ))}
      </Sidebar>
    </Box>
  );
};

export default DriverNavbar;