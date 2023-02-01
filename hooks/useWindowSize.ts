import { useEffect, useState } from "react";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const onWindowResizeHandler = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", onWindowResizeHandler);
    onWindowResizeHandler();

    return () => window.removeEventListener("resize", onWindowResizeHandler);
  }, [setWindowSize]);
  return windowSize;
};

export default useWindowSize;
