import axios from "axios";

const API_URL = "http://localhost:5000/api/bookings";

export const createBooking = async (hotelId, hotelCheckin, hotelCheckout, token) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        "hotel": hotelId,
        "check_in": hotelCheckin,
        "check_out": hotelCheckout,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error booking hotel", error);
    return null;
  }
};

export const fetchBookings = async (token) => {
  try {
    const response = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings", error);
    return [];
  }
};

export const fetchAllBookings = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/api/bookings/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching bookings", error);
      return [];
    }
  };
  