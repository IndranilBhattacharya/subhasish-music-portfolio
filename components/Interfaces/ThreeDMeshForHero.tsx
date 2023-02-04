import { FC, memo } from "react";
import Spline from "@splinetool/react-spline";
import { motion, Variants } from "framer-motion";
import useWindowSize from "../../hooks/useWindowSize";

const mesh: Variants = {
  hidden: { opacity: 0, zIndex: -5 },
  visible: {
    opacity: 1,
    zIndex: 0,
    transition: { duration: 1.5 },
  },
};

const ThreeDMeshForHero: FC = () => {
  const wondowSize = useWindowSize();

  return (
    <motion.div
      variants={mesh}
      exit={{ display: "none", zIndex: -5 }}
      style={{ height: wondowSize.width, width: wondowSize.width * 0.5 }}
    >
      <Spline scene="https://prod.spline.design/Ir9aazIH2TogyEoF/scene.splinecode" />
    </motion.div>
  );
};

export default memo(ThreeDMeshForHero);
