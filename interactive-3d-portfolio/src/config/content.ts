/**
 * Portfolio content: Dong Hyeun Lee
 * Positioning: AiX Engineer (AI + Physical Systems)
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
    'AiX Engineer (AI + Physical Systems) | Automation & Reliability | Python, Java, React, FastAPI | U.S. Permanent Resident',
  headline: "I'm",
  nameHighlight: 'DongHyeun Lee',
  ctaResume: {
    label: 'Download Resume',
    href: '/resume/DONGHYEUN%20LEE_SAS_Metrology%20Process%20Engineer_Resume.pdf',
  },
  ctaCv: {
    label: 'Download CV',
    href: '/resume/DONGHYEUN%20LEE_SAS_Metrology%20Process%20Engineer_Coverletter.pdf',
  },
  ctaProjects: { label: 'View Projects', scrollToId: 'projects' },
};

export const about = {
  title: 'About',
  summary:
    'AiX Engineer specializing in the integration of wet-lab analytical instruments, manufacturing devices, and dry-lab data systems. Experienced in bridging physical measurements—imaging, spectroscopy, and precision dispensing—with in-silico analysis, automation pipelines, and decision-ready dashboards. Strong background in translating real-world process signals into reliable, scalable software workflows for manufacturing and R&D environments.',
};

export const resume = {
  summary:
    'AiX Engineer (AI + Physical Systems) with an M.S. in Chemistry and hands-on experience across wet labs, manufacturing devices, and dry-lab automation. Experienced in operating and interpreting data from analytical instruments (HPLC, UV-Vis, XPS, XRD, SEM/FIB-SEM) and integrating vision-based inspection, precision dispensing, and liquid handling systems into data-driven workflows. Strong capability in in-silico analysis, image processing, statistical monitoring, and automation pipelines that convert physical signals into actionable process intelligence for manufacturing and reliability-focused environments.',

  summaryNote:
    '(Interview Finalist: Samsung, ASML, Otsuka (continue ...) | Offer: SK Battery America)',

  coreSkills: [
    // AiX Core
    'AiX Engineering: AI + Physical Systems Integration',
    'End-to-End Automation: Measurement → Analysis → Feedback',
    'Manufacturing Reliability & Root Cause Analysis',

    // Wet Lab / Analytical
    'Analytical Instruments: HPLC, UV-Vis, XPS, XRD',
    'Microscopy: Optical, SEM, FIB-SEM, AFM',
    'Surface & Materials Characterization',
    'Calibration, Repeatability, Measurement Validation',

    // Manufacturing Devices
    'Vision-Based Inspection & Imaging Systems',
    'Precision Dispensing (Piezo Dispensers)',
    'Liquid Handling Systems (Gilson, PipetMax)',
    'Manufacturing Equipment Signal Interpretation',

    // Dry Lab / Software
    'In-Silico Analysis & Modeling',
    'Image Processing & Feature Extraction (Python, ImageJ, MATLAB)',
    'Statistical Analysis & SPC/FDC Concepts',
    'Automation APIs & Dashboards (FastAPI, React, SQL)',
  ],

  experience: [
    {
      role: 'Senior Researcher',
      company: 'Proteina Inc.',
      location: 'Seoul, Korea',
      dates: '2021 – 2023',
      bullets: [
        'Operated and analyzed wet-lab analytical instruments including UV-Vis, ellipsometry, AFM, and optical microscopy to characterize surface and signal behavior.',
        'Executed imaging-based metrology workflows using calibrated grid standards to ensure dimensional accuracy, field-of-view uniformity, and repeatability.',
        'Integrated vision-based inspection data with in-silico analysis pipelines (Python/MATLAB) for drift detection, signal stability tracking, and anomaly identification.',
        'Supported manufacturing-style workflows by correlating wet clean and plasma surface treatments with downstream measurement signals and yield impact.',
        'Built automation-ready datasets bridging wet-lab measurements, image-derived features, and statistical monitoring outputs.',
      ],
    },
    {
      role: 'Research Engineer',
      company: 'Palogen LLC',
      location: 'Seoul, Korea',
      dates: '2020 – 2021',
      bullets: [
        'Supported sensor and device manufacturing QA using defect evidence from optical and SEM-based inspections.',
        'Worked with precision dispensing and liquid handling workflows to diagnose variability sources affecting signal quality.',
        'Performed rapid, reliability-focused analyses under production timelines, translating raw device behavior into structured failure hypotheses.',
      ],
    },
    {
      role: 'Graduate Researcher (M.S., Chemistry)',
      company: 'Sogang University',
      location: 'Seoul, Korea',
      dates: '2018 – 2020',
      bullets: [
        'Generated micro/nano-scale datasets from polymer and surface-engineered systems using photolithography, plasma processing, and wet chemistry.',
        'Performed image-based signal extraction and feature quantification using ImageJ, MATLAB, and Python.',
        'Applied XPS and XRD to correlate material structure with optical, chemical, and functional responses.',
        'Developed in-silico analysis workflows to interpret experimental data and guide next-step fabrication and testing.',
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
    '/resume/DONGHYEUN%20LEE_SAS_Metrology%20Process%20Engineer_Resume.pdf',
};

export const coverLetter = {
  targetRole: 'Metrology Process Engineer — Samsung Austin Semiconductor',
  pdfUrl: '/resume/DONGHYEUN%20LEE_SAS_Metrology%20Process%20Engineer_Coverletter.pdf',
};

export const skills = [
  { name: 'AiX Systems & Automation', level: 90 },
  { name: 'Wet Lab & Analytical Instruments', level: 88 },
  { name: 'Manufacturing Devices & Vision', level: 85 },
  { name: 'In-Silico & Image Analysis', level: 88 },
  { name: 'Python / MATLAB', level: 90 },
  { name: 'React / FastAPI / Java', level: 80 },
];

/** Project card images */
const PROJECT_IMAGE_BASE = '/assets/DongHyeunLee/Project/Image';

