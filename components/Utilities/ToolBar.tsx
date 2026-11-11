import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { BsChatRight } from "react-icons/bs";
import { motion, useScroll } from "framer-motion";
import { FC, memo, useEffect, useState } from "react";

import routes from "../../constants/app.routes";
import officialLogo from "../../assets/icons/subhasish_logo_s.png";

const ToolBar: FC = () => {
  const route = useRouter();
  const [scrolled, setScrolled] = useState<boolean>(false);
  const { scrollYProgress: globalScrollYProgress } = useScroll();

  useEffect(
    () =>
      globalScrollYProgress.onChange((latestGlobalY) => {
        setScrolled(latestGlobalY > 0);
      }),
    [globalScrollYProgress]
  );

  return (
    <header
      id="tool-top"
      className="container-app h-14 flex lg:z-30 lg:fixed lg:top-3 lg:left-1/2 lg:-translate-x-1/2 lg:justify-center"
    >
      <motion.div
        layout
        transition={{ duration: 0.15 }}
        className={`h-full w-full flex items-center justify-between ${
          scrolled
            ? "lg:w-[88%] lg:px-5 lg:rounded-2xl lg:border lg:border-white/10 lg:bg-black/50 lg:shadow-[0_0.5rem_2rem_rgba(0,0,0,0.5)] lg:backdrop-blur-2xl"
            : ""
        }`}
      >
        <Link href="/#tool-top">
          <a aria-label="Subhasish - Home" className="flex items-center w-fit">
            <span className="relative w-8">
              <Image alt="S" objectFit="contain" src={officialLogo} />
            </span>
            <span className="uppercase text-sm font-extrabold tracking-wide">
              ubhasish
            </span>
          </a>
        </Link>
        <nav className="hidden lg:flex items-center gap-2 font-semibold">
          {routes.map(({ displayName, path }) => {
            const active =
              route.asPath === path ||
              (route.asPath === "/" && displayName === "Home");
            return (
              path && (
                <Link href={path} key={displayName}>
                  <a
                    className={`relative px-4 py-1.5 rounded-lg transition duration-150 ease-in-out hover:bg-white/10 hover:text-white ${
                      active ? "text-white" : "text-white/60"
                    }`}
                  >
                    {displayName}
                    {active && (
                      <span className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-0.5 w-5 rounded-full bg-red-500"></span>
                    )}
                  </a>
                </Link>
              )
            );
          })}
        </nav>
        <Link href="/#contact-me">
          <a
            aria-label="Click to hire me"
            className="relative hidden lg:inline-flex items-center px-5 py-1.5 overflow-hidden font-semibold rounded-lg border border-red-500/50 bg-red-500/10 group"
          >
            <span className="w-48 h-48 rounded rotate-[-40deg] bg-red-600 absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
            <span className="relative flex gap-2 items-center">
              <BsChatRight /> Hire me
            </span>
          </a>
        </Link>
      </motion.div>
    </header>
  );
};

export default memo(ToolBar);
