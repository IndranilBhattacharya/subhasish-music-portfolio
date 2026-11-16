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
  // Latch: reveal once, never snap back to B/W; also avoids a re-render per scroll frame.
  const [revealed, setRevealed] = useState(false);

  useEffect(
    () =>
      scrollYProgress.onChange((latestY) => {
        if (latestY > 0.35) setRevealed(true);
      }),
    [scrollYProgress]
  );

  return (
    <div
      id="about"
      ref={aboutMeContainerRef}
      className="mt-28 lg:mt-32 w-full h-fit flex flex-col relative scroll-mt-20"
    >
      <SectionWatermark top={aboutMeY} content={"About Me"} />
      <div data-reveal>
        <div className="eyebrow">The Artist</div>
        <h2 className="section-title">About Me</h2>
      </div>
      <div className="w-full h-fit mt-10 gap-8 lg:gap-12 flex flex-col lg:flex-row lg:items-center">
        {/* Box matches the photo's aspect so the photo, B/W copy and mask sprite frames line up exactly. */}
        <div className="w-full lg:w-[48%] aspect-[2947/3139] relative overflow-hidden rounded-2xl border border-white/10">
          <div
            className={`${classes["mask-animator"]} ${
              revealed ? classes["animate-mask"] : ""
            }`}
          ></div>
          <div className={classes["bw-background"]}></div>
        </div>
        <div data-reveal className={classes.content}>
          <section className="w-full font-display text-2xl lg:text-3xl font-semibold leading-snug">
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
              className="text-red-500"
            />
          </section>
          <section className="mt-5 leading-relaxed text-gray-300">
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
