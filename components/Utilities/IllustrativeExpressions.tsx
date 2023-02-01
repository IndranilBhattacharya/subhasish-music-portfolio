import { FC, memo, useEffect, useState } from "react";
import { AnimatePresence, useScroll } from "framer-motion";

import YtExpression from "./YtExpression";
import SkillsExpression from "./SkillsExpression";
import { HeroExpRefs, YtExpInfo } from "../../types";
import { fetchYTChannelStats } from "../../services/ytService";
import ThreeDMeshForHero from "../Interfaces/ThreeDMeshForHero";

const initYtInfo: YtExpInfo = {
  viewCount: 0,
  videoCount: 0,
  subscriberCount: 0,
  youTubeSvgPathProgress: 0,
  youTubeSvgLogoFill: "#ffff",
};

const IllustrativeExpressions: FC<HeroExpRefs> = ({
  youTubeRef,
  skillSetRef,
  aboutMeRef,
}) => {
  const { scrollYProgress: youTubeYProgress } = useScroll({
    target: youTubeRef,
    offset: ["start end", "center center"],
  });
  const { scrollYProgress: skillsYProgress } = useScroll({
    target: skillSetRef,
    offset: ["start end", "center center"],
  });
  const { scrollYProgress: aboutMeYProgress } = useScroll({
    target: aboutMeRef,
    offset: ["start 0.7", "end center"],
  });

  const [skillsY, setSkillsY] = useState<number>(0);
  const [youTubeY, setYouTubeY] = useState<number>(0);
  const [aboutMeY, setAboutMeY] = useState<number>(0);

  const [initHeroExpression, setInitHeroExpression] = useState(<></>);
  const [ytChannelInfo, setYtChannelInfo] = useState<YtExpInfo>(initYtInfo);

  const youTubeSvgPathProgress = Math.max(
    skillsY > 0 ? youTubeY - skillsY * 7 : youTubeY * 3,
    0
  );
  const ytRGB = 255 * youTubeSvgPathProgress;
  const youTubeSvgLogoFill = `rgba(${ytRGB}, ${ytRGB}, ${ytRGB})`;

  useEffect(() => {
    const initContentLoadTimeout = setTimeout(() => {
      setInitHeroExpression(<ThreeDMeshForHero />);
    }, 500);

    youTubeYProgress.onChange((latestYouTubeY) => {
      setYouTubeY(latestYouTubeY);
    });
    skillsYProgress.onChange((latestSkillsY) => {
      setSkillsY(latestSkillsY);
    });
    aboutMeYProgress.onChange((latestAboutMeY) => {
      setAboutMeY(latestAboutMeY);
    });

    return () => clearTimeout(initContentLoadTimeout);
  }, [
    skillsYProgress,
    youTubeYProgress,
    aboutMeYProgress,
    setSkillsY,
    setAboutMeY,
    setYouTubeY,

    setInitHeroExpression,
  ]);

  useEffect(() => {
    const meshLoadTimeout = setTimeout(() => {
      youTubeY > 0.05 && setInitHeroExpression(<></>);
      youTubeY <= 0.05 && setInitHeroExpression(<ThreeDMeshForHero />);
    }, 750);

    return () => clearTimeout(meshLoadTimeout);
  }, [youTubeY, setInitHeroExpression]);

  useEffect(() => {
    const onChannelStatsFetch = async () => {
      try {
        const ytChannelStatsResponse = await fetchYTChannelStats();
        const ytRawStat = ytChannelStatsResponse.data.items[0].statistics;
        setYtChannelInfo((prevInfo) => {
          return {
            ...prevInfo,
            viewCount: +ytRawStat.viewCount,
            videoCount: +ytRawStat.videoCount,
            subscriberCount: +ytRawStat.subscriberCount,
          };
        });
      } catch (err) {
        console.log(err);
      }
    };
    onChannelStatsFetch();
  }, [setYtChannelInfo]);

  return (
    <AnimatePresence>
      {youTubeY <= 0.05 && initHeroExpression}
      {youTubeY > 0.05 && skillsY <= 0.1 && (
        <YtExpression
          viewCount={ytChannelInfo.viewCount}
          videoCount={ytChannelInfo.videoCount}
          youTubeSvgLogoFill={youTubeSvgLogoFill}
          subscriberCount={ytChannelInfo.subscriberCount}
          youTubeSvgPathProgress={youTubeSvgPathProgress}
        />
      )}
      {skillsY > 0.1 && aboutMeY <= 0.2 && (
        <SkillsExpression pathProgress={skillsY} />
      )}
    </AnimatePresence>
  );
};

export default memo(IllustrativeExpressions);
