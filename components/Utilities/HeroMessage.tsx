import { FC, memo } from "react";
import { motion } from "framer-motion";
import { Player, Controls } from "@lottiefiles/react-lottie-player";

import DynamicBg from "../Interfaces/DynamicBg";
import AnimatedMouseScroll from "../Interfaces/AnimatedMouseScroll";
import SwipeUpAction from "../../assets/jsons/swipe-up-for-more.json";

const message = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const sentence = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.25, delay: i * 0.25 },
  }),
};

const HeroMessage: FC = () => {
  return (
    <div className="relative w-full h-full flex flex-col pt-[5vh] lg:pt-7 lg:justify-center pb-[15vh]">
      <motion.div
        initial="hidden"
        variants={message}
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        className="w-full gap-1 flex flex-col text-6xl font-bold"
        transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
      >
        <motion.div custom={1} variants={sentence}>
          I make
        </motion.div>
        <motion.div custom={2} variants={sentence}>
          Music that keeps you
        </motion.div>
        <motion.div custom={3} variants={sentence} className="flex items-start">
          in
          <div className="h-[4rem] w-60 relative">
            <svg
              width="100%"
              height="100%"
              className="hero-mask absolute top-0 left-0 w-full"
            >
              <defs>
                <mask id="hero_mask" x="0" y="0" width="100%" height="100%">
                  <rect x="0" y="0" width="100%" height="100%" />
                  <text x="35%" y="80%" fill="red" textAnchor="middle">
                    Loop
                  </text>
                </mask>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" />
            </svg>
            <DynamicBg />
          </div>
        </motion.div>
      </motion.div>
      <motion.div
        custom={4}
        initial="hidden"
        variants={sentence}
        whileInView="visible"
        className="mt-8 mb-10 text-gray-200 flex flex-wrap text-lg"
      >
        {`I can help you compose and produce music that can touch the souls of your audiences. You can also get music samples as per your need from the Samples store section.`}
      </motion.div>
      <motion.div
        custom={6}
        initial="hidden"
        variants={sentence}
        whileInView="visible"
        className="mt-2 mb-5 w-full flex justify-center opacity-75 lg:hidden"
      >
        <Player
          loop
          autoplay
          src={SwipeUpAction}
          style={{ height: "20vw", width: "20vw" }}
        >
          <Controls visible={false} />
        </Player>
      </motion.div>
      <div className="absolute left-0 bottom-7 h-10 gap-4 hidden lg:flex items-center">
        <AnimatedMouseScroll className="h-full aspect-square" />
        <span id="my-songs" className="font-semibold">
          Explore my work..
        </span>
      </div>
    </div>
  );
};

export default memo(HeroMessage);
