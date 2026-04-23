import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import Photo from "../../assets/img/myProfilePhoto.jpeg";
import { ArrowUpIcon } from "./arrow-icon";
import { Menu, X } from "lucide-react";

const fullName = "bilalaniq";
const profilePhoto = Photo;

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
  firstName: string;
}

export function TubeLightNavBar({ items, className, firstName }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Scroll spy (unchanged, works with manual scroll)
  useEffect(() => {
    const NAVBAR_HEIGHT = 80;
    const getActiveSection = () => {
      const scrollPos = window.scrollY + NAVBAR_HEIGHT + 15;
      for (const item of items) {
        const section = document.getElementById(item.url.substring(2));
        if (section) {
          const { offsetTop, offsetHeight } = section;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            return item.name;
          }
        }
      }
      return items[0]?.name;
    };
    const handleScroll = () => {
      const active = getActiveSection();
      if (active) setActiveTab(active);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const colors = {
    bgDark: "#00076f",
    purpleDeep: "#44008b",
    magenta: "#9f45b0",
    pink: "#e54ed0",
    lightPink: "#ffe4f2",
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    e.preventDefault();
    const targetId = item.url.substring(2);
    const element = document.getElementById(targetId);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      window.history.pushState(null, "", `/#${targetId}`);
      setActiveTab(item.name);
      setIsMenuOpen(false);
    }
  };

  return (
    <div>
      {/* DESKTOP NAVIGATION */}
      <div className={cn("hidden lg:block fixed z-[50] top-0 left-1/2 -translate-x-1/2 mb-6 md:pt-8 pt-4", className)}>
        <div
          className="flex items-center gap-3 border backdrop-blur-sm py-2.5 px-3.5 rounded-full shadow-lg"
          style={{ borderColor: colors.pink, backgroundColor: "rgba(0, 7, 111, 0.3)" }}
        >
          <a href="/#Hero" onClick={(e) => {
            e.preventDefault();
            const hero = document.getElementById("Hero");
            if (hero) {
              window.scrollTo({ top: 0, behavior: "smooth" });
              window.history.pushState(null, "", "/#Hero");
              setActiveTab("Hero");
            }
          }} className="flex items-center gap-2 mr-14">
            <img className="w-11 aspect-square object-cover object-[center_9%] rounded-full mt-1 border-2" style={{ borderColor: colors.lightPink }} src={profilePhoto} alt={`${fullName} Profile Photo`} />
            <p className="font-myNameFont text-xl" style={{ color: colors.lightPink }}>{firstName}</p>
          </a>

          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <a
                key={item.name}
                href={item.url}
                onClick={(e) => handleNavClick(e, item)}
                className={cn("relative text-base font-myMainFont font-semibold px-4.5 py-2.5 rounded-full transition-all duration-300 cursor-pointer", isActive ? "text-white" : "text-white/80 hover:text-white hover:bg-white/10")}
                style={{ backgroundColor: isActive ? colors.magenta : "transparent" }}
              >
                <span className="hidden md:inline">{item.name}</span>
                <span className="md:hidden"><Icon size={18} strokeWidth={2.5} /></span>
                {isActive && (
                  <motion.div layoutId="lamp" className="absolute inset-0 w-full rounded-full -z-10" style={{ backgroundColor: colors.magenta }} initial={false} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full" style={{ backgroundColor: colors.magenta }}>
                      <div className="absolute w-12 h-6 rounded-full blur-md -top-2 -left-2" style={{ backgroundColor: colors.pink + "40" }} />
                      <div className="absolute w-8 h-6 rounded-full blur-sm -top-1" style={{ backgroundColor: colors.pink + "40" }} />
                      <div className="absolute w-4 h-4 rounded-full blur-sm top-0 left-2" style={{ backgroundColor: colors.pink + "40" }} />
                    </div>
                  </motion.div>
                )}
              </a>
            );
          })}

          <Link to="/register" className="ml-4">
            <ArrowUpIcon className="hover:opacity-80 transition-opacity" />
          </Link>
        </div>
      </div>

      {/* MOBILE NAVIGATION - similar click handler */}
      <div className={cn("block lg:hidden fixed z-[50] top-0 left-4 right-4 md:left-20 md:right-20 md:pt-8 pt-4 w-auto", className)}>
        <div className="w-full flex justify-between items-center gap-3 border backdrop-blur-sm py-2.5 px-3.5 rounded-full shadow-lg" style={{ borderColor: colors.pink, backgroundColor: "rgba(0, 7, 111, 0.3)" }}>
          <a href="/#Hero" onClick={(e) => {
            e.preventDefault();
            const hero = document.getElementById("Hero");
            if (hero) {
              window.scrollTo({ top: 0, behavior: "smooth" });
              window.history.pushState(null, "", "/#Hero");
              setActiveTab("Hero");
              setIsMenuOpen(false);
            }
          }} className="flex items-center gap-2 flex-1">
            <img className="w-10 md:w-12 aspect-square object-cover object-[center_30%] rounded-full border-2 flex-shrink-0" style={{ borderColor: colors.lightPink }} src={profilePhoto} alt={`${fullName} Profile Photo`} />
            <p className="font-myNameFont text-lg md:text-xl truncate" style={{ color: colors.lightPink }}>{firstName}</p>
          </a>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="px-2 py-2 rounded-full flex-shrink-0" style={{ backgroundColor: colors.magenta }} aria-label="Toggle menu">
            {isMenuOpen ? <X size={22} className="text-white" /> : <Menu size={22} className="text-white" />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div key="mobile-menu" initial={{ opacity: 0, y: -10, scaleY: 0.95 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} exit={{ opacity: 0, y: -10, scaleY: 0.95 }} transition={{ duration: 0.2 }} className="mt-3 w-full origin-top">
              <div className="p-2.5 flex flex-col border backdrop-blur-sm rounded-2xl gap-2 z-[51]" style={{ borderColor: colors.pink, backgroundColor: "rgba(0, 7, 111, 0.5)" }}>
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.name;
                  return (
                    <a
                      key={item.name}
                      href={item.url}
                      onClick={(e) => {
                        handleNavClick(e, item);
                        setIsMenuOpen(false);
                      }}
                      className={cn("relative text-sm md:text-base font-myMainFont font-semibold px-4.5 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer", isActive ? "text-white" : "text-white/80 hover:text-white hover:bg-white/10")}
                      style={{ backgroundColor: isActive ? colors.magenta : "transparent" }}
                    >
                      <Icon size={18} strokeWidth={2.5} />
                      <span>{item.name}</span>
                    </a>
                  );
                })}
                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="w-full flex justify-center">
                  <ArrowUpIcon className="justify-center" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}