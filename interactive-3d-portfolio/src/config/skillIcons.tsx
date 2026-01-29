import type { IconType } from 'react-icons';
import {
  FaHtml5,
  FaCss3Alt,
  FaJsSquare,
  FaPython,
  FaGitAlt,
  FaGithub,
  FaLinux,
} from 'react-icons/fa';
import { VscVscode } from 'react-icons/vsc';
import {
  SiJupyter,
  SiPytorch,
  SiTensorflow,
  SiKeras,
  SiOpencv,
  SiNumpy,
  SiPandas,
  SiScikitlearn,
} from 'react-icons/si';

export type SkillIconItem = {
  key: string;
  label: string;
  Icon: IconType;
};

export const skillIcons: SkillIconItem[] = [
  { key: 'html', label: 'HTML', Icon: FaHtml5 },
  { key: 'css', label: 'CSS', Icon: FaCss3Alt },
  { key: 'js', label: 'JavaScript', Icon: FaJsSquare },
  { key: 'python', label: 'Python', Icon: FaPython },
  { key: 'git', label: 'Git', Icon: FaGitAlt },
  { key: 'github', label: 'GitHub', Icon: FaGithub },
  { key: 'linux', label: 'Linux', Icon: FaLinux },
  { key: 'vscode', label: 'VS Code', Icon: VscVscode },
  { key: 'jupyter', label: 'Jupyter', Icon: SiJupyter },
  { key: 'pytorch', label: 'PyTorch', Icon: SiPytorch },
  { key: 'tensorflow', label: 'TensorFlow', Icon: SiTensorflow },
  { key: 'keras', label: 'Keras', Icon: SiKeras },
  { key: 'opencv', label: 'OpenCV', Icon: SiOpencv },
  { key: 'numpy', label: 'NumPy', Icon: SiNumpy },
  { key: 'pandas', label: 'Pandas', Icon: SiPandas },
  { key: 'sklearn', label: 'Scikit-learn', Icon: SiScikitlearn },
];
