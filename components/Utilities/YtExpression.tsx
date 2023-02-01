import { FC, memo } from "react";
import { FaEye, FaMusic } from "react-icons/fa";
import { motion, Variants } from "framer-motion";
import { RiNotification2Fill } from "react-icons/ri";

import YouTubeSvg from "../Interfaces/YouTubeSvg";
import { YtDisplayStat, YtExpInfo } from "../../types";
import useNumberFormat from "../../hooks/useNumberFormat";

const anayticsHolderVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const ytStatVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.3 },
  }),
};

const YtExpression: FC<YtExpInfo> = ({
  viewCount,
  videoCount,
  subscriberCount,
  youTubeSvgLogoFill,
  youTubeSvgPathProgress,
}) => {
  const songsCount = useNumberFormat(videoCount);
  const totalviewCount = useNumberFormat(viewCount);
  const subsCount = useNumberFormat(subscriberCount);

  const ytStatsForDisplay: YtDisplayStat[] = [
    { icon: FaMusic, statField: "Songs", count: songsCount },
    { icon: RiNotification2Fill, statField: "Subscribers", count: subsCount },
    { icon: FaEye, statField: "Total Views", count: totalviewCount },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-full flex justify-center">
        <YouTubeSvg
          youTubeSvgLogoFill={youTubeSvgLogoFill}
          youTubeSvgPathProgress={youTubeSvgPathProgress}
        />
      </div>
      <motion.div
        initial="hidden"
        key="ytAnalyticsHolder"
        variants={anayticsHolderVariants}
        className="w-full flex items-center justify-evenly"
        animate={youTubeSvgPathProgress >= 1 ? "visible" : "hidden"}
      >
        {ytStatsForDisplay.map((stat, i) => (
          <motion.div
            custom={i}
            key={stat.statField}
            variants={ytStatVariants}
            className="flex flex-col"
          >
            <div className="flex gap-2 items-center tracking-wide text-xs text-gray-200 uppercase">
              <stat.icon />
              {stat.statField}
            </div>
            <div className="font-bold text-5xl">{stat.count}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default memo(YtExpression);
