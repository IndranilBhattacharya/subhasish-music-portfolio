import { BiTime } from "react-icons/bi";
import { ImLink } from "react-icons/im";
import { FC, memo, useCallback } from "react";
import { GrUploadOption } from "react-icons/gr";
import YTVideoResponse from "../../types/YTVideoResponse";

const YtVideoContent: FC<{ video: YTVideoResponse }> = ({ video }) => {
  const getPublishDate = useCallback((videoPublishDate: string) => {
    const dateObj = new Date(videoPublishDate);
    const dateStr = dateObj.toLocaleDateString("en-US", {
      dateStyle: "long",
    });
    return dateStr;
  }, []);

  const getDuration = useCallback((isoDuration: string): string => {
    if (!isoDuration) return "0:00";
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i);
    if (!match) return "0:00";
    
    const hours = parseInt(match[1] || "0", 10);
    const minutes = parseInt(match[2] || "0", 10);
    const seconds = parseInt(match[3] || "0", 10);
    
    const formatOption = {
      minimumIntegerDigits: 2,
      useGrouping: false,
    };
    
    const secondsStr = seconds.toLocaleString("en-US", formatOption);
    if (hours > 0) {
      const minutesStr = minutes.toLocaleString("en-US", formatOption);
      return `${hours}:${minutesStr}:${secondsStr}`;
    }
    return `${minutes}:${secondsStr}`;
  }, []);
  return (
    <>
      <div className="flex flex-col gap-1 px-5 pt-4 pb-12">
        <div className="w-full truncate text-xl" title={video.snippet.title}>
          {video.snippet.title}
        </div>
        <div className="flex items-start gap-8 w-full text-gray-400">
          <span className="flex gap-1 items-center">
            <GrUploadOption className="fill-gray-400" />
            {getPublishDate(video.snippet.publishedAt)}
          </span>
          <span className="flex gap-1 items-center">
            <BiTime /> {getDuration(video.contentDetails.duration)}
          </span>
        </div>
      </div>
      <div className="px-5 pb-6">
        <span className="w-fit flex gap-2 items-center">
          <ImLink className="fill-red-500" />
          <a
            target="_blank"
            rel="noreferrer"
            className="external-link"
            href={`https://www.youtube.com/watch?v=${video.id}`}
          >
            Listen on YouTube
          </a>
        </span>
      </div>
    </>
  );
};

export default memo(YtVideoContent);
