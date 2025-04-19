import React, { useState } from 'react';
import Navbar from '../../components/navbar';
import LeafletMap from '../../components/LeafletMap';
import { Box, Paper, Typography } from '@mui/material';
import { styled } from '@mui/system';

// Styled sidebar
const Sidebar = styled(Paper)(({ theme }) => ({
  width: '260px',
  height: '100vh',
  background: 'linear-gradient(180deg, #2E3B55 0%, #1F2A40 100%)',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '4px 0 12px rgba(0,0,0,0.15)',
  paddingTop: theme.spacing(4),
  paddingLeft: theme.spacing(3),
  transition: 'width 0.3s',
  borderTopRightRadius: '24px',
  borderBottomRightRadius: '24px',
  overflow: 'hidden',
}));

// Styled map container
const MapContainer = styled(Paper)(({ theme }) => ({
  flex: 1,
  margin: theme.spacing(2),
  marginLeft: theme.spacing(1),
  backgroundColor: '#ffffff',
  padding: theme.spacing(2),
  height: 'calc(100vh - 32px)',
  borderRadius: '24px',
  boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.1)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

// Styled title
const NavbarTitle = styled(Typography)(({ theme }) => ({
  fontSize: '22px',
  fontWeight: 'bold',
  marginBottom: theme.spacing(5),
  textAlign: 'center',
  color: '#ffffff',
}));

function Integrate({ role, name, garbageDumps }) {
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <Box className="flex h-screen bg-gradient-to-br from-gray-100 to-blue-100">
     
      <Navbar onSelectLocation={setSelectedLocation} />

      <MapContainer elevation={4}>
        <LeafletMap
          user={{ role, name }}
          selectedLocation={selectedLocation}
          onMapClick={setSelectedLocation}
          garbageDumps={garbageDumps}
        />
      </MapContainer>
    </Box>
  );
}

export default Integrate;