import React, { useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

function App() {
  const [refresh, setRefresh] = useState(false);
  return (
    <div style={{ padding: 20 }}>
      <h1>Task Manager</h1>
      <TaskForm onAdded={() => setRefresh(!refresh)} />
      <TaskList refresh={refresh} />
    </div>
  );
}

export default App;
