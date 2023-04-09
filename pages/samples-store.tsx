import { memo } from "react";
import Head from "next/head";
import { NextPage } from "next";
import { motion } from "framer-motion";
import { Player, Controls } from "@lottiefiles/react-lottie-player";

import useWindowSize from "../hooks/useWindowSize";
import ToolBar from "../components/Utilities/ToolBar";
import classes from "../styles/SampleStore.module.css";
import BottomNavBar from "../components/Utilities/BottomNavBar";
import SpaceBoyDeveloper from "../assets/jsons/space-boy-developer.json";

const sampleStorePageAnimationStates = {
  initial: { opacity: 0 },
  stable: { opacity: 1 },
  exit: { opacity: 0 },
};

const SamplesStore: NextPage = () => {
  const [wScreen, hScreen] = useWindowSize();

  return (
    <motion.div
      exit="exit"
      animate="stable"
      initial="initial"
      variants={sampleStorePageAnimationStates}
      className="relative overflow-hidden w-[calc(100vw_-_0.5rem)] min-h-screen flex flex-col items-center"
    >
      <Head>
        <title>Subhasish Music - Samples Store</title>
        <meta property="og:title" content="Subhasish Music Official" />
        <meta
          property="og:image"
          content="https://subhasishmusic.vercel.app/icons/icon.png"
        />
        <meta property="og:url" content="https://subhasishmusic.vercel.app/" />
        <meta
          property="og:description"
          content="The sound sample store page is under development. Soon, it'll be available to public and you'll be able to purchase those samples that can be incorporated in your project easily."
        />
        <meta
          name="description"
          content="The sound sample store page is under development. Soon, it'll be available to public and you'll be able to purchase those samples that can be incorporated in your project easily."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToolBar />
      <BottomNavBar />
      <Player
        loop
        autoplay
        src={SpaceBoyDeveloper}
        style={{ height: hScreen / 1.5, width: wScreen / 1.5 }}
      >
        <Controls visible={false} />
      </Player>
      <section className="lg:mt-8 mb-10 w-full text-center text-lg text-gray-200">
        This page is under development for a better user experience. Stay tuned
        for exciting updates!
      </section>
      <div
        className={`absolute -bottom-1/2 left-0 lg:-bottom-[35vw] lg:left-[23vw] ${classes["bg-bottom"]}`}
      ></div>
    </motion.div>
  );
};

export default memo(SamplesStore);
