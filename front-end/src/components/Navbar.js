// src/components/Navbar.js
import { Link } from "react-router-dom";
import { FaHotel } from "react-icons/fa";
import "./Navbar.css"; // Import the CSS file

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Logo Section */}
      <div className="logo">
        <FaHotel className="hotel-icon" />
        <h1>Akkor Hotel</h1>
      </div>

      {/* Navigation Links */}
      <div className="nav-links">
        <Link to="/" className="nav-item">Home</Link>
        <Link to="/hotels" className="nav-item">Hotels</Link>
        <Link to="/my-bookings" className="nav-item">My Bookings</Link>

        {/* Login & Register Buttons */}
        <Link to="/login" className="btn btn-login">Login</Link>
        <Link to="/register" className="btn btn-register">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
