import Link from "next/link";
import { FC, memo } from "react";
import { useRouter } from "next/router";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

import routes from "../../constants/app.routes";
import navIcon from "../../constants/nav-icon.map";

const BottomNavBar: FC = () => {
  const route = useRouter();

  const bottomNavRoutes = [
    ...routes?.map((r) => ({ ...r })),
    {
      path: "/#contact-me",
      displayName: "Hire Me",
    },
  ];
  const homeNav = bottomNavRoutes.find((r) => r?.displayName === "Home");
  const aboutMeNav = bottomNavRoutes.find((r) => r?.displayName === "About Me");
  if (homeNav) {
    homeNav.path = "/#tool-top";
  }
  if (aboutMeNav) {
    aboutMeNav.path = "/#about";
  }

  // Shown below lg only; CSS-gated so there is no flash on desktop.
  return (
    <nav className="lg:hidden z-[999] fixed left-1/2 -translate-x-1/2 bottom-[max(0.75rem,env(safe-area-inset-bottom))] h-16 w-[92vw] max-w-md rounded-2xl border border-white/10 bg-black/60 shadow-[0_0.5rem_2rem_rgba(0,0,0,0.6)] backdrop-blur-xl">
      <div className="w-full h-full px-2 flex items-center justify-between text-xl">
        {bottomNavRoutes.map(({ displayName, path }) => {
          const active =
            route.asPath === path ||
            (route.asPath === "/" && displayName === "Home");
          const NavIcon = navIcon[displayName];
          return (
            path && (
              <Link href={path} key={displayName}>
                <a
                  aria-label={displayName}
                  data-tooltip-id={displayName}
                  data-tooltip-content={displayName}
                  className={`relative flex-1 h-12 flex items-center justify-center rounded-xl transition ease-in-out duration-150 hover:bg-white/10 ${
                    displayName === "Hire Me" ? "text-red-500" : "text-white"
                  } ${active ? "opacity-100 bg-white/10" : "opacity-60"}`}
                >
                  <Tooltip id={displayName} />
                  <NavIcon />
                </a>
              </Link>
            )
          );
        })}
      </div>
    </nav>
  );
};

export default memo(BottomNavBar);
