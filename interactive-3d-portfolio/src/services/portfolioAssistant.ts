import { basics, about, skills, projects } from '../config/content';

function toLower(s: string | undefined): string {
  return String(s ?? '').toLowerCase();
}

function includesAny(text: string, needles: string[]): boolean {
  const t = toLower(text);
  return needles.some((n) => t.includes(toLower(n)));
}

export type AssistantAction = { type: 'scroll'; id: string } | { type: 'link'; href: string };

export function getAssistantReply(userText: string): { text: string; actions: AssistantAction[] } {
  const text = String(userText ?? '').trim();
  if (!text) {
    return { text: 'Ask me about projects, skills, resume, or contact info.', actions: [] };
  }

  if (includesAny(text, ['go to', 'open', 'show', 'jump', 'navigate', 'scroll'])) {
    if (includesAny(text, ['project', 'work', 'portfolio'])) {
      return { text: 'Taking you to Projects.', actions: [{ type: 'scroll', id: 'projects' }] };
    }
    if (includesAny(text, ['resume', 'cv'])) {
      return { text: 'Taking you to Resume.', actions: [{ type: 'scroll', id: 'resume' }] };
    }
    if (includesAny(text, ['about', 'skill'])) {
      return { text: 'Taking you to Skills.', actions: [{ type: 'scroll', id: 'skills' }] };
    }
    if (includesAny(text, ['journey', 'timeline'])) {
      return { text: 'Taking you to Journey.', actions: [{ type: 'scroll', id: 'journey' }] };
    }
    if (includesAny(text, ['contact', 'email', 'phone'])) {
      return { text: 'Taking you to Contact.', actions: [{ type: 'scroll', id: 'contact' }] };
    }
    if (includesAny(text, ['home', 'hero'])) {
      return { text: 'Taking you to Home.', actions: [{ type: 'scroll', id: 'home' }] };
    }
    if (includesAny(text, ['blog', 'guestbook'])) {
      return { text: 'Taking you to Blog.', actions: [{ type: 'scroll', id: 'blog' }] };
    }
  }

  if (includesAny(text, ['skills', 'stack', 'tech', 'technology', 'framework', 'tools'])) {
    const top = [...skills]
      .sort((a, b) => (b.level ?? 0) - (a.level ?? 0))
      .slice(0, 6)
      .map((s) => `${s.name} (${s.level}%)`)
      .join(', ');
    return {
      text: `Top skills: ${top}.`,
      actions: [{ type: 'scroll', id: 'skills' }],
    };
  }

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

  if (includesAny(text, ['contact', 'email', 'phone', 'linkedin', 'github', 'blog', 'reach'])) {
    const phoneFormatted =
      basics.phone.length >= 10
        ? `(${basics.phone.slice(0, 3)}) ${basics.phone.slice(3, 6)}-${basics.phone.slice(6)}`
        : basics.phone;
    return {
      text:
        `You can reach ${basics.fullName} at:\n` +
        `- Email: ${basics.email}\n` +
        `- Phone: ${phoneFormatted}\n` +
        `- LinkedIn: ${basics.linkedin}\n` +
        `- GitHub: ${basics.github}\n` +
        `- Blog: ${basics.blog}\n` +
        `- Location: ${basics.location}`,
      actions: [{ type: 'scroll', id: 'contact' }],
    };
  }

  if (includesAny(text, ['resume', 'cv', 'download'])) {
    return {
      text: 'You can download the PDF from the Resume section.',
      actions: [{ type: 'scroll', id: 'resume' }],
    };
  }

  if (includesAny(text, ['about', 'background', 'bio', 'experience'])) {
    return {
      text: about.summary,
      actions: [{ type: 'scroll', id: 'journey' }],
    };
  }

  return {
    text:
      "I can help with: projects, skills, resume, contact, journey, or blog.\nTry asking: “Show projects” or “How can I contact you?”",
    actions: [],
  };
}
