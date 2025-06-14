import { useState } from 'react';

function App() {
  const [story, setStory] = useState("");
  const [file, setFile] = useState(null);

  async function uploadStory() {
    const formData = new FormData();
    formData.append("story", story);
    await fetch('/upload-story/', { method: "POST", body: formData });
    alert("Story uploaded!");
  }

  async function uploadCharacter() {
    const formData = new FormData();
    formData.append("file", file);
    await fetch('/upload-character/', { method: "POST", body: formData });
    alert("Character uploaded!");
  }

  return (
    <div>
      <h1>Upload Story</h1>
      <textarea value={story} onChange={e => setStory(e.target.value)} />
      <button onClick={uploadStory}>Upload Story</button>

      <h1>Upload Character</h1>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={uploadCharacter}>Upload Character</button>
    </div>
  );
}

export default App;
