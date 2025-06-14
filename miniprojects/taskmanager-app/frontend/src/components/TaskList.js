import React, { useEffect, useState } from "react";
import { fetchTasks, toggleTask } from "../api";

export default function TaskList({ refresh }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks().then(setTasks);
  }, [refresh]);

  return (
    <ul>
      {tasks.map(t => (
        <li key={t.id}>
          <input
            type="checkbox"
            checked={t.completed}
            onChange={() => toggleTask(t.id, !t.completed)}
          />
          {t.title}
        </li>
      ))}
    </ul>
  );
}
