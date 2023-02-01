import { FC, memo } from "react";
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
    <motion.iframe
      loading="lazy"
      key="meshBlob"
      variants={mesh}
      height={wondowSize.width}
      width={wondowSize.width * 0.5}
      exit={{ display: "none", zIndex: -5 }}
      title="Abstract 3D Spectrum Visualizer Mesh Blob"
      src="https://my.spline.design/subhasishportfolio-46056df1861346778738189edf51a3e7/"
    ></motion.iframe>
  );
};

export default memo(ThreeDMeshForHero);
