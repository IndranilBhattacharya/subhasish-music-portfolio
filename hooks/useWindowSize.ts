import { useEffect, useState } from "react";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<number[]>([0, 0]);

  useEffect(() => {
    const onWindowResizeHandler = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener("resize", onWindowResizeHandler);
    onWindowResizeHandler();

    return () => window.removeEventListener("resize", onWindowResizeHandler);
  }, [setWindowSize]);
  return windowSize;
};

export default useWindowSize;
