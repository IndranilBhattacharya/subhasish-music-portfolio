import Image from "next/image";
import { FC, memo } from "react";

import calledOutArrowToEmail from "../../assets/icons/arrow.svg";

const ContactMeSection: FC = () => {
  return (
    <div className="w-[77vw] relative flex flex-col">
      <div className="w-full text-4xl font-bold">Lets talk business!</div>
      <div className="mt-6 text-gray-200 drop-shadow-2xl flex flex-wrap">
        {`If you're looking for someone to produce or compose songs/music for your project, I'm here to help! I have experience working on a variety of genres and I'm passionate about creating unique and engaging music. Feel free to reach out to me to discuss your project and see how we can work together. Looking forward to connecting with you!`}
      </div>
      <div className="w-1/2 relative flex flex-col">
        <div className="text-7xl font-bold">
          subhasishmusic.business@gmail.com
        </div>
        <div className="absolute flex flex-col items-end">
          <div className="relative w-8">
            <Image alt="" objectFit="contain" src={calledOutArrowToEmail} />
          </div>
          <div className="text-gray-400">Please drop an email</div>
        </div>
      </div>
      <div className="w-1/2"></div>
    </div>
  );
};

export default memo(ContactMeSection);
