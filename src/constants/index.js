import {
  backend,
  creator,
  html,
  css,
  javascript,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  express,
  threejs,
  git,
  figma,
  java,
  sensor_dashboard,
  scm_app,
  family_app,
  pixel_art,
} from "../assets";

export const navLinks = [
  { id: "about", title: "About" },
  { id: "work", title: "Work" },
  { id: "contact", title: "Contact" },
];

export const services = [
  { title: "Full Stack Developer", icon: backend },
  { title: "Data & ML", icon: creator },
  { title: "Backend & APIs", icon: backend },
  { title: "Frontend & UI", icon: creator },
];

export const technologies = [
  { name: "HTML 5", icon: html },
  { name: "CSS 3", icon: css },
  { name: "JavaScript", icon: javascript },
  { name: "React JS", icon: reactjs },
  { name: "Redux", icon: redux },
  { name: "Tailwind CSS", icon: tailwind },
  { name: "Node JS", icon: nodejs },
  { name: "MongoDB", icon: mongodb },
  { name: "Express JS", icon: express },
  { name: "Three JS", icon: threejs },
  { name: "Git", icon: git },
  { name: "Figma", icon: figma },
  { name: "Java", icon: java },
];

export const projects = [
  {
    name: "Smart Sensor Dashboard",
    description: "Real-time monitoring app using React + FastAPI.",
    tags: [
      { name: "react", color: "blue-text-gradient" },
      { name: "FastAPI", color: "green-text-gradient" },
      { name: "MySQL", color: "pink-text-gradient" },
    ],
    image: sensor_dashboard,
    source_code_link: "https://github.com/kiryuchi10/smart-sensor-dashboard",
  },
  {
    name: "SCM Apps",
    description: "Supply Chain Management with inventory, order management, and AI-powered demand forecasting.",
    tags: [
      { name: "react", color: "blue-text-gradient" },
      { name: "Flask", color: "green-text-gradient" },
      { name: "AI/ML", color: "pink-text-gradient" },
    ],
    image: scm_app,
    source_code_link: "https://github.com/kiryuchi10/SCM-apps",
  },
  {
    name: "Family Expenditure Tracker",
    description: "Personal finance app with bank JSON import, categories, and spending insights.",
    tags: [
      { name: "react", color: "blue-text-gradient" },
      { name: "Python", color: "green-text-gradient" },
      { name: "Data", color: "pink-text-gradient" },
    ],
    image: family_app,
    source_code_link: "https://github.com/kiryuchi10/family-expenditure-app",
  },
  {
    name: "Pixel Art Generator",
    description: "Upload an image and convert it to 8-bit pixel art.",
    tags: [
      { name: "react", color: "blue-text-gradient" },
      { name: "FastAPI", color: "green-text-gradient" },
      { name: "Pillow", color: "pink-text-gradient" },
    ],
    image: pixel_art,
    source_code_link: "https://github.com/kiryuchi10/pixel-art-generator",
  },
];
