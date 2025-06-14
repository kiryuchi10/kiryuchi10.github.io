import React from "react";
import Cover from "./Cover";
import Resume from "./Resume";
import CV from "./CV";
import Projects from "./Projects";
import ContactForm from "./ContactForm";

const Book = () => {
  return (
    <div className="portfolio-container">
      <Cover />
      <Resume />
      <CV />
      <Projects />
      <ContactForm />
    </div>
  );
};

export default Book;
