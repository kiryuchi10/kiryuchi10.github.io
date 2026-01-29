import React, { useState, useCallback } from 'react';
import { SectionContainer } from '../components/layout/SectionContainer';
import { contact, basics } from '../config/content';
import { sendContact } from '../services/apiService';

type FormState = { name: string; email: string; subject: string; message: string };
type Status = 'idle' | 'success' | 'error';

export function ContactSection(): React.ReactElement {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [showEmailFallback, setShowEmailFallback] = useState(false);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setStatus('idle');
  }, []);

  const resetForm = useCallback(() => {
    setForm({ name: '', email: '', subject: '', message: '' });
    setStatus('idle');
    setStatusMessage('');
    setShowEmailFallback(false);
  }, []);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSending(true);
      setStatus('idle');
      setStatusMessage('');
      try {
        const res = await sendContact({
          name: form.name,
          email: form.email,
          subject: form.subject || 'Portfolio contact',
          message: form.message,
        });
        const data = res as { status?: string; message?: string };
        setForm({ name: '', email: '', subject: '', message: '' });
        setStatus('success');
        setStatusMessage(data.message ?? 'Your message has been sent.');
        setShowEmailFallback(false);
      } catch (err) {
        const message = (err as Error).message ?? '';
        const code = (err as Error & { code?: string }).code;
        setStatus('error');
        if (message.includes('fetch') || message.includes('Network') || message.includes('timeout') || code === 'ECONNABORTED') {
          setStatusMessage('Unable to connect. Use the email link below.');
        } else {
          setStatusMessage('Something went wrong. Try the email link below.');
        }
        setShowEmailFallback(true);
      } finally {
        setSending(false);
      }
    },
    [form]
  );

  const handleEmailFallback = useCallback(() => {
    const subject = encodeURIComponent(form.subject || 'Contact from Portfolio');
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}\n\nFrom: ${typeof window !== 'undefined' ? window.location.href : ''}`
    );
    window.location.href = `mailto:${basics.email}?subject=${subject}&body=${body}`;
  }, [form]);

  return (
    <SectionContainer id="contact" title={contact.title}>
      <p className="contact-subtitle">{contact.subtitle}</p>
      <div className="contact-two-col">
        <div className="contact-form-wrap">
          <h2 className="contact-form-heading">{contact.formTitle}</h2>
          <form className="contact-form" onSubmit={onSubmit}>
            <div className="contact-form-row">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder={contact.fields.name}
                required
              />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder={contact.fields.email}
                required
              />
            </div>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={onChange}
              placeholder={contact.fields.subject}
            />
            <textarea
              name="message"
              value={form.message}
              onChange={onChange}
              placeholder={contact.fields.message}
              rows={5}
              required
            />
            {status === 'success' && (
              <p className="contact-status contact-status--success" role="status">
                {statusMessage}
              </p>
            )}
            {status === 'error' && (
              <p className="contact-status contact-status--error" role="alert">
                {statusMessage}
              </p>
            )}
            <div className="contact-form-actions">
              <button type="submit" className="btn btn-primary" disabled={sending}>
                {sending ? contact.sendingLabel : contact.submitLabel}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                {contact.resetLabel}
              </button>
              {showEmailFallback && (
                <button type="button" className="btn contact-fallback-btn" onClick={handleEmailFallback}>
                  {contact.fallbackLabel}
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="contact-info-wrap">
          <h2 className="contact-info-heading">{contact.infoTitle}</h2>
          <ul className="contact-info-list">
            <li><strong>Address:</strong> {contact.address}</li>
            <li><strong>Phone:</strong> {contact.phone}</li>
            <li><strong>Email:</strong> {basics.email}</li>
            <li><strong>Website:</strong> {contact.website}</li>
          </ul>
          <p className="contact-email">
            {contact.orEmail} <a href={`mailto:${basics.email}`}>{basics.email}</a>
          </p>
        </div>
      </div>
    </SectionContainer>
  );
}
