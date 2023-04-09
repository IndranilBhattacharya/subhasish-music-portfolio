import { FC, memo } from "react";
import Spline from "@splinetool/react-spline";
import { motion, Variants } from "framer-motion";
import useWindowSize from "../../hooks/useWindowSize";

const mesh: Variants = {
  hidden: { opacity: 0, zIndex: -5 },
  visible: {
    zIndex: 0,
    opacity: 1,
    transition: { duration: 1.5 },
  },
};

const ThreeDMeshForHero: FC = () => {
  const [width, _] = useWindowSize();

  return (
    <motion.div
      variants={mesh}
      exit={{ display: "none", zIndex: -5 }}
      style={{ height: width, width: width * 0.5 }}
    >
      <Spline scene="https://prod.spline.design/Ir9aazIH2TogyEoF/scene.splinecode" />
    </motion.div>
  );
};

export default memo(ThreeDMeshForHero);
