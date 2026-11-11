import { FC, memo } from "react";
import { RiFacebookFill } from "react-icons/ri";
import { SiMinutemailer } from "react-icons/si";
import { BsWhatsapp, BsInstagram } from "react-icons/bs";

import SocialMedia from "../../types/SocialMedia";
import HackerEffect from "../Interfaces/HackerEffect";
import classes from "../../styles/ContactMeSection.module.css";

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
      className="container-app relative flex flex-col scroll-mt-24"
    >
      <div data-reveal>
        <div className="eyebrow">Contact</div>
        <h2 className="section-title">{`Let's talk business!`}</h2>
        <p className="section-text">
          {`If you're looking for someone to produce or compose songs/music for your project, I'm here to help! I have experience working on a variety of genres and I'm passionate about creating unique and engaging music. Feel free to reach out to me to discuss your project and see how we can work together. Looking forward to connecting with you!`}
        </p>
      </div>
      <div data-reveal className="mt-10 w-full grid lg:grid-cols-2 gap-5">
        <div className="glass-card min-w-0 p-5 sm:p-8 flex flex-col justify-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <SiMinutemailer className="text-red-500" />
            <span>Please click below to drop an email</span>
          </div>
          <div>
            <a
              target="_blank"
              rel="noreferrer"
              className={classes["official-mail-link"]}
              href={`mailto:subhasishmusic.business@gmail.com`}
            >
              <HackerEffect text="subhasishmusic.business@gmail.com" />
            </a>
          </div>
        </div>
        <div className="glass-card min-w-0 p-5 sm:p-8 flex flex-col gap-6">
          <p className="text-gray-300">
            {`And also, if you're on WhatsApp, Facebook or Instagram, let's connect there too!`}
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-5">
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
                <span>{p.platformName}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-12 pt-6 w-full border-t border-white/10 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Subhasish Music. All rights reserved.
      </div>
    </div>
  );
};

export default memo(ContactMeSection);
