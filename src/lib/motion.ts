import type { Variants } from 'framer-motion';

/**
 * Motion vocabulary for Heirloom — "how would this move if it were paper?"
 * Allowed: fold, lift, slide, reveal, stack, unfold, drift.
 * Never: bounce, elastic, spin, shake, flash.
 */

export const paperEase: [number, number, number, number] = [0.22, 0.61, 0.36, 1];
export const paperEaseSlow: [number, number, number, number] = [0.16, 0.84, 0.44, 1];

/** Reveal — content fades and lifts gently into place. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: paperEase } },
};

/** Staggered container for lists of paper strips / cards. */
export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
};

/** Stack — a new card slides up gently beneath the previous ones. */
export const stack: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: paperEaseSlow } },
};

/** Unfold from a slight downward tilt, like a letter opening. */
export const unfold: Variants = {
  hidden: { opacity: 0, rotateX: -10, y: 20, transformPerspective: 900 },
  visible: { opacity: 1, rotateX: 0, y: 0, transition: { duration: 0.85, ease: paperEaseSlow } },
};

/** A single letter line revealed in sequence. */
export const letterLine: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.25 + i * 0.24, duration: 0.7, ease: paperEase },
  }),
};

/** A stamp settling firmly — scale from slightly large to just pressed. */
export const stamp: Variants = {
  hidden: { opacity: 0, scale: 1.6, rotate: -8 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: -8,
    transition: { duration: 0.5, ease: paperEase },
  },
};

/** A wax seal drops and settles. */
export const wax: Variants = {
  hidden: { opacity: 0, scale: 0.7, y: -26 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.55, ease: paperEaseSlow } },
};
