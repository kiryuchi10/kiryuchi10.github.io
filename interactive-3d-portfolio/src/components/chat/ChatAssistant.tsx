import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getAssistantReply } from '../../services/portfolioAssistant';
import './ChatAssistant.css';

const QUICK = [
  'What projects should I look at first?',
  'What are your strongest technical skills?',
  'How do I contact you?',
  'Show me the journey',
];

function scrollToId(id: string): void {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function runActions(actions: { type: string; id?: string; href?: string }[]): void {
  actions.forEach((a) => {
    if (a.type === 'scroll' && a.id) scrollToId(a.id);
    if (a.type === 'link' && a.href) {
      window.location.hash = a.href.replace('#', '');
    }
  });
}

type Message = {
  role: 'user' | 'assistant';
  content: string;
  ts: number;
  actions?: { type: string; id?: string; href?: string }[];
};

export function ChatAssistant(): React.ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const welcome = useMemo<Message>(
    () => ({
      role: 'assistant',
      content:
        "Hi — I'm your portfolio guide. Ask about projects, skills, resume, contact info, or jump to a section instantly.",
      ts: Date.now(),
    }),
    []
  );

  useEffect(() => {
    if (isOpen && messages.length === 0) setMessages([welcome]);
  }, [isOpen, messages.length, welcome]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [isOpen]);

  const send = async (text?: string): Promise<void> => {
    const msg = (text ?? input).trim();
    if (!msg || thinking) return;

    setMessages((prev) => [...prev, { role: 'user', content: msg, ts: Date.now() }]);
    setInput('');
    setThinking(true);

    await new Promise((r) => setTimeout(r, 450));

    const { text: reply, actions } = getAssistantReply(msg);
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: reply, ts: Date.now(), actions },
    ]);
    setThinking(false);

    if (actions?.length) {
      setTimeout(() => runActions(actions), 250);
    }
  };

  return (
    <>
      <div className="chatassistant-fab chat-assistant-fab-wrap">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="chat-assistant-fab"
          aria-label={isOpen ? 'Close assistant' : 'Open assistant'}
        >
          <span className="chat-assistant-fab-icon">{isOpen ? '✕' : '✦'}</span>
        </button>
      </div>

      {isOpen && (
        <div className="chat-assistant-panel">
          <div className="chat-assistant-panel-inner">
            <div className="chat-assistant-header">
              <div>
                <div className="chat-assistant-title">Portfolio Guide</div>
                <div className="chat-assistant-subtitle">Ask + jump to sections</div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="chat-assistant-close"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="chat-assistant-messages">
              {messages.map((m) => (
                <div
                  key={m.ts}
                  className={`chat-assistant-msg chat-assistant-msg--${m.role}`}
                >
                  <div className="chat-assistant-msg-bubble">{m.content}</div>
                </div>
              ))}

              {messages.length === 1 && messages[0]?.role === 'assistant' && (
                <div className="chat-assistant-quick">
                  <div className="chat-assistant-quick-label">Quick prompts</div>
                  {QUICK.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => send(q)}
                      disabled={thinking}
                      className="chat-assistant-quick-btn"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {thinking && (
                <div className="chat-assistant-msg chat-assistant-msg--assistant">
                  <div className="chat-assistant-msg-bubble chat-assistant-thinking">
                    Thinking…
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="chat-assistant-input-wrap">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="chat-assistant-form"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question… (e.g., “Show projects”)"
                  className="chat-assistant-input"
                  disabled={thinking}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || thinking}
                  className="chat-assistant-send"
                >
                  Send
                </button>
              </form>
              <div className="chat-assistant-hint">
                Local assistant (no external AI) • fast navigation + FAQs
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
