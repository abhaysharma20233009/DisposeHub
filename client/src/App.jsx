import 'leaflet/dist/leaflet.css';
import './App.css'

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/register/Login";
import Signup from "./pages/register/SignUp";
import Leaderboard from './components/leaderboard';
import Integrate from './pages/GeneralUser/Integrate';
import DriverIntegrate from './pages/GeneralUser/driverIntegrate';
//import RouteMap from './components/rasta';



function App() {
  const name = "Anshul";
  const role = "driver"; 

  return (

    <Router>
      <Routes>
      <Route path="/map" element={<Integrate role={role} name={name} />} />
        <Route path="/login" element={ <Login />} />
        <Route path="/signup" element={ <Signup />} />
        <Route path="/leader-board" element={ <Leaderboard />} />
        <Route path="/driver" element={ <DriverIntegrate role={role} name={name} />} />
      
      </Routes>
    </Router>

  );
}

export default App;
