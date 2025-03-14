import { useEffect, useState } from "react";
import { fetchBookings } from "../api/bookingApi";

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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li key={booking.id} className="border p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Hotel: {booking.hotelName}</h3>
              <p className="text-gray-600">Date: {booking.check_in}</p>
              <p className="text-gray-600">Status: {booking.check_out}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyBookings;
