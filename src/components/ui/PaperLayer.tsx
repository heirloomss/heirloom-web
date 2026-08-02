import React from 'react';
import { cn } from '@/utils/cn';

interface PaperLayerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  deck?: boolean;
  dogear?: boolean;
  tone?: 'cotton' | 'ivory' | 'linen';
}

/**
 * PaperLayer — High-fidelity layered archival paper component.
 * Features stacked paper physical depth, folded corners, and paper shadows.
 */
export function PaperLayer({
  children,
  className,
  deck = false,
  dogear = false,
  tone = 'cotton',
  ...props
}: PaperLayerProps) {
  const toneClasses = {
    cotton: 'bg-[#FFFDFC] border-ink/10',
    ivory: 'bg-[#FFFDF8] border-moss/15',
    linen: 'bg-[#ECE4D6] border-bronze/15',
  };

  return (
    <div
      className={cn(
        'relative rounded-card transition-all duration-300 shadow-paper-2 hover:shadow-paper-3 hover:-translate-y-1',
        toneClasses[tone],
        deck && 'paper-stack-deck',
        dogear && 'paper-dogear',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
