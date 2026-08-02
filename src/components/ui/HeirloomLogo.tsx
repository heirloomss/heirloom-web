import React from 'react';

interface HeirloomLogoProps {
  size?: number | string;
  className?: string;
}

/**
 * Exact vector SVG implementation of the official Heirloom logo:
 * Dark rounded squircle container with interlocking aperture wings and a center gold sphere.
 */
export function HeirloomLogo({ size = 36, className = '' }: HeirloomLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      fill="none"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <radialGradient id="heirloom-gold-sphere" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#E8C87A" />
          <stop offset="45%" stopColor="#C59A45" />
          <stop offset="85%" stopColor="#9A7025" />
          <stop offset="100%" stopColor="#785317" />
        </radialGradient>
      </defs>

      {/* Left Wing */}
      <path
        d="M 44 10 H 26 A 16 16 0 0 0 10 26 V 74 A 16 16 0 0 0 26 90 H 44 C 47 90 49 87 47 84 C 34 68 31 50 34 32 C 37 19 45 12 44 10 Z"
        fill="#1E1C1A"
      />

      {/* Right Wing */}
      <path
        d="M 56 90 H 74 A 16 16 0 0 0 90 74 V 26 A 16 16 0 0 0 74 10 H 56 C 53 10 51 13 53 16 C 66 32 69 50 66 68 C 63 81 55 88 56 90 Z"
        fill="#1E1C1A"
      />

      {/* Center Gold Sphere */}
      <circle cx="50" cy="50" r="11.5" fill="url(#heirloom-gold-sphere)" />
    </svg>
  );
}
