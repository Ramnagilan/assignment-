import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import NotesPage from "./components/Notes/NotesPage"; // New combined NotesPage
import Navbar from "./components/Navbar";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />

      <Routes>
        {/* Redirect root to register page */}
        <Route path="/" element={<Navigate to="/register" />} />

        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />

        {/* Protected Notes Route */}
        <Route
          path="/notes"
          element={
            user ? (
              <NotesPage user={user} /> // Pass user as prop for greeting
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
