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
      className="glass-card yt-card flex flex-col h-full transform-gpu transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-red-500/40 hover:shadow-[0_1.25rem_2.5rem_rgba(0,0,0,0.5)]"
      style={{
        background: `radial-gradient(
        30rem circle at ${localX}px ${localY}px,
        rgba(239, 68, 68, 0.16),
        transparent 95%
      )`,
      }}
    >
      {children}
    </div>
  );
};

export default memo(YtCard);
