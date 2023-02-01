import { FC, memo } from "react";
import { MotionValue, motion } from "framer-motion";

const SectionWatermark: FC<{ top: MotionValue<string>; content: string }> = ({
  top,
  content,
}) => {
  return (
    <motion.div
      style={{ top }}
      className="z-0 leading-[12rem] text-[13rem] w-max absolute left-1/12 watermark"
    >
      {content}
    </motion.div>
  );
};

export default memo(SectionWatermark);
