import { aboutMe, projects, skills, socialLinks, personalInfo } from '../data/portfolioData';

function toLower(s) {
  return String(s || '').toLowerCase();
}

function includesAny(text, needles) {
  const t = toLower(text);
  return needles.some((n) => t.includes(toLower(n)));
}

export function getAssistantReply(userText) {
  const text = String(userText || '').trim();
  if (!text) return { text: "Ask me about projects, skills, resume, or contact info.", actions: [] };

  // Navigation intents
  if (includesAny(text, ['go to', 'open', 'show', 'jump', 'navigate', 'scroll'])) {
    if (includesAny(text, ['project', 'work', 'portfolio'])) {
      return { text: 'Taking you to Projects.', actions: [{ type: 'scroll', id: 'projects' }] };
    }
    if (includesAny(text, ['resume', 'cv'])) {
      return { text: 'Taking you to Resume.', actions: [{ type: 'scroll', id: 'resume' }] };
    }
    if (includesAny(text, ['about', 'skill'])) {
      return { text: 'Taking you to About.', actions: [{ type: 'scroll', id: 'about' }] };
    }
    if (includesAny(text, ['contact', 'email', 'phone'])) {
      return { text: 'Taking you to Contact.', actions: [{ type: 'scroll', id: 'contact' }] };
    }
  }

  // Skills
  if (includesAny(text, ['skills', 'stack', 'tech', 'technology', 'framework', 'tools'])) {
    const top = skills
      .slice()
      .sort((a, b) => (b.level || 0) - (a.level || 0))
      .slice(0, 6)
      .map((s) => `${s.name} (${s.level}%)`)
      .join(', ');
    return {
      text: `Top skills: ${top}.`,
      actions: [{ type: 'scroll', id: 'about' }],
    };
  }

  // Projects
  if (includesAny(text, ['project', 'projects', 'portfolio', 'work'])) {
    const list = projects
      .slice(0, 4)
      .map((p) => `- ${p.title}: ${p.description}`)
      .join('\n');
    return {
      text: `Here are a few projects:\n${list}\n\nWant to jump to the Projects section?`,
      actions: [{ type: 'scroll', id: 'projects' }],
    };
  }

  // Contact
  if (includesAny(text, ['contact', 'email', 'phone', 'linkedin', 'github', 'blog', 'reach'])) {
    const phoneFormatted = `(${socialLinks.phone.slice(0, 3)}) ${socialLinks.phone.slice(3, 6)}-${socialLinks.phone.slice(6)}`;
    return {
      text:
        `You can reach ${personalInfo.displayName} at:\n` +
        `- Email: ${socialLinks.email}\n` +
        `- Phone: ${phoneFormatted}\n` +
        `- LinkedIn: ${socialLinks.linkedin}\n` +
        `- GitHub: ${socialLinks.github}\n` +
        `- Blog: ${socialLinks.blog}\n` +
        `- Location: ${aboutMe.address}`,
      actions: [{ type: 'scroll', id: 'contact' }],
    };
  }

  // Resume
  if (includesAny(text, ['resume', 'cv', 'download'])) {
    return {
      text: 'You can download the PDF from the Resume section, or open the Resume page.',
      actions: [
        { type: 'scroll', id: 'resume' },
        { type: 'link', href: '#/resume', label: 'Open Resume page' },
      ],
    };
  }

  // 3D
  if (includesAny(text, ['3d', 'three', 'webgl', 'animation'])) {
    return { text: 'Check out the 3D Lab section.', actions: [{ type: 'scroll', id: 'lab' }] };
  }

  // About / background
  if (includesAny(text, ['about', 'background', 'bio', 'experience'])) {
    return { text: aboutMe.bio, actions: [{ type: 'scroll', id: 'about' }] };
  }

  return {
    text:
      "I can help with: projects, skills, resume, contact, or the 3D lab.\nTry asking: “Show projects” or “How can I contact you?”",
    actions: [],
  };
}

