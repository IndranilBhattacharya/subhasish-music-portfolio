type YTChannelStatsResponse = {
  etag: string;
  id: string;
  kind: string;
  statistics: {
    viewCount: string;
    videoCount: string;
    subscriberCount: string;
    hiddenSubscriberCount: boolean;
  };
};

export default YTChannelStatsResponse;
