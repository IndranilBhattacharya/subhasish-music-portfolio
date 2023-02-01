import { FC, memo, useEffect, useRef, useState } from "react";
import { FCProps } from "../../types";

interface CardProps extends FCProps {
  x: number;
  y: number;
}

const YtCard: FC<CardProps> = ({ x, y, children }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [localX, setLocalX] = useState<number>(0);
  const [localY, setLocalY] = useState<number>(0);

  useEffect(() => {
    const cardRectBoundary = cardRef.current?.getBoundingClientRect();
    setLocalX(x - (cardRectBoundary?.left ?? 0));
    setLocalY(y - (cardRectBoundary?.top ?? 0));
  }, [x, y, setLocalX, setLocalY]);

  return (
    <div
      ref={cardRef}
      className="glass-card yt-card bg-slate-50 bg-opacity-5 flex flex-col h-fit"
      style={{
        background: `radial-gradient(
        30rem circle at ${localX}px ${localY}px,
        rgba(225, 115, 115, 0.17),
        transparent 95%
      )`,
      }}
    >
      {children}
    </div>
  );
};

export default memo(YtCard);
