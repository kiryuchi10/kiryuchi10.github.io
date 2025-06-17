// frontend/src/components/Projects.jsx
export const projects = [
  {
    name: "Smart Sensor Dashboard",
    description: "Real-time monitoring app using React + FastAPI.",
    tags: [
      { name: "React", color: "text-blue-500" },
      { name: "FastAPI", color: "text-green-500" },
      { name: "MySQL", color: "text-yellow-500" },
    ],
    image: "/images/sensor_dashboard.png",
    sourceCodeLink: "https://github.com/kiryuchi10/smart-sensor-dashboard",
  },
  {
    name: "Pixel Art Generator",
    description: "Upload an image and convert it to 8-bit pixel art.",
    tags: [
      { name: "React", color: "text-pink-500" },
      { name: "FastAPI", color: "text-green-500" },
      { name: "Pillow", color: "text-yellow-500" },
    ],
    image: "/images/pixel_art.png",
    sourceCodeLink: "https://github.com/kiryuchi10/pixel-art",
  },
];
