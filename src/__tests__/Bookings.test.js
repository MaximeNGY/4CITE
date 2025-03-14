import { render, screen, waitFor } from "@testing-library/react";
import MyBookings from "../pages/MyBookings";
import { fetchBookings } from "../api/bookingApi";

jest.mock("../api/bookingApi");

describe("MyBookings Component", () => {
  const mockBookings = [
    {
      id: 1,
      hotelName: "Hotel Paradise",
      check_in: "2025-04-01",
      check_out: "2025-04-05",
    },
    {
      id: 2,
      hotelName: "Ocean View",
      check_in: "2025-05-10",
      check_out: "2025-05-15",
    },
  ];

  beforeEach(() => {
    localStorage.setItem("token", "mockToken");
  });

  afterEach(() => {
    localStorage.clear(); 
    jest.resetAllMocks(); 
  });

  test("alerts the user if not logged in", () => {
    localStorage.removeItem("token");
    window.alert = jest.fn();

    render(<MyBookings />);

    expect(window.alert).toHaveBeenCalledWith("Please log in to see your bookings.");
    expect(screen.queryByText("My Bookings")).not.toBeInTheDocument();
  });

  test("renders 'No bookings found' if there are no bookings", async () => {
    fetchBookings.mockResolvedValue([]);

    render(<MyBookings />);

    expect(screen.getByText("My Bookings")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("No bookings found.")).toBeInTheDocument();
    });

    expect(fetchBookings).toHaveBeenCalledWith("mockToken");
  });

  test("displays a list of bookings if available", async () => {
    fetchBookings.mockResolvedValue(mockBookings);

    render(<MyBookings />);

    expect(screen.getByText("My Bookings")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Hotel: Hotel Paradise")).toBeInTheDocument();
      expect(screen.getByText("Hotel: Ocean View")).toBeInTheDocument();
    });

    expect(screen.getByText("Date: 2025-04-01")).toBeInTheDocument();
    expect(screen.getByText("Status: 2025-04-05")).toBeInTheDocument();
    expect(screen.getByText("Date: 2025-05-10")).toBeInTheDocument();
    expect(screen.getByText("Status: 2025-05-15")).toBeInTheDocument();

    expect(fetchBookings).toHaveBeenCalledWith("mockToken");
  });

  test("handles errors when fetching bookings", async () => {
    fetchBookings.mockRejectedValue(new Error("Failed to fetch bookings"));
    window.alert = jest.fn();

    render(<MyBookings />);

    await waitFor(() => {
      expect(fetchBookings).toHaveBeenCalledWith("mockToken");
    });

    expect(screen.getByText("No bookings found.")).toBeInTheDocument();
  });
});
