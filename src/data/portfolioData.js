import sensorDashboardImg from '../assets/sensor_dashboard.png';
import scmAppsImg from '../assets/scm_app.png';
import familyTrackerImg from '../assets/family_app.jpg';
import pixelArtImg from '../assets/pixel_art.jpeg';

export const personalInfo = {
  name: 'Donghyeun Lee',
  displayName: 'Donghyeun Lee',
  currentRole: 'Full Stack Developer',
  greeting: 'Hello!',
  projectsCompleted: '10+',
};

export const roles = ['Full Stack Developer', 'React Developer', 'AI Integration'];

export const tagline = {
  primary: 'Full Stack Developer with 4+ years of biotech R&D experience.',
  secondary: 'React, Flask, Spring Boot, and AI-powered web apps.',
};

export const skills = [
  { name: 'React', level: 90 },
  { name: 'JavaScript', level: 88 },
  { name: 'Python', level: 85 },
  { name: 'Flask / FastAPI', level: 80 },
  { name: 'SQL / Data', level: 75 },
  { name: 'AI / ML', level: 70 },
];

export const personalDetails = [
  { label: 'Profile', value: 'Full Stack & AI Integration' },
  { label: 'Domain', value: 'Biotech R&D, Manufacturing Analytics' },
  { label: 'Education', value: 'Biochemistry & Diagnostics background' },
  { label: 'Frameworks', value: 'React, Flask, Spring Boot, FastAPI' },
];

export const aboutMe = {
  name: 'Donghyeun Lee',
  jobRole: 'Full Stack Developer',
  experience: '4+ years',
  address: 'Austin, Texas',
  bio: `Full Stack Developer with 4+ years of biotech R&D experience, specializing in React, Flask, Spring Boot, and AI integration. Built web apps for manufacturing analytics and nanopore chip defect prediction using Python and ML.`,
};

export const projects = [
  {
    title: 'Smart Sensor Dashboard',
    description: 'Real-time monitoring app using React + FastAPI.',
    badges: ['React', 'FastAPI', 'MySQL'],
    image: sensorDashboardImg,
    link: 'https://github.com/kiryuchi10/smart-sensor-dashboard',
  },
  {
    title: 'SCM Apps',
    description: 'Supply Chain Management with inventory, order management, and AI-powered demand forecasting.',
    badges: ['React', 'Flask', 'SQLite', 'AI/ML'],
    image: scmAppsImg,
    link: 'https://github.com/kiryuchi10/SCM-apps',
  },
  {
    title: 'Family Expenditure Tracker',
    description: 'Personal finance app with bank JSON import, categories, and spending insights.',
    badges: ['React', 'Python', 'Data Analysis'],
    image: familyTrackerImg,
    link: 'https://github.com/kiryuchi10/family-expenditure-app',
  },
  {
    title: 'Pixel Art Generator',
    description: 'Upload an image and convert it to 8-bit pixel art.',
    badges: ['React', 'FastAPI', 'Pillow'],
    image: pixelArtImg,
    link: 'https://github.com/kiryuchi10/pixel-art-generator',
  },
];

export const socialLinks = {
  linkedin: 'https://www.linkedin.com/in/dong-hyeun-lee-47a3b813a',
  github: 'https://github.com/kiryuchi10',
  blog: 'https://velog.io/@husuhaga10/posts',
  email: 'donghyeunlee1@gmail.com',
  phone: '5127312449',
  address: 'Austin, Texas',
  cv: '/resume/DONG_HYEUN_LEE_Resume_250603.pdf',
};
