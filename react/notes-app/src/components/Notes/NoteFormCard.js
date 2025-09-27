import React, { useState, useEffect } from "react";
import "./NoteFormCard.css";

const API_URL = process.env.REACT_APP_API_URL;

export default function NoteFormCard({ note, onClose, onSave }) {
  const [form, setForm] = useState({ title: "", content: "" });

  useEffect(() => {
    if (note) setForm({ title: note.title, content: note.content });
    else setForm({ title: "", content: "" });
  }, [note]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("access_token");
      const url = note
        ? `${API_URL}/api/notes/${note.id}/`
        : `${API_URL}/api/notes/`;
      const method = note ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) onSave();
      else console.log(await res.json());
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async () => {
    if (!note) return;
    try {
      const token = localStorage.getItem("access_token");
      await fetch(`${API_URL}/api/notes/${note.id}/`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      onSave();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="note-form-card-backdrop">
      <div className="note-form-card">
        <h3>{note ? "Edit Note" : "Add Note"}</h3>
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="content"
            placeholder="Content"
            value={form.content}
            onChange={handleChange}
            required
          />
          <div className="form-buttons">
            <button type="submit">{note ? "Update" : "Save"}</button>
            <button type="button" onClick={onClose}>Cancel</button>
            {note && <button type="button" onClick={handleDelete} className="delete-btn">Delete</button>}
          </div>
        </form>
      </div>
    </div>
  );
}
