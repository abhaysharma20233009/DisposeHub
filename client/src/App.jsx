
import { useState } from 'react'
import 'leaflet/dist/leaflet.css';
import './App.css'
import LeafletMap from './components/LeafletMap';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/register/Login";
import Signup from "./pages/register/SignUp";
import Leaderboard from './components/leaderboard';



function App() {

  return (

    <Router>
      <Routes>
        <Route path="/map" element={<LeafletMap />} />
        <Route path="/login" element={ <Login />} />
        <Route path="/signup" element={ <Signup />} />
        <Route path="/leader-board" element={ <Leaderboard />} />
        <Route path="/withdrawl-money" element={<Wallet/>}/>
      </Routes>
    </Router>

  );
}

export default App;
