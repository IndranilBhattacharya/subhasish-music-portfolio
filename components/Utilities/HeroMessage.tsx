import Link from "next/link";
import { FC, memo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { BsMusicNote, BsSoundwave } from "react-icons/bs";

import useWindowSize from "../../hooks/useWindowSize";
import AnimatedMouseScroll from "../Interfaces/AnimatedMouseScroll";

const ThreeDMeshForHero = dynamic(
  () => import("../Interfaces/ThreeDMeshForHero"),
  { ssr: false }
);

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
  const [wScreen] = useWindowSize();

  return (
    <div
      id="hero-top"
      className="hero-height relative w-full flex flex-col justify-center pt-10 pb-28 lg:pt-24 lg:pb-24"
    >
      {/* Below lg the fixed illustration column is hidden: the scene sits behind the copy. */}
      {wScreen > 0 && wScreen < 1024 && (
        <div className="absolute -top-[2vh] -right-[22vw] w-[95vw] max-w-[38rem] aspect-square opacity-50 pointer-events-none">
          <ThreeDMeshForHero />
        </div>
      )}
      <motion.div
        initial="hidden"
        variants={message}
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
        className="relative w-full flex flex-col"
      >
        <motion.div custom={0} variants={sentence} className="eyebrow mb-5">
          Producer &middot; Composer &middot; Singer
        </motion.div>
        <h1 className="flex flex-col gap-1 font-display font-bold tracking-tight leading-[1.08] text-[clamp(2.25rem,8vw,4rem)]">
          <motion.span custom={1} variants={sentence}>
            I make
          </motion.span>
          <motion.span custom={2} variants={sentence}>
            Music that keeps you
          </motion.span>
          <motion.span custom={3} variants={sentence}>
            in <span className="text-gradient-red">Loop</span>
          </motion.span>
        </h1>
      </motion.div>
      <motion.p
        custom={4}
        initial="hidden"
        variants={sentence}
        whileInView="visible"
        className="relative mt-7 max-w-[55ch] text-lg leading-relaxed text-gray-300"
      >
        I can help you compose and produce music that can touch the souls of
        your audiences. You can also get music samples as per your need from
        the Samples store section.
      </motion.p>
      <motion.div
        custom={5}
        initial="hidden"
        variants={sentence}
        whileInView="visible"
        className="relative mt-9 flex flex-wrap gap-4"
      >
        <Link href="/#my-songs">
          <a className="btn-primary">
            <BsMusicNote /> Listen to my songs
          </a>
        </Link>
        <Link href="/samples-store">
          <a className="btn-ghost">
            <BsSoundwave /> Browse samples
          </a>
        </Link>
      </motion.div>
      <div className="absolute left-0 bottom-7 h-10 gap-4 hidden lg:flex items-center text-gray-300">
        <AnimatedMouseScroll className="h-full aspect-square" />
        <span className="font-semibold">Explore my work..</span>
      </div>
      <span id="my-songs" className="absolute bottom-0 left-0"></span>
    </div>
  );
};

export default memo(HeroMessage);
