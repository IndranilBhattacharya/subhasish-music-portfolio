import { FC, memo, useRef, useState, useEffect, useCallback } from "react";

const alphabets = "abcdefghijklmnopqrstuvwxyz";

/**
 * Scrambles the text on hover, then resolves it left to right.
 * Rendered in a monospace font so scrambled letters keep the exact width of
 * the final text: no reflow or wrapping while it animates.
 */
const HackerEffect: FC<{ text: string }> = ({ text }) => {
  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const [displayText, setDisplayText] = useState<string>(text?.toLowerCase());

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const onMouseEnterHandler = useCallback(() => {
    if (!text) {
      return;
    }
    clearInterval(intervalRef.current);
    let iteration = 0;
    intervalRef.current = setInterval(() => {
      setDisplayText(
        [...text.toLowerCase()]
          .map((char, index) =>
            index < iteration
              ? char
              : alphabets[Math.floor(Math.random() * alphabets.length)]
          )
          .join("")
      );
      if (iteration >= text.length) {
        clearInterval(intervalRef.current);
      }
      iteration += 1 / 2;
    }, 25);
  }, [text]);

  return (
    <span
      aria-label={text}
      onMouseEnter={onMouseEnterHandler}
      className="font-mono font-bold text-[clamp(0.8rem,3.5vw,1.6rem)]"
    >
      <span aria-hidden>{displayText}</span>
    </span>
  );
};

export default memo(HackerEffect);
