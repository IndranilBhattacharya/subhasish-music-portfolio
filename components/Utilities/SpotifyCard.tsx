import { FC, memo } from "react";
import Image from "next/image";
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
      className="group spotify-card cursor-pointer"
    >
      <div className="relative w-full aspect-square rounded-xl overflow-hidden">
        <Image
          alt=""
          layout="fill"
          objectFit="cover"
          src={track.album.images?.[0]?.url ?? ""}
        />
      </div>
      <button className="p-3.5 flex absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 shadow-lg rounded-full justify-center items-center bg-white text-black scale-0 transition duration-300 group-hover:scale-100">
        <FaPlay size={20} />
      </button>
    </div>
  );
};

export default memo(SpotifyCard);
