//Works.jsx
import React, { useState } from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { projects } from "./Projects"; //Fix import name
import { SectionWrapper } from "../hoc/SectionWrapper"; // 경로 유지
import { fadeIn } from "../utils/motion";
import { config } from "../constants/config";
import { Header } from "./atoms/Header";
import github from "../assets/github.png"; // 상대 경로로 맞추기
import { BuyMeACoffeeWidget } from "./BuyMeACoffee";

const ProjectCard = ({ index, name, description, tags, image, sourceCodeLink }) => (
  <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
    <Tilt glareEnable tiltMaxAngleX={30} tiltMaxAngleY={30} glareColor="#aaa6c3">
      <div className="bg-tertiary w-full rounded-2xl p-5 sm:w-[300px]">
        <div className="relative h-[230px] w-full">
          <img src={image} alt={name} className="h-full w-full rounded-2xl object-cover" />
          <div className="absolute inset-0 m-3 flex justify-end card-img_hover">
            <motion.div
              onClick={() => window.open(sourceCodeLink, "_blank")}
              className="black-gradient flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
              whileHover={{ scale: 1.2, rotate: 360 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <img src={github} alt="github" className="h-1/2 w-1/2 object-contain" />
            </motion.div>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-white text-[24px] font-bold">{name}</h3>
          <p className="text-secondary mt-2 text-[14px]">{description}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <motion.p 
              key={tag.name} 
              className={`text-[14px] ${tag.color} px-2 py-1 rounded-full bg-opacity-20 bg-white`}
              whileHover={{ scale: 1.1 }}
            >
              #{tag.name}
            </motion.p>
          ))}
        </div>

        {/* Buy Me a Coffee Widget for featured projects */}
        {index === 0 && (
          <div className="mt-4">
            <BuyMeACoffeeWidget compact={true} />
          </div>
        )}
      </div>
    </Tilt>
  </motion.div>
);

const Works = () => {
  return (
    <>
      <Header useMotion={true} {...config.sections.works} />

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="text-secondary mt-3 max-w-3xl text-[17px] leading-[30px]"
      >
        {config.sections.works.content}
      </motion.p>

      {/* Projects Grid */}
      <div className="mt-20 flex flex-wrap gap-7 justify-center">
       {projects.map((project, index) => (
        <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>

      {/* Support Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        style={{ 
          marginTop: '60px', 
          textAlign: 'center',
          padding: '40px 20px',
          background: 'linear-gradient(135deg, rgba(74, 144, 226, 0.1) 0%, rgba(226, 74, 74, 0.1) 100%)',
          borderRadius: '20px'
        }}
      >
        <h3 style={{ fontSize: '1.8rem', color: '#333', marginBottom: '15px' }}>
          Like My Work?
        </h3>
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '20px', maxWidth: '500px', margin: '0 auto 20px' }}>
          Your support helps me create more amazing projects and contribute to the open-source community
        </p>
        <BuyMeACoffeeWidget />
      </motion.div>
    </>
  );
};

export default SectionWrapper(Works, "works");
