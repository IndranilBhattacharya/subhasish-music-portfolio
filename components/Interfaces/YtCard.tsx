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
      className="glass-card yt-card bg-slate-50 bg-opacity-5 flex flex-col h-fit transform-gpu transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] rounded-2xl overflow-hidden"
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
