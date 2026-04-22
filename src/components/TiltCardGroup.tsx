// src/components/TiltCardGroup.tsx
import React, { useRef, useEffect, useState } from "react";
import VanillaTilt from "vanilla-tilt";

// ===== Types =====
export interface TiltCardProps {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  buttonText?: string;
  buttonLink?: string;
  variant?: "green" | "blue" | "red" | "orange";
  className?: string;
}

interface TiltCardGroupProps {
  cards: TiltCardProps[];
  // showThemeToggle prop removed – no longer needed
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
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only initialize tilt on non-mobile devices
    if (!isMobile && cardRef.current) {
      VanillaTilt.init(cardRef.current, {
        max: 15,
        speed: 300,
        easing: "cubic-bezier(.03,.98,.52,.99)",
        scale: 1.05,
      });
    }
  }, [isMobile]);

  const variantColors: Record<string, string> = {
    green: "#166534", // dark green
    blue: "#1da3c3",
    red: "#eb0e2f",
    orange: "#f97316",
  };

  const borderColor = variantColors[variant];
  const buttonBg = variantColors[variant];
  const gradient = `radial-gradient(ellipse at right top, ${borderColor}ed 0%, var(--box-bg) 47%, var(--box-bg) 100%)`;

  // Mobile styles: simpler, no 3D transforms, smaller size
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
        isMobile ? "w-[280px] h-[380px] m-4" : "w-[300px] h-[400px] m-10"
      } rounded-[20px] preserve-3d font-['Poppins',sans-serif] ${className}`}
      style={{
        background: gradient,
        ...mobileStyles,
      }}
    >
      {/* Background text "NIKE" */}
      <div className="absolute top-5 left-5 text-[6em] font-black italic opacity-0 transition-opacity duration-500 text-[var(--card-bg-text)] group-hover:opacity-[0.04] pointer-events-none">
        NIKE
      </div>

      {/* Background text "SHOES" */}
      <div className="absolute bottom-5 right-5 text-[4.5em] font-black italic opacity-0 transition-opacity duration-500 text-[var(--card-bg-text)] group-hover:opacity-[0.04] pointer-events-none">
        SHOES
      </div>

      {/* Title */}
      <h2
        className={`absolute top-0 left-0 w-full text-center text-[var(--name-color)] transition-all duration-500 z-10 ${
          isMobile
            ? "opacity-100 top-10"
            : "opacity-0 group-hover:top-10 group-hover:opacity-100"
        }`}
        style={{
          transform: isMobile ? "translate3d(0,0,0)" : "translate3d(0,0,75px)",
        }}
      >
        {title}
      </h2>

      {/* Button */}
      <a
        href={buttonLink}
        className={`absolute left-1/2 -translate-x-1/2 px-6 py-2 rounded-full text-white no-underline transition-all duration-500 z-10 ${
          isMobile
            ? "opacity-100 bottom-8"
            : "opacity-0 bottom-0 group-hover:bottom-8 group-hover:opacity-100"
        }`}
        style={{
          background: buttonBg,
          transform: isMobile
            ? "translate3d(-50%,0,0)"
            : "translate3d(-50%,0,75px)",
        }}
      >
        {buttonText}
      </a>

      {/* Colored circle */}
      <div
        className={`absolute top-1/2 left-1/2 w-[200px] h-[200px] rounded-full transition-all duration-500 z-10 ${
          !isMobile && "group-hover:translate-z-[35px]"
        }`}
        style={{
          background: buttonBg,
          transform: isMobile
            ? "translate3d(-50%,-50%,0)"
            : "translate3d(-50%,-50%,0px)",
        }}
      />

      {/* Product image */}
      <img
        src={imageSrc}
        alt={imageAlt}
        className={`absolute top-1/2 left-1/2 max-w-[300px] transition-all duration-500 z-[11] -rotate-[15deg] ${
          !isMobile && "group-hover:translate-z-right"
        }`}
        style={{
          transform: isMobile
            ? "translate3d(calc(-50% + 80px), -50%, 0px) rotate(-15deg)"
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
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {/* Embedded styles for CSS variables and custom utilities */}
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

        /* Hover translation utilities (only for desktop) */
        @media (min-width: 768px) {
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

        /* Fallback for browsers that don't support mask-composite */
        .tilt-border {
          -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: destination-out;
        }
      `}</style>

      {/* Responsive container */}
      <div className="flex justify-center items-center">
        <div className="relative flex justify-center items-center flex-wrap w-full max-w-[1200px] preserve-3d px-4">
          {cards.map((card, index) => (
            <TiltCard key={index} {...card} isMobile={isMobile} />
          ))}
        </div>
      </div>
    </>
  );
};

export default TiltCardGroup;