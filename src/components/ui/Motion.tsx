'use client';

import { motion, type HTMLMotionProps, type Variants } from 'framer-motion';
import { fadeUp } from '@/lib/motion';
import { cn } from '@/utils/cn';

interface FadeInProps extends HTMLMotionProps<'div'> {
  /** Seconds before the animation begins. */
  delay?: number;
}

/** Section-level reveal: fades and lifts gently, like a card being placed. */
export function FadeIn({ delay = 0, className, ...props }: FadeInProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: Math.max(delay - 0.6, 0) }}
      className={cn(className)}
      {...props}
    />
  );
}

/** A motion.div with preset variants for stacking grids. */
export function Stagger({
  className,
  variants,
  ...props
}: { variants: Variants } & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className={cn(className)}
      {...props}
    />
  );
}

export { motion };
export type { Variants };
