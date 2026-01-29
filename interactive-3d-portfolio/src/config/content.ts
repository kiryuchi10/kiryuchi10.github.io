/**
 * Portfolio content: Dong Hyeun Lee
 * Resume: Metrology Process Engineer (Samsung Austin Semiconductor)
 * PDFs: place in public/resume/ for download links
 */

export const basics = {
  fullName: 'Donghyeun Lee',
  location: 'Austin, TX',
  phone: '512-731-2449',
  email: 'donghyeunlee1@gmail.com',
  linkedin: 'https://www.linkedin.com/in/dong-hyeun-lee-47a3b813a',
  github: 'https://github.com/kiryuchi10',
  blog: 'https://velog.io/@husuhaga10/posts',
};

export const hero = {
  intro:
    'Full-Stack & Automation Engineer | AI for Vision-Based Physical Systems | Python, Java, React, FastAPI | U.S. Permanent Resident',
  headline: "I'm",
  nameHighlight: 'DongHyeun Lee',
  ctaResume: {
    label: 'Download Resume',
    href: '/resume/DONGHYEUN_LEE_Metrology_Equipment_Engineer_Samsung_Resume.pdf',
  },
  ctaProjects: { label: 'View Projects', scrollToId: 'projects' },
};

export const about = {
  title: 'About',
  summary:
    'Metrology Process Engineer with an M.S. in Chemistry and hands-on experience in imaging-based metrology, statistical data analysis, calibration, and yield improvement for semiconductor-adjacent and advanced materials systems.',
};

export const resume = {
  summary:
    'Metrology Process Engineer with an M.S. in Chemistry and hands-on experience in imaging-based metrology, statistical data analysis, calibration, and yield improvement for semiconductor-adjacent and advanced materials systems. Strong background in optical imaging, SEM/AFM, spectrometry, dimensional mapping, and RCA, with proven ability to translate measurement data into actionable process feedback in cleanroom/manufacturing environments.',
  summaryNote:
    '(Interview Finalist: Samsung, ASML, Otsuka | Offer: SK Battery America)',

  coreSkills: [
    'Process & Metrology Monitoring',
    'Statistical Methods & Data Analysis',
    'Technical Presentations',
    'SEM (imaging optimization, defect analysis)',
    'Defect classification, RCA, process feedback loops',
    'AFM, Ellipsometry, UV-Vis, Optical Microscopy',
  ],

  experience: [
    {
      role: 'Senior Researcher',
      company: 'Proteina Inc.',
      location: 'Seoul, Korea',
      dates: '2021 – 2023',
      bullets: [
        'Developed wet clean and surface activation flows (piranha, plasma) for reproducible pre-functionalization control.',
        'Executed imaging-based metrology (TIRF, optical) with Cr-grid standards for dimensional calibration and FOV uniformity.',
        'Built statistical analysis pipelines (Python/MATLAB) for signal stability, drift detection, and repeatability metrics.',
        'Integrated AFM, optical microscopy, UV-Vis, ellipsometry for fast cross-tool validation and RCA.',
        'Applied SPC, control charts, and R&R to nano-scale surface processes; correlated treatment conditions with thickness and optical response.',
      ],
    },
    {
      role: 'Research Engineer',
      company: 'Palogen LLC',
      location: 'Seoul, Korea',
      dates: '2020 – 2021',
      bullets: [
        'Supported sensor manufacturing QA via defect analysis, signal instability diagnostics, and yield loss investigation.',
        'Performed reliability-focused analysis in time-critical, quality-driven manufacturing environments.',
      ],
    },
    {
      role: 'Graduate Researcher (M.S., Chemistry)',
      company: 'Sogang University',
      location: 'Seoul, Korea',
      dates: '2018 – 2020',
      bullets: [
        'Generated micro/nano-scale datasets from surface-engineered polymer systems.',
        'Performed optical signal extraction and image-based feature analysis (ImageJ, MATLAB, Python).',
        'Fabricated micro/nano structures via photolithography, resist processing, plasma treatment, and wet chemistry.',
      ],
    },
    {
      role: 'Offer Accepted – Manufacturing Innovation Engineer',
      company: 'SK Battery America (SKBA)',
      location: 'Commerce, GA',
      dates: 'Start: TBA',
      bullets: [
        'Selected for SPC/FDC-driven manufacturing innovation program targeting AI-based defect detection and yield optimization.',
      ],
    },
  ],

  education: [
    {
      school: 'Sogang University',
      degree: 'M.S., Chemistry',
      dates: '2018 – 2020',
      extra: 'GPA: 4.3 / 4.5',
    },
    {
      school: 'Hong Kong University of Science & Technology (HKUST)',
      degree: 'B.S., Chemical & Bioproduct Engineering',
      dates: '2010 – 2013',
    },
  ],

  certifications: [
    'AI & Machine Learning (PGP) — University of Texas at Austin, 2025',
    'Full-Stack Java Development — HiMedia Academy, 2024',
    'Semiconductor Training Certificate — Seoul National University ISRC, 2010',
  ],

  pdfUrl:
    '/resume/DONGHYEUN_LEE_Metrology_Equipment_Engineer_Samsung_Resume.pdf',
};

