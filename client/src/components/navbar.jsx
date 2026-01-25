// components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any authentication tokens or user data here
    localStorage.clear(); 
    navigate('/login');
  };

  return (
    <nav className="bg-purple-700 text-white px-8 py-4 shadow-md flex justify-between items-center">
      <div className="text-2xl font-bold tracking-wide">
        <Link to="/">DisposeHub</Link>
      </div>
      <div className="space-x-6">
        <Link to="/" className="hover:underline text-lg">Home</Link>
        <Link to="/dashboard" className="hover:underline text-lg">Dashboard</Link>
      </div>
      <div>
        <Button
          variant="contained"
          onClick={handleLogout}
          sx={{
            textTransform: "none",
            borderRadius: "999px",
            bgcolor: "#ffffff",
            color: "#9C27B0",
            fontWeight: "bold",
            "&:hover": {
              bgcolor: "#f0e6f6",
            }
          }}
        >
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
