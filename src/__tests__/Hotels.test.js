import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Hotels from "../pages/Hotels";
import { fetchHotels } from "../api/hotelApi";
import { createBooking } from "../api/bookingApi";

jest.mock("../api/hotelApi");
jest.mock("../api/bookingApi");

describe("Hotels Component", () => {
  beforeEach(() => {
    localStorage.setItem("token", "mockToken"); 
  });

  afterEach(() => {
    localStorage.clear();
    jest.resetAllMocks();
  });

  test("renders available hotels", async () => {
    const mockHotels = [
      { id: 1, name: "Hotel One", location: "City A", description: "A nice place", picture_list: ["image1.jpg"] },
      { id: 2, name: "Hotel Two", location: "City B", description: "Another nice place", picture_list: [] },
    ];

    fetchHotels.mockResolvedValue(mockHotels);

    render(<Hotels />);

    expect(screen.getByText("Available Hotels")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Hotel One")).toBeInTheDocument();
      expect(screen.getByText("Hotel Two")).toBeInTheDocument();
    });

    expect(screen.getByText("City A")).toBeInTheDocument();
    expect(screen.getByText("City B")).toBeInTheDocument();
  });

  test("allows selecting check-in and check-out dates", async () => {
    fetchHotels.mockResolvedValue([{ id: 1, name: "Hotel One", location: "City A", description: "A nice place", picture_list: [] }]);

    render(<Hotels />);

    await waitFor(() => {
      expect(screen.getByText("Hotel One")).toBeInTheDocument();
    });

    const checkInInput = screen.getByLabelText("Check-in:");
    const checkOutInput = screen.getByLabelText("Check-out:");

    fireEvent.change(checkInInput, { target: { value: "2025-04-01" } });
    fireEvent.change(checkOutInput, { target: { value: "2025-04-05" } });

    expect(checkInInput.value).toBe("2025-04-01");
    expect(checkOutInput.value).toBe("2025-04-05");
  });

  test("alerts if trying to book without dates", async () => {
    fetchHotels.mockResolvedValue([{ id: 1, name: "Hotel One", location: "City A", description: "A nice place", picture_list: [] }]);

    render(<Hotels />);

    await waitFor(() => {
      expect(screen.getByText("Hotel One")).toBeInTheDocument();
    });

    window.alert = jest.fn();

    const bookButton = screen.getByText("Book Now");
    fireEvent.click(bookButton);

    expect(window.alert).toHaveBeenCalledWith("Please select check-in and check-out dates.");
  });

  test("books a hotel successfully", async () => {
    fetchHotels.mockResolvedValue([{ id: 1, name: "Hotel One", location: "City A", description: "A nice place", picture_list: [] }]);
    createBooking.mockResolvedValue({ success: true });

    render(<Hotels />);

    await waitFor(() => {
      expect(screen.getByText("Hotel One")).toBeInTheDocument();
    });

    window.alert = jest.fn();

    const checkInInput = screen.getByLabelText("Check-in:");
    const checkOutInput = screen.getByLabelText("Check-out:");

    fireEvent.change(checkInInput, { target: { value: "2025-04-01" } });
    fireEvent.change(checkOutInput, { target: { value: "2025-04-05" } });

    const bookButton = screen.getByText("Book Now");
    fireEvent.click(bookButton);

    await waitFor(() => {
      expect(createBooking).toHaveBeenCalledWith(1, "2025-04-01", "2025-04-05", "mockToken");
      expect(window.alert).toHaveBeenCalledWith("Hotel booked successfully!");
    });
  });

  test("shows an error if booking fails", async () => {
    fetchHotels.mockResolvedValue([{ id: 1, name: "Hotel One", location: "City A", description: "A nice place", picture_list: [] }]);
    createBooking.mockRejectedValue(new Error("Booking failed"));

    render(<Hotels />);

    await waitFor(() => {
      expect(screen.getByText("Hotel One")).toBeInTheDocument();
    });

    window.alert = jest.fn();

    const checkInInput = screen.getByLabelText("Check-in:");
    const checkOutInput = screen.getByLabelText("Check-out:");

    fireEvent.change(checkInInput, { target: { value: "2025-04-01" } });
    fireEvent.change(checkOutInput, { target: { value: "2025-04-05" } });

    const bookButton = screen.getByText("Book Now");
    fireEvent.click(bookButton);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("An error occurred while booking the hotel.");
    });
  });
});
