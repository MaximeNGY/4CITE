import { useEffect, useState } from "react";
import { fetchHotels } from "../api/hotelApi";
import { createBooking } from "../api/bookingApi";
import "./Hotels.css";

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [token, setToken] = useState(null);
  const [bookingData, setBookingData] = useState({});

  useEffect(() => {
    setToken(localStorage.getItem("token"));

    const loadHotels = async () => {
      try {
        const data = await fetchHotels();
        setHotels(data);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    loadHotels();
  }, []);

  const handleDateChange = (hotelId, field, value) => {
    setBookingData((prev) => ({
      ...prev,
      [hotelId]: {
        ...prev[hotelId],
        [field]: value,
      },
    }));
  };

  const handleBooking = async (hotelId) => {
    if (!token) {
      alert("You must be logged in to book a hotel.");
      return;
    }

    const { check_in, check_out } = bookingData[hotelId] || {};

    if (!check_in || !check_out) {
      alert("Please select check-in and check-out dates.");
      return;
    }

    try {
      const booking = await createBooking(hotelId, check_in, check_out, token);
      if (booking) {
        alert("Hotel booked successfully!");
      } else {
        alert("Failed to book hotel.");
      }
    } catch (error) {
      console.error("Error booking hotel:", error);
      alert("An error occurred while booking the hotel.");
    }
  };

  return (
    <div className="hotels-container">
      <h2 className="page-title">Available Hotels</h2>
      <div className="hotels-grid">
        {hotels.map((hotel) => (
          <div key={hotel._id} className="hotel-card">
            {hotel.picture_list?.length > 0 && (
              <img
                src={hotel.picture_list[0]}
                alt={hotel.name}
                className="hotel-image"
              />
            )}
            <h3 className="hotel-name">{hotel.name}</h3>
            <p className="hotel-location">{hotel.location}</p>
            <p className="hotel-description">{hotel.description}</p>

            {/* Date input fields */}
            <div className="date-fields">
              <label className="date-label">Check-in:</label>
              <input
                type="date"
                value={bookingData[hotel.id]?.check_in || ""}
                onChange={(e) => handleDateChange(hotel._id, "check_in", e.target.value)}
                className="date-input"
              />
            </div>

            <div className="date-fields">
              <label className="date-label">Check-out:</label>
              <input
                type="date"
                value={bookingData[hotel._id]?.check_out || ""}
                onChange={(e) => handleDateChange(hotel._id, "check_out", e.target.value)}
                className="date-input"
              />
            </div>

            <button
              className="book-now-btn"
              onClick={() => handleBooking(hotel._id)}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hotels;
