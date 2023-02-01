import { FC, memo } from "react";
import { motion, Variants } from "framer-motion";

const playerState: Variants = {
  hidden: { width: "66.5%", height: 80 },
  visible: { width: "100%", height: 352 },
};

const SpotifyPlayer: FC<{ trackId: string; spotifyYProgress: number }> = ({
  trackId,
  spotifyYProgress,
}) => {
  return (
    <div
      className={`${
        spotifyYProgress < 1 ? "sticky" : ""
      } top-[6rem] z-30 mt-8 flex w-full items-center justify-center`}
    >
      <motion.iframe
        width="100%"
        loading="lazy"
        variants={playerState}
        transition={{ duration: 0.3 }}
        className="rounded-xl shadow-2xl shadow-black"
        animate={spotifyYProgress > 0 ? "hidden" : "visible"}
        src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      />
    </div>
  );
};

export default memo(SpotifyPlayer);
