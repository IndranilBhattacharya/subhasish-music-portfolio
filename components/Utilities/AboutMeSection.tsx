import { TypeAnimation } from "react-type-animation";
import { FC, memo, useEffect, useRef, useState } from "react";
import { MotionValue, useScroll, useTransform } from "framer-motion";

import classes from "../../styles/AboutMeSection.module.css";
import SectionWatermark from "../Interfaces/SectionWatermark";

const useParallax = (value: MotionValue<number>) => {
  return useTransform(value, [0, 1], ["-10%", "60%"]);
};

const AboutMeSection: FC = () => {
  const aboutMeContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: aboutMeContainerRef,
    offset: ["start end", "end start"],
  });

  const aboutMeY = useParallax(scrollYProgress);
  const [y, setY] = useState<number>(0);

  useEffect(() => {
    scrollYProgress.onChange((latestY) => {
      setY(latestY);
    });
  }, [setY, scrollYProgress]);

  return (
    <div
      ref={aboutMeContainerRef}
      className="mt-32 w-full h-fit flex flex-col relative"
    >
      <SectionWatermark top={aboutMeY} content={"About Me"} />
      <div className="w-full text-4xl font-bold">About Me</div>
      <div className="w-full h-fit overflow-hidden gap-8 flex items-center">
        <div className="w-[52%] h-[85vh] relative overflow-hidden">
          <div
            className={`${classes["mask-animator"]} ${
              y > 0.35 ? classes["animate-mask"] : ""
            } opacity-90`}
          ></div>
          <div className={classes["bw-background"]}></div>
        </div>
        <div className={classes.content}>
          <section className="text-3xl font-semibold">
            Greetings, I am Subhasish Chakraborty, a
            <TypeAnimation
              sequence={[
                " music producer",
                2000,
                " music composer",
                2000,
                " singer",
                2000,
              ]}
              wrapper="span"
              cursor={true}
              repeat={Infinity}
              className="w-fit text-red-500"
            />
          </section>
          <section className="mt-4 text-gray-300">
            My expertise lies in Indian pop, EDM, Bengali and Hindi songs. I am
            well-versed in a variety of musical styles and genres. I have a keen
            ear for melody and a talent for creating unique, catchy songs. My
            proven track record of producing hit music that resonates with
            audiences of all ages, has been my strength. I am also a skilled
            singer, with a powerful voice that is well-suited to a wide range of
            musical styles. I am blessed to have a large and dedicated fan base
            and am respected and admired by my peers in the Indian music
            industry. I promise to deliver music that will be more than anyone
            expects and will take everyone on a journey of sound and emotions.
          </section>
        </div>
      </div>
    </div>
  );
};

export default memo(AboutMeSection);
