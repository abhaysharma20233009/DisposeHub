import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import {
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  useTheme,
} from '@mui/material';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const socketRef = useRef(null);
  const theme = useTheme();

  const setupSocket = () => {
    if (!socketRef.current) {
      socketRef.current = io('http://localhost:3000');
      socketRef.current.on('leaderboard', (data) => {
        setUsers(data);
        console.log(data);
      });
    }
  };

  const cleanupSocket = () => {
    if (socketRef.current) {
      socketRef.current.off('leaderboard');
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  useEffect(() => {
    const handleFocus = () => {
      console.log('Window focused – connecting to socket');
      setupSocket();
    };

    const handleBlur = () => {
      console.log('Window blurred – disconnecting socket');
      cleanupSocket();
    };

    if (document.hasFocus()) handleFocus();
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      cleanupSocket();
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  const getMedalColor = (index) => {
    if (index === 0) return '#FFD700'; // Gold
    if (index === 1) return '#C0C0C0'; // Silver
    if (index === 2) return '#CD7F32'; // Bronze
    return theme.palette.primary.main;
  };

  return (
    <Box sx={{ bgcolor: '#122222', color: 'white', minHeight: '100vh', py: 6 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#A3E635' }}>
        🌟 Top Performers Leaderboard
      </Typography>

      <TableContainer component={Paper} sx={{ maxWidth: 1000, mx: 'auto', bgcolor: '#2EEEEE' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#2C2C2C' }}>
              <TableCell sx={{ color: '#A3E635', fontWeight: 'bold' }}>Rank</TableCell>
              <TableCell sx={{ color: '#A3E635', fontWeight: 'bold' }}>User</TableCell>
              <TableCell sx={{ color: '#A3E635', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ color: '#A3E635', fontWeight: 'bold' }}>Points</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedUsers.map((user, index) => (
              <TableRow
                key={user._id}
                sx={{
                  '&:nth-of-type(odd)': { bgcolor: '#252525' },
                  '&:nth-of-type(even)': { bgcolor: '#1B1B1B' },
                  '&:hover': { bgcolor: '#333' },
                }}
              >
                <TableCell>
                  <Box
                    sx={{
                      backgroundColor: getMedalColor(index),
                      color: index < 3 ? 'black' : 'white',
                      px: 2,
                      py: 0.5,
                      borderRadius: 2,
                      display: 'inline-block',
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}
                  >
                    {index + 1}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={user.profilePicture} alt={user.name} />
                    <Typography sx={{ color: '#ccc' }}fontWeight={500}>{user.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: '#ccc' }}>{user.email}</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#A3E635' }}>{user.points}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Leaderboard;
