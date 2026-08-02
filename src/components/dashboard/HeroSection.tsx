'use client';

import { motion } from 'framer-motion';
import { fadeUp } from '@/lib/motion';
import { greeting } from '@/utils/format';
import { useUser } from '@/hooks';

/** The peaceful centerpiece: a warm greeting and a word of certainty. */
export function HeroSection() {
  const { data: user } = useUser();
  const firstName = user?.firstName ?? user?.name?.split(' ')[0] ?? 'there';

  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      aria-labelledby="greeting"
      className="text-center"
    >
      <p id="greeting" className="text-sm font-medium uppercase tracking-[0.24em] text-ink-faint">
        {greeting()}, {firstName}
      </p>
      <div aria-hidden className="paper-divider mx-auto mt-5 w-40" />
      <h1 className="mt-5 font-display text-5xl md:text-6xl">
        Your legacy is <span className="italic text-moss">protected</span>
      </h1>
      <p className="mx-auto mt-4 max-w-reading text-pretty text-ink-soft">
        Everything you have prepared is safe, organized, and ready — nothing to
        do today unless you would like to.
      </p>
    </motion.section>
  );
}
