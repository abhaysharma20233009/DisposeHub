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
    <nav className="bg-gray-900 text-white px-8 py-4 shadow-md flex justify-between items-center">
      <div className="text-2xl font-bold tracking-wide">
        <Link to="/">DisposeHub</Link>
      </div>
      <div className="space-x-4 flex">
        <Link
            to="/"
            className="inline-block  bg-zinc-500 text-white font-medium px-10 py-2 rounded-lg shadow-md hover:from-purple-600 hover:to-fuchsia-700 transition-all duration-300"
        >
            Home
        </Link>
        <Link
            to="/dashboard"
            className="inline-block bg-zinc-500 text-white font-medium px-5 py-2 rounded-lg shadow-md hover:from-purple-600 hover:to-fuchsia-700 transition-all duration-300"
        >
            Dashboard
        </Link>
        </div>

      <div>
      <Button
        variant="contained"
        onClick={handleLogout}
        sx={{
            textTransform: "none",
            borderRadius: "999px",
            bgcolor: "#e53935", // red shade
            color: "#ffffff", // white text
            fontWeight: "bold",
            "&:hover": {
            bgcolor: "#d32f2f", // darker red on hover
            },
        }}
        >
        Logout
        </Button>

      </div>
    </nav>
  );
};

export default Navbar;