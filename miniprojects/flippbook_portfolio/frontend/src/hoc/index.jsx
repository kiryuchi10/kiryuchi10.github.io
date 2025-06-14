export const navLinks = [
  { id: "about", title: "About" },
  { id: "works", title: "Projects" },
  { id: "contact", title: "Contact" },
];

export const services = [
  { title: "React Developer", icon: "🌀" },
  { title: "AI App Builder", icon: "🤖" },
  { title: "Flask / FastAPI", icon: "🔥" },
  { title: "SQL & Docker", icon: "🐳" },
];

export const projects = [
  {
    name: "Smart PDF Extractor",
    description: "Extracts tables, OCR, and metadata from scientific PDFs. React + Flask + OpenCV + MySQL.",
    tags: [
      { name: "React", color: "text-blue-500" },
      { name: "Flask", color: "text-green-500" },
      { name: "OCR", color: "text-red-500" },
    ],
    image: "/assets/pdfextractor.png",
    sourceCodeLink: "https://github.com/kiryuchi10/pdf-extractor",
  },
  {
    name: "Voice Emotion Diary",
    description: "Records voice, transcribes text, and detects emotion. Deployed as desktop and web app.",
    tags: [
      { name: "Tauri", color: "text-purple-500" },
      { name: "Whisper", color: "text-gray-500" },
    ],
    image: "/assets/emodiary.png",
    sourceCodeLink: "https://github.com/kiryuchi10/emotion-diary",
  },
];
