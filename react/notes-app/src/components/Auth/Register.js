import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ user_name: "", user_email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${API_URL}/api/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(JSON.stringify(data));
        return;
      }

      setMessage("User registered successfully!");
      setForm({ user_name: "", user_email: "", password: "" });
    } catch (err) {
      setMessage("Network error or server not responding");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="user_name" placeholder="Username" value={form.user_name} onChange={handleChange} required />
        <input type="email" name="user_email" placeholder="Email" value={form.user_email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <div className="auth-buttons">
          <button type="submit">Register</button>
          <button type="button" onClick={() => navigate("/login")}>Login</button>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
