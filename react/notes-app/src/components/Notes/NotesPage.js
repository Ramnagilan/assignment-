import React, { useState, useEffect } from "react";
import NoteFormCard from "./NoteFormCard";
import "./NotesPage.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function NotesPage({ user }) {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch notes from backend
  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_URL}/api/notes/`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setNotes(data);
      else console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Handlers for add/edit notes
  const handleAddClick = () => {
    setSelectedNote(null);
    setShowForm(true);
  };

  const handleEditClick = (note) => {
    setSelectedNote(note);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedNote(null);
  };

  const handleFormSave = () => {
    fetchNotes();
    setShowForm(false);
    setSelectedNote(null);
  };

  // Helper to format date
  const formatDate = (note) => {
    const dateStr = note.updated_at || note.created_at;
    const date = new Date(dateStr);
    return date.toLocaleString(); // e.g., "9/27/2025, 12:57:51 PM"
  };

  return (
    <div className="notes-page">
      {/* Greeting */}
      <h1 className="notes-greeting">Good Morning, {user.user_name}</h1>

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <p className="empty-state">No notes available</p>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <div
              key={note.id}
              className="note-card"
              onClick={() => handleEditClick(note)}
            >
              <div className="note-title">{note.title}</div>
              <hr className="separator" />
              <div className="note-content">{note.content}</div>
              <div className="note-date">
                Last modified: {formatDate(note)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Add Button */}
      <button className="add-btn" onClick={handleAddClick}>
        +
      </button>

      {/* Note Form Card for Add/Edit */}
      {showForm && (
        <NoteFormCard
          note={selectedNote}
          onClose={handleFormClose}
          onSave={handleFormSave}
        />
      )}
    </div>
  );
}
