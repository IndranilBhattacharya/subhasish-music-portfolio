import gsap from "gsap";
import { useEffect } from "react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

/**
 * Fades up every `[data-reveal]` element the first time it scrolls into view.
 * Keep `data-reveal` off elements that carry Tailwind transform/transition
 * classes: those are `!important` here and would fight GSAP's inline styles.
 */
const useScrollReveal = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.set("[data-reveal]", { opacity: 0, y: 36 });
      ScrollTrigger.batch("[data-reveal]", {
        once: true,
        start: "top 90%",
        onEnter: (elements) =>
          gsap.to(elements, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
            clearProps: "transform",
          }),
      });
    });
    return () => context.revert();
  }, []);
};

export default useScrollReveal;
