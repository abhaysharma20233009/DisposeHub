import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import 'leaflet/dist/leaflet.css';
import './App.css';

// Pages and Components
import LeafletMap from './components/LeafletMap';
import Login from "./pages/register/Login";
import Signup from "./pages/register/SignUp";
import Leaderboard from './components/leaderboard';
import DriverIntegrate from './pages/GeneralUser/driverIntegrate';
import Dashboard from './pages/home/Dashboard';
import LandingPage from './pages/Landing';
import ContactUsPage from './pages/ContactUsPage';
import Integrate from './pages/GeneralUser/Integrate';
import { Wallet } from './components/Wallet';
import UserProfile from './pages/register/profile/profile';
import EditUserProfile from './pages/register/profile/editProfile';
import TransactionsPage from './pages/TransactionPage';
import { getMe } from './apis/userApi';
import Navbar from './components/websiteNavbar';
import AdminDashboard from './pages/adminPages/adminDashboard';
import ContactMessages from './pages/contactMessages';
import AdminTransactions from './pages/AdminTransactions';
import AuthCallback from "./auth/AuthCallback";



function App() {
  const location = useLocation();
  const hideNavbarRoutes = ["/", "/login", "/signup"];
  const hideNavbar = hideNavbarRoutes.includes(location.pathname);

  const [authLoading, setAuthLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [name, setName] = useState(null);
  const [garbageDumps, setGarbageDumps] = useState({ data: [] });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getMe();
        if (user) {
          setRole(user.role);
          setName(user.name);
        } else {
          setRole(null);
          setName(null);
        }
        setAuthLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchGarbageDumps = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/garbage/all');
        const data = await response.json();
        if (data.success) {
          setGarbageDumps(data);
        } else {
          console.error("Failed to fetch garbage dumps:", data.message);
        }
      } catch (error) {
        console.error("Error fetching garbage dumps:", error);
      }
    };

    fetchUser();
    fetchGarbageDumps();
  }, []);

  return (
    <>
      {!hideNavbar && <Navbar role={role} />}
      <Routes>
        <Route path="/" element={<LandingPage role={role} isLoggedIn={!!role} />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/driver" element={<DriverIntegrate role={role} name={name} garbageDumps={garbageDumps} />} />
        <Route path="/map" element={<Integrate role={role} name={name} garbageDumps={garbageDumps} />} />
        <Route path="/leader-board" element={<Leaderboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editProfile" element={<EditUserProfile />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/withdrawl-money" element={<Wallet />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/admin-dashboard" element = {<AdminDashboard />} />
        <Route path="/admin/contact-messages" element={<ContactMessages />} />
        <Route path="/admin/transactions" element={<AdminTransactions />} />
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
