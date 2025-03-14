import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Hotels from './pages/Hotels';
import AdminDashboard from './pages/AdminDashboard';
import MyBookings from './pages/MyBookings';
import Navbar from "./components/Navbar";
import { useSelector } from "react-redux";
import "./App.css"; 

function App() {

  const role = useSelector((state) => state.user.role);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        {role === "admin" && <Route path="/admin" element={<AdminDashboard />} />}
      </Routes>
    </Router>
  );
}

export default App;
