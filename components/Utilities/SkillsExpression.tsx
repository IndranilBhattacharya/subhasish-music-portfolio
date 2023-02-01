import { FC, memo } from "react";
import InstrumentSvg from "../Interfaces/InstrumentSvg";

const SkillsExpression: FC<{ pathProgress: number }> = ({ pathProgress }) => {
  return (
    <div className="w-full flex justify-center">
      <InstrumentSvg pathProgress={pathProgress} />
    </div>
  );
};

export default memo(SkillsExpression);
