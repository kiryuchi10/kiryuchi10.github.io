/**
 * Data-driven skill icons for Skills section.
 * Uses react-icons (Fa*, Si*). Install: npm install react-icons
 */

import React from 'react';
import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaPython,
  FaGitAlt,
  FaGithub,
  FaLinux,
  FaCode,
} from 'react-icons/fa';
import {
  SiPandas,
  SiNumpy,
  SiOpencv,
  SiPytorch,
  SiTensorflow,
  SiMysql,
  SiJupyter,
} from 'react-icons/si';
import * as Si from 'react-icons/si';

const FallbackSk = () => <span className="text-sm font-bold opacity-80">sk</span>;
const SiSklearn = Si.SiScikitlearn || FallbackSk;

export const skills = [
  { key: 'html', label: 'HTML', Icon: FaHtml5, color: '#E34F26' },
  { key: 'css', label: 'CSS', Icon: FaCss3Alt, color: '#1572B6' },
  { key: 'js', label: 'JavaScript', Icon: FaJs, color: '#F7DF1E' },
  { key: 'python', label: 'Python', Icon: FaPython, color: '#3776AB' },
  { key: 'pandas', label: 'Pandas', Icon: SiPandas, color: '#150458' },
  { key: 'numpy', label: 'NumPy', Icon: SiNumpy, color: '#013243' },
  { key: 'opencv', label: 'OpenCV', Icon: SiOpencv, color: '#5C3EE8' },
  { key: 'sklearn', label: 'Scikit-learn', Icon: SiSklearn, color: '#F7931E' },
  { key: 'pytorch', label: 'PyTorch', Icon: SiPytorch, color: '#EE4C2C' },
  { key: 'tensorflow', label: 'TensorFlow', Icon: SiTensorflow, color: '#FF6F00' },
  { key: 'sql', label: 'SQL', Icon: SiMysql, color: '#4479A1' },
  { key: 'git', label: 'Git', Icon: FaGitAlt, color: '#F05032' },
  { key: 'github', label: 'GitHub', Icon: FaGithub, color: '#FFFFFF' },
  { key: 'linux', label: 'Linux', Icon: FaLinux, color: '#FCC624' },
  { key: 'vscode', label: 'VS Code', Icon: FaCode, color: '#007ACC' },
  { key: 'jupyter', label: 'Jupyter', Icon: SiJupyter, color: '#F37626' },
];

export default skills;
