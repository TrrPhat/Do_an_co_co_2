import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollParallax = ({
  children,
  scrollContainerRef,
  className = '',
  speed = 0.5,
  scrollStart = 'top bottom',
  scrollEnd = 'bottom top'
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
        scrub: 1,
        markers: false,
        invalidateOnRefresh: true
      }
    });

    tl.to(el, {
      y: (i, el) => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        return -(rect.height * speed);
      },
      ease: 'none'
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars?.trigger === el) {
          trigger.kill();
        }
      });
    };
  }, [scrollContainerRef, speed, scrollStart, scrollEnd]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

export default ScrollParallax;

