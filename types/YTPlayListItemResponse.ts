interface YTPlayListItemResponse {
  id: string;
  etag: string;
  kind: string;
  contentDetails: {
    videoId: string;
    videoPublishedAt: string;
  };
}

export default YTPlayListItemResponse;
