// src/pages/Home.tsx
import { lazy, Suspense } from "react";
import HeroSection from "@/components/hero-section";
import Footer from "@/components/footer";
import GuestGrid from "@/components/GuestGrid";

// Import the main showcase component (handles its own state and detail view)

const ParticleField = lazy(() => import("@/components/ParticleField"));

const Home = () => {
  const handleSpeedUp = () => {
    // @ts-ignore
    window.__setParticleSpeed?.(true);
  };
  const handleSlowDown = () => {
    // @ts-ignore
    window.__setParticleSpeed?.(false);
  };

  return (
    <div className="bg-black">
      {/* Full‑screen particle section */}
      <section
        id="Hero"
        className="relative h-screen w-full overflow-hidden scroll-mt-20 md:scroll-mt-24"
      >
        <Suspense fallback={null}>
          <ParticleField />
        </Suspense>

        <div className="relative z-10 flex h-full flex-col pt-20 md:pt-24">
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <h1
              className="text-white font-extrabold text-center tracking-tight font-['Plus_Jakarta_Sans'] leading-none 
                         text-[15vw] md:text-[18vw] lg:text-[20vw] xl:text-[16rem] transition-colors duration-300"
              onMouseEnter={handleSpeedUp}
              onMouseLeave={handleSlowDown}
            >
              NCAT
            </h1>
            <p className="text-white/70 text-center text-sm md:text-lg lg:text-xl font-light tracking-widest uppercase">
              Next‑Gen Creative Agency & Technology
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="relative z-10 bg-black">
        <HeroSection />

        {/* ----- EVENT GUESTS SECTION ----- */}
        <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Meet Our Guests
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Distinguished speakers, panelists, and workshop hosts joining us for an unforgettable experience.
            </p>
          </div>
          {/* 👇 Add the guest grid here */}
          <GuestGrid />
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Home;