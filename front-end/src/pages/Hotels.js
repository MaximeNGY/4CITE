import { useEffect, useState } from "react";
import { fetchHotels } from "../api/hotelApi";
import { createBooking } from "../api/bookingApi";

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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Hotels</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="border p-4 rounded-lg shadow">
            {hotel.picture_list?.length > 0 && (
              <img
                src={hotel.picture_list[0]}
                alt={hotel.name}
                className="w-full h-40 object-cover rounded"
              />
            )}
            <h3 className="text-lg font-semibold mt-2">{hotel.name}</h3>
            <p className="text-gray-600">{hotel.location}</p>
            <p className="text-sm mt-1">{hotel.description}</p>

            {/* Champs de saisie pour les dates */}
            <div className="mt-4">
              <label className="block text-sm font-medium">Check-in:</label>
              <input
                type="date"
                value={bookingData[hotel.id]?.check_in || ""}
                onChange={(e) => handleDateChange(hotel.id, "check_in", e.target.value)}
                className="border p-2 rounded w-full mt-1"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium">Check-out:</label>
              <input
                type="date"
                value={bookingData[hotel.id]?.check_out || ""}
                onChange={(e) => handleDateChange(hotel.id, "check_out", e.target.value)}
                className="border p-2 rounded w-full mt-1"
              />
            </div>

            <button
              className="bg-blue-500 text-white p-2 rounded mt-3"
              onClick={() => handleBooking(hotel.id)}
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
