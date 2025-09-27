import React from "react";
import "./Navbar.css";

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">NotesApp</div>
      
      {/* Show username and logout only when user is logged in */}
      {user && (
        <div className="navbar-user">
          <span className="navbar-username">{user.user_name}</span>
          <button className="nav-btn logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
