import { FC, memo, useState, useCallback, MouseEventHandler } from "react";

let interval: NodeJS.Timer;
const alphabets = "abcdefghijklmnopqrstuvwxyz";

const HackerEffect: FC<{ text: string }> = ({ text }) => {
  const [displayText, setDisplayText] = useState<string>(text?.toLowerCase());

  const onMouseHoverHandler: MouseEventHandler<HTMLDivElement> = useCallback(
    (_) => {
      if (!text) {
        return;
      }
      if (interval) {
        clearInterval(interval);
      }
      let iteration = 0;
      interval = setInterval(() => {
        const interText = [...text.toLowerCase()]
          .map((_, index) => {
            if (index < iteration) {
              return text[index];
            }
            return [...alphabets][Math.floor(Math.random() * 26)];
          })
          .join("");
        setDisplayText(interText);
        if (iteration >= text?.length) {
          clearInterval(interval);
        }
        iteration += 1 / 2;
      }, 25);
    },
    [text]
  );

  return (
    <div className="text-3xl font-semibold" onMouseOver={onMouseHoverHandler}>
      {displayText}
    </div>
  );
};

export default memo(HackerEffect);
