import Head from "next/head";
import type { NextPage } from "next";
import { motion, useScroll } from "framer-motion";
import { useRef, useState, useEffect } from "react";

import {
  fetchYTChannelStats,
  fetchYTVideoContent,
  fetchYTChannelContent,
  fetchYTChannelPlayListItems,
} from "../services/ytService";
import IndexISRProps from "../types/IndexISRProps";
import ToolBar from "../components/Utilities/ToolBar";
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
  const { scrollYProgress } = useScroll();
  const [yPercent, setYPercent] = useState<number>(0);

  const contentClasses = "z-10 w-full lg:w-3/5 relative";

  const aboutMeSectionRef = useRef<HTMLDivElement>(null);
  const skillSetSectionRef = useRef<HTMLDivElement>(null);
  const portfolioSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollYProgress.onChange((currentYFraction) => {
      if (currentYFraction <= 0.08) {
        setYPercent(currentYFraction);
      }
    });
  }, [setYPercent, scrollYProgress]);

  return (
    <motion.div
      exit="exit"
      animate="stable"
      initial="initial"
      style={{
        backgroundImage: `url(${appBgTexture.src})`,
        backgroundSize: `${yPercent >= 0.005 ? "0%" : "cover"}`,
      }}
      variants={homePageAnimationStates}
      className="relative w-full flex flex-col items-center bg-no-repeat bg-fixed bg-center lg:bg-right-top overflow-hidden"
    >
      <Head>
        <title>Subhasish Music</title>
        <meta property="og:image" content="/icons/icon-180x180.png" />
        <meta
          name="description"
          content="Subhasish is a well-versed music composer in a variety of musical styles and genres. Subhasish has produced several hit musics that resonates with audiences of all ages, has been my strength. Subhasish is also a skilled singer, with a powerful voice that is well-suited to a wide range of musical styles. "
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ToolBar />
      <BottomNavBar />
      <main className="w-[85vw] lg:w-[77vw] relative flex flex-col items-center">
        <MainSectionsWrapper className={`${contentClasses} h-screen`}>
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
        <section className="fixed top-0 z-20 right-[4vw] hidden lg:w-2/5 h-screen lg:flex justify-center items-center overflow-hidden">
          <IllustrativeExpressions
            {...{
              ...props.ytStats,
              aboutMeRef: aboutMeSectionRef,
              youTubeRef: portfolioSectionRef,
              skillSetRef: skillSetSectionRef,
            }}
          />
        </section>
      </main>
      <footer className="mt-36 pb-[10vw] lg:pb-0 w-full h-fit lg:h-[80vh] relative flex flex-col items-center">
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
