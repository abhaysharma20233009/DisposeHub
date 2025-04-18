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
  CircularProgress
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socketError, setSocketError] = useState(false);
  const [lottieData, setLottieData] = useState(null);
  const socketRef = useRef(null);
  const theme = useTheme();

  const setupSocket = () => {
    try {
      if (!socketRef.current) {
        socketRef.current = io('http://localhost:3000');

        socketRef.current.on('connect', () => {
          setSocketError(false);
        });

        socketRef.current.on('leaderboard', (data) => {
          setUsers(data);
          setLoading(false);
        });

        socketRef.current.on('connect_error', () => {
          setSocketError(true);
          setLoading(false);
        });
      }
    } catch (err) {
      console.error(err);
      setSocketError(true);
      setLoading(false);
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
      setupSocket();
    };

    const handleBlur = () => {
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

  // Fetch Lottie JSON from URL
  useEffect(() => {
    const fetchLottie = async () => {
      try {
        const res = await fetch('https://lottie.host/9a550431-d23b-45c5-9d95-6a1cd5c91a77/tUOMl7t47e.json');
        const json = await res.json();
        setLottieData(json);
      } catch (err) {
        console.error("Failed to load Lottie animation", err);
      }
    };

    fetchLottie();
  }, []);

  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  const getMedalColor = (index) => {
    if (index === 0) return '#FFD700';
    if (index === 1) return '#C0C0C0';
    if (index === 2) return '#CD7F32';
    return '#BB86FC';
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #2D0035, #150050)',
      color: '#fff',
      py: 6,
      px: 2
    }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          {lottieData && (
            <Lottie animationData={lottieData} style={{ height: 180 }} />
          )}
        </Box>
      </motion.div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Typography variant="h3" align="center" gutterBottom sx={{
          fontWeight: 'bold',
          background: 'linear-gradient(to right, #ffffff, #BB86FC)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          🚀 Leaderboard: Top Performers
        </Typography>
      </motion.div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <CircularProgress sx={{ color: '#BB86FC' }} />
          </Box>
        ) : socketError ? (
          <Typography align="center" color="error" mt={6}>
            ⚠️ Could not connect to leaderboard server.
          </Typography>
        ) : sortedUsers.length === 0 ? (
          <Typography align="center" mt={6} sx={{ color: '#BB86FC' }}>
            No users available on the leaderboard yet.
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{
            maxWidth: 1000,
            mx: 'auto',
            borderRadius: 4,
            backdropFilter: 'blur(12px)',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            overflowX: 'auto'
          }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
                  <TableCell sx={{ color: '#BB86FC', fontWeight: 'bold' }}>Rank</TableCell>
                  <TableCell sx={{ color: '#BB86FC', fontWeight: 'bold' }}>User</TableCell>
                  <TableCell sx={{ color: '#BB86FC', fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ color: '#BB86FC', fontWeight: 'bold' }}>Points</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedUsers.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TableCell>
                      <Box
                        sx={{
                          backgroundColor: getMedalColor(index),
                          color: index < 3 ? 'black' : 'white',
                          px: 2,
                          py: 0.5,
                          borderRadius: 2,
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
                        <Typography sx={{ color: 'white' }} fontWeight={500}>
                          {user.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: 'white' }}>{user.email}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#BB86FC' }}>{user.points}</TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </motion.div>
    </Box>
  );
};

export default Leaderboard;
