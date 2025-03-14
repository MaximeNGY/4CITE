import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminDashboard from "../components/AdminDashboard";
import { fetchHotels, createHotel, deleteHotel } from "../api/hotelApi";
import { fetchAllBookings } from "../api/bookingApi";

jest.mock("../api/hotelApi", () => ({
  fetchHotels: jest.fn(),
  createHotel: jest.fn(),
  deleteHotel: jest.fn(),
}));

jest.mock("../api/bookingApi", () => ({
  fetchAllBookings: jest.fn(),
}));

describe("AdminDashboard Component", () => {
  const mockHotels = [
    { id: 1, name: "Hotel One", location: "Paris", description: "A beautiful hotel" },
    { id: 2, name: "Hotel Two", location: "New York", description: "Luxury at its best" },
  ];

  const mockBookings = [
    { id: 101, userEmail: "user1@example.com", hotelName: "Hotel One", date: "2025-03-10" },
    { id: 102, userEmail: "user2@example.com", hotelName: "Hotel Two", date: "2025-03-12" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("token", "mockToken");

    fetchHotels.mockResolvedValue(mockHotels);
    fetchAllBookings.mockResolvedValue(mockBookings);
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

  test("renders Admin Dashboard with hotels and bookings", async () => {
    renderComponent();

    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Add New Hotel")).toBeInTheDocument();
    expect(screen.getByText("All Hotels")).toBeInTheDocument();
    expect(screen.getByText("All Bookings")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Hotel One")).toBeInTheDocument();
      expect(screen.getByText("Hotel Two")).toBeInTheDocument();
      expect(screen.getByText("user1@example.com")).toBeInTheDocument();
      expect(screen.getByText("user2@example.com")).toBeInTheDocument();
    });
  });

  test("handles adding a new hotel", async () => {
    createHotel.mockResolvedValueOnce({});

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Hotel Name"), {
      target: { value: "Hotel Three" },
    });
    fireEvent.change(screen.getByPlaceholderText("Location"), {
      target: { value: "Tokyo" },
    });
    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: "A modern hotel" },
    });
    fireEvent.change(screen.getByPlaceholderText("Picture URL"), {
      target: { value: "http://example.com/image.jpg" },
    });

    fireEvent.click(screen.getByText("Add Hotel"));

    await waitFor(() => {
      expect(createHotel).toHaveBeenCalledWith(
        {
          name: "Hotel Three",
          location: "Tokyo",
          description: "A modern hotel",
          picture: "http://example.com/image.jpg",
        },
        "mockToken"
      );
      expect(fetchHotels).toHaveBeenCalledTimes(2);
    });
  });

  test("handles deleting a hotel", async () => {
    deleteHotel.mockResolvedValueOnce({});

    renderComponent();

    
    await waitFor(() => expect(screen.getByText("Hotel One")).toBeInTheDocument());

    
    fireEvent.click(screen.getAllByText("Delete Hotel")[0]);

    await waitFor(() => {
      expect(deleteHotel).toHaveBeenCalledWith(1, "mockToken");
      expect(fetchHotels).toHaveBeenCalledTimes(2);
    });
  });

  test("displays empty hotel and booking lists when no data is available", async () => {
    fetchHotels.mockResolvedValueOnce([]);
    fetchAllBookings.mockResolvedValueOnce([]);

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText("All Hotels")).toBeInTheDocument();
      expect(screen.getByText("All Bookings")).toBeInTheDocument();
      expect(screen.queryByText("Delete Hotel")).not.toBeInTheDocument();
    });
  });

  test("prevents adding a hotel with incomplete data", async () => {
    renderComponent();

    fireEvent.click(screen.getByText("Add Hotel"));

    await waitFor(() => {
      expect(createHotel).not.toHaveBeenCalled();
    });
  });

  test("loads data using the provided token", async () => {
    renderComponent();

    await waitFor(() => {
      expect(fetchHotels).toHaveBeenCalled();
      expect(fetchAllBookings).toHaveBeenCalledWith("mockToken");
    });
  });
});
