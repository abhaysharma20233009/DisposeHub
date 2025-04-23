// components/Navbar.jsx
import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { FaBell } from "react-icons/fa";
import NotificationDropdown from "./Notification";
const Navbar = ({role}) => {
  const navigate = useNavigate();
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [data, setData] = useState(0);
  const toggleNotificationBell = () => setIsBellOpen(!isBellOpen);
  const handleLogout = () => {
    // Clear any authentication tokens or user data here
    localStorage.clear(); 
    navigate('/login');
  };
  const handleDataFromChild = (childData) => {
    setData(childData);
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
            to={role === 'admin' ? "/admin-dashboard" : "/dashboard"}
            className="inline-block bg-zinc-500 text-white font-medium px-5 py-2 rounded-lg shadow-md hover:from-purple-600 hover:to-fuchsia-700 transition-all duration-300"
        >
            Dashboard
        </Link>
        </div>
        
      <div>
         <div className="flex items-center gap-6">
                {/* Notification Bell */}
                <div className="relative cursor-pointer bell-icon" onClick={toggleNotificationBell}>
                  <FaBell className="text-2xl text-red-400 hover:text-red-600 transform transition duration-200 hover:scale-110" />
                  {data > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {data}
                    </span>
                  )}
                  {isBellOpen && <NotificationDropdown sendData={handleDataFromChild} />}
                </div>
        </div>
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