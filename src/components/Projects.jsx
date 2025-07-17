import React from "react";
import "./Projects.css";
import sensorDashboardImg from "../assets/sensor_dashboard.png";
import scmAppsImg from "../assets/scm_app.png";
import familyTrackerImg from "../assets/family_app.jpg";
import pixelArtImg from "../assets/pixel_art.jpeg";

export const projects = [
  {
    name: "Smart Sensor Dashboard",
    description: "Real-time monitoring app using React + FastAPI.",
    tags: [
      { name: "React", color: "#61dafb" },
      { name: "FastAPI", color: "#009688" },
      { name: "MySQL", color: "#f39c12" },
    ],
    image: sensorDashboardImg,
    sourceCodeLink: "https://github.com/kiryuchi10/smart-sensor-dashboard",
  },
  {
    name: "SCM Apps",
    description:
      "Supply Chain Management system with inventory tracking, order management, and AI-powered demand forecasting. Features real-time analytics and automated alerts.",
    tags: [
      { name: "React", color: "#61dafb" },
      { name: "Flask", color: "#000000" },
      { name: "SQLite", color: "#003b57" },
      { name: "AI/ML", color: "#ff6b6b" },
    ],
    image: scmAppsImg,
    sourceCodeLink: "https://github.com/kiryuchi10/SCM-apps",
  },
  {
    name: "Family Expenditure Tracker",
    description:
      "Personal finance management app for tracking family expenses with bank JSON import, category management, and spending insights. Built as a new parent to manage household finances.",
    tags: [
      { name: "React", color: "#61dafb" },
      { name: "Python", color: "#3776ab" },
      { name: "Data Analysis", color: "#e67e22" },
      { name: "Finance", color: "#27ae60" },
    ],
    image: familyTrackerImg,
    sourceCodeLink: "https://github.com/kiryuchi10/family-expenditure-app",
    blogPost:
      "https://medium.com/@donghyeunlee1/from-bank-json-to-beautiful-insights-building-an-expenditure-tracker-as-a-new-parent-junior-2213cc96074e",
  },
  {
    name: "Pixel Art Generator",
    description: "Upload an image and convert it to 8-bit pixel art.",
    tags: [
      { name: "React", color: "#61dafb" },
      { name: "FastAPI", color: "#009688" },
      { name: "Pillow", color: "#f39c12" },
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
          <a
            href={project.sourceCodeLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={project.image}
              alt={project.name}
              className="project-image"
              onError={(e) => {
                console.log(`Failed to load image: ${project.name}`, e.target.src);
                e.target.style.backgroundColor = '#f0f0f0';
                e.target.style.display = 'flex';
                e.target.style.alignItems = 'center';
                e.target.style.justifyContent = 'center';
                e.target.innerHTML = `<div style="text-align: center; color: #666; font-size: 14px;">${project.name}<br/>Image Loading...</div>`;
              }}
              onLoad={() => console.log(`Successfully loaded: ${project.name}`)}
            />
          </a>
          <div className="project-content">
            <div className="project-title">{project.name}</div>
            <div className="project-description">{project.description}</div>
            <div className="project-tags">
              {project.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="project-tag"
                  style={{ color: tag.color }}
                >
                  #{tag.name}
                </span>
              ))}
            </div>
            {project.blogPost && (
              <div className="project-links">
                <a
                  href={project.blogPost}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blog-link"
                >
                  📖 Read Blog Post
                </a>
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Projects;
