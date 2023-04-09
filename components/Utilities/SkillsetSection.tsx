import Image from "next/image";
import { FC, memo, useRef } from "react";
import { MotionValue, useScroll, useTransform } from "framer-motion";

import { MusicTool, SkillItem } from "../../types";
import ableton from "../../assets/icons/ableton.png";
import flStudioLogo from "../../assets/icons/fl_studio.png";
import logicProLogo from "../../assets/icons/logic_pro.png";
import SectionWatermark from "../Interfaces/SectionWatermark";

const instruments: SkillItem[] = [
  { name: "Piano", theme: "bg-violet-500/75", background: "bg-violet-500/20" },
  { name: "Guitalele", theme: "bg-cyan-500/75", background: "bg-cyan-500/20" },
  {
    name: "Classical Guitar",
    theme: "bg-indigo-500/75",
    background: "bg-indigo-500/20",
  },
  {
    name: "Bass Guitar",
    theme: "bg-amber-500/75",
    background: "bg-amber-500/20",
  },
  {
    name: "Electric Guitar",
    theme: "bg-fuchsia-500/75",
    background: "bg-fuchsia-500/20",
  },
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
    widthClass: "w-full lg:w-1/3",
    avatar: logicProLogo,
    url: "https://www.apple.com/in/logic-pro/",
  },
  {
    avatar: ableton,
    widthClass: "w-full lg:w-1/3",
    name: "Ableton Live",
    url: "https://www.ableton.com/en/",
  },
  {
    name: "FL Studio",
    avatar: flStudioLogo,
    widthClass: "w-full lg:w-[10%]",
    url: "https://www.image-line.com/",
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
      <div className="w-full text-4xl font-bold">My Skills</div>
      <div className="mt-6 text-gray-200 flex flex-wrap">
        {`In today's era of application-based sound engineering and music production, 
        I try to incorporate original sounds from physical instruments as much as possible. 
        Here are a couple of skills that I possess.`}
      </div>
      <div className="mt-12 sub-head w-full text-2xl font-semibold">
        Genres I produce!
      </div>
      <div className="mt-9 w-full h-fit grid lg:grid-cols-3 lg:gap-x-5 gap-y-8">
        {musicGenres.map((genre) => (
          <div key={genre.name} className="gap-2 flex flex-col">
            <div className="w-full font-semibold">{genre.name}</div>
            <div className="w-full flex flex-wrap text-sm text-gray-200">
              {genre.description}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 sub-head w-full text-2xl font-semibold">
        Instruments I love!
      </div>
      <div className="mt-9 gap-5 flex flex-col lg:flex-row lg:flex-wrap">
        {instruments.map((instrument) => (
          <div
            key={instrument.name}
            className={`w-fit relative py-2 px-9 rounded-md ${instrument.background} shadow`}
          >
            <span
              className={`absolute left-2 top-[15%] w-2 h-[70%] rounded-sm ${instrument.theme} shadow-md`}
            ></span>
            {instrument.name}
          </div>
        ))}
      </div>
      <div
        id="about-me"
        className="mt-12 sub-head w-full text-2xl font-semibold"
      >
        Tools I use!
      </div>
      <div className="mt-9 flex w-full flex-col lg:flex-row lg:flex-wrap lg:gap-x-14 gap-y-7 items-center justify-items-stretch">
        {tools.map((tool) => (
          <a
            target="_blank"
            rel="noreferrer"
            href={tool.url}
            key={tool.name}
            title={tool.name}
            className={`${tool.widthClass} decoration-transparent`}
          >
            <div className="relative w-full">
              <Image alt="S" objectFit="contain" src={tool.avatar} />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default memo(SkillsetSection);
