import React, { useState } from 'react';
import './ContactForm.css';

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기서 fetch 또는 axios 사용 가능
    alert('Message sent!');
    setForm({ name: '', email: '', subject: '', message: '' });
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
            <button type="submit">Send Message</button>
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
              <span><strong>Phone:</strong> +123 2355 98</span>
            </li>
            <li>
              <i className="fas fa-paper-plane"></i>
              <span><strong>Email:</strong> info@yoursite.com</span>
            </li>
            <li>
              <i className="fas fa-globe"></i>
              <span><strong>Website:</strong> yoursite.com</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default ContactForm;
