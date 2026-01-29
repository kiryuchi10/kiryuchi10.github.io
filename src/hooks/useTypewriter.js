import { useEffect, useState } from 'react';

export function useTypewriter({
  words = ['Developer', 'Engineer', 'Builder'],
  speed = 90,
  pause = 900,
} = {}) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex % words.length];

    const tick = () => {
      if (!deleting) {
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) {
          setTimeout(() => setDeleting(true), pause);
        }
      } else {
        const next = current.slice(0, text.length - 1);
        setText(next);
        if (next === '') {
          setDeleting(false);
          setWordIndex((i) => (i + 1) % words.length);
        }
      }
    };

    const t = setTimeout(tick, deleting ? speed * 0.6 : speed);
    return () => clearTimeout(t);
  }, [text, deleting, wordIndex, words, speed, pause]);

  return text;
}

