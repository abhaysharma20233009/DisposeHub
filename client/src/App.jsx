<<<<<<< HEAD
import { Profiler, useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css';
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
=======
import { useEffect, useState } from 'react'
import { useLocation } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'leaflet/dist/leaflet.css';
import './App.css'

// Pages and Components
import LeafletMap from './components/LeafletMap';
>>>>>>> fc55336506d68588c9a54561f6f27036039c1df7
import Login from "./pages/register/Login";
import Signup from "./pages/register/SignUp";
import Leaderboard from './components/leaderboard';
import DriverIntegrate from './pages/GeneralUser/driverIntegrate';
import Dashboard from './pages/home/Dashboard';
import LandingPage from './pages/Landing';
import ContactUsPage from './pages/ContactUsPage';
import { getMe } from './apis/userApi';
<<<<<<< HEAD
=======
import Integrate from './pages/GeneralUser/Integrate';
>>>>>>> fc55336506d68588c9a54561f6f27036039c1df7
import { Wallet } from './components/Wallet';
import UserProfile from './pages/register/profile/profile';
import EditUserProfile from './pages/register/profile/editProfile';
import TransactionsPage from './pages/TransactionPage';
<<<<<<< HEAD
import Integrate from './pages/GeneralUser/Integrate';
import { useLocation } from "react-router-dom";
import Navbar from './components/websiteNavbar';

function App() {
  const [role, setRole] = useState(null);
  const [name, setName] = useState(null);
  const [garbageDumps, setGarbageDumps] = useState([]);
  const location = useLocation();
  const hideNavbar = location.pathname === "/";
  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getMe();
        console.log("user"+user.role);
        setRole(user.role);
        setName(user.name);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  // Fetch garbage dumps on component mount
  useEffect(() => {
=======
import Navbar from './components/websiteNavbar';

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/";
  const [role, setRole] = useState(null);
  const [name, setName] = useState(null);
  const [garbageDumps, setGarbageDumps] = useState({ data: [] });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getMe();
        setRole(user.role);
        setName(user.name);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

>>>>>>> fc55336506d68588c9a54561f6f27036039c1df7
    const fetchGarbageDumps = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/garbage/all');
        const data = await response.json();
        if (data.success) {
<<<<<<< HEAD
          setGarbageDumps(data.dumps);
=======
          setGarbageDumps(data);
>>>>>>> fc55336506d68588c9a54561f6f27036039c1df7
        } else {
          console.error("Failed to fetch garbage dumps:", data.message);
        }
      } catch (error) {
        console.error("Error fetching garbage dumps:", error);
      }
    };

<<<<<<< HEAD
=======
    fetchUser();
>>>>>>> fc55336506d68588c9a54561f6f27036039c1df7
    fetchGarbageDumps();
  }, []);

  return (
    <>
       {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/driver" element={<DriverIntegrate role={role} name={name} garbageDumps={garbageDumps} />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/map" element={<Integrate role={role} name={name} garbageDumps={garbageDumps} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/leader-board" element={<Leaderboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editProfile" element={<EditUserProfile />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/withdrawl-money" element={<Wallet/>}/>
        <Route path="/contact" element={<ContactUsPage/>} />
        <Route path="/transactions" element={<TransactionsPage/>} />
      </Routes>
    </>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}