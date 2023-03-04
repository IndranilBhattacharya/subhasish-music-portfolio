import Image from "next/image";
import { motion } from "framer-motion";
import { FC, memo, useRef, useState, useCallback } from "react";

import { YtPlayerProps } from "../../types";

let animationTimeOut: ReturnType<typeof setTimeout>;

const YtPlayer: FC<YtPlayerProps> = ({ embedIFrame, thumbnailsUrl }) => {
  const playerFrameRef = useRef<HTMLDivElement>(null);
  const [playYtVideo, setPlayYtVideo] = useState<boolean>(false);

  const onPlayVideoHandler = useCallback(() => {
    if (animationTimeOut) {
      clearTimeout(animationTimeOut);
    }
    setPlayYtVideo(true);
    animationTimeOut = setTimeout(() => {
      const iFrameElement = playerFrameRef.current
        ?.firstElementChild as HTMLIFrameElement;
      iFrameElement.src += "?autoplay=1&mute=0&enablejsapi=1";
    }, 1250);
  }, []);

  return (
    <div
      onClick={onPlayVideoHandler}
      className="relative cursor-pointer w-full overflow-hidden aspect-video"
    >
      {playYtVideo && (
        <div
          ref={playerFrameRef}
          className="yt-player-holder"
          dangerouslySetInnerHTML={{ __html: embedIFrame }}
        ></div>
      )}
      <motion.div
        transition={{ duration: 0.75, ease: "easeOut" }}
        animate={playYtVideo ? { y: "-125%" } : { y: 0 }}
        className="absolute top-0 left-0 z-20 w-full aspect-video"
      >
        <Image alt="" layout="fill" objectFit="cover" src={thumbnailsUrl} />
      </motion.div>
    </div>
  );
};

export default memo(YtPlayer);
