import Image from "next/image";
import { FC, memo } from "react";
import { SiMinutemailer } from "react-icons/si";

import HackerEffect from "../Interfaces/HackerEffect";
import calledOutArrowToEmail from "../../assets/icons/arrow.svg";
import SocialHandleLinkSvg from "../Interfaces/SocialHandleLinkSvg";

const ContactMeSection: FC = () => {
  return (
    <div className="w-[77vw] relative flex flex-col">
      <div className="w-full text-4xl font-bold">{`Let's talk business!`}</div>
      <div className="mt-6 text-gray-300 text-sm drop-shadow-2xl flex flex-wrap">
        {`If you're looking for someone to produce or compose songs/music for your project, I'm here to help! I have experience working on a variety of genres and I'm passionate about creating unique and engaging music. Feel free to reach out to me to discuss your project and see how we can work together. Looking forward to connecting with you!`}
      </div>
      <div className="mt-10 flex w-full">
        <div className="w-1/2 relative flex flex-col">
          <a
            target="_blank"
            rel="noreferrer"
            className="external-link w-fit"
            href={`mailto:subhasishmusic.business@gmail.com`}
          >
            <HackerEffect text="subhasishmusic.business@gmail.com" />
          </a>

          <div className="absolute top-14 right-[40%]">
            <div className="relative w-16 rotate-6">
              <Image alt="" objectFit="contain" src={calledOutArrowToEmail} />
              <div className="gap-2 flex items-center text-gray-400 -rotate-6 w-max absolute -bottom-[5%] left-full">
                <SiMinutemailer /> <span>Please drop an email here </span>
              </div>
            </div>
          </div>
        </div>
        <div className="pl-4 w-1/2 flex flex-col">
          <div className="pt-2 text-gray-300 text-sm drop-shadow-2xl flex flex-wrap">
            {`And also, if you're on WhatsApp, Facebook or Instagram, let's connect there too!`}
          </div>
          <div className="mt-3 flex w-full">
            <SocialHandleLinkSvg />
            <div className="flex flex-col"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ContactMeSection);
