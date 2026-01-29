import React from 'react';
import ContactForm from './ContactForm';

export default function Contact() {
  return (
    <section id="contact" className="relative z-[1] py-16 md:py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-white mb-8">Contact</h2>
        <ContactForm />
      </div>
    </section>
  );
}
