import React, { useEffect, useState } from "react";
import { getMe } from "../../apis/userApi";
import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom"; // Used for routing to LeafletMap.jsx
import { deepPurple } from "@mui/material/colors";

export default function UserDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const uid = localStorage.getItem("firebaseUID");
      if (uid) {
        try {
          const data = await getMe(uid);
          setUser(data);
        } catch (err) {
          console.error("Error fetching user data", err);
        }
      }
    };
    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center" style={{ background: 'linear-gradient(135deg, #2D0035, #150050)' }}>
        <CircularProgress sx={{ color: "#fff" }} />
      </div>
    );
  }

  const renderUserSections = () => (
    <>
      {/* Profile Picture */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-sm shadow-xl rounded-3xl p-8 flex flex-col items-center border border-purple-400 hover:shadow-purple-200"
      >
        <Avatar
          src={user.profilePicture || "https://i.pravatar.cc/100"}
          sx={{ width: 120, height: 120, bgcolor: "#9C27B0", mb: 3 }}
        />
        <h2 className="text-3xl font-bold text-white mb-1">{user.name}</h2>
        <p className="text-sm font-semibold bg-purple-700/30 text-white px-4 py-1 rounded-full mt-2 shadow-sm">
          {user.role}
        </p>
      </motion.div>

      {/* Points and Wallet */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white/10 backdrop-blur-sm shadow-xl rounded-3xl p-8 border border-purple-400 hover:shadow-purple-200"
      >
        <div className="space-y-6 text-base text-white">
          <div className="flex justify-between">
            <span className="font-medium">Points Earned:</span>
            <span className="font-bold text-purple-300">{user.points}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Wallet Balance:</span>
            <span className="font-bold text-purple-300">₹{user.wallet}</span>
          </div>
        </div>
      </motion.div>

      {/* Edit Profile Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-white/10 backdrop-blur-sm shadow-xl rounded-3xl p-8 border border-purple-400 hover:shadow-purple-200 text-center mt-6"
      >
        <Link to="/edit-profile">
          <Button
            variant="contained"
            sx={{
              borderRadius: "999px",
              px: 4,
              py: 1,
              textTransform: "none",
              bgcolor: "#9C27B0",
              "&:hover": {
                bgcolor: "#7B1FA2",
              },
            }}
          >
            Edit Profile
          </Button>
        </Link>
      </motion.div>

      {/* Find Nearby Dustbins (Route to LeafletMap.jsx) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="bg-white/10 backdrop-blur-sm shadow-xl rounded-3xl p-8 border border-purple-400 hover:shadow-purple-100 text-center mt-6"
      >
        <Link to="/leaflet-map">
          <Button
            variant="outlined"
            sx={{
              borderRadius: "999px",
              px: 4,
              py: 1,
              textTransform: "none",
              color: "#fff",
              borderColor: "#9C27B0",
              "&:hover": {
                borderColor: "#fff",
                bgcolor: "#7B1FA230",
              },
            }}
          >
            Find Nearby Dustbins
          </Button>
        </Link>
      </motion.div>
    </>
  );

  const renderDriverSections = () => (
    <div className="min-h-screen flex flex-col items-center py-12 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/10 backdrop-blur-sm shadow-xl rounded-3xl p-8 flex flex-col items-center border border-purple-400 hover:shadow-purple-100 w-full max-w-lg"
      >
        <Avatar
          src="https://i.pravatar.cc/100" // You can replace this with user.profilePicture
          sx={{ width: 120, height: 120, bgcolor: "#9C27B0", mb: 3 }}
        />
        <h2 className="text-3xl font-bold text-white mb-1">{user.name}</h2>
        <p className="text-sm font-semibold bg-purple-700/30 text-white px-4 py-1 rounded-full mt-2 shadow-sm">
          Driver
        </p>
      </motion.div>

      {/* Edit Profile Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white/10 backdrop-blur-sm shadow-xl rounded-3xl p-8 border border-purple-400 hover:shadow-purple-100 text-center mt-6 w-full max-w-lg"
      >
        <Link to="/edit-profile">
          <Button
            variant="contained"
            sx={{
              borderRadius: "999px",
              px: 4,
              py: 1,
              textTransform: "none",
              bgcolor: "#9C27B0",
              "&:hover": {
                bgcolor: "#7B1FA2",
              },
            }}
          >
            Edit Profile
          </Button>
        </Link>
      </motion.div>

      {/* Grid for two sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 w-full max-w-5xl">
        {/* Nearby Dustbins */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white/10 backdrop-blur-sm shadow-xl rounded-3xl p-8 border border-purple-400 hover:shadow-purple-200 text-center"
        >
          <h3 className="font-bold text-xl text-white mb-4">Nearby Dustbins</h3>
          <p className="text-sm text-white mb-4">
            Find the nearest dustbins in your area to dispose of waste properly.
          </p>
          <Link to="/leaflet-map">
            <Button
              variant="outlined"
              sx={{
                borderRadius: "999px",
                px: 4,
                py: 1,
                textTransform: "none",
                color: "#fff",
                borderColor: "#9C27B0",
                "&:hover": {
                  borderColor: "#fff",
                  bgcolor: "#7B1FA230",
                },
              }}
            >
              Find Dustbins
            </Button>
          </Link>
        </motion.div>

        {/* Garbage Store Places */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-white/10 backdrop-blur-sm shadow-xl rounded-3xl p-8 border border-purple-400 hover:shadow-purple-200 text-center"
        >
          <h3 className="font-bold text-xl text-white mb-4">Garbage Store Places</h3>
          <p className="text-sm text-white mb-4">
            See the list of places where you can dispose of your collected waste.
          </p>
          <div className="text-white">
            <ul className="space-y-2">
              {/* Replace with actual data */}
              <li className="text-sm">Store Location 1</li>
              <li className="text-sm">Store Location 2</li>
              <li className="text-sm">Store Location 3</li>
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Grid for two sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 w-full max-w-5xl">
        {/* Number of Places Garbage Picked */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="bg-white/10 backdrop-blur-sm shadow-xl rounded-3xl p-8 border border-purple-400 hover:shadow-purple-200 text-center"
        >
          <h3 className="font-bold text-xl text-white mb-4">Places Garbage Picked</h3>
          <p className="text-xl text-white mb-4">
            See how many places you've helped by collecting garbage.
          </p>
          <p className="text-xl text-white">{5}</p> {/* Replace 5 with actual count */}
        </motion.div>

        {/* Edit Profile Button for User/Driver */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="bg-white/10 backdrop-blur-sm shadow-xl rounded-3xl p-8 border border-purple-400 hover:shadow-purple-200 text-center"
        >
          <Link to="/edit-profile">
            <Button
              variant="contained"
              sx={{
                borderRadius: "999px",
                px: 4,
                py: 1,
                textTransform: "none",
                bgcolor: "#9C27B0",
                "&:hover": {
                  bgcolor: "#7B1FA2",
                },
              }}
            >
              Edit Profile
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen px-6 py-6 text-white font-['Segoe UI']" style={{ background: 'linear-gradient(135deg, #2D0035, #150050)' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <h1 className="text-5xl font-extrabold text-white drop-shadow-xl tracking-tight">Welcome to EcoTrack!</h1>
        <p className="text-lg mt-4 max-w-2xl mx-auto text-gray-200 font-medium leading-relaxed">
          Empower your surroundings by responsibly disposing waste and earning rewards. Be the change the world needs.
        </p>
      </motion.div>

      {/* Conditional rendering based on user role */}
      {user.role === "user" ? renderUserSections() : renderDriverSections()}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/10 backdrop-blur-sm shadow-xl rounded-3xl p-8 mt-12 border border-purple-400 hover:shadow-purple-200 text-center"
      >
        <h2 className="text-2xl font-bold">Let's make the world cleaner!</h2>
      </motion.div>
    </div>
  );
}
