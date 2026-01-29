import React, { useState } from 'react';
import { getBackendUrl } from '../../config/environment';
import { getProfile } from '../../data/profile.config';
import BuyMeACoffee from '../BuyMeACoffee';

export default function Contact3D() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
    honeypot: '',
  });
  const [status, setStatus] = useState({ loading: false, ok: null, msg: '' });

  const profile = getProfile();
  const contact = profile?.contact || {};
  const API_BASE = getBackendUrl();

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, ok: null, msg: '' });

    try {
      const url = API_BASE ? `${API_BASE}/api/contact` : '/api/contact';
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || data?.error || 'Failed to send');

      setStatus({ loading: false, ok: true, msg: 'Message sent!' });
      setForm({ name: '', email: '', message: '', honeypot: '' });
    } catch (err) {
      setStatus({ loading: false, ok: false, msg: err?.message || 'Error' });
    }
  };

  return (
    <section id="contact" className="py-16">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-3xl font-bold">{contact.title || 'Contact'}</h2>
          <p className="mt-3 text-white/70">{contact.subtitle || 'Send a message.'}</p>
          <div className="mt-6">
            <BuyMeACoffee showFloating={false} showInline={true} theme="dark" />
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="p-6 rounded-2xl border border-white/10 bg-white/5 grid gap-3"
        >
          <input
            name="honeypot"
            value={form.honeypot}
            onChange={onChange}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder={contact.fields?.name || 'Your name'}
            className="px-4 py-2 rounded-xl bg-black/40 border border-white/10 outline-none focus:ring-2 focus:ring-white/20"
            required
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            placeholder={contact.fields?.email || 'Email'}
            className="px-4 py-2 rounded-xl bg-black/40 border border-white/10 outline-none focus:ring-2 focus:ring-white/20"
            required
          />
          <textarea
            name="message"
            value={form.message}
            onChange={onChange}
            placeholder={contact.fields?.message || 'Message'}
            rows={5}
            className="px-4 py-2 rounded-xl bg-black/40 border border-white/10 outline-none focus:ring-2 focus:ring-white/20"
            required
          />

          <button
            type="submit"
            disabled={status.loading}
            className="mt-2 px-4 py-2 rounded-xl bg-white text-black font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {status.loading ? (contact.sendingLabel || 'Sending...') : (contact.submitLabel || 'Send')}
          </button>

          {status.ok === true && <div className="text-green-300 text-sm">{status.msg}</div>}
          {status.ok === false && <div className="text-red-300 text-sm">{status.msg}</div>}
        </form>
      </div>
    </section>
  );
}
