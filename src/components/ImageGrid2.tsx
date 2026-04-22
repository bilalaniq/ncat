import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(ScrollTrigger, CustomEase);

export interface GalleryImage {
  id: string | number;
  src: string;
  name: string;
  role?: string; // optional secondary text
}

interface GallerySectionProps {
  /** Array of image objects with src and name */
  images?: GalleryImage[];
  /** Caption text for the entire section (displayed below the grid) */
  sectionCaption?: string;
  /** Additional CSS classes */
  className?: string;
}

const defaultImages: GalleryImage[] = [
  {
    id: 100,
    src: 'https://picsum.photos/id/100/400/500',
    name: 'Emma Watson',
    role: 'Creative Director',
  },
  {
    id: 101,
    src: 'https://picsum.photos/id/101/400/500',
    name: 'James Lee',
    role: 'Lead Designer',
  },
  {
    id: 102,
    src: 'https://picsum.photos/id/102/400/500',
    name: 'Sophia Chen',
    role: 'Art Director',
  },
  {
    id: 103,
    src: 'https://picsum.photos/id/103/400/500',
    name: 'Michael Brown',
    role: 'Photographer',
  },
  {
    id: 104,
    src: 'https://picsum.photos/id/104/400/500',
    name: 'Olivia Martinez',
    role: 'Stylist',
  },
  {
    id: 106,
    src: 'https://picsum.photos/id/106/400/500',
    name: 'David Kim',
    role: 'Producer',
  },
  {
    id: 107,
    src: 'https://picsum.photos/id/107/400/500',
    name: 'Isabella Rossi',
    role: 'Makeup Artist',
  },
  {
    id: 108,
    src: 'https://picsum.photos/id/108/400/500',
    name: 'William Taylor',
    role: 'Lighting Tech',
  },
  {
    id: 109,
    src: 'https://picsum.photos/id/109/400/500',
    name: 'Ava Johnson',
    role: 'Set Designer',
  },
  {
    id: 110,
    src: 'https://picsum.photos/id/110/400/500',
    name: 'Ethan Wilson',
    role: 'Videographer',
  },
];

const GallerySection: React.FC<GallerySectionProps> = ({
  images = defaultImages,
  className = '',
}) => {
  const sectionCaptionRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  // Reset refs array when images change
  useEffect(() => {
    imageRefs.current = imageRefs.current.slice(0, images.length);
  }, [images]);

  const addImageRef = (el: HTMLImageElement | null, index: number) => {
    if (el) imageRefs.current[index] = el;
  };

  // Helper to get image source (supports full URLs or cosmos.so IDs)
  const getImageSrc = (src: string): string => {
    if (src.startsWith('http://') || src.startsWith('https://')) return src;
    return `https://cdn.cosmos.so/${src}?format=jpeg`;
  };

  useEffect(() => {
    CustomEase.create('verticalEase', '0.4, 0, 0.2, 1');
    CustomEase.create('blurEase', '0.65, 0, 0.35, 1');

    // Animate each image with clip-path reveal
    imageRefs.current.forEach((img, index) => {
      if (!img) return;
      gsap
        .timeline({
          scrollTrigger: {
            trigger: img,
            start: 'top bottom-=50',
            end: 'bottom top+=50',
            toggleActions: 'play none none reverse',
          },
        })
        .fromTo(
          img,
          { clipPath: 'inset(100% 0 0 0)' },
          {
            clipPath: 'inset(0% 0 0 0)',
            duration: 1.0,
            delay: index * 0.05,
            ease: 'verticalEase',
          }
        );
    });

    // Animate section caption
    gsap.to(sectionCaptionRef.current, {
      scrollTrigger: {
        trigger: '.gallery-section',
        start: 'top bottom',
        end: 'center center',
        toggleActions: 'play none none reverse',
        scrub: true,
      },
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1,
      ease: 'blurEase',
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [images]);

  return (
    <section id="gallery" className={`gallery-section ${className}`}>
      <style>{`
        .gallery-section {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 6rem 0;
          overflow: hidden;
          background-color: #000;
        }

        .gallery-section .container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .gallery-section .gallery-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 2rem 1.5rem;
          justify-content: center;
          margin-bottom: 4rem;
        }

        .gallery-section .gallery-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .gallery-section .image-wrapper {
          width: 100%;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .gallery-section .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(100%);
          transition: filter 0.3s, transform 0.3s;
          clip-path: inset(100% 0 0 0); /* hidden until animation */
          will-change: clip-path;
        }

        .gallery-section .gallery-item:hover img {
          filter: grayscale(0%);
          transform: scale(1.03);
        }

        .gallery-section .item-name {
          font-size: 1.2rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 0.25rem;
        }

        .gallery-section .item-role {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .gallery-section .section-caption {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          font-size: 1rem;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
          opacity: 0;
          transform: translateY(2rem);
          filter: blur(5px);
        }

        /* Responsive breakpoints */
        @media (max-width: 1200px) {
          .gallery-section .gallery-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 992px) {
          .gallery-section .gallery-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .gallery-section {
            padding: 4rem 0;
          }
          .gallery-section .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.5rem;
          }
          .gallery-section .item-name {
            font-size: 1rem;
          }
          .gallery-section .item-role {
            font-size: 0.8rem;
          }
        }

        @media (max-width: 480px) {
          .gallery-section .container {
            padding: 0 1rem;
          }
        }
      `}</style>

      <div className="container">
        {/* Image grid with names */}
        <div className="gallery-grid">
          {images.map((item, index) => (
            <div className="gallery-item" key={item.id}>
              <div className="image-wrapper">
                <img
                  src={getImageSrc(item.src)}
                  alt={item.name}
                  ref={(el) => addImageRef(el, index)}
                  loading="lazy"
                />
              </div>
              <div className="item-name">{item.name}</div>
              {item.role && <div className="item-role">{item.role}</div>}
            </div>
          ))}
        </div>

        {/* Section caption */}
        <div className="section-caption" ref={sectionCaptionRef}>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;