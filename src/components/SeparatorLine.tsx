// components/SeparatorLine.tsx
import React from 'react';

interface SeparatorLineProps {
  thickness?: number;    // in pixels, default 2
  marginY?: number;      // vertical margin in pixels, default 32
  width?: string;        // e.g., '100%', '80%', default '100%'
}

const SeparatorLine: React.FC<SeparatorLineProps> = ({
  thickness = 2,
  marginY = 32,
  width = '100%',
}) => {
  return (
    <hr
      style={{
        border: 'none',
        height: `${thickness}px`,
        backgroundColor: '#44008b',
        margin: `${marginY}px 0`,
        width: width,
      }}
    />
  );
};

export default SeparatorLine;