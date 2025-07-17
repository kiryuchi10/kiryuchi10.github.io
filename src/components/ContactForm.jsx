import React, { useState } from 'react';
import './ContactForm.css';

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setForm({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
        console.error('Error:', result.error);
      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Network error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        {/* Form Side */}
        <div className="form-box">
          <h2>Get in touch</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            </div>
            <input type="text" name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} required />
            <textarea name="message" placeholder="Message" rows="5" value={form.message} onChange={handleChange} required />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
            {submitStatus === 'success' && (
              <div className="status-message success">Message sent successfully!</div>
            )}
            {submitStatus === 'error' && (
              <div className="status-message error">Failed to send message. Please try again.</div>
            )}
          </form>
        </div>

        {/* Info Side */}
        <div className="info-box">
          <h2>Contact us</h2>
          <ul>
            <li>
              <i className="fas fa-map-marker-alt"></i>
              <span><strong>Address:</strong> 198 West 21th Street, Suite 721, New York NY 10016</span>
            </li>
            <li>
              <i className="fas fa-phone"></i>
              <span><strong>Phone:</strong> +512 731 2449</span>
            </li>
            <li>
              <i className="fas fa-paper-plane"></i>
              <span><strong>Email:</strong> donghyeunlee1@gmail.com</span>
            </li>
            <li>
              <i className="fas fa-globe"></i>
              <span><strong>Website:</strong> kiryuchi10.github.io</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default ContactForm;
