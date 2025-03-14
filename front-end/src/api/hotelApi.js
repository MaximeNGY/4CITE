import axios from "axios";

const API_URL = "http://localhost:5000/api/hotels"; // Change this if your backend is hosted elsewhere

export const fetchHotels = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching hotels", error);
    return [];
  }
};

export const createHotel = async (hotel, token) => {
    try {
      const response = await axios.post("http://localhost:5000/api/hotels", hotel, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating hotel", error);
    }
  };
  
  export const deleteHotel = async (id, token) => {
    try {
      await axios.delete(`http://localhost:5000/api/hotels/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Error deleting hotel", error);
    }
  };
  
