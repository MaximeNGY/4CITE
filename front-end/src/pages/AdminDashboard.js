import { useEffect, useState } from "react";
import { fetchHotels, createHotel, deleteHotel } from "../api/hotelApi";
import { fetchAllBookings } from "../api/bookingApi";

const AdminDashboard = () => {
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newHotel, setNewHotel] = useState({ name: "", location: "", description: "", picture: "" });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadData = async () => {
      setHotels(await fetchHotels());
      setBookings(await fetchAllBookings(token));
    };
    loadData();
  }, [token]);

  const handleCreateHotel = async () => {
    await createHotel(newHotel, token);
    setHotels(await fetchHotels());
    setNewHotel({ name: "", location: "", description: "", picture: "" });
  };

  const handleDeleteHotel = async (id) => {
    await deleteHotel(id, token);
    setHotels(await fetchHotels());
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      <div className="border p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold mb-2">Add New Hotel</h3>
        <input
          type="text"
          placeholder="Hotel Name"
          value={newHotel.name}
          onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Location"
          value={newHotel.location}
          onChange={(e) => setNewHotel({ ...newHotel, location: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={newHotel.description}
          onChange={(e) => setNewHotel({ ...newHotel, description: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <input
          type="text"
          placeholder="Picture URL"
          value={newHotel.picture}
          onChange={(e) => setNewHotel({ ...newHotel, picture: e.target.value })}
          className="border p-2 w-full mb-2"
        />
        <button className="bg-blue-500 text-white p-2 rounded" onClick={handleCreateHotel}>
          Add Hotel
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-4">All Hotels</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="border p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">{hotel.name}</h3>
            <p className="text-gray-600">{hotel.location}</p>
            <p className="text-sm">{hotel.description}</p>
            <button
              className="bg-red-500 text-white p-2 rounded mt-3"
              onClick={() => handleDeleteHotel(hotel.id)}
            >
              Delete Hotel
            </button>
          </div>
        ))}
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-4">All Bookings</h3>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id} className="border p-4 rounded-lg shadow mb-2">
            <p>User: {booking.userEmail}</p>
            <p>Hotel: {booking.hotelName}</p>
            <p>Date: {booking.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
