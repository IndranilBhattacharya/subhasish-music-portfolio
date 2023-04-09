import Link from "next/link";
import { FC, memo } from "react";
import { useRouter } from "next/router";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

import routes from "../../constants/app.routes";
import navIcon from "../../constants/nav-icon.map";
import useWindowSize from "../../hooks/useWindowSize";

const BottomNavBar: FC = () => {
  const route = useRouter();
  const [wScreen, _] = useWindowSize();

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

  const bottomNavbar = (
    <footer className="z-[999] fixed left-[5%] bottom-0 h-[14vmin] w-[90%] bg-gray-300 rounded-t-xl bg-opacity-10 shadow-[inset_0_1px_0_0_hsl(0deg_0%_100%_/_5%)] backdrop-filter backdrop-blur-xl">
      <div className="w-full h-full px-[2%] flex items-center justify-between text-lg font-semibold">
        {bottomNavRoutes.map(({ displayName, path }) => (
          <span
            key={displayName}
            data-tooltip-id={displayName}
            data-tooltip-content={displayName}
            className={`px-[3vw] py-[3vw] cursor-pointer  rounded hover:bg-white/20 transition ease-in-out duration-150 
            ${displayName === "Hire Me" ? "text-red-600" : "text-white"} 
            ${
              route.asPath === path ||
              (route.asPath === "/" && displayName === "Home")
                ? "opacity-100"
                : "opacity-60"
            }`}
          >
            <Tooltip id={displayName} />
            {path && <Link href={path}>{navIcon[displayName]()}</Link>}
          </span>
        ))}
      </div>
    </footer>
  );

  return wScreen < 1024 ? bottomNavbar : <></>;
};

export default memo(BottomNavBar);
