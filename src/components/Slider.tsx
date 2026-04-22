// src/components/HOME/slider.tsx
import React from 'react';

interface SliderProps {
  images: string[];
  width: number;
  height: number;
  reverse?: boolean;
  quantity?: number;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({
  images,
  width,
  height,
  reverse = false,
  quantity = images.length,
  className = '',
}) => {
  const effectiveQuantity = Math.min(quantity, images.length);
  const displayedImages = images.slice(0, effectiveQuantity);

  return (
    <>
      <style>{`
        .slider {
          width: 100%;
          height: var(--height);
          overflow: hidden;
          mask-image: linear-gradient(
            to right,
            transparent,
            #000 10% 90%,
            transparent
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            #000 10% 90%,
            transparent
          );
        }
        .slider .list {
          display: flex;
          width: 100%;
          min-width: calc(var(--width) * var(--quantity));
          position: relative;
        }
        .slider .list .item {
          width: var(--width);
          height: var(--height);
          position: absolute;
          left: 100%;
          animation: autoRun 10s linear infinite;
          transition: filter 0.5s;
          animation-delay: calc((10s / var(--quantity)) * (var(--position) - 1) - 10s) !important;
        }
        .slider .list .item img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        @keyframes autoRun {
          from {
            left: 100%;
          }
          to {
            left: calc(var(--width) * -1);
          }
        }

        @keyframes reversePlay {
          from {
            left: calc(var(--width) * -1);
          }
          to {
            left: 100%;
          }
        }

        .slider.reverse .list .item {
          animation: reversePlay 10s linear infinite;
        }

        /* Hover effects – ONLY on devices that support hover (mouse) */
        @media (hover: hover) {
          .slider:hover .item {
            animation-play-state: paused !important;
            filter: grayscale(1);
          }
          .slider .item:hover {
            filter: grayscale(0);
          }
        }
      `}</style>

      <div
        className={`slider ${reverse ? 'reverse' : ''} ${className}`}
        style={
          {
            '--width': `${width}px`,
            '--height': `${height}px`,
            '--quantity': effectiveQuantity,
          } as React.CSSProperties
        }
      >
        <div className="list">
          {displayedImages.map((src, index) => (
            <div
              key={index}
              className="item"
              style={{ '--position': index + 1 } as React.CSSProperties}
            >
              <img src={src} alt={`logo ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Slider;