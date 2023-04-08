import { memo } from "react";
import Head from "next/head";
import { NextPage } from "next";
import { motion } from "framer-motion";
import { Player, Controls } from "@lottiefiles/react-lottie-player";

import useWindowSize from "../hooks/useWindowSize";
import ToolBar from "../components/Utilities/ToolBar";
import classes from "../styles/SampleStore.module.css";
import SpaceBoyDeveloper from "../assets/jsons/space-boy-developer.json";

const sampleStorePageAnimationStates = {
  initial: { opacity: 0 },
  stable: { opacity: 1 },
  exit: { opacity: 0 },
};

const SamplesStore: NextPage = () => {
  const { width: wScreen, height: hScreen } = useWindowSize();

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
        <meta
          name="description"
          content="The sound sample store page is under development. Soon, it'll be available to public and you'll be able to purchase those samples that can be incorporated in your project easily."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToolBar />
      <Player
        loop
        autoplay
        src={SpaceBoyDeveloper}
        style={{ height: hScreen / 1.5, width: wScreen / 1.5 }}
      >
        <Controls visible={false} />
      </Player>
      <div className="mt-8 mb-10 text-gray-200 flex flex-wrap text-lg">
        This page is under development for a better user experience. Stay tuned
        for exciting updates!
      </div>
      <div
        className={`absolute -bottom-[35vw] left-[23vw] ${classes["bg-bottom"]}`}
      ></div>
    </motion.div>
  );
};

export default memo(SamplesStore);
