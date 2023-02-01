import youTubeAxios from "../config/youTubeAxios";
import { YtChannel, YtChannelStats, YtPlayListItem, YtVideo } from "../types";

const fetchYTChannelStats = async (): Promise<YtChannelStats> => {
  return youTubeAxios.get<any, YtChannelStats>("channels", {
    params: {
      part: "statistics",
      id: process.env.NEXT_PUBLIC_YT_CHANNEL_ID,
    },
  });
};

const fetchYTVideoContent = async (videoIds: string): Promise<YtVideo> => {
  return youTubeAxios.get<any, YtVideo>(
    "videos?part=snippet&part=contentDetails&part=player",
    {
      params: {
        id: videoIds,
      },
    }
  );
};

const fetchYTChannelContent = async (): Promise<YtChannel> => {
  return youTubeAxios.get<any, YtChannel>(
    "channels?part=snippet&part=contentDetails",
    {
      params: {
        id: process.env.NEXT_PUBLIC_YT_CHANNEL_ID,
      },
    }
  );
};

const fetchYTChannelPlayListItems = async (
  playlistId: string
): Promise<YtPlayListItem> => {
  return youTubeAxios.get<any, YtPlayListItem>("playlistItems", {
    params: {
      playlistId,
      part: "contentDetails",
    },
  });
};

export {
  fetchYTChannelStats,
  fetchYTVideoContent,
  fetchYTChannelContent,
  fetchYTChannelPlayListItems,
};
