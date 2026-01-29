import React, { useEffect, useState } from 'react';

type TypewriterProps = {
  text: string;
  typingSpeedMs?: number;
  holdMs?: number;
  loop?: boolean;
  className?: string;
};

export function Typewriter({
  text: rawText,
  typingSpeedMs = 90,
  holdMs = 2000,
  loop = false,
  className,
}: TypewriterProps): React.ReactElement {
  const text = typeof rawText === 'string' && rawText.length > 0 ? rawText : '';
  const [output, setOutput] = useState('');
  const [done, setDone] = useState(false);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !text) {
      setOutput(text);
      setDone(true);
      return;
    }

    let index = 0;
    let typingTimer: number;
    let holdTimer: number;

    const typeNext = (): void => {
      const char = text[index];
      if (char === undefined) {
        setDone(true);
        if (loop) {
          holdTimer = window.setTimeout(() => {
            setOutput('');
            setDone(false);
            setCycle((c) => c + 1);
          }, holdMs);
        }
        return;
      }
      setOutput((prev) => prev + char);
      index += 1;

      if (index < text.length) {
        typingTimer = window.setTimeout(typeNext, typingSpeedMs);
      } else {
        setDone(true);
        if (loop) {
          holdTimer = window.setTimeout(() => {
            setOutput('');
            setDone(false);
            setCycle((c) => c + 1);
          }, holdMs);
        } else {
          holdTimer = window.setTimeout(() => {}, holdMs);
        }
      }
    };

    typingTimer = window.setTimeout(typeNext, typingSpeedMs);

    return () => {
      window.clearTimeout(typingTimer);
      window.clearTimeout(holdTimer);
    };
  }, [text, typingSpeedMs, holdMs, loop, cycle]);

  return (
    <span className={className}>
      {output}
      {!done && text.length > 0 && <span className="typewriter-caret" />}
    </span>
  );
}
