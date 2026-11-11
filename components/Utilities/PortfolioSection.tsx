import {
  FC,
  memo,
  useRef,
  useState,
  useEffect,
  useReducer,
  useCallback,
  MouseEventHandler,
} from "react";
import { MotionValue, useScroll, useTransform } from "framer-motion";

import {
  MousePosition,
  MousePositionAction,
} from "../../types";
import YtCard from "../Interfaces/YtCard";
import YtPlayer from "../Interfaces/YtPlayer";
import ArtistPlatforms from "./ArtistPlatforms";
import IndexISRProps from "../../types/IndexISRProps";
import YtVideoContent from "../Interfaces/YtVideoContent";
import SectionWatermark from "../Interfaces/SectionWatermark";

const bgCoordinateReducer = (
  state: MousePosition,
  { type, value }: MousePositionAction
): MousePosition => {
  switch (type) {
    case "x":
      return { ...state, x: value };
    case "y":
      return { ...state, y: value };
    default:
      return state;
  }
};

const useParallax = (value: MotionValue<number>) => {
  return useTransform(value, [0, 1], ["-2%", "50%"]);
};

const PortfolioSection: FC<IndexISRProps> = ({ ytVideos }) => {
  const portfolioSectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: portfolioYProgress } = useScroll({
    axis: "y",
    target: portfolioSectionRef,
    offset: ["start end", "0.7 start"],
  });
  const myReleasesY = useParallax(portfolioYProgress);

  const [mousePosition, dispatchMousePosition] = useReducer(
    bgCoordinateReducer,
    { x: 0, y: 0 }
  );

  const onYtVideoCardMouseMoveHandler: MouseEventHandler<HTMLDivElement> =
    useCallback((event) => {
      dispatchMousePosition({ type: "x", value: event.clientX });
      dispatchMousePosition({ type: "y", value: event.clientY });
    }, []);

  return (
    <div
      ref={portfolioSectionRef}
      className="mt-20 lg:mt-32 w-full h-fit flex flex-col relative"
    >
      <SectionWatermark top={myReleasesY} content={"My Releases"} />
      <div data-reveal>
        <div className="eyebrow">Discography</div>
        <h2 className="section-title">My Releases</h2>
        <p className="section-text">
          {`You can find my originals on different popular platforms like YouTube, Apple Music, Spotify etc.
        I've also collaborated with various artists to make some great melodies which are linked with my YouTube channel.`}
        </p>
      </div>
      <div data-reveal>
        <div className="mt-12 mb-1 tracking-wide text-xs text-red-400 uppercase">
          #Top<span className="text-sm">5</span>
        </div>
        <h3 className="sub-head">Latest YouTube Songs</h3>
      </div>
      <div
        onMouseMove={onYtVideoCardMouseMoveHandler}
        className="mt-8 w-full h-fit grid gap-5 sm:grid-cols-2"
      >
        {ytVideos.map((video) => (
          <YtCard key={video.id} x={mousePosition.x} y={mousePosition.y}>
            <YtPlayer
              embedIFrame={video.player.embedHtml}
              thumbnailsUrl={(
                video.snippet.thumbnails["standard"] ??
                video.snippet.thumbnails["high"]
              ).url}
            />
            <YtVideoContent video={video} />
          </YtCard>
        ))}
      </div>
      <div data-reveal>
        <h3 className="sub-head mt-16">Available On Other Platforms</h3>
        <p className="section-text mt-7">
          You can explore my artist channels on several other Music platforms.
          Please have a look!
        </p>
      </div>
      <ArtistPlatforms />
    </div>
  );
};

export default memo(PortfolioSection);
