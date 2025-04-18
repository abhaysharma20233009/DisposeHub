import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { getMe } from "../../../../src/apis/userApi";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { useSpring, animated, config } from "react-spring";
import styled, { keyframes } from "styled-components";

// Keyframes for animations
const fall = keyframes`
  0% {
    top: -20px;
    opacity: 1;
  }
  100% {
    top: 100%;
    opacity: 0;
  }
`;

const grow = keyframes`
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

// Styled components for animations
const FallingCoin = styled(animated.div)`
  position: absolute;
  animation: ${fall} ${props => props.duration || '3s'} linear infinite;
  animation-delay: ${props => props.delay || '0s'};
  left: ${props => props.left || '50%'};
  z-index: 1;
`;

const GrowingTreeContainer = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto;
`;

const Tree = styled.div`
  width: 100%;
  height: 100%;
  background-image: url('https://cdn-icons-png.flaticon.com/512/477/477033.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  animation: ${grow} 1.5s ease-out forwards, ${pulse} 3s ease-in-out infinite;
`;

export default function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const userData = await getMe();
      setUser(userData);
    } catch (error) {
      console.log(error.message || "Error loading user data ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Generate falling coins with random properties
  const generateCoins = () => {
    const coins = [];
    const coinImages = [
      'https://cdn-icons-png.flaticon.com/512/272/272525.png', // Gold coin
      'https://cdn-icons-png.flaticon.com/512/3132/3132693.png', // Silver coin
      'https://cdn-icons-png.flaticon.com/512/477/477029.png' // Bronze coin
    ];
    
    for (let i = 0; i < 8; i++) {
      coins.push(
        <FallingCoin
          key={i}
          delay={`${Math.random() * 2}s`}
          duration={`${2 + Math.random() * 3}s`}
          left={`${10 + Math.random() * 80}%`}
        >
          <img
            src={coinImages[Math.floor(Math.random() * coinImages.length)]}
            alt="Coin"
            style={{ width: "20px", height: "20px" }}
          />
        </FallingCoin>
      );
    }
    return coins;
  };

  // Tree growing animation based on points
  const GrowingTree = () => {
    const points = user?.points || 0;
    let treeSize = '60px';
    
    if (points > 1000) treeSize = '100px';
    else if (points > 500) treeSize = '90px';
    else if (points > 200) treeSize = '80px';
    else if (points > 50) treeSize = '70px';

    return (
      <GrowingTreeContainer>
        <Tree style={{ width: treeSize, height: treeSize }} />
      </GrowingTreeContainer>
    );
  };

  if (!user) {
    return <p className="text-center text-red-500">Error loading user data</p>;
  }

  return (
    <div className="flex flex-wrap gap-8 p-8 min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      {/* Profile Section */}
      <div className="w-400 md:w-2/4 bg-white/10 backdrop-blur-md border border-gray-700 shadow-lg rounded-3xl p-6 relative overflow-hidden">
        <button
          onClick={() => navigate("/editProfile", { state: { user } })}
          className="absolute top-4 right-4 p-2 bg-cyan-500 text-black rounded-full hover:bg-cyan-600 transition z-10"
        >
          <FaEdit size={20} />
        </button>

        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-cyan-400 shadow-lg">
            <img
              src={user?.profilePicture || "/cop.jpg"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* User Info */}
        <h2 className="mt-4 text-3xl font-bold text-cyan-400 text-center">{user.name}</h2>
        <p className="text-center text-gray-300">{user.email}</p>

        {/* Points & Wallet Balance Sections with Animations */}
        <Box mt={4} display="flex" justifyContent="center" alignItems="center" gap={4}>
          {/* Points Section with Growing Tree */}
          <Card
            sx={{
              width: 180,
              textAlign: "center",
              backgroundColor: "#1c1c1c",
              color: "#fff",
              boxShadow: 3,
              position: "relative",
              overflow: "visible",
            }}
          >
            <CardContent>
              <Typography variant="h6" component="div" color="cyan">
                Points
              </Typography>
              <GrowingTree />
              <Typography variant="h5" component="div" sx={{ mt: 1 }}>
                {user.points ?? "N/A"}
              </Typography>
            </CardContent>
          </Card>

          {/* Wallet Balance Section with Falling Coins */}
          <Card
            sx={{
              width: 180,
              textAlign: "center",
              backgroundColor: "#1c1c1c",
              color: "#fff",
              boxShadow: 3,
              position: "relative",
              overflow: "hidden",
              height: "160px",
            }}
          >
            {generateCoins()}
            <CardContent style={{ position: "relative", zIndex: 2 }}>
              <Typography variant="h6" component="div" color="cyan">
                Wallet Balance
              </Typography>
              <Typography variant="h5" component="div">
                ${user.walletBalance?.toFixed(2) ?? "0.00"}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </div>
    </div>
  );
}