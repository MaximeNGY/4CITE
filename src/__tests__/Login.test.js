import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";
import Login from "../pages/Login";

jest.mock("axios");
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Login Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders the login form", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("updates input fields correctly", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("password123");
  });

  test("submits the form and navigates on successful login", async () => {
    axios.post.mockResolvedValueOnce({
      data: { token: "mockToken" },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "securepassword" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("http://localhost:5000/api/auth/login", {
        email: "user@example.com",
        password: "securepassword",
      });
      expect(localStorage.getItem("token")).toBe("mockToken");
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("shows an alert on invalid credentials", async () => {
    axios.post.mockRejectedValueOnce(new Error("Invalid credentials"));

    window.alert = jest.fn();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "wrong@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("http://localhost:5000/api/auth/login", {
        email: "wrong@example.com",
        password: "wrongpassword",
      });
      expect(window.alert).toHaveBeenCalledWith("Invalid credentials");
      expect(localStorage.getItem("token")).toBeNull();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  test("prevents form submission if inputs are empty", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole("button", { name: /login/i });

    fireEvent.click(loginButton);

    expect(axios.post).not.toHaveBeenCalled();
    expect(localStorage.getItem("token")).toBeNull();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
