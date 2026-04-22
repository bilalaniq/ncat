import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);

const Footer: React.FC = () => {
  const footerPathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    CustomEase.create('svgEase', '0.25, 0.1, 0.25, 1');

    const footerPath = footerPathRef.current;
    if (footerPath) {
      gsap.set(footerPath, {
        opacity: 0,
        y: 50,
        filter: 'blur(8px)',
      });

      const footerTl = gsap.timeline({ paused: true });
      footerTl.to(footerPath, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 1.4,
        ease: 'svgEase',
      });

      ScrollTrigger.create({
        trigger: '#footer',
        start: 'top bottom-=100',
        onEnter: () => footerTl.play(),
        onLeaveBack: () => footerTl.reverse(),
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section
      id="footer"
      className="relative z-20 bg-black text-white overflow-hidden pt-16 md:pt-24 min-h-[70vh] md:min-h-[60vh] lg:min-h-[50vh]"
    >
      {/* SVG Container (absolute positioned at bottom) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none">
        <svg
          width="100%"
          height="auto"
          viewBox="0 0 78 19"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <g transform="matrix(1 0 0 -0.519 0 19)">
            <path
              className="footer-svg-paths"
              fill="white"
              ref={footerPathRef}
              d="
                M 16.25 36.00
                L 16.25 0.59
                L 13.46 0.59
                L 2.62 28.38
                L 2.62 0.59
                L 0.00 0.59
                L 0.00 36.00
                L 2.81 36.00
                L 13.64 8.21
                L 13.64 36.00
                L 16.25 36.00
                M 35.84 33.89
                L 37.11 31.85
                L 38.09 29.31
                L 38.78 26.29
                L 36.09 25.20
                L 35.55 27.54
                L 34.86 29.42
                L 34.02 30.83
                L 33.03 31.81
                L 31.88 32.40
                L 30.59 32.59
                L 29.09 32.37
                L 27.77 31.72
                L 26.62 30.63
                L 25.66 29.18
                L 24.91 27.43
                L 24.37 25.38
                L 24.02 23.16
                L 23.80 20.89
                L 23.73 18.58
                L 23.81 15.70
                L 24.07 13.07
                L 24.49 10.70
                L 25.10 8.64
                L 25.89 6.97
                L 26.87 5.67
                L 27.98 4.74
                L 29.14 4.18
                L 30.36 4.00
                L 31.81 4.25
                L 33.10 5.01
                L 34.24 6.27
                L 35.18 8.03
                L 35.90 10.27
                L 36.39 13.00
                L 39.12 11.82
                L 38.40 8.28
                L 37.37 5.35
                L 36.04 3.03
                L 34.44 1.34
                L 32.63 0.34
                L 30.59 0.00
                L 28.51 0.26
                L 26.70 1.03
                L 25.17 2.33
                L 23.89 4.11
                L 22.83 6.36
                L 21.99 9.07
                L 21.39 12.09
                L 21.02 15.25
                L 20.90 18.56
                L 21.04 22.09
                L 21.45 25.30
                L 22.13 28.20
                L 23.07 30.73
                L 24.24 32.81
                L 25.64 34.46
                L 27.20 35.64
                L 28.87 36.35
                L 30.64 36.59
                L 32.59 36.29
                L 34.32 35.39
                L 35.84 33.89
                M 50.41 32.34
                L 50.09 30.04
                L 49.72 27.77
                L 49.27 25.52
                L 47.01 15.13
                L 54.05 15.13
                L 51.89 24.94
                L 51.29 27.75
                L 50.80 30.22
                L 50.41 32.34
                M 51.99 36.00
                L 60.40 0.59
                L 57.29 0.59
                L 54.90 11.32
                L 46.21 11.32
                L 43.97 0.59
                L 41.07 0.59
                L 48.99 36.00
                L 51.99 36.00
                M 78.13 36.00
                L 78.13 31.85
                L 71.32 31.85
                L 71.32 0.59
                L 68.58 0.59
                L 68.58 31.85
                L 61.78 31.85
                L 61.78 36.00
                L 78.13 36.00
              "
            />
          </g>
        </svg>
        {/* Optional texture overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-screen opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              'url("https://cdn.cosmos.so/00c1aedd-73e6-4e74-a278-2252a626bbff?format=jpeg")',
          }}
        />
      </div>
    </section>
  );
};

export default Footer;