import { FC, memo, useEffect, useState } from "react";
import { AnimatePresence, useScroll } from "framer-motion";

import { HeroExpRefs } from "../../types";
import YtExpression from "./YtExpression";
import SkillsExpression from "./SkillsExpression";
import ThreeDMeshForHero from "../Interfaces/ThreeDMeshForHero";

const IllustrativeExpressions: FC<HeroExpRefs> = ({
  viewCount,
  videoCount,
  youTubeRef,
  aboutMeRef,
  skillSetRef,
  subscriberCount,
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

  return (
    <AnimatePresence>
      {youTubeY <= 0.05 && initHeroExpression}
      {youTubeY > 0.05 && skillsY <= 0.1 && (
        <YtExpression
          {...{
            viewCount,
            videoCount,
            subscriberCount,
            youTubeSvgLogoFill,
            youTubeSvgPathProgress,
          }}
        />
      )}
      {skillsY > 0.1 && aboutMeY <= 0.2 && (
        <SkillsExpression pathProgress={skillsY} />
      )}
    </AnimatePresence>
  );
};

export default memo(IllustrativeExpressions);