export const projects = [
  {
    title: 'AI/ML BMS System',
    description:
      'Real-time monitoring dashboard for battery modules and sensor data (voltage, SoC, temperature, alarms) with automation-ready backend pipelines.',
    badges: ['PostgreSQL', 'FastAPI', 'Vite', 'TypeScript', 'Three.js', 'AI/ML'],
    image: '/assets/DongHyeunLee/Project/Video/녹음-2026-01-30-044543-aimlbms.gif',
    link: 'https://github.com/kiryuchi10/aiml-bms-system/tree/one-page-scroll-website/backend',
  },
  {
    title: 'SCM System — AI Tools',
    description:
      'AI-powered supply chain tools including demand forecasting, AI assistant, and analytics dashboards.',
    badges: ['React', 'Flask', 'AI/ML'],
    image: `${PROJECT_IMAGE_BASE}/scm_app.png`,
    link: 'https://github.com/kiryuchi10/SCM-apps',
  },
  {
    title: 'Pixel Art Generator',
    description:
      'Vision-based image transformation pipeline converting photos into pixel art with before/after analysis.',
    badges: ['React', 'FastAPI', 'Pillow', 'Image Processing'],
    image: `${PROJECT_IMAGE_BASE}/pixel_art.jpeg`,
    link: 'https://github.com/kiryuchi10/pixel-art-generator',
  },
  {
    title: 'Family Expenditure Tracker',
    description:
      'Personal finance analytics app with automated bank JSON ingestion and visualization.',
    badges: ['React', 'Data', 'Finance'],
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
  address: 'Austin, TX & Commerce, GA',
  phone: '+1 512 731 2449',
  website: 'kiryuchi10.github.io',
  resetLabel: 'Reset',
  fallbackLabel: 'Send via Email Client',
  orEmail: 'Or email:',
};
