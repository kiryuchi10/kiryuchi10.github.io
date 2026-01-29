/**
 * Single source of truth for portfolio content.
 * All sections read from here; do not hardcode personal text in components.
 */

export const profile = {
  basics: {
    fullName: 'Donghyeun Lee',
    location: 'Austin, TX',
    phone: '512-731-2449',
    email: 'donghyeunlee1@gmail.com',
    links: {
      linkedinLabel: 'LinkedIn',
      linkedinUrl: 'https://www.linkedin.com/in/dong-hyeun-lee-47a3b813a',
      githubLabel: 'GitHub',
      githubUrl: 'https://github.com/kiryuchi10',
      blogLabel: 'Blog',
      blogUrl: 'https://velog.io/@husuhaga10/posts',
    },
  },

  home: {
    tagline: 'Wired for Innovation',
    headline: "I'm a",
    typedRoles: ['MLS Data Reviewer', 'Technical Builder', 'R&D Engineer', 'AI Developer', 'Data-Driven Engineer'],
    subheadline:
      'GLP/GMP-aligned data review • LIMS-adjacent workflows • Python + automation',
    ctaPrimary: { label: 'Download Resume', href: '/resume', scrollToId: null },
    ctaSecondary: { label: 'View Projects', scrollToId: 'projects' },
  },

  about: {
    title: 'About',
    summary:
      'Biomedical laboratory data analyst with 4+ years of experience reviewing, validating, and managing molecular diagnostic and clinical assay data in GLP-regulated environments. Strong focus on data integrity, traceability, and audit-ready documentation.',
    highlights: [
      'Review raw instrument outputs, verify specimen/test accuracy, and reconcile records',
      'Translate finalized results into database/LIMS-like systems and maintain audit-ready documentation',
      'Troubleshoot assay + automation workflows (sensors, motion, fluid handling, optics, software)',
    ],
  },

  resume: {
    summary:
      'Biomedical laboratory data analyst with 4+ years reviewing, validating, and managing molecular diagnostic and clinical assay data in GLP-regulated environments. (Interview Finalist: Samsung, ASML, Otsuka | Offer: SK Battery America)',
    coreSkills: [
      'Clinical & Preclinical CDx Assay Data Review',
      'CLIA / GLP / GMP / SOP Compliance & Audit Readiness',
      'Molecular & Biochemical Assays',
      'Data Integrity, Traceability & Documentation',
      'LIMS-Adjacent Review & Patient/Panel Assay Test Verification',
      'Troubleshooting Assay Automation',
      'Python & AI/ML Fullstack Developer',
    ],
    experience: [
      {
        role: 'Senior Researcher',
        company: 'Proteina Inc.',
        location: 'Seoul, Korea',
        dates: '2021 – 2023',
        bullets: [
          'Supported daily operation, commissioning, and troubleshooting of automation-heavy electro-mechanical systems.',
          'Designed custom chip jigs for TIRF imaging systems; improved positional repeatability from ±12 μm to ±3 μm.',
          'Maintained GLP-level SOP compliance and contributed to audit-ready documentation.',
        ],
      },
      {
        role: 'Research Engineer',
        company: 'Palogen LLC',
        location: 'Seoul, Korea',
        dates: '2020 – 2021',
        bullets: [
          'Supported sensor manufacturing reliability analysis; investigated defects, signal instability, and yield loss.',
          'Built electrical testing pipelines to characterize nanopore formation, leakage current, and resistance metrics.',
        ],
      },
      {
        role: 'Graduate Researcher (M.S., Chemistry)',
        company: 'Sogang University',
        location: 'Seoul, Korea',
        dates: '2018 – 2020',
        bullets: [
          'Generated datasets from micro/nano-fabricated polymer and surface-engineered systems.',
          'Performed optical signal analysis and feature extraction using ImageJ, MATLAB, and Python.',
        ],
      },
      {
        role: 'Offer Accepted – Manufacturing Innovation Engineer',
        company: 'SK Battery America (SKBA)',
        location: 'Commerce, GA',
        dates: 'Start: TBA',
        bullets: [
          'Selected for a hybrid program focused on SPC/FDC pipelines, defect detection, and AI-based yield analysis in battery electrode production.',
        ],
      },
    ],
    education: [
      { school: 'Sogang University', degree: 'M.S., Chemistry', dates: '2018–2020', extra: 'GPA: 4.3 / 4.5' },
      { school: 'Hong Kong University of Science & Technology (HKUST)', degree: 'B.S., Chemical & Bioproduct Engineering', dates: '2010–2013' },
    ],
    certifications: [
      'AI & Machine Learning (PGP) — University of Texas at Austin, 2025',
      'Full-Stack Java Development — HiMedia Academy, 2024',
      'Semiconductor Training Certificate — Seoul National University ISRC, 2010',
    ],
    // Single PDF for download. Place file in public/resume/
    // Natera MLS Data Reviewer: copy "DongHyeunLee_Natera _MLS Data Reviewer_Resume.pdf" to public/resume/ and set:
    // pdfUrl: '/resume/DongHyeunLee_Natera_MLS_Data_Reviewer_Resume.pdf',
    pdfUrl: '/resume/DONG_HYEUN_LEE_Resume_250603.pdf',
  },

  coverLetter: {
    title: 'Cover Letter Highlights',
    targetRole: 'Medical Laboratory Scientist, Data Reviewer I — Natera (Austin, TX)',
    paragraphs: [
      'I am applying for the Medical Laboratory Scientist, Data Reviewer I position at Natera in Austin, TX. I bring 4+ years of experience supporting molecular diagnostic data review, assay operations, and regulatory compliance in GLP/GMP-aligned laboratory environments, with a strong focus on data accuracy, traceability, and audit readiness.',
      'At Proteina Inc., I routinely reviewed and validated molecular and clinical assay results prior to release, ensured consistency between raw instrument outputs and structured databases, verified sample identity and test selection, resolved discrepancies through raw data and run-log review, and translated finalized results into LIMS-like SQL systems supporting clinical, QC, and regulatory workflows under GLP/GMP SOPs.',
      'I am highly motivated to contribute to Natera\'s leadership in cell-free DNA diagnostics by supporting accurate data review, compliant operations, and reliable clinical reporting. I am prepared to comply with HIPAA/PHI, security, and Natera training requirements.',
    ],
  },

  contact: {
    title: 'Contact',
    subtitle: 'Send a message. This form is designed for a FastAPI/Netlify backend (rate-limit + honeypot).',
    fields: { name: 'Your name', email: 'Email', message: 'Message' },
    submitLabel: 'Send',
    sendingLabel: 'Sending...',
  },
};

/** Helper: safe get with defaults */
export function getProfile() {
  return profile;
}

export default profile;
