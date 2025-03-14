import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../pages/Register";
import axios from "axios";

jest.mock("axios");

describe("Register Component", () => {
  afterEach(() => {
    jest.resetAllMocks(); 
  });

  test("renders the registration form", () => {
    render(<Register />);

    expect(screen.getByRole('heading', { name: /Register/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Pseudo")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument(); 
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });

  test("updates input values on change", () => {
    render(<Register />);

    const emailInput = screen.getByPlaceholderText("Email");
    const pseudoInput = screen.getByPlaceholderText("Pseudo");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(pseudoInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(pseudoInput.value).toBe("testuser");
    expect(passwordInput.value).toBe("password123");
  });

  test("submits the form successfully", async () => {
    axios.post.mockResolvedValueOnce({ data: { message: "User registered successfully" } });

    render(<Register />);

    const emailInput = screen.getByPlaceholderText("Email");
    const pseudoInput = screen.getByPlaceholderText("Pseudo");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: /register/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(pseudoInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    window.alert = jest.fn();

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("http://localhost:5000/api/auth/register", {
        email: "test@example.com",
        pseudo: "testuser",
        password: "password123",
      });
    });

    expect(window.alert).toHaveBeenCalledWith("Registration Successful!");
  });

  test("shows an error alert if registration fails", async () => {
    axios.post.mockRejectedValueOnce(new Error("Registration failed"));

    render(<Register />);

    const emailInput = screen.getByPlaceholderText("Email");
    const pseudoInput = screen.getByPlaceholderText("Pseudo");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByRole("button", { name: /register/i });

    fireEvent.change(emailInput, { target: { value: "fail@example.com" } });
    fireEvent.change(pseudoInput, { target: { value: "failuser" } });
    fireEvent.change(passwordInput, { target: { value: "failpassword" } });

    window.alert = jest.fn();

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("http://localhost:5000/api/auth/register", {
        email: "fail@example.com",
        pseudo: "failuser",
        password: "failpassword",
      });
    });

    expect(window.alert).toHaveBeenCalledWith("Error registering user");
  });

  test("prevents form submission if fields are empty", async () => {
    axios.post.mockResolvedValueOnce({ data: {} });

    render(<Register />);

    const submitButton = screen.getByRole("button", { name: /register/i });

    window.alert = jest.fn();

    fireEvent.click(submitButton);

    expect(axios.post).not.toHaveBeenCalled(); 
  });
});