export const coverLetter = {
  targetRole: 'Metrology Process Engineer — Samsung Austin Semiconductor',
  pdfUrl: '/resume/DongHyeun_Lee_Samsung_Metrology_Cover_Letter.pdf',
  paragraphs: [
    'I am writing to apply for the Metrology Process Engineer position at Samsung Austin Semiconductor...',
    'In my most recent role as a Senior Research Engineer at Proteina Inc...',
    'I established offline and inline characterization workflows...',
    'A key part of my role involved statistical interpretation...',
    'Earlier in my career at Palogen LLC...',
    'I am particularly drawn to this role...',
    'Thank you for your time and consideration...',
  ],
  signOff: 'Sincerely,\nDong Hyeun Lee',
};

export const skills = [
  { name: 'Process & Metrology', level: 90 },
  { name: 'Python / MATLAB', level: 88 },
  { name: 'Statistical Data Analysis', level: 85 },
  { name: 'React / Java', level: 80 },
  { name: 'SEM / AFM / Optical', level: 85 },
  { name: 'FastAPI / Automation', level: 75 },
];

/** Project card images */
const PROJECT_IMAGE_BASE = '/assets/DongHyeunLee/Project/Image';

export const projects = [
  {
    title: 'AI/ML BMS System',
    description:
      'Real-time monitoring dashboard for battery modules and sensor data (voltage, SoC, temperature, alarms). One-page scroll + backend.',
    badges: ['PostgreSQL', 'FastAPI', 'Vite', 'TypeScript', 'Three.js', 'AI/ML'],
    image: '/assets/DongHyeunLee/Project/Video/녹음-2026-01-30-044543-aimlbms.gif',
    link: 'https://github.com/kiryuchi10/aiml-bms-system/tree/one-page-scroll-website/backend',
  },
  {
    title: 'SCM System — AI Tools',
    description:
      'AI-powered supply chain tools: demand forecasting, AI assistant, and insights.',
    badges: ['React', 'Flask', 'AI/ML'],
    image: `${PROJECT_IMAGE_BASE}/scm_app.png`,
    link: 'https://github.com/kiryuchi10/SCM-apps',
  },
  {
    title: 'Pixel Art Generator',
    description:
      'Convert photo to pixel art with before/after comparison.',
    badges: ['React', 'FastAPI', 'Pillow'],
    image: `${PROJECT_IMAGE_BASE}/pixel_art.jpeg`,
    link: 'https://github.com/kiryuchi10/pixel-art-generator',
  },
  {
    title: 'Family Expenditure Tracker',
    description:
      'Personal finance app with bank JSON ingestion and spending analytics.',
    badges: ['React', 'Finance', 'Data'],
    image: `${PROJECT_IMAGE_BASE}/family_app.jpg`,
    link: 'https://github.com/kiryuchi10/family-expenditure-app',
  },
];

export const blogPosts = [
  {
    id: 1,
    title:
      'From Bank JSON to Beautiful Insights: Building an Expenditure Tracker as a New Parent',
    excerpt:
      'Building a personal finance tracker with React and Python using bank JSON ingestion and spending analytics.',
    date: '2024-12-15',
    readTime: '8 min read',
    tags: ['React', 'Python', 'Finance', 'Data Analysis'],
    link: 'https://medium.com/@donghyeunlee1/from-bank-json-to-beautiful-insights-building-an-expenditure-tracker-as-a-new-parent-junior-2213cc96074e',
    featured: true,
  },
];

export const contact = {
  title: 'Contact',
  subtitle: 'Send a message.',
  fields: {
    name: 'Your name',
    email: 'Email',
    subject: 'Subject',
    message: 'Message',
  },
  submitLabel: 'Send',
  sendingLabel: 'Sending...',
  formTitle: 'Get in touch',
  infoTitle: 'Contact info',
  address: 'Austin, Tx & Commerce, GA',
  phone: '+512 731 2449',
  website: 'kiryuchi10.github.io',
  resetLabel: 'Reset',
  fallbackLabel: 'Send via Email Client',
  orEmail: 'Or email:',
};
