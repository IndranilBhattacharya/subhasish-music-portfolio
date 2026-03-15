import Image from "next/image";
import { FC, memo } from "react";
import { RiFacebookFill } from "react-icons/ri";
import { SiMinutemailer } from "react-icons/si";
import { BsWhatsapp, BsInstagram } from "react-icons/bs";

import SocialMedia from "../../types/SocialMedia";
import HackerEffect from "../Interfaces/HackerEffect";
import classes from "../../styles/ContactMeSection.module.css";
import calledOutArrowToEmail from "../../assets/icons/arrow.svg";
import SocialHandleLinkSvg from "../Interfaces/SocialHandleLinkSvg";

const socialPlaforms: SocialMedia[] = [
  {
    logo: BsWhatsapp,
    bgClass: "whatsapp",
    platformName: "WhatsApp",
    referenceLink: "https://wa.me/917001075627",
  },
  {
    logo: RiFacebookFill,
    bgClass: "facebook",
    platformName: "Facebook",
    referenceLink: "https://m.facebook.com/subhasishmusic",
  },
  {
    logo: BsInstagram,
    bgClass: "instagram",
    platformName: "Instagram",
    referenceLink: "https://www.instagram.com/subhasishmusic/",
  },
];

const ContactMeSection: FC = () => {
  return (
    <div
      id="contact-me"
      className="w-[85vw] lg:w-[77vw] 2k:w-[65vw] max-w-[2000px] relative flex flex-col mb-10"
    >
      <div className="w-full text-4xl font-bold">{`Let's talk business!`}</div>
      <div className="mt-6 text-gray-300 drop-shadow-2xl flex flex-wrap">
        {`If you're looking for someone to produce or compose songs/music for your project, I'm here to help! I have experience working on a variety of genres and I'm passionate about creating unique and engaging music. Feel free to reach out to me to discuss your project and see how we can work together. Looking forward to connecting with you!`}
      </div>
      <div className="mt-10 flex flex-col lg:flex-row w-full">
        <div className="w-full lg:w-1/2 pb-[23vh] lg:pb-0 relative flex flex-col">
          <a
            target="_blank"
            rel="noreferrer"
            className={`${classes["official-mail-link"]} group inline-block max-w-[85vw] lg:max-w-[35vw] 4k:max-w-full`}
            href={`mailto:subhasishmusic.business@gmail.com`}
          >
            <div className="max-w-full overflow-hidden text-ellipsis break-all whitespace-normal lg:whitespace-nowrap transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] origin-left">
              <HackerEffect text="subhasishmusic.business@gmail.com" />
            </div>
          </a>

          <div className="hidden lg:block absolute top-[4rem] left-[1rem]">
            <div className="relative w-16 rotate-6 z-10">
              <Image alt="" objectFit="contain" src={calledOutArrowToEmail} />
              <div className="text-sm lg:text-base gap-2 flex items-center text-gray-400 -rotate-6 w-max absolute lg:-bottom-[5%] -left-[10%] lg:left-full">
                <SiMinutemailer />
                <span>Please click here to drop an email </span>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:pl-4 w-full lg:w-1/2 flex flex-col">
          <div className="pt-2 text-gray-300 drop-shadow-2xl flex flex-wrap">
            {`And also, if you're on WhatsApp, Facebook or Instagram, let's connect there too!`}
          </div>
          <div className="mt-3 flex w-full">
            <SocialHandleLinkSvg />
            <div className="mt-8 ml-4 flex flex-col justify-evenly">
              {socialPlaforms.map((p) => (
                <a
                  target="_blank"
                  rel="noreferrer"
                  key={p.platformName}
                  href={p.referenceLink}
                  className={classes["social-link"]}
                >
                  <div
                    className={`${classes[p.bgClass]} ${
                      classes["social-media"]
                    }`}
                  >
                    <div className={classes["icon"]}>{<p.logo />}</div>
                  </div>
                  <span className="z-[55]">{p.platformName}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ContactMeSection);
