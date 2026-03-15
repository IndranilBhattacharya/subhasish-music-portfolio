import { FC, memo } from "react";
import { motion, Variants } from "framer-motion";

const playerState: Variants = {
  minified: { scale: 0.75, y: "2vh", x: "-3vw" },
  expanded: { scale: 1, y: 0, x: 0 },
};

const SpotifyPlayer: FC<{ trackId: string; spotifyYProgress: number }> = ({
  trackId,
  spotifyYProgress,
}) => {
  const isFloating = spotifyYProgress > 0 && spotifyYProgress < 1;

  return (
    <div className="z-30 mt-8 w-full h-[352px] relative origin-top perspective-1000">
      <motion.div
        initial={false}
        animate={isFloating ? "minified" : "expanded"}
        variants={playerState}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} 
        className={`origin-top-left lg:origin-top rounded-xl shadow-2xl shadow-black transform-gpu will-change-transform ${
          isFloating
            ? "fixed top-2 lg:top-[5vh] left-[7.5vw] lg:left-[19.2vw] z-50 w-[85vw] lg:w-[46.2vw]"
            : "absolute top-0 left-0 w-[85vw] lg:w-[46.2vw]"
        }`}
      >
        <iframe
          loading="lazy"
          title="Spotify Embedded Music Track Player"
          className="w-full h-[352px] block"
          src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator`}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        />
      </motion.div>
    </div>
  );
};

export default memo(SpotifyPlayer);
