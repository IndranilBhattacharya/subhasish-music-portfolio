import { FC, memo } from "react";
import { motion } from "framer-motion";

const SocialHandleLinkSvg: FC = () => {
  return (
    <svg
      fill="none"
      width="106"
      height="396"
      viewBox="0 0 106 396"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        d="M1 117V277C1.00003 297 1.00005 313.5 34.5 313.5C74.9 313.5 74.6668 313.5 104.5 313.5"
      />
      <motion.path
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        d="M1 18V178C1.00003 198 1.00005 214.5 34.5 214.5C74.9 214.5 74.6668 214.5 104.5 214.5"
      />
      <motion.path
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        d="M1 0.5V80C1.00003 100 1.00005 116.5 34.5 116.5C74.9 116.5 74.6668 116.5 104.5 116.5"
      />
    </svg>
  );
};

export default memo(SocialHandleLinkSvg);
