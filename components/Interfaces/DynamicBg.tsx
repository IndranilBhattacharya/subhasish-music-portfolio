import { FC, useRef, memo } from "react";
import { useAnimationFrame } from "framer-motion";

const DynamicBg: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useAnimationFrame((time) => {
    const canvasContext = canvasRef.current?.getContext("2d");
    if (!canvasContext) return;
    
    const speedFactor = time / 1000;
    const canvasWidth = canvasRef?.current?.clientWidth ?? 0;
    const canvasHeight = canvasRef?.current?.clientHeight ?? 0;

    for (let x = 0; x <= 36; x++) {
      for (let y = 0; y <= 36; y++) {
        const dx = x - 18;
        const dy = y - 18;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Organic ripple equations
        const wave1 = Math.sin(dist * 0.4 - speedFactor * 1.5);
        const wave2 = Math.sin(dist * 0.2 - speedFactor * 0.8);
        const combined = ((wave1 + wave2) / 2 + 1) / 2;
        
        const falloff = Math.max(0, 1 - dist / 22);
        const alpha = combined * falloff * 0.095;
        
        // Primary Red (241, 91, 91)
        const r = Math.floor(241 * alpha);
        const g = Math.floor(91 * alpha);
        const b = Math.floor(91 * alpha);

        canvasContext.fillStyle = `rgb(${r}, ${g}, ${b})`;
        canvasContext.fillRect(x, y, canvasWidth, canvasHeight);
      }
    }
  });

  return (
    <canvas
      width={36}
      height={36}
      ref={canvasRef}
      className="w-full h-full bg-black rounded-xl"
    ></canvas>
  );
};

export default memo(DynamicBg);
