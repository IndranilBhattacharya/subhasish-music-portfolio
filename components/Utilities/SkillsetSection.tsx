import Image from "next/image";
import { FC, memo, useRef } from "react";
import { MotionValue, useScroll, useTransform } from "framer-motion";

import { MusicTool } from "../../types";
import ableton from "../../assets/icons/ableton.png";
import flStudioLogo from "../../assets/icons/fl_studio.png";
import logicProLogo from "../../assets/icons/logic_pro.png";
import SectionWatermark from "../Interfaces/SectionWatermark";
import reaperAWLogo from "../../assets/icons/reaper_audio_workstation.png";

const instruments: string[] = [
  "Piano",
  "Guitalele",
  "Classical Guitar",
  "Bass Guitar",
  "Electric Guitar",
];

const musicGenres: { name: string; description: string }[] = [
  {
    name: "Indian Pop",
    description:
      "Indian pop, also known as Indipop or Hindi pop, originated in India and is sung primarily in Hindi.",
  },
  {
    name: "Bengali",
    description:
      "Bengali music is native to the eastern Indian state of West Bengal and the country of Bangladesh.",
  },
  {
    name: "Hindi",
    description:
      "Hindi music includes classical, folk, and modern popular music which uses traditional Indian instruments.",
  },
  {
    name: "EDM",
    description:
      "Electronic Dance Music is a range of electronic music genres made for clubs, festivals, and concerts.",
  },
  {
    name: "Hip-Hop",
    description:
      "Hip-hop, originated in the United States in the 1970s, is characterized by its use of rap and DJing.",
  },
  {
    name: "Indie Pop",
    description:
      "Indie pop originated in the 1980s and is characterized by the use of unconventional sounds.",
  },
  {
    name: "Lo-Fi",
    description:
      "Lo-fi incorporates elements of nostalgia and introspection that often creates a relaxed and laid-back vibe.",
  },
];

const tools: MusicTool[] = [
  {
    name: "Logic Pro",
    avatar: logicProLogo,
    url: "https://www.apple.com/in/logic-pro/",
  },
  {
    avatar: ableton,
    name: "Ableton Live",
    url: "https://www.ableton.com/en/",
  },
  {
    name: "FL Studio",
    avatar: flStudioLogo,
    url: "https://www.image-line.com/",
  },
  {
    name: "Reaper Digital Audio Workstation",
    avatar: reaperAWLogo,
    url: "https://www.reaper.fm/",
  },
];

const useParallax = (value: MotionValue<number>) => {
  return useTransform(value, [0, 1], ["0%", "60%"]);
};

const SkillsetSection: FC = () => {
  const skillsSectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: skillYProgress } = useScroll({
    axis: "y",
    target: skillsSectionRef,
    offset: ["start end", "end start"],
  });
  const skillY = useParallax(skillYProgress);

  return (
    <div
      ref={skillsSectionRef}
      className="mt-28 w-full h-fit flex flex-col relative"
    >
      <SectionWatermark top={skillY} content={"My Skills"} />
      <div data-reveal>
        <div className="eyebrow">Craft</div>
        <h2 className="section-title">My Skills</h2>
        <p className="section-text">
          {`In today's era of application-based sound engineering and music production,
        I try to incorporate original sounds from physical instruments as much as possible.
        Here are a couple of skills that I possess.`}
        </p>
      </div>
      <h3 data-reveal className="mt-14 sub-head">
        Genres I produce!
      </h3>
      <div className="mt-9 w-full h-fit grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {musicGenres.map((genre) => (
          <div
            data-reveal
            key={genre.name}
            className="glass-card p-5 gap-2 flex flex-col"
          >
            <div className="w-full flex items-center gap-2 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              {genre.name}
            </div>
            <div className="w-full text-sm leading-relaxed text-gray-300">
              {genre.description}
            </div>
          </div>
        ))}
      </div>
      <h3 data-reveal className="mt-14 sub-head">
        Instruments I love!
      </h3>
      <div data-reveal className="mt-9 gap-3 flex flex-wrap">
        {instruments.map((instrument) => (
          <div
            key={instrument}
            className="relative py-2 pl-8 pr-5 rounded-lg border border-red-500/25 bg-red-500/10"
          >
            <span className="absolute left-3 top-1/4 w-1.5 h-1/2 rounded-sm bg-red-500"></span>
            {instrument}
          </div>
        ))}
      </div>
      <h3 id="about-me" data-reveal className="mt-14 sub-head">
        Tools I use!
      </h3>
      <div data-reveal className="mt-9 w-full grid grid-cols-2 sm:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <a
            target="_blank"
            rel="noreferrer"
            href={tool.url}
            key={tool.name}
            title={tool.name}
            className="glass-card h-24 px-5 flex items-center justify-center decoration-transparent transition-colors duration-300 hover:border-red-500/40 hover:bg-white/[0.08]"
          >
            <div className="relative w-full h-12">
              <Image
                layout="fill"
                alt={tool.name}
                objectFit="contain"
                src={tool.avatar}
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default memo(SkillsetSection);
