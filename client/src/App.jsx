import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/register/Login";
import Signup from "./pages/register/SignUp";


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={ <Login />} />
        <Route path="/signup" element={ <Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
