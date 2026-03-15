import { memo, FC } from "react";
import Image from "next/image";
import { FaSpotify } from "react-icons/fa";
import ressoLogo from "../../assets/icons/resso.png";
import tidalLogo from "../../assets/icons/tidal.png";
import saavnLogo from "../../assets/icons/jio_saavn.png";
import ytMusicLogo from "../../assets/icons/yt_music.png";
import appleMusicLogo from "../../assets/icons/apple_music.svg";
import amazonMusicLogo from "../../assets/icons/amazon_music_logo.svg";

const musicPlatforms = [
  {
    name: "Spotify",
    icon: <FaSpotify size={48} className="text-[#1DB954] drop-shadow-lg" />,
    url: "https://open.spotify.com/artist/4oDS347Lo7aB5SPu5wTXsH?si=HolmQwViRe2RuEdC4eVhOw",
  },
  {
    name: "YouTube Music",
    avatar: ytMusicLogo,
    url: "https://music.youtube.com/channel/UCCMS9vppuOXgHcRHdBXIg5A",
  },
  {
    name: "Amazon Music",
    avatar: amazonMusicLogo,
    url: "https://music.amazon.in/artists/B009MYEWKO/subhasish",
  },
  {
    name: "Jio Saavn",
    avatar: saavnLogo,
    url: "https://www.jiosaavn.com/artist/subhasish/4aa5jKT6-Ms_",
  },
  {
    name: "Resso",
    avatar: ressoLogo,
    url: "https://www.resso.com/artist/6570669085112162305",
  },
  {
    name: "Tidal",
    avatar: tidalLogo,
    url: "https://tidal.com/browse/artist/9744421",
  },
];

const ArtistPlatforms: FC = () => {
  return (
    <div className="mt-8 flex flex-col w-full gap-y-7">
      {/* Apple Music Marketing Highlight */}
      <a
        target="_blank"
        rel="noreferrer"
        href="https://music.apple.com/us/artist/subhasish/1635044981"
        className="group relative w-full h-[25vh] lg:h-[35vh] flex items-center justify-center overflow-hidden rounded-3xl transform-gpu transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(250,36,60,0.3)] bg-gradient-to-br from-[#fa243c]/10 to-transparent border border-[#fa243c]/20"
      >
        <div className="absolute inset-0 bg-[#fa243c] opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
        <div className="z-10 flex flex-col items-center gap-6">
          <div className="relative w-48 lg:w-72 h-16 lg:h-24 filter drop-shadow-[0_0_15px_rgba(250,36,60,0.5)]">
            <Image alt="Apple Music" layout="fill" objectFit="contain" src={appleMusicLogo} />
          </div>
          <span className="text-white/80 font-bold text-lg lg:text-2xl tracking-wide group-hover:text-white transition-colors duration-500">
            Listen on Apple Music
          </span>
        </div>
      </a>

      {/* Other Platforms Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 w-full">
        {musicPlatforms.map((platform) => (
          <a
            target="_blank"
            rel="noreferrer"
            href={platform.url}
            key={platform.name}
            title={platform.name}
            className="group relative flex flex-col items-center justify-center p-6 h-36 rounded-2xl bg-white/5 border border-white/10 transform-gpu transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.05] hover:bg-white/10 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          >
            {platform.icon ? (
              platform.icon
            ) : (
              <div className="relative w-full h-12 flex justify-center object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                <Image alt={platform.name} layout="fill" objectFit="contain" src={platform.avatar} />
              </div>
            )}
            <span className="mt-5 text-sm font-semibold text-gray-400 group-hover:text-white transition-colors duration-300">
              {platform.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default memo(ArtistPlatforms);
