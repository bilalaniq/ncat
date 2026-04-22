// src/components/StaircaseHoverList.tsx
import React, { useState, useEffect, useRef } from 'react';

export interface AgendaItem {
  time: string;
  title: string;
  subtitle?: string;
  href?: string; // optional link
}

export interface StaircaseHoverListProps {
  items: AgendaItem[];
  title?: string;
  showNotice?: boolean;
  /** Disable the scaling hover effect entirely on touch devices (default: false) */
  disableHoverOnTouch?: boolean;
}

const StaircaseHoverList: React.FC<StaircaseHoverListProps> = ({
  items,
  title = '',
  showNotice = false,
  disableHoverOnTouch = false,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect touch capability on mount
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = (index: number) => {
    if (disableHoverOnTouch && isTouchDevice) return;
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    if (disableHoverOnTouch && isTouchDevice) return;
    setHoveredIndex(null);
  };

  const handleTouchStart = (index: number) => {
    if (disableHoverOnTouch && isTouchDevice) return;
    // Clear any pending reset
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    setHoveredIndex(index);
  };

  const handleTouchEnd = () => {
    if (disableHoverOnTouch && isTouchDevice) return;
    // Reset after a short delay to allow the user to see the effect,
    // but not interfere with scrolling or link tapping
    resetTimeoutRef.current = setTimeout(() => {
      setHoveredIndex(null);
    }, 150);
  };

  const getScale = (index: number): number => {
    if (hoveredIndex === null) return 1;
    if (hoveredIndex === index) return 1.25;
    if (hoveredIndex === index - 1) return 1.15;
    if (hoveredIndex === index + 1) return 1.11;
    return 1;
  };

  const getTransitionDelay = (index: number): string => {
    if (hoveredIndex === index) return '0s';
    if (hoveredIndex === index - 1) return '0.1s';
    if (hoveredIndex === index + 1) return '0.2s';
    return '0s';
  };

  return (
    <>
      <style>{`
        .agenda-staircase-container {
          position: relative;
          font-family: 'Plus Jakarta Sans', sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 0 1rem; /* Added padding for mobile */
        }
        .agenda-staircase-container h2 {
          margin: 0 0 1.5rem 0;
          padding: 0;
          color: #f0abfc;
          font-size: 2rem;
          font-weight: 700;
          text-align: center;
        }
        .notice {
          max-width: 600px;
          color: hsl(0, 70%, 10%);
          background: hsla(0, 70%, 70%, 0.8);
          padding: 1.5rem;
          margin: 1rem 0;
          border: 1px solid hsl(0, 100%, 70%);
          border-radius: 5px;
          line-height: 1.4;
        }
        .notice h2 {
          margin: 0;
          color: hsl(0, 90%, 20%);
        }
        .notice p {
          margin: 0;
        }
        .agenda-staircase-list {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .agenda-card {
          margin: 0.75rem 0;
          padding: 0;
          background: linear-gradient(135deg, #1e1028 0%, #2a1a35 100%);
          text-align: left;
          transition: transform 0.2s ease-in-out, filter 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          position: relative;
          border-radius: 8px;
          border-left: 10px solid #f0abfc;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          cursor: pointer; /* Indicate tappable on mobile */
          -webkit-tap-highlight-color: transparent; /* Remove default tap highlight */
        }
        .agenda-card:hover {
          border-left-color: #e879f9;
        }
        .agenda-card-inner {
          display: flex;
          align-items: stretch;
          min-height: 100px;
        }
        .agenda-time {
          width: 140px;
          padding: 1.2rem 1rem;
          background: rgba(0, 0, 0, 0.2);
          border-right: 1px solid rgba(240, 171, 252, 0.2);
          font-weight: 700;
          color: #f0abfc;
          font-size: 1rem;
          line-height: 1.4;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        .agenda-content {
          flex: 1;
          padding: 1.2rem 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .agenda-title {
          font-weight: 700;
          font-size: 1.2rem;
          color: white;
          margin-bottom: 0.3rem;
          line-height: 1.3;
        }
        .agenda-subtitle {
          font-weight: 400;
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.4;
        }
        .agenda-card a {
          text-decoration: none;
          color: inherit;
          display: block;
        }
        .agenda-card:hover {
          z-index: 5;
          box-shadow: 0 0 25px rgba(240, 171, 252, 0.4);
        }
        .agenda-card:hover .agenda-time {
          color: #e879f9;
        }

        /* Mobile optimizations */
        @media (max-width: 640px) {
          .agenda-staircase-container h2 {
            font-size: 1.75rem;
          }
          .agenda-card-inner {
            flex-direction: column;
          }
          .agenda-time {
            width: auto;
            border-right: none;
            border-bottom: 1px solid rgba(240, 171, 252, 0.2);
            padding: 0.8rem 1.2rem;
          }
          .agenda-content {
            padding: 1rem 1.2rem;
          }
          .agenda-title {
            font-size: 1.1rem;
          }
        }

        /* Optional: disable scaling on very small screens to prevent layout issues */
        @media (max-width: 480px) {
          .agenda-card {
            transform: none !important;
            transition: box-shadow 0.2s ease;
          }
          .agenda-card:active {
            box-shadow: 0 0 15px rgba(240, 171, 252, 0.4);
          }
        }
      `}</style>

      <div className="agenda-staircase-container">
        {title && <h2>{title}</h2>}

        {showNotice && (
          <div className="notice">
            <h2>Notice</h2>
            <p>
              Your browser doesn't support <code>:has()</code> CSS relational pseudo-class.
              This demo uses JavaScript to achieve the same effect.
            </p>
          </div>
        )}

        <ul className="agenda-staircase-list">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="agenda-card"
              onMouseEnter={() => handleMouseEnter(idx)}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleTouchStart(idx)}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
              style={{
                transform: `scale(${getScale(idx)})`,
                transitionDelay: getTransitionDelay(idx),
                filter: hoveredIndex === idx ? 'brightness(120%)' : undefined,
              }}
            >
              {item.href ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  <div className="agenda-card-inner">
                    <div className="agenda-time">{item.time}</div>
                    <div className="agenda-content">
                      <div className="agenda-title">{item.title}</div>
                      {item.subtitle && (
                        <div className="agenda-subtitle">{item.subtitle}</div>
                      )}
                    </div>
                  </div>
                </a>
              ) : (
                <div className="agenda-card-inner">
                  <div className="agenda-time">{item.time}</div>
                  <div className="agenda-content">
                    <div className="agenda-title">{item.title}</div>
                    {item.subtitle && (
                      <div className="agenda-subtitle">{item.subtitle}</div>
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default StaircaseHoverList;