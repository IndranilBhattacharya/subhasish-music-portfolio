import { FC, memo } from "react";
import { motion, Variants } from "framer-motion";

const playerState: Variants = {
  minified: { height: 80 },
  expandaed: { height: 352 },
};

const SpotifyPlayer: FC<{ trackId: string; spotifyYProgress: number }> = ({
  trackId,
  spotifyYProgress,
}) => {
  return (
    <div
      className={`${
        spotifyYProgress > 0 && spotifyYProgress < 1
          ? "fixed top-2 lg:top-[5vh] left-[7.5vw] lg:left-[19.2vw]"
          : ""
      } z-30 mt-8 w-[85vw] ${
        spotifyYProgress > 0 ? "lg:w-[27vw]" : "lg:w-[46.2vw]"
      }`}
    >
      <motion.iframe
        loading="lazy"
        variants={playerState}
        transition={{ duration: 0.3 }}
        title="Spotify Embedded Music Track Player"
        className="w-full rounded-xl shadow-2xl shadow-black"
        animate={spotifyYProgress > 0 ? "minified" : "expandaed"}
        src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      />
    </div>
  );
};

export default memo(SpotifyPlayer);
