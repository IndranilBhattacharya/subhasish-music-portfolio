import Image from "next/image";
import { FC, memo } from "react";
import { FaPlay } from "react-icons/fa";
import SpotifyTrack from "../../types/SpotifyTrack";

const SpotifyCard: FC<{
  track: SpotifyTrack;
  onClick: (id: string) => void;
}> = ({ track, onClick }) => {
  return (
    <div
      key={track.id}
      onClick={onClick.bind(null, track.id)}
      className="group spotify-card cursor-pointer transform-gpu transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.04] hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)] rounded-xl"
    >
      <div className="relative w-full aspect-square rounded-xl overflow-hidden">
        <Image
          alt=""
          layout="fill"
          objectFit="cover"
          src={track.album.images?.[0]?.url ?? ""}
        />
      </div>
      <button
        aria-label="Play Spotify Music"
        className="p-3.5 flex absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 shadow-lg rounded-full justify-center items-center bg-white text-black scale-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100"
      >
        <FaPlay size={20} />
      </button>
    </div>
  );
};

export default memo(SpotifyCard);
