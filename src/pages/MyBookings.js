import { useEffect, useState } from "react";
import { fetchBookings } from "../api/bookingApi";
import "./MyBookings.css"; 

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("Please log in to see your bookings.");
      return;
    }

    const loadBookings = async () => {
      const data = await fetchBookings(token);
      setBookings(data);
    };

    loadBookings();
  }, [token]);

  return (
    <div className="bookings-container">
      <h2 className="page-title">My Bookings</h2>
      {bookings.length === 0 ? (
        <p className="no-bookings">No bookings found.</p>
      ) : (
        <ul className="bookings-list">
          {bookings.map((booking) => (
            <li key={booking.id} className="booking-card">
              <h3 className="hotel-name">{booking.hotel.name}</h3>
              <p className="booking-date">Check-in: {booking.check_in}</p>
              <p className="booking-date">Check-out: {booking.check_out}</p>
              <p className="booking-location">Location: {booking.hotel.location}</p>
              <p className="booking-Description">Description: {booking.hotel.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyBookings;
