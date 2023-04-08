import { memo } from "react";
import Head from "next/head";
import { NextPage } from "next";
import { Player, Controls } from "@lottiefiles/react-lottie-player";

import useWindowSize from "../hooks/useWindowSize";
import ToolBar from "../components/Utilities/ToolBar";
import SpaceBoyDeveloper from "../assets/jsons/space-boy-developer.json";

const SamplesStore: NextPage = () => {
  const { width: wScreen, height: hScreen } = useWindowSize();

  return (
    <div className="w-[calc(100vw_-_0.5rem)] min-h-screen flex flex-col items-center">
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
    </div>
  );
};

export default memo(SamplesStore);
