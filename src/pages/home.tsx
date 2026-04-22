// src/pages/Home.tsx
import { lazy, Suspense } from "react";
import HeroSection from "@/components/hero-section";
import Footer from "@/components/footer";
import OrganizerCards from "@/components/OrganizerCards";
import Slider from "@/components/Slider";
import GallerySection1 from "@/components/ImageGrid1";
import GallerySection2 from "@/components/ImageGrid2";
import StaircaseHoverList from "@/components/StaircaseHoverList";


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

  const logoImages = [
    'https://picsum.photos/id/100/100/100',
    'https://picsum.photos/id/101/100/100',
    'https://picsum.photos/id/104/100/100',
    'https://picsum.photos/id/107/100/100',
    'https://picsum.photos/id/116/100/100',
    'https://picsum.photos/id/119/100/100',
    'https://picsum.photos/id/120/100/100',
    'https://picsum.photos/id/155/100/100',
    'https://picsum.photos/id/169/100/100',
    'https://picsum.photos/id/176/100/100',
  ];

  // Detailed agenda items with time, title, and subtitle
  const agendaItems = [
    {
      time: "09:00 – 09:30",
      title: "Registration & Networking",
      subtitle: "Welcome and attendee check-in.",
    },
    {
      time: "09:30 – 10:00",
      title: "Recitation & Welcome Notes",
      subtitle: "Opening ceremony and introductory remarks.",
    },
    {
      time: "10:00 – 10:20",
      title: "Keynote Session: CyberCrimes and Cybersecurity Awareness",
      subtitle: "Akram Mughal",
    },
    {
      time: "10:20 – 10:40",
      title: "Keynote Session: Behind The Screens: How Digital Forensics Solves Cyber Crimes",
      subtitle: "Huzaifa Arif",
    },
    {
      time: "10:40 – 10:50",
      title: "Live Attack 1: A Blend of Social Engineering and Session Hijacking",
      subtitle: "Abdul Moeed",
    },
    {
      time: "10:50 – 11:10",
      title: "Keynote Session: Pakistan's Cybersecurity Initiatives",
      subtitle: "Dr. Haider Abbas",
    },
    {
      time: "11:10 – 12:10",
      title: "Panel Talk: Collective Defense: Rethinking Cybersecurity as an Ecosystem",
      subtitle: "Industry Experts & Researchers",
    },
    {
      time: "12:10 – 12:30",
      title: "Break and Networking",
      subtitle: "Refreshments and connecting with peers.",
    },
    {
      time: "12:30 – 12:40",
      title: "Side Activities and Giveaway",
      subtitle: "Interactive sessions and exciting prizes.",
    },
    {
      time: "12:40 – 01:00",
      title: "Keynote Session: From DevOps to AISecOps: Securing Systems that Think",
      subtitle: "Farhan Ashraf",
    },
    {
      time: "01:00 – 01:20",
      title: "Keynote Session: Searching the Unsearchable: How Searchable Encryption Builds Cloud Trust",
      subtitle: "Dr. Shahzaib Tahir",
    },
    {
      time: "01:20 – 01:40",
      title: "Live Attack 2: Offensive Security & Reverse Shell Exploitation",
      subtitle: "Saad Shehzad, Wasif Ali Khan",
    },
    {
      time: "01:40 – 02:00",
      title: "Closing Remarks",
      subtitle: "Sardar Tahir Mehmood",
    },
    {
      time: "02:00 – 02:20",
      title: "Swags Distribution and Group Photo",
      subtitle: "Commemorating the event with all participants.",
    },
    {
      time: "02:20 – 03:00",
      title: "Hi Tea by ICCI",
      subtitle: "Final refreshments and closing networking.",
    },
  ];

  return (
    <div className="bg-black">
      {/* Hero section with particles */}
      <section
        id="Hero"
        className="relative h-screen w-full overflow-hidden scroll-mt-20 md:scroll-mt-24"
      >
        <Suspense fallback={null}>
          <ParticleField />
        </Suspense>

        <div className="relative z-10 flex h-full flex-col pt-28 md:pt-32 lg:pt-36">
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <h1
              className="text-white font-extrabold text-center tracking-tight font-['Plus_Jakarta_Sans'] leading-[0.9]
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
        <OrganizerCards />

        <div className="text-center mb-10">
          <h2 className="text-[#f0abfc] text-3xl md:text-4xl font-bold drop-shadow-md">
            Our Guests
          </h2>
          <p className="text-white/80 mt-2 drop-shadow-sm">
            Learn from industry-leading experts
          </p>
        </div>

        <GallerySection1 />

        <div className="text-center mb-10">
          <h2 className="text-[#f0abfc] text-3xl md:text-4xl font-bold drop-shadow-md">
            Our Speakers
          </h2>
          <p className="text-white/80 mt-2 drop-shadow-sm">
            Learn from industry-leading experts
          </p>
        </div>

        <GallerySection2 />

        <div className="text-center mb-10">
          <h2 className="text-[#f0abfc] text-3xl md:text-4xl font-bold drop-shadow-md">
            Our Partners
          </h2>
          <p className="text-white/80 mt-2 drop-shadow-sm">
            Learn from industry-leading experts
          </p>
        </div>

        <Slider
          images={logoImages.slice(0, 9)}
          width={230}
          height={230}
          reverse={true}
          quantity={9}
        />

        <div className="text-center mt-50 mb-10">
          <h2 className="text-[#f0abfc] text-3xl md:text-4xl font-bold drop-shadow-md">
            Event Agenda
          </h2>
          <p className="text-white/80 mt-2 drop-shadow-sm">
            NCAT Summit Islamabad 2026
          </p>
        </div>

        {/* Enhanced Staircase Hover List for Agenda */}
        <div className="max-w-5xl mx-auto px-4 mb-20">
          <StaircaseHoverList items={agendaItems} title="" />
        </div>

        {/* CTA Section */}
        <section className="py-20 md:py-28 px-4 text-center">
          <div className="flex flex-col items-center gap-3">
            <a
              href="mailto:hi@filip.fyi"
              className="text-[#f0abfc] hover:text-[#e879f9] text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-wider transition-colors"
            >
              GET IN TOUCH
            </a>
            <a
              href="mailto:hi@filip.fyi"
              className="text-gray-300 hover:text-white text-lg md:text-xl transition-colors"
            >
              hi@filip.fyi
            </a>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default Home;