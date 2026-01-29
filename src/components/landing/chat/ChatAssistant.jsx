import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getAssistantReply } from '../../../services/portfolioAssistant';

const QUICK = [
  'What projects should I look at first?',
  'What are your strongest technical skills?',
  'How do I contact you?',
  'Show me the 3D lab',
];

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function runActions(actions = []) {
  actions.forEach((a) => {
    if (a.type === 'scroll' && a.id) scrollTo(a.id);
    if (a.type === 'link' && a.href) window.location.hash = a.href.replace('#', '');
  });
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  const welcome = useMemo(
    () => ({
      role: 'assistant',
      content:
        "Hi — I’m AIX Guide. Ask about projects, skills, resume, contact info, or jump to a section instantly.",
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

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || thinking) return;

    setMessages((prev) => [...prev, { role: 'user', content: msg, ts: Date.now() }]);
    setInput('');
    setThinking(true);

    // small “human-ish” delay
    await new Promise((r) => setTimeout(r, 450));

    const { text: reply, actions } = getAssistantReply(msg);
    setMessages((prev) => [...prev, { role: 'assistant', content: reply, ts: Date.now(), actions }]);
    setThinking(false);

    // Execute “jump” actions after the reply lands
    if (actions?.length) {
      setTimeout(() => runActions(actions), 250);
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.div
        className="fixed bottom-6 right-6 z-[80]"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 18 }}
      >
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="relative h-14 w-14 rounded-full bg-gradient-to-r from-primary via-accent to-secondary shadow-[0_20px_60px_-15px_hsla(173_80%_60%_/_0.35)] border border-white/10 hover:opacity-90 transition-opacity"
          aria-label={isOpen ? 'Close assistant' : 'Open assistant'}
        >
          <span className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />
          <span className="relative text-white text-xl">{isOpen ? '✕' : '✦'}</span>
        </button>
      </motion.div>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="assistant"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="fixed bottom-24 right-6 z-[81] w-[92vw] max-w-md"
          >
            <div className="glass rounded-2xl shadow-lg border border-border overflow-hidden flex flex-col h-[560px] max-h-[78vh]">
              {/* Header */}
              <div className="px-4 py-3 bg-gradient-to-r from-primary/90 via-accent/80 to-secondary/80 text-white flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">AIX Guide</div>
                  <div className="text-xs text-white/80">Ask + jump to sections</div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="h-9 w-9 rounded-full hover:bg-white/15 transition-colors"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/40">
                {messages.map((m) => (
                  <motion.div
                    key={m.ts}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap break-words ${
                        m.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'glass border border-primary/15'
                      }`}
                    >
                      {m.content}
                    </div>
                  </motion.div>
                ))}

                {messages.length === 1 && messages[0]?.role === 'assistant' && (
                  <div className="pt-2 space-y-2">
                    <div className="text-xs text-muted-foreground text-center">Quick prompts</div>
                    {QUICK.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => send(q)}
                        disabled={thinking}
                        className="w-full text-left glass border border-primary/20 hover:border-primary/40 rounded-xl px-3 py-2 text-sm transition-colors disabled:opacity-60"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {thinking && (
                  <div className="flex justify-start">
                    <div className="glass border border-primary/15 rounded-2xl px-4 py-2 text-sm text-muted-foreground">
                      Thinking…
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-border/50 bg-background/70">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send();
                  }}
                  className="flex gap-2"
                >
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question… (e.g., “Show projects”)"
                    className="flex-1 px-3 py-2 rounded-xl bg-muted/50 border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    disabled={thinking}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || thinking}
                    className="px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-60"
                  >
                    Send
                  </button>
                </form>
                <div className="text-[10px] text-muted-foreground mt-2 text-center">
                  Local assistant (no external AI) • fast navigation + FAQs
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

