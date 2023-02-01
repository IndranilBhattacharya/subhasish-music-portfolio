import { memo, FC } from "react";
import Image from "next/image";
import { MusicPlatform } from "../../types";
import ressoLogo from "../../assets/icons/resso.png";
import tidalLogo from "../../assets/icons/tidal.png";
import saavnLogo from "../../assets/icons/jio_saavn.png";
import ytMusicLogo from "../../assets/icons/yt_music.png";
import appleMusicLogo from "../../assets/icons/apple_music.svg";
import amazonMusicLogo from "../../assets/icons/amazon_music_logo.svg";

const musicPlatforms: MusicPlatform[] = [
  {
    widthClass: "w-1/3",
    avatar: ytMusicLogo,
    name: "YouTube Music",
    url: "https://music.youtube.com/channel/UCCMS9vppuOXgHcRHdBXIg5A",
  },
  {
    widthClass: "w-1/3",
    name: "Amazon Music",
    avatar: amazonMusicLogo,
    url: "https://music.amazon.in/artists/B009MYEWKO/subhasish",
  },
  {
    name: "Resso",
    avatar: ressoLogo,
    widthClass: "w-[10%]",
    url: "https://www.resso.com/artist/6570669085112162305",
  },
  {
    widthClass: "w-[10%]",
    name: "Apple Music",
    avatar: appleMusicLogo,
    url: "https://music.apple.com/us/artist/subhasish/1635044981",
  },
  {
    name: "Jio Saavn",
    avatar: saavnLogo,
    widthClass: "w-1/3",
    url: "https://www.jiosaavn.com/artist/subhasish/4aa5jKT6-Ms_",
  },
  {
    name: "Tidal",
    avatar: tidalLogo,
    widthClass: "w-1/3",
    url: "https://tidal.com/browse/artist/9744421",
  },
];

const ArtistPlatforms: FC = () => {
  return (
    <div className="mt-8 gap-x-14 gap-y-7 flex w-full flex-wrap items-center justify-items-stretch">
      {musicPlatforms.map((platform) => (
        <a
          target="_blank"
          rel="noreferrer"
          href={platform.url}
          key={platform.name}
          title={platform.name}
          className={`${platform.widthClass} decoration-transparent`}
        >
          <div className="relative w-full">
            <Image alt="S" objectFit="contain" src={platform.avatar} />
          </div>
        </a>
      ))}
    </div>
  );
};

export default memo(ArtistPlatforms);
