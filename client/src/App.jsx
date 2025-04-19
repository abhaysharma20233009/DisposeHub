import { useLocation } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LeafletMap from './components/LeafletMap';
import Login from "./pages/register/Login";
import Signup from "./pages/register/SignUp";
import Leaderboard from './components/leaderboard';
import Dashboard from './pages/home/Dashboard';
import LandingPage from './pages/Landing';
import ContactUsPage from './pages/ContactUsPage';
import { Wallet } from './components/Wallet';
import UserProfile from './pages/register/profile/profile';
import EditUserProfile from './pages/register/profile/editProfile';
import TransactionsPage from './pages/TransactionPage';
import Navbar from './components/Navbar'; // ← import the Navbar
import './App.css';
import 'leaflet/dist/leaflet.css';

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/map" element={<LeafletMap />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/leader-board" element={<Leaderboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/editProfile" element={<EditUserProfile />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/withdrawl-money" element={<Wallet />} />
        <Route path="/contact" element={<ContactUsPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
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
