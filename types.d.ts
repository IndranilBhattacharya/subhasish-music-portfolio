import { ReactNode } from "react";
import { StaticImageData } from "next/image";
import SpotifyTrack from "./types/SpotifyTrack";
import YTVideoResponse from "./types/YTVideoResponse";
import YTChannelResponse from "./types/YTChannelResponse";
import YTChannelStatsResponse from "./types/YTChannelStatsResponse";
import YTPlayListItemResponse from "./types/YTPlayListItemResponse";

interface FCProps {
  key?: Key;
  className?: string;
  children?: ReactNode;
}

interface ToolRoute {
  path?: string;
  displayName: string;
}

interface SSRProps {
  ytChannelData: any;
}

interface YtStats {
  viewCount: number;
  videoCount: number;
  subscriberCount: number;
}

interface HeroExpRefs extends YtStats {
  youTubeRef: RefObject<HTMLDivElement>;
  aboutMeRef: RefObject<HTMLDivElement>;
  skillSetRef: RefObject<HTMLDivElement>;
}

interface YtSvgPath {
  youTubeSvgLogoFill: string;
  youTubeSvgPathProgress: number;
}

interface YtExpInfo extends YtStats, YtSvgPath {}

interface GenericAxiosResponse {
  config: any;
  headers: any;
  request: any;
  status: number;
  statusText: string;
  data: {
    etag: string;
    kind: string;
    length: number;
    pageInfo: { totalResults: number; resultsPerPage: number };
  };
}

interface GenericAxiosError {
  config: any;
  code: string;
  name: string;
  request: any;
  message: string;
  response: {
    config: any;
    data: { error: { message: string; status: number } };
    headers: any;
    request: any;
    status: number;
    statusText: string;
  };
}

interface YtChannel extends GenericAxiosResponse {
  data: {
    items: YTChannelResponse[];
  };
}

interface YtChannelStats extends GenericAxiosResponse {
  data: {
    items: YTChannelStatsResponse[];
  };
}

interface YtPlayListItem extends GenericAxiosResponse {
  data: {
    items: YTPlayListItemResponse[];
  };
}

interface YtVideo extends GenericAxiosResponse {
  data: {
    items: YTVideoResponse[];
  };
}

interface YtDisplayStat {
  count: string;
  icon: IconType;
  statField: string;
}

interface YtPlayerProps {
  embedIFrame: string;
  thumbnailsUrl: string;
}

interface MousePosition {
  x: number;
  y: number;
}

interface MousePositionAction {
  type: string;
  value: number;
}

interface SpotifyToken extends GenericAxiosResponse {
  data: {
    expires_in: number;
    token_type: string;
    access_token: string;
  };
}

interface SpotifyTrackResponse extends GenericAxiosResponse {
  data: {
    tracks: SpotifyTrack[];
  };
}

interface MusicPlatform {
  url: string;
  name: string;
  widthClass: string;
  avatar: StaticImageData;
}

interface MusicTool extends MusicPlatform {}

interface SkillItem {
  name: string;
  theme: string;
  background: string;
}
