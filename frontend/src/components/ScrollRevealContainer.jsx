import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ParallaxSection = ({
  children,
  backgroundImage,
  backgroundColor = 'transparent',
  backgroundGradient,
  minHeight = '100vh',
  overlayColor = 'rgba(0,0,0,0.7)',
  parallaxSpeed = 30,
  enableParallax = true,
  className = ''
}) => {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    if (!enableParallax || !bgRef.current) return;

    const bg = bgRef.current;

    gsap.to(bg, {
      yPercent: parallaxSpeed,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === sectionRef.current) trigger.kill();
      });
    };
  }, [enableParallax, parallaxSpeed]);

  return (
    <div
      ref={sectionRef}
      className={className}
      style={{
        position: 'relative',
        minHeight,
        overflow: 'hidden',
        background: backgroundGradient || backgroundColor
      }}
    >
      {/* Background Image with Parallax */}
      {backgroundImage && (
        <div
          ref={bgRef}
          style={{
            position: 'absolute',
            top: '-20%',
            left: 0,
            width: '100%',
            height: '140%',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.3)',
            zIndex: 0,
            willChange: 'transform'
          }}
        />
      )}

      {/* Overlay */}
      {(backgroundImage || backgroundGradient) && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: overlayColor,
            zIndex: 1
          }}
        />
      )}

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          height: '100%'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ParallaxSection;