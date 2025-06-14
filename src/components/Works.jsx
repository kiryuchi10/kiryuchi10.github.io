//Works.jsx
import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { projects } from "./Projects"; //Fix import name
import { SectionWrapper } from "../hoc/SectionWrapper"; // 경로 유지
import { fadeIn } from "../utils/motion";
import { config } from "../constants/config";
import { Header } from "./atoms/Header";
import github from "../assets/github.png"; // 상대 경로로 맞추기

const ProjectCard = ({ index, name, description, tags, image, sourceCodeLink }) => (
  <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
    <Tilt glareEnable tiltMaxAngleX={30} tiltMaxAngleY={30} glareColor="#aaa6c3">
      <div className="bg-tertiary w-full rounded-2xl p-5 sm:w-[300px]">
        <div className="relative h-[230px] w-full">
          <img src={image} alt={name} className="h-full w-full rounded-2xl object-cover" />
          <div className="absolute inset-0 m-3 flex justify-end card-img_hover">
            <div
              onClick={() => window.open(sourceCodeLink, "_blank")}
              className="black-gradient flex h-10 w-10 cursor-pointer items-center justify-center rounded-full"
            >
              <img src={github} alt="github" className="h-1/2 w-1/2 object-contain" />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-white text-[24px] font-bold">{name}</h3>
          <p className="text-secondary mt-2 text-[14px]">{description}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <p key={tag.name} className={`text-[14px] ${tag.color}`}>
              #{tag.name}
            </p>
          ))}
        </div>
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

      <div className="mt-20 flex flex-wrap gap-7 justify-center">
       {projects.map((project, index) => (
        <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "works");
