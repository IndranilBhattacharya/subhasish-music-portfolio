import { FC, memo } from "react";
import { MotionValue, motion } from "framer-motion";

const SectionWatermark: FC<{ top: MotionValue<string>; content: string }> = ({
  top,
  content,
}) => {
  return (
    <motion.div
      style={{ top }}
      aria-hidden
      className="z-0 leading-none text-[clamp(4.5rem,15vw,13rem)] font-display font-bold w-max absolute left-0 pointer-events-none select-none watermark"
    >
      {content}
    </motion.div>
  );
};

export default memo(SectionWatermark);
