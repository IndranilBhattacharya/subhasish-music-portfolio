import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { BsChatRight } from "react-icons/bs";
import { motion, useScroll } from "framer-motion";
import { FC, memo, useEffect, useState } from "react";

import { ToolRoute } from "../../types";
import useWindowSize from "../../hooks/useWindowSize";
import officialLogo from "../../assets/icons/subhasish_logo_s.png";

const toolRoutes: ToolRoute[] = [
  { path: "/", displayName: "Home" },
  { path: "/#my-songs", displayName: "Songs" },
  { path: "/samples-store", displayName: "Samples" },
  { path: "/#about-me", displayName: "About Me" },
];

const ToolBar: FC = () => {
  const route = useRouter();
  const [wScreen, hScreen] = useWindowSize();
  const [globalY, setGlobalY] = useState<number>(0);
  const { scrollYProgress: globalScrollYProgress } = useScroll();

  const toolbarContentDynamicClasses =
    globalY > 0 && !route?.pathname?.includes("samples-store")
      ? "w-[80%] px-[1%] bg-gray-300 rounded-xl bg-opacity-10 shadow-[inset_0_1px_0_0_hsl(0deg_0%_100%_/_5%)_,_inset_0_-1px_0_0_hsl(0deg_0%_100%_/_5%)] backdrop-filter backdrop-blur-2xl"
      : "w-full";

  useEffect(() => {
    globalScrollYProgress.onChange((latestGloablY) => {
      setGlobalY(latestGloablY);
    });
  }, [globalScrollYProgress, setGlobalY]);

  const desktopToolBar = (
    <header className="z-30 fixed top-2 w-[77vw] h-14 flex justify-center">
      <motion.div
        layout
        transition={{ duration: 0.15 }}
        className={`h-full flex items-center justify-between ${toolbarContentDynamicClasses}`}
      >
        <div className="flex items-center w-fit">
          <div className="relative w-8">
            <Image alt="S" objectFit="contain" src={officialLogo} />
          </div>
          <span className="uppercase text-sm font-extrabold">ubhasish</span>
        </div>
        <div className="flex items-center justify-evenly text-lg font-semibold gap-5">
          {toolRoutes.map(({ displayName, path }) => (
            <span
              key={displayName}
              className={`px-5 py-1 rounded hover:bg-white/20 transition ease-in-out duration-150 ${
                route.pathname !== path && "text-white/50"
              }`}
            >
              {path && <Link href={path}>{displayName}</Link>}
            </span>
          ))}
        </div>
        <Link href="/#contact-me">
          <button className="relative inline-flex items-center justify-start px-5 py-1 overflow-hidden font-semibold transition-all bg-white/20 rounded hover:bg-black group">
            <span className="w-48 h-48 rounded rotate-[-40deg] bg-red-500 absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
            <span className="relative w-full text-left transition-colors duration-300 ease-in-out flex gap-2 items-center">
              <BsChatRight /> Hire me
            </span>
          </button>
        </Link>
      </motion.div>
    </header>
  );

  return desktopToolBar;
};

export default memo(ToolBar);
