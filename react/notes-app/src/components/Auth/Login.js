import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Login failed");
        return;
      }

      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);

      onLogin(data.user);
      navigate("/notes"); // redirect to notes after login
    } catch (err) {
      setMessage("Network error or server not responding");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {/* Buttons container */}
        <div className="auth-buttons">
          <button type="submit">Login</button>
          <button type="button" onClick={() => navigate("/register")}>Register</button>
        </div>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
