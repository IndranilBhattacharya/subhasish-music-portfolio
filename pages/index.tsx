import Head from "next/head";
import type { NextPage } from "next";
import { useRef } from "react";
import { motion } from "framer-motion";

import {
  fetchYTChannelStats,
  fetchYTVideoContent,
  fetchYTChannelContent,
  fetchYTChannelPlayListItems,
} from "../services/ytService";
import IndexISRProps from "../types/IndexISRProps";
import ToolBar from "../components/Utilities/ToolBar";
import useScrollReveal from "../hooks/useScrollReveal";
import YTVideoResponse from "../types/YTVideoResponse";
import HeroMessage from "../components/Utilities/HeroMessage";
import BottomNavBar from "../components/Utilities/BottomNavBar";
import appBgTexture from "../assets/images/hero_bg_texture.svg";
import AboutMeSection from "../components/Utilities/AboutMeSection";
import SkillsetSection from "../components/Utilities/SkillsetSection";
import PortfolioSection from "../components/Utilities/PortfolioSection";
import ContactMeSection from "../components/Utilities/ContactMeSection";
import MainSectionsWrapper from "../components/Interfaces/MainSectionsWrapper";
import IllustrativeExpressions from "../components/Utilities/IllustrativeExpressions";

const homePageAnimationStates = {
  initial: { opacity: 0 },
  stable: { opacity: 1 },
  exit: { opacity: 0 },
};

const Home: NextPage<IndexISRProps> = (props) => {
  const contentClasses = "z-10 w-full lg:w-3/5 relative";

  const aboutMeSectionRef = useRef<HTMLDivElement>(null);
  const skillSetSectionRef = useRef<HTMLDivElement>(null);
  const portfolioSectionRef = useRef<HTMLDivElement>(null);

  useScrollReveal();

  return (
    <motion.div
      exit="exit"
      animate="stable"
      initial="initial"
      variants={homePageAnimationStates}
      className="relative w-full flex flex-col items-center overflow-hidden"
    >
      <Head>
        <title>Subhasish Music</title>
        <meta property="og:title" content="Subhasish Music Official" />
        <meta
          property="og:image"
          content="https://subhasishmusic.vercel.app/icons/icon.png"
        />
        <meta property="og:url" content="https://subhasishmusic.vercel.app/" />
        <meta
          property="og:description"
          content="Subhasish is a well-versed music composer in a variety of musical styles and genres. Subhasish has produced several hit musics that resonates with audiences of all ages, has been my strength. Subhasish is also a skilled singer, with a powerful voice that is well-suited to a wide range of musical styles. "
        />
        <meta
          name="description"
          content="Subhasish is a well-versed music composer in a variety of musical styles and genres. Subhasish has produced several hit musics that resonates with audiences of all ages, has been my strength. Subhasish is also a skilled singer, with a powerful voice that is well-suited to a wide range of musical styles. "
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        aria-hidden
        className="hero-texture"
        style={{ backgroundImage: `url(${appBgTexture.src})` }}
      />
      <ToolBar />
      <BottomNavBar />
      <main className="container-app relative flex flex-col items-center">
        <MainSectionsWrapper className={contentClasses}>
          <HeroMessage />
        </MainSectionsWrapper>
        <MainSectionsWrapper
          ref={portfolioSectionRef}
          className={`${contentClasses} h-fit`}
        >
          <PortfolioSection {...props} />
        </MainSectionsWrapper>
        <MainSectionsWrapper
          ref={skillSetSectionRef}
          className={`${contentClasses} h-fit`}
        >
          <SkillsetSection />
        </MainSectionsWrapper>
        <MainSectionsWrapper ref={aboutMeSectionRef} className="w-full h-fit">
          <AboutMeSection />
        </MainSectionsWrapper>
      </main>
      {/* Fixed illustration column, aligned to the right 2/5 of the container. */}
      <section className="pointer-events-none fixed inset-0 z-20 hidden lg:flex justify-center">
        <div className="container-app h-full flex justify-end">
          <div className="w-2/5 h-full pl-8 flex justify-center items-center overflow-hidden">
            <IllustrativeExpressions
              {...{
                ...props.ytStats,
                aboutMeRef: aboutMeSectionRef,
                youTubeRef: portfolioSectionRef,
                skillSetRef: skillSetSectionRef,
              }}
            />
          </div>
        </div>
      </section>
      <footer className="mt-28 lg:mt-36 pb-28 lg:pb-8 w-full relative flex flex-col items-center">
        <ContactMeSection />
      </footer>
    </motion.div>
  );
};

export async function getStaticProps() {
  let ytStats = {
    viewCount: 0,
    videoCount: 0,
    subscriberCount: 0,
  };
  let ytVideos: YTVideoResponse[] = [];

  try {
    const ytChannelResponse = await fetchYTChannelContent();
    const uploadPlayListId =
      ytChannelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;
    const playListContent = await fetchYTChannelPlayListItems(uploadPlayListId);
    const videoIds = playListContent.data.items
      .map((vidContent) => vidContent.contentDetails.videoId)
      .join(",");
    const ytVideosData = await fetchYTVideoContent(videoIds);
    ytVideos = [...ytVideosData.data.items];
  } catch (err) {
    console.error(err);
  }

  try {
    const ytChannelStatsResponse = await fetchYTChannelStats();
    const ytRawStat = ytChannelStatsResponse.data.items[0].statistics;
    ytStats = {
      viewCount: +ytRawStat.viewCount,
      videoCount: +ytRawStat.videoCount,
      subscriberCount: +ytRawStat.subscriberCount,
    };
  } catch (err) {
    console.error(err);
  }

  return {
    props: {
      ytStats,
      ytVideos,
      headers: {
        "Cache-Control": "max-age=86400",
      },
    },
    revalidate: 3600 * 24,
  };
}

export default Home;
