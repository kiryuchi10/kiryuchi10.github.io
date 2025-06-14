import React from "react";
import { motion } from "framer-motion";

import { style } from "../../constants/style";
import { textVariant } from "../../utils/motion";

export const Header = ({ useMotion, p, h2 }) => {
  const Content = () => (
    <>
      <p className={style.sectionSubText}>{p}</p>
      <h2 className={style.sectionHeadText}>{h2}</h2>
    </>
  );

  return useMotion ? (
    <motion.div variants={textVariant()}>
      <Content />
    </motion.div>
  ) : (
    <Content />
  );
};
