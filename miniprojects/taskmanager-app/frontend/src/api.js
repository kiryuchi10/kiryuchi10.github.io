const API = process.env.REACT_APP_API_URL;  // must match .env

export async function fetchTasks() {
  const res = await fetch(`${API}/tasks/`);
  return res.json();
}

export async function addTask(t) {
  const res = await fetch(`${API}/tasks/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(t)
  });
  return res.json();
}

export async function toggleTask(id, completed) {
  const res = await fetch(`${API}/tasks/${id}?completed=${completed}`, {
    method: "PUT"
  });
  return res.json();
}
