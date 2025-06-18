import React from "react";
import "./Projects.css";
import sensorDashboardImg from "../assets/sensor_dashboard.png";
import pixelArtImg from "../assets/pixel_art.jpeg";

export const projects = [
  {
    name: "Smart Sensor Dashboard",
    description: "Real-time monitoring app using React + FastAPI.",
    tags: [
      { name: "React", color: "text-blue-500" },
      { name: "FastAPI", color: "text-green-500" },
      { name: "MySQL", color: "text-yellow-500" },
    ],
    image: sensorDashboardImg,
    sourceCodeLink: "https://github.com/kiryuchi10/smart-sensor-dashboard",
  },
  {
    name: "Pixel Art Generator",
    description: "Upload an image and convert it to 8-bit pixel art.",
    tags: [
      { name: "React", color: "text-pink-500" },
      { name: "FastAPI", color: "text-green-500" },
      { name: "Pillow", color: "text-yellow-500" },
    ],
    image: pixelArtImg,
    sourceCodeLink: "https://github.com/kiryuchi10/pixel-art-generator",
  },
];

const Projects = () => {
  return (
    <section className="projects-wrapper">
      {projects.map((project, index) => (
        <div className="project-card" key={index}>
          <a href={project.sourceCodeLink} target="_blank" rel="noopener noreferrer">
            <img src={project.image} alt={project.name} className="project-image" />
          </a>
          <div className="project-content">
            <div className="project-title">{project.name}</div>
            <div className="project-description">{project.description}</div>
            <div className="project-tags">
              {project.tags.map((tag, tagIndex) => (
                <span key={tagIndex} className="project-tag" style={{ color: tag.color }}>
                  #{tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Projects;
