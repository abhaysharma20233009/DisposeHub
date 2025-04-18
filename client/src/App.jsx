import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import './App.css'
import LeafletMap from './components/LeafletMap';

function App() {

  return (
    <>
      <Routes>
        <Route path="/map" element={<LeafletMap />} />
      </Routes>
    </>
  )
}

export default App
