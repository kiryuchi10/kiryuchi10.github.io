import React, { useState } from 'react';
import { Container, Typography, CircularProgress } from '@mui/material';

function App() {
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cleaning, setCleaning] = useState("");
 
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/heatmap", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setImageData(data.image);
    } catch (err) {
      alert("Upload failed");
    }
    setLoading(false);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Gene Expression Heatmap Generator
      </Typography>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {loading && <CircularProgress />}
      {imageData && (
        <img
          src={`data:image/png;base64,${imageData}`}
          alt="heatmap"
          style={{ width: "100%", marginTop: 20 }}
        />
      )}
    </Container>
  );
}

export default App;
