import React, { useState, useCallback } from 'react';
import './ContactForm.css';
import { useContactForm } from '../hooks/useContactForm';
import Notification from './common/Notification';
import { BuyMeACoffeeWidget } from './BuyMeACoffee';
import { motion } from 'framer-motion';

function ContactForm() {
  const [notifications, setNotifications] = useState([]);
  const [showEmailFallback, setShowEmailFallback] = useState(false);

  const addNotification = useCallback((notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const handleSuccess = useCallback((response) => {
    // Hide fallback button on successful submission
    setShowEmailFallback(false);
    
    addNotification({
      type: 'success',
      title: 'Message Sent!',
      message: 'Thank you for your message. I\'ll get back to you soon!',
      duration: 5000
    });
  }, [addNotification]);

  const handleError = useCallback((error) => {
    let errorMessage = 'Please try again or contact me directly via email.';
    let errorDetails = error.message;
    let showFallback = false;
    
    // Provide more specific error messages based on error type
    if (error.message?.includes('fetch') || error.message?.includes('NetworkError') || error.message?.includes('Failed to fetch')) {
      errorMessage = 'Unable to connect to server. You can use the email fallback below or contact me directly.';
      errorDetails = 'Backend service is currently unavailable';
      showFallback = true;
    } else if (error.message?.includes('timeout') || error.message?.includes('ECONNABORTED')) {
      errorMessage = 'Request timed out. Please try again or use the email fallback below.';
      errorDetails = 'The server took too long to respond';
      showFallback = true;
    } else if (error.message?.includes('Rate limit')) {
      errorMessage = 'Too many requests. Please wait a moment before trying again.';
      errorDetails = 'Rate limit exceeded';
    }
    
    addNotification({
      type: 'error',
      title: 'Failed to Send Message',
      message: errorMessage,
      details: errorDetails,
      duration: 8000
    });

    // Show fallback email option for connection issues
    if (showFallback) {
      setShowEmailFallback(true);
      setTimeout(() => {
        addNotification({
          type: 'info',
          title: 'Alternative Contact Method',
          message: 'Use the "Send via Email Client" button below as an alternative.',
          duration: 10000
        });
      }, 1000);
    }
  }, [addNotification]);

  const {
    formData,
    errors,
    isSubmitting,
    updateField,
    submitForm,
    resetForm
  } = useContactForm(handleSuccess, handleError);

  const handleChange = useCallback((e) => {
    updateField(e.target.name, e.target.value);
  }, [updateField]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    await submitForm();
  }, [submitForm]);

  const handleEmailFallback = useCallback(() => {
    const subject = encodeURIComponent(formData.subject || 'Contact from Portfolio Website');
    const body = encodeURIComponent(
      `Hi,\n\nName: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}\n\nSent from: ${window.location.href}`
    );
    const mailtoLink = `mailto:donghyeunlee1@gmail.com?subject=${subject}&body=${body}`;
    
    window.location.href = mailtoLink;
    
    addNotification({
      type: 'info',
      title: 'Email Client Opened',
      message: 'Your default email client should open with the message pre-filled.',
      duration: 5000
    });
  }, [formData, addNotification]);

  return (
    <>
      <section className="contact-section">
        <div className="contact-container">
          {/* Form Side */}
          <motion.div 
            className="form-box"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2>Get in touch</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-field">
                  <input 
                    type="text" 
                    name="name" 
                    placeholder="Name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className="form-field">
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
              </div>
              <div className="form-field">
                <input 
                  type="text" 
                  name="subject" 
                  placeholder="Subject" 
                  value={formData.subject} 
                  onChange={handleChange} 
                  required 
                  className={errors.subject ? 'error' : ''}
                />
                {errors.subject && <span className="field-error">{errors.subject}</span>}
              </div>
              <div className="form-field">
                <textarea 
                  name="message" 
                  placeholder="Message" 
                  rows="5" 
                  value={formData.message} 
                  onChange={handleChange} 
                  required 
                  className={errors.message ? 'error' : ''}
                />
                {errors.message && <span className="field-error">{errors.message}</span>}
              </div>
              {errors.general && (
                <div className="form-error">{errors.general}</div>
              )}
              <div className="form-actions">
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
                <button type="button" onClick={resetForm} className="reset-btn">
                  Reset
                </button>
                {showEmailFallback && (
                  <button type="button" onClick={handleEmailFallback} className="fallback-btn">
                    Send via Email Client
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Info Side */}
          <motion.div 
            className="info-box"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
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
            
            {/* Support Widget */}
            <div style={{ marginTop: '30px', padding: '20px', background: 'rgba(74, 144, 226, 0.1)', borderRadius: '10px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#333' }}>Support My Work</h3>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
                If you find my work helpful, consider supporting me!
              </p>
              <BuyMeACoffeeWidget compact={true} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Notifications */}
      <div className="notification-container">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </>
  );
}

export default ContactForm;
