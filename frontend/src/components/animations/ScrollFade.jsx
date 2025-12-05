import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollFade = ({
  children,
  scrollContainerRef,
  className = '',
  animationDuration = 1,
  ease = 'power2.out',
  scrollStart = 'top bottom-=20%',
  scrollEnd = 'bottom top+=20%',
  yOffset = 50,
  opacityStart = 0,
  opacityEnd = 1
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scrollerCandidate = scrollContainerRef?.current;
    const scroller =
      scrollerCandidate && scrollerCandidate.scrollHeight > scrollerCandidate.clientHeight
        ? scrollerCandidate
        : window;

    const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          scroller,
          start: scrollStart,
          end: scrollEnd,
          scrub: 1.5, // Smooth scrub với độ mượt cao hơn
          markers: false,
          invalidateOnRefresh: true
        }
    });

    gsap.set(el, {
      willChange: 'opacity, transform',
      opacity: opacityStart,
      y: yOffset
    });

    tl.to(el, {
      duration: animationDuration,
      ease: ease,
      opacity: opacityEnd,
      y: 0
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars?.trigger === el) {
          trigger.kill();
        }
      });
    };
  }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, yOffset, opacityStart, opacityEnd]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

export default ScrollFade;

