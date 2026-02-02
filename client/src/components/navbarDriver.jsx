import React from 'react';
import { Box, Paper, Typography, Button, Divider, Tooltip } from '@mui/material';
import { styled } from '@mui/system';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import { deactivateLocation } from "../apis/garbageApi";

const Sidebar = styled(Paper)(({ theme }) => ({
  width: '100%',
  height: '100%',
  background: 'linear-gradient(180deg, #2E3B55 0%, #1F2A40 100%)',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(3),
  overflowY: 'auto',
  borderTopRightRadius: '24px',
  borderBottomRightRadius: '24px',
}));

const LocationBox = styled(Box)(({ theme, disabled }) => ({
  backgroundColor: disabled ? '#4a5568' : '#f0f4f8',
  color: disabled ? '#cbd5e0' : '#1a202c',
  padding: theme.spacing(2),
  borderRadius: '16px',
  marginBottom: theme.spacing(2),
  boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
  opacity: disabled ? 0.6 : 1,
  transition: '0.3s',
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const DriverNavbar = ({ locations, setLocations }) => {
  const [passed, setPassed] = React.useState({});

  const handlePass = (Id) => {
    setPassed((prev) => ({ ...prev, [Id]: true }));
  };

  const handleTake = (name) => {
    alert(`You are going to complete task of : ${name}`);
  };

  const handleThrown = async (id) => {
    const confirm = window.confirm("Have you thrown it?");
    if (!confirm) return;

    try {
    await deactivateLocation(id);

    setLocations((prev) =>
      prev.filter((loc) => loc._id !== id)
    );
  } catch (error) {
    console.error("Failed to deactivate location:", error.message);
  }
};


  return (
    <Sidebar
  elevation={0}
  sx={{
    p: 3,
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #a855f7, #6b21a8)',
    color: 'white',
    borderRadius: 3,
    overflowY: 'auto',
  }}
>
  <Typography
    variant="h4"
    gutterBottom
    sx={{
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#fff',
      mb: 4,
    }}
  >
    Active Garbage Requests
  </Typography>

  {locations.map((loc) => (
    <Box
      key={loc._id}
      sx={{
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 4,
        p: 3,
        mb: 3,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: '#fff',
        transition: 'transform 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
        },
        opacity: passed[loc._id] ? 0.5 : 1,
        pointerEvents: passed[loc._id] ? 'none' : 'auto',
      }}
    >
      <Box display="flex" alignItems="center" gap={1} mb={1}>
        <LocationOnIcon sx={{ color: '#fcd34d' }} />
        <Typography variant="h6" fontWeight={600}>
          {loc.name || 'Garbage'}
        </Typography>
      </Box>

      <Typography variant="body2">Lat: {loc.lat}</Typography>
      <Typography variant="body2" mb={1}>
        Lng: {loc.long}
      </Typography>

      <Divider sx={{ my: 1.5, borderColor: 'rgba(255,255,255,0.2)' }} />

      <Box display="flex" gap={1} flexWrap="wrap">
        <Tooltip title="Take Task">
          <Button
            variant="contained"
            sx={{
              background: 'linear-gradient(to right, #8b5cf6, #a855f7)',
              color: '#fff',
              '&:hover': {
                background: 'linear-gradient(to right, #7c3aed, #9333ea)',
              },
              borderRadius: 3,
            }}
            startIcon={<CheckCircleIcon />}
            onClick={() => handleTake(loc.name)}
          >
            Take
          </Button>
        </Tooltip>

        <Tooltip title="Pass Task">
          <Button
            variant="outlined"
            sx={{
              borderColor: '#e879f9',
              color: '#f9a8d4',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              borderRadius: 3,
            }}
            startIcon={<ClearIcon />}
            onClick={() => handlePass(loc._id)}
          >
            Pass
          </Button>
        </Tooltip>

        <Tooltip title="Mark Thrown">
          <Button
            variant="contained"
            sx={{
              background: 'linear-gradient(to right, #ec4899, #db2777)',
              color: '#fff',
              '&:hover': {
                background: 'linear-gradient(to right, #be185d, #9d174d)',
              },
              borderRadius: 3,
            }}
            startIcon={<DeleteIcon />}
            onClick={() => handleThrown(loc._id)}
          >
            Thrown
          </Button>
        </Tooltip>
      </Box>
    </Box>
  ))}
</Sidebar>

  );
};

export default DriverNavbar;
