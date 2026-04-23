// src/components/TiltCardGroup.tsx
import React, { useRef, useEffect, useState } from "react";

// ===== Types =====
export interface TiltCardProps {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  buttonText?: string;
  buttonLink?: string;
  variant?: "green" | "blue" | "red" | "orange";
  className?: string;
  // New: customizable background text for each card
  bgTextTop?: string;    // default: "NIKE"
  bgTextBottom?: string; // default: "SHOES"
}

interface TiltCardGroupProps {
  cards: TiltCardProps[];
}

// ===== Single Card Component =====
const TiltCard: React.FC<TiltCardProps & { isMobile?: boolean }> = ({
  imageSrc,
  imageAlt = "",
  title,
  buttonText = "Buy Now",
  buttonLink = "#",
  variant = "green",
  className = "",
  isMobile = false,
  bgTextTop = "NIKE",      // default value
  bgTextBottom = "SHOES",  // default value
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only initialize tilt on non‑mobile devices, and only if reduced motion is not preferred
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!isMobile && !prefersReducedMotion && cardRef.current) {
      // Dynamically import VanillaTilt to keep mobile bundle lean
      import("vanilla-tilt").then((VanillaTilt) => {
        VanillaTilt.default.init(cardRef.current!, {
          max: 15,
          speed: 300,
          easing: "cubic-bezier(.03,.98,.52,.99)",
          scale: 1.05,
        });
      });
    } else if (isMobile && cardRef.current) {
      // Destroy VanillaTilt on mobile and reset transforms
      if ((cardRef.current as any).vanillaTilt) {
        (cardRef.current as any).vanillaTilt.destroy();
      }
      cardRef.current.style.transform = "none";
      cardRef.current.style.transformStyle = "flat";
    }

    return () => {
      // Cleanup on unmount
      if (cardRef.current && (cardRef.current as any).vanillaTilt) {
        (cardRef.current as any).vanillaTilt.destroy();
      }
    };
  }, [isMobile]);

  const variantColors: Record<string, string> = {
    green: "#166534",
    blue: "#1da3c3",
    red: "#eb0e2f",
    orange: "#f97316",
  };

  const borderColor = variantColors[variant];
  const buttonBg = variantColors[variant];
  const gradient = `radial-gradient(ellipse at right top, ${borderColor}ed 0%, var(--box-bg) 47%, var(--box-bg) 100%)`;

  // Mobile: flat rendering, no 3D transforms
  const mobileStyles = isMobile
    ? {
      transformStyle: "flat" as const,
      transform: "none",
    }
    : {
      transformStyle: "preserve-3d" as const,
    };

  return (
    <div
      ref={cardRef}
      className={`tilt-card group relative ${
        // Responsive sizing: full width on very small screens, fixed width on larger
        isMobile
          ? "w-full max-w-[280px] h-[380px] my-4 mx-auto"
          : "w-[300px] h-[400px] m-10"
        } rounded-[20px] ${isMobile ? "" : "preserve-3d"} font-['Poppins',sans-serif] ${className}`}
      style={{
        background: gradient,
        ...mobileStyles,
      }}
    >
      {/* Background text - top (customizable) */}
      <div className="absolute top-5 left-5 text-[6em] font-black italic opacity-0 transition-opacity duration-500 text-[var(--card-bg-text)] group-hover:opacity-[0.04] pointer-events-none">
        {bgTextTop}
      </div>

      {/* Background text - bottom (customizable) */}
      <div className="absolute bottom-5 right-5 text-[4.5em] font-black italic opacity-0 transition-opacity duration-500 text-[var(--card-bg-text)] group-hover:opacity-[0.04] pointer-events-none">
        {bgTextBottom}
      </div>

      {/* Title */}
      <h2
        className={`absolute top-0 left-0 w-full text-center text-[var(--name-color)] transition-all duration-500 z-10 ${isMobile
          ? "opacity-100 top-10"
          : "opacity-0 group-hover:top-10 group-hover:opacity-100"
          }`}
        style={{
          transform: "none",
        }}
      >
        {title}
      </h2>

      {/* Button */}
      <a
        href={buttonLink}
        className={`absolute left-1/2 -translate-x-1/2 px-6 py-2 rounded-full text-white no-underline transition-all duration-500 z-10 ${isMobile
          ? "opacity-100 bottom-8"
          : "opacity-0 bottom-0 group-hover:bottom-8 group-hover:opacity-100"
          }`}
        style={{
          background: buttonBg,
          transform: "translateX(-50%)",
        }}
      >
        {buttonText}
      </a>

      {/* Colored circle */}
      <div
        className={`absolute top-1/2 left-1/2 w-[200px] h-[200px] rounded-full transition-all duration-500 z-10 ${!isMobile && "group-hover:translate-z-[35px]"
          }`}
        style={{
          background: buttonBg,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Product image */}
      <img
        src={imageSrc}
        alt={imageAlt}
        className={`absolute top-1/2 left-1/2 max-w-[300px] transition-all duration-500 z-[11] -rotate-[15deg] ${!isMobile && "group-hover:translate-z-right"
          }`}
        style={{
          transform: isMobile
            ? "translate(calc(-50% + 80px), -50%) rotate(-15deg)"
            : "translate3d(calc(-50% + 80px), -50%, 0px) rotate(-15deg)",
        }}
      />

      {/* Gradient border */}
      <div
        className="absolute inset-0 rounded-[20px] pointer-events-none tilt-border"
        style={
          {
            "--border-color": borderColor,
            padding: "2px",
            background: `linear-gradient(45deg, var(--box-bg), var(--box-bg), var(--box-bg), var(--box-bg), ${borderColor}) border-box`,
            mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "destination-out",
          } as React.CSSProperties
        }
      />
    </div>
  );
};

