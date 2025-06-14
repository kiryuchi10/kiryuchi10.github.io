import React, { useState } from "react";
import { addTask } from "../api";

export default function TaskForm({ onAdded }) {
  const [title, setTitle] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    if (!title) return;
    await addTask({ title });
    setTitle("");
    onAdded();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="New task title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button type="submit">Add Task</button>
    </form>
  );
}
