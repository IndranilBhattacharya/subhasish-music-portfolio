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
  GenericAxiosError,
  MousePositionAction,
} from "../../types";
import Cookies from "universal-cookie";
import SpotifyCard from "./SpotifyCard";
import YtCard from "../Interfaces/YtCard";
import YtPlayer from "../Interfaces/YtPlayer";
import ArtistPlatforms from "./ArtistPlatforms";
import SpotifyTrack from "../../types/SpotifyTrack";
import IndexISRProps from "../../types/IndexISRProps";
import SpotifyPlayer from "../Interfaces/SpotifyPlayer";
import YtVideoContent from "../Interfaces/YtVideoContent";
import SectionWatermark from "../Interfaces/SectionWatermark";
import {
  fetchArtistTopTracks,
  generateSpotifyAccessToken,
} from "../../services/spotifyService";

const cookies = new Cookies();

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
  const spotifyTracksRef = useRef<HTMLDivElement>(null);
  const portfolioSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: spotifyScrollYProgress } = useScroll({
    axis: "y",
    target: spotifyTracksRef,
    offset: ["start 0.55", "0.7 start"],
  });

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

  const [spotifyY, setSpotifyY] = useState<number>(0);
  const [spotifyTracks, setSpotifyTracks] = useState<SpotifyTrack[]>([]);
  const [activeSpotifyTrack, setActiveSpotifyTrack] = useState<string>("");

  useEffect(() => {
    spotifyScrollYProgress.onChange((latestSpotifyY) => {
      setSpotifyY(latestSpotifyY);
    });
  }, [setSpotifyY, spotifyScrollYProgress]);

  const setSortedSpotifyTracks = useCallback(
    (tracks: SpotifyTrack[]) => {
      const sortedTracks = tracks.sort((t1, t2) => {
        return (t1?.popularity ?? 0) - (t2?.popularity ?? 0);
      });
      setSpotifyTracks(sortedTracks.slice(0, 9));
      setActiveSpotifyTrack(sortedTracks[0].id);
    },
    [setSpotifyTracks, setActiveSpotifyTrack]
  );

  useEffect(() => {
    const onArtistTopTrackFetch = async () => {
      try {
        const topTracksResponse = await fetchArtistTopTracks();
        setSortedSpotifyTracks([...topTracksResponse.data.tracks]);
      } catch (err) {
        console.log(err);
      }
    };

    const onSpotifyTokenGeneration = async () => {
      try {
        const accessTokenResponse = await generateSpotifyAccessToken();
        cookies.set("_spaToken", accessTokenResponse.data.access_token, {
          secure: true,
        });
        onArtistTopTrackFetch();
      } catch (err) {}
    };

    fetchArtistTopTracks()
      .then((topTracksResponse) => {
        setSortedSpotifyTracks([...topTracksResponse.data.tracks]);
      })
      .catch((err: GenericAxiosError) => {
        const statusCode = err?.response?.data?.error?.status;
        if (statusCode >= 400 && statusCode <= 599) {
          onSpotifyTokenGeneration();
        }
      });
  }, [setSpotifyTracks, setActiveSpotifyTrack, setSortedSpotifyTracks]);

  const onYtVideoCardMouseMoveHandler: MouseEventHandler<HTMLDivElement> =
    useCallback((event) => {
      dispatchMousePosition({ type: "x", value: event.clientX });
      dispatchMousePosition({ type: "y", value: event.clientY });
    }, []);

  const onTrackChangeHandler = useCallback(
    (trackId: string) => {
      setActiveSpotifyTrack(trackId);
    },
    [setActiveSpotifyTrack]
  );

  return (
    <div
      ref={portfolioSectionRef}
      className="mt-32 w-full h-fit flex flex-col relative"
    >
      <SectionWatermark top={myReleasesY} content={"My Releases"} />
      <div className="w-full text-4xl font-bold">My Releases</div>
      <div className="mt-6 text-gray-200 drop-shadow-2xl flex flex-wrap">
        {`You can find my originals on different popular platforms like YouTube, Spotify etc.
        I've also collaborated with various artists to make some great melodies which are linked with my YouTube channel.`}
      </div>
      <div className="mt-10 tracking-wide text-xs text-gray-200 uppercase">
        #Top<span className="text-sm">5</span>
      </div>
      <div className="sub-head w-full text-2xl font-semibold">
        Latest YouTube Songs
      </div>
      <div
        onMouseMove={onYtVideoCardMouseMoveHandler}
        className="mt-7 w-full h-fit grid gap-5 grid-cols-2"
      >
        {ytVideos.map((video) => (
          <YtCard key={video.id} x={mousePosition.x} y={mousePosition.y}>
            <YtPlayer
              embedIFrame={video.player.embedHtml}
              thumbnailsUrl={video.snippet.thumbnails["standard"].url}
            />
            <YtVideoContent video={video} />
          </YtCard>
        ))}
      </div>
      <div className="sub-head mt-14 w-full text-2xl font-semibold">
        Top Tracks on Spotify
      </div>
      <SpotifyPlayer trackId={activeSpotifyTrack} spotifyYProgress={spotifyY} />
      <div
        ref={spotifyTracksRef}
        className="mt-5 w-full h-fit grid gap-5 grid-cols-3"
      >
        {spotifyTracks.map((track) => (
          <SpotifyCard
            track={track}
            key={track.id}
            onClick={onTrackChangeHandler}
          />
        ))}
      </div>
      <div className="sub-head mt-14 w-full text-2xl font-semibold">
        Other Platforms
      </div>
      <div className="mt-6 text-gray-200 flex flex-wrap">
        You can explore my artist channels on several other Music platforms.
        Please have a look!
      </div>
      <ArtistPlatforms />
    </div>
  );
};

export default memo(PortfolioSection);