// ===== Group Container =====
const TiltCardGroup: React.FC<TiltCardGroupProps> = ({ cards }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Use matchMedia for better performance and accuracy
    const mql = window.matchMedia("(max-width: 767px)");
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };
    handleChange(mql); // initial check
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return (
    <>
      {/* Embedded styles with hover and motion‑sensitive media queries */}
      <style>{`
        :root {
          --main-bg: #131313;
          --box-bg: #232323;
          --name-color: #f8f8f8;
          --card-bg-text: #ffffff;
        }

        .preserve-3d {
          transform-style: preserve-3d;
        }

        /* Only apply hover‑based 3D effects on devices with a fine pointer (mouse/trackpad) */
        @media (hover: hover) {
          .group:hover .group-hover\\:top-10 {
            top: 2.5rem;
          }
          .group:hover .group-hover\\:opacity-100 {
            opacity: 1;
          }
          .group:hover .group-hover\\:bottom-8 {
            bottom: 2rem;
          }
          .group:hover .group-hover\\:opacity-\\[0\\.04\\] {
            opacity: 0.04;
          }
          .group:hover .group-hover\\:translate-z-\\[35px\\] {
            transform: translate3d(-50%, -50%, 35px) !important;
          }
          .group:hover .group-hover\\:translate-z-right {
            transform: translate3d(calc(-50% + 15px), -50%, 100px) rotate(-15deg) !important;
          }
        }

        /* Respect user preference for reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .tilt-card,
          .tilt-card * {
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
            transform: none !important;
          }
        }

        /* Fallback for browsers that don't support mask‑composite */
        .tilt-border {
          -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: destination-out;
        }
      `}</style>

      {/* Responsive container – prevents overflow on small screens */}
      <div className="flex justify-center items-center w-full px-4">
        <div className="relative flex justify-center items-center flex-wrap w-full max-w-[1200px] preserve-3d">
          {cards.map((card, index) => (
            <TiltCard key={index} {...card} isMobile={isMobile} />
          ))}
        </div>
      </div>
    </>
  );
};

export default TiltCardGroup;