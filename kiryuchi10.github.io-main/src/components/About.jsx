//About.jsx
import React from "react";


import { motion } from "framer-motion";


import { SectionWrapper } from "../hoc/SectionWrapper";
import { fadeIn } from "../utils/motion";
import { config } from "../constants/config";


import { Header } from "./atoms/Header";

const About = () => {
  return (
    <>
      <Header useMotion={true} {...config.sections.about} />

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="text-secondary mt-4 max-w-3xl text-[17px] leading-[30px]"
      >
        {config.sections.about.content}
      </motion.p>

    </>
  );
};

export default SectionWrapper(About, "about");
