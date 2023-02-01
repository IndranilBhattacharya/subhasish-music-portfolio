import { FC, memo } from "react";
import { motion } from "framer-motion";
import { YtSvgPath } from "../../types";

const initialPathState = { pathLength: 0, fill: "none" };

const YouTubeSvg: FC<YtSvgPath> = ({
  youTubeSvgLogoFill,
  youTubeSvgPathProgress,
}) => {
  return (
    <svg
      fill="none"
      viewBox="-375 -25 1920 1080"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        initial={initialPathState}
        animate={{
          fill: youTubeSvgLogoFill,
          pathLength: youTubeSvgPathProgress,
        }}
        stroke="white"
        strokeWidth="15"
        strokeLinecap="round"
        d="M477.5 237.5L784 413.5L477.5 585.5L473.5 237.5"
      />
      <motion.path
        initial={initialPathState}
        animate={{
          pathLength: youTubeSvgPathProgress,
        }}
        stroke="white"
        strokeWidth="15"
        strokeLinecap="round"
        d="M464 1C585 1.16667 834.2 2.7 863 7.5C899 13.5 1096.5 -12 1143.5 106.5C1181.1 201.3 1179.5 439 1174 546C1177.83 628.833 1151.1 797 1013.5 807C841.5 819.5 500.5 831.5 469 824.5C437.5 817.5 178 817.5 148 807C118 796.5 25 788 14.5 617.5C4 447 -3.5 403 5.5 275C14.5 147 28 79.5 88 43.5C148 7.5 327.5 7.5 340.5 6C350.9 4.8 423.5 2.16667 458.5 1"
      />
    </svg>
  );
};

export default memo(YouTubeSvg);
