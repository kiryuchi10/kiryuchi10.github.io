import React from "react";
import { motion } from "framer-motion";

const SectionWrapper = (Component, idName) =>
  function HOC() {
    return (
      <section id={idName} className="section-wrapper">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Component />
        </motion.div>
      </section>
    );
  };

export { SectionWrapper };
