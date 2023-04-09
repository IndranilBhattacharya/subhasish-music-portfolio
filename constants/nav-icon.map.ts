import { BiUser, BiHomeAlt } from "react-icons/bi";
import { BsChatRight, BsMusicNote, BsSoundwave } from "react-icons/bs";

const navIcon: { [key: string]: any } = {
  Home: BiHomeAlt,
  Songs: BsMusicNote,
  "About Me": BiUser,
  Samples: BsSoundwave,
  "Hire Me": BsChatRight,
};

export default navIcon;
