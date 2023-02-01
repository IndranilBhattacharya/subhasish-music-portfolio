import { FC, useCallback, useRef, memo } from "react";
import { useAnimationFrame } from "framer-motion";

const DynamicBg: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getRed = useCallback((x: number, y: number, t: number): number => {
    return Math.floor(192 + 64 * Math.cos((x * x - y * y) / 300 + t));
  }, []);

  const getGreen = useCallback((x: number, y: number, t: number): number => {
    return Math.floor(
      192 +
        64 * Math.sin((x * x * Math.cos(t / 4) + y * y * Math.sin(t / 3)) / 300)
    );
  }, []);

  const getBlue = useCallback((x: number, y: number, t: number): number => {
    return Math.floor(
      192 +
        64 *
          Math.sin(
            5 * Math.sin(t / 9) +
              ((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100
          )
    );
  }, []);

  useAnimationFrame((time, _) => {
    const canvasContext = canvasRef.current?.getContext("2d");
    if (!canvasContext) {
      return;
    }
    const speedFactor = time / 1000;
    const canvasWidth = canvasRef?.current?.clientWidth ?? 0;
    const canvasHeight = canvasRef?.current?.clientHeight ?? 0;

    for (let x = 0; x <= 35; x++) {
      for (let y = 0; y <= 35; y++) {
        const r = getRed(x, y, speedFactor);
        const g = getGreen(x, y, speedFactor);
        const b = getBlue(x, y, speedFactor);
        canvasContext.fillStyle = `rgb(${r}, ${g}, ${b})`;
        canvasContext?.fillRect(x, y, canvasWidth, canvasHeight);
      }
    }
  });

  return (
    <canvas
      width={32}
      height={32}
      ref={canvasRef}
      className="w-full h-full"
    ></canvas>
  );
};

export default memo(DynamicBg);
