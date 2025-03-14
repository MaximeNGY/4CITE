import { useState } from "react";
import axios from "axios";
import "./Register.css";  // Importing the CSS file

export default function Register() {
  const [email, setEmail] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");  // For displaying error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");  // Reset error message on each attempt

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        email,
        pseudo,
        password,
      });
      alert("Registration Successful!");
    } catch (err) {
      setError("Error registering user. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Create Your Account</h2>

        {/* Error message display */}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="Pseudo"
              className="input-field"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
