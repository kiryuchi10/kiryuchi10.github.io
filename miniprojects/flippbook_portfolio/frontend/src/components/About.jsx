//About.jsx
import React from "react";


import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";


import { SectionWrapper } from "../hoc/SectionWrapper";
import { fadeIn } from "../utils/motion";
import { config } from "../constants/config";


import { Header } from "./atoms/Header";

const ServiceCard = ({ index, title, icon }) => (
  <Tilt glareEnable tiltMaxAngleX={30} tiltMaxAngleY={30} glareColor="#aaa6c3">
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className="green-pink-gradient shadow-card w-full rounded-[20px] p-[1px] max-w-[250px]"
    >
      <div className="bg-tertiary min-h-[280px] flex flex-col items-center justify-evenly rounded-[20px] px-12 py-5">
        <img src={icon} alt={title} className="h-16 w-16 object-contain" />
        <h3 className="text-white text-[20px] font-bold text-center">{title}</h3>
      </div>
    </motion.div>
  </Tilt>
);

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
