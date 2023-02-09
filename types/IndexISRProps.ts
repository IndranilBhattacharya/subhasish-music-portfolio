import YTVideoResponse from "./YTVideoResponse";

type IndexISRProps = {
  ytVideos: YTVideoResponse[];
  ytStats: {
    viewCount: number;
    videoCount: number;
    subscriberCount: number;
  };
};

export default IndexISRProps;
