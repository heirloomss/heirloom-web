'use client';

import React from 'react';
import { HeirloomLogo } from './HeirloomLogo';

interface WaxSealProps {
  tone?: 'moss' | 'burgundy' | 'gold' | 'bronze';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function WaxSeal({
  tone = 'burgundy',
  size = 'md',
  text,
  className = '',
}: WaxSealProps) {
  const sizeMap = {
    sm: 'h-8 w-8',
    md: 'h-11 w-11',
    lg: 'h-14 w-14',
  };

  const logoSizeMap = {
    sm: 16,
    md: 22,
    lg: 28,
  };

  const toneMap = {
    burgundy: 'from-[#8C3A4F] via-[#7B4252] to-[#5F323F] text-[#F8E7EB] border-[#9E4B60]',
    moss: 'from-[#55755E] via-[#4A6653] to-[#3B5343] text-[#E7EDE8] border-[#668870]',
    gold: 'from-[#DBB65F] via-[#C8A24A] to-[#9E7C30] text-[#FFFDF8] border-[#EACE85]',
    bronze: 'from-[#B88452] via-[#A97645] to-[#80552D] text-[#F9EFE6] border-[#CD9663]',
  };

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full font-display font-bold shadow-seal-inset transition-transform duration-300 hover:scale-105 bg-gradient-to-br border ${sizeMap[size]} ${toneMap[tone]} ${className}`}
      style={{
        boxShadow:
          '0 4px 10px rgba(46, 42, 36, 0.25), inset 0 2px 4px rgba(255, 255, 255, 0.35), inset 0 -3px 6px rgba(0, 0, 0, 0.35)',
      }}
    >
      {/* Outer wax drip ring */}
      <div className="absolute inset-0.5 rounded-full border border-white/20 pointer-events-none" />
      
      {/* Inner crest ring */}
      <div className="absolute inset-1.5 rounded-full border border-black/15 pointer-events-none" />
      
      {/* Center content */}
      <div className="relative z-10 flex items-center justify-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
        {text ? (
          <span className="font-serif tracking-tighter text-xs">{text}</span>
        ) : (
          <HeirloomLogo size={logoSizeMap[size]} />
        )}
      </div>
    </div>
  );
}
