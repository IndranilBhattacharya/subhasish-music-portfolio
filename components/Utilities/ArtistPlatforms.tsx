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
    icon: <FaSpotify className="w-12 h-12 text-[#1DB954] drop-shadow-lg" />,
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
    <div data-reveal className="mt-8 flex flex-col w-full gap-5">
      {/* Apple Music Marketing Highlight */}
      <a
        target="_blank"
        rel="noreferrer"
        href="https://music.apple.com/us/artist/subhasish/1635044981"
        className="group relative w-full min-h-[11rem] lg:min-h-[15rem] py-8 flex items-center justify-center overflow-hidden rounded-2xl transform-gpu transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_1.25rem_3rem_rgba(250,36,60,0.3)] bg-gradient-to-br from-[#fa243c]/20 via-[#fa243c]/5 to-transparent border border-[#fa243c]/25"
      >
        <div className="absolute inset-0 bg-[#fa243c] opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
        <div className="z-10 flex flex-col items-center gap-5">
          <div className="relative w-44 lg:w-64 h-14 lg:h-20 filter drop-shadow-[0_0_15px_rgba(250,36,60,0.5)]">
            <Image alt="Apple Music" layout="fill" objectFit="contain" src={appleMusicLogo} />
          </div>
          <span className="text-white/80 font-bold text-lg lg:text-2xl tracking-wide group-hover:text-white transition-colors duration-500">
            Listen on Apple Music
          </span>
        </div>
      </a>

      {/* Other Platforms Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-5 w-full">
        {musicPlatforms.map((platform) => (
          <a
            target="_blank"
            rel="noreferrer"
            href={platform.url}
            key={platform.name}
            title={platform.name}
            className="group relative flex flex-col items-center justify-center p-5 h-36 rounded-2xl bg-white/[0.04] border border-white/10 transform-gpu transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-red-500/40 hover:bg-white/[0.08] hover:shadow-[0_0.75rem_2rem_rgba(0,0,0,0.5)]"
          >
            {platform.icon ? (
              platform.icon
            ) : (
              <div className="relative w-full h-12 flex justify-center object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                <Image alt={platform.name} layout="fill" objectFit="contain" src={platform.avatar} />
              </div>
            )}
            <span className="mt-4 text-sm text-center font-semibold text-gray-400 group-hover:text-white transition-colors duration-300">
              {platform.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default memo(ArtistPlatforms);
