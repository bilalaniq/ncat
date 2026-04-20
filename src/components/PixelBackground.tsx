// src/components/PixelBackground.tsx
import React, { useEffect, useRef, useState } from 'react';

interface PixelBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  gap?: number;
  colors?: string[];
  animated?: boolean;
  showUnsupportedWarning?: boolean;
}

const workletCode = `
  function getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  class PixelPaint {
    static get inputProperties() {
      return [
        "--pixel-paint-colors",
        "--pixel-paint-gap",
        "--pixel-paint-progress"
      ];
    }

    paint(ctx, bounds, props) {
      const colors = props
        .getAll("--pixel-paint-colors")
        .map((color) => color.toString());
      const gap = props.get("--pixel-paint-gap").value;

      for (let x = 0; x < bounds.width; x += gap) {
        for (let y = 0; y < bounds.height; y += gap) {
          const color = colors[Math.floor(Math.random() * colors.length)];
          const size = getRandom(1, 2);

          ctx.fillStyle = color;
          ctx.fillRect(x, y, size, size);
        }
      }
    }
  }

  if (typeof registerPaint !== "undefined") {
    registerPaint("pixel-paint", PixelPaint);
  }
`;

const styleText = `
  @property --pixel-paint-colors {
    syntax: "<color>#";
    initial-value: #f8fafc, #f1f5f9, #cbd5e1;
    inherits: false;
  }

  @property --pixel-paint-gap {
    syntax: "<number>";
    initial-value: 4;
    inherits: false;
  }

  @property --pixel-paint-progress {
    syntax: "<number>";
    initial-value: 0;
    inherits: true;
  }

  @keyframes sparkle {
    to {
      --pixel-paint-progress: 1;
    }
  }

  .pixel-background {
    background-image: paint(pixel-paint);
  }

  .pixel-background-animated {
    animation: 1s steps(10) infinite sparkle;
  }

  .pixel-text {
    background-image: paint(pixel-paint);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    font-size: clamp(3rem, 15vw, 8rem);
    font-weight: bold;
    text-align: center;
    animation: 1s steps(10) infinite sparkle;
  }

  .pixel-fallback-warning {
    line-height: 1.4;
    text-align: center;
    color: black;
    background-color: papayawhip;
    padding: 1rem;
    border-radius: 0.25rem;
  }
`;

export const PixelBackground: React.FC<PixelBackgroundProps> = ({
  children,
  className = '',
  gap = 8,
  colors = ['#09090b', '#18181b', '#27272a'],
  animated = true,
  showUnsupportedWarning = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);
  const workletAddedRef = useRef(false);

  useEffect(() => {
    if (!document.getElementById('pixel-paint-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'pixel-paint-styles';
      styleEl.textContent = styleText;
      document.head.appendChild(styleEl);
    }

    // Type assertion for CSS.paintWorklet
    const supported = 'paintWorklet' in CSS;
    setIsSupported(supported);

    if (supported && !workletAddedRef.current) {
      const blob = new Blob([workletCode], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      // Cast CSS to any to avoid TypeScript error
      (CSS as any).paintWorklet
        .addModule(url)
        .catch((err: unknown) => {
          console.warn('Failed to load pixel-paint worklet:', err);
          setIsSupported(false);
        })
        .finally(() => URL.revokeObjectURL(url));
      workletAddedRef.current = true;
    }
  }, []);

  const containerStyle: React.CSSProperties = {
    '--pixel-paint-gap': gap,
    '--pixel-paint-colors': colors.join(', '),
  } as React.CSSProperties;

  const containerClasses = [
    'pixel-background',
    animated && isSupported ? 'pixel-background-animated' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={containerRef} className={containerClasses} style={containerStyle}>
      {!isSupported && showUnsupportedWarning && (
        <div className="pixel-fallback-warning">
          ⚠️{' '}
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/API/CSS_Painting_API/Guide"
            target="_blank"
            rel="noopener noreferrer"
          >
            CSS Paint API
          </a>{' '}
          is not supported in this browser. Try viewing in Chrome.
        </div>
      )}
      {children}
    </div>
  );
};