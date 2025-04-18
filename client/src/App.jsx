
import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import './App.css'
import LeafletMap from './components/LeafletMap';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/register/Login";
import Signup from "./pages/register/SignUp";



function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/map" element={<LeafletMap />} />
        <Route path="/login" element={ <Login />} />
        <Route path="/signup" element={ <Signup />} />
      </Routes>
    </Router>
   </>
  );
}

export default App;
