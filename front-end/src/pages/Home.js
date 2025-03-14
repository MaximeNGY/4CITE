import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Welcome to Akkor Hotel</h1>
        <p>Experience an unforgettable stay at our luxury hotels.</p>
        <div className="hero-buttons">
          <Link to="/hotels" className="btn btn-primary">Explore Hotels</Link>
          <Link to="/login" className="btn btn-secondary">Login</Link>
        </div>
      </header>

      <section className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Luxury Hotels</h3>
            <p>Enjoy comfort and 5-star service at our hotels.</p>
          </div>

          <div className="feature-card">
            <h3>Easy Booking</h3>
            <p>Book your room in just a few clicks with our intuitive platform.</p>
          </div>

          <div className="feature-card">
            <h3>Exclusive Offers</h3>
            <p>Get special discounts and limited-time offers.</p>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <h2>What Our Customers Say</h2>
        <div className="testimonial">
          <p>"An amazing stay! The staff is welcoming and the rooms are beautiful."</p>
          <span>– Marie Dupont</span>
        </div>

        <div className="testimonial">
          <p>"Impeccable service and perfect location. I highly recommend it!"</p>
          <span>– Jacques Martin</span>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Akkor Hotel. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
