import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Feather, Lock } from 'lucide-react';
import { PaperLayer } from '@/components/ui/PaperLayer';
import { Badge } from '@/components/ui/Badge';
import {
  FEATURES,
  JOURNEY_STEPS,
  LEGACY_JOURNEY,
  FEATURE_AUDIENCE,
  TAGLINES,
  type Feature,
} from '@/lib/content';

export default function LandingPage() {
  return (
    <div className="relative mx-auto max-w-content px-6 pb-24 pt-10 md:px-10 lg:px-16">
      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between py-6">
        <div className="flex items-center gap-3">
          <Monogram />
          <span className="font-display text-2xl font-semibold tracking-wide">
            Heirloom
          </span>
        </div>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-8">
            <li>
              <Link
                href="/login"
                className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
              >
                Sign in
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                className="inline-flex min-h-[44px] items-center rounded-button bg-moss px-5 text-sm font-medium text-cotton shadow-paper-2 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-moss-deep"
              >
                Begin your legacy
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero */}
      <section aria-labelledby="hero-heading" className="relative z-10 pb-28 pt-16 text-center md:pt-24">
        {/* Layered paper diorama illustration */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-0 mx-auto h-[460px] max-w-3xl">
          <div className="absolute left-1/2 top-10 h-80 w-[560px] max-w-[90vw] -translate-x-1/2 -rotate-2 rounded-card bg-linen/80 shadow-paper-1" />
          <div className="absolute left-1/2 top-16 h-80 w-[520px] max-w-[86vw] -translate-x-[48%] rotate-1 rounded-card bg-cotton shadow-paper-2 paper-edge" />
          <div className="absolute left-1/2 top-24 h-80 w-[470px] max-w-[80vw] -translate-x-[52%] -rotate-[0.5deg] overflow-hidden rounded-card bg-ivory shadow-paper-3 paper-edge">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-bronze-wash/70 to-transparent" />
            <div className="absolute -right-10 bottom-0 h-56 w-56 rounded-tl-[80px] bg-moss-wash/70" />
            <div className="absolute -left-12 bottom-0 h-44 w-44 rounded-tr-[60px] bg-burgundy-wash/60" />
            <div className="absolute left-10 top-10 max-w-[240px] space-y-3 opacity-70">
              <div className="h-3 w-40 rounded-full bg-ink/10" />
              <div className="h-3 w-52 rounded-full bg-ink/10" />
              <div className="h-3 w-28 rounded-full bg-ink/10" />
              <div className="paper-divider my-4 !opacity-60" />
              <div className="h-3 w-36 rounded-full bg-moss/25" />
            </div>
          </div>
        </div>

        <Badge tone="gold" className="mx-auto mb-8">
          <Feather className="mr-1.5 h-3.5 w-3.5" aria-hidden />
          Because love deserves a plan that lasts
        </Badge>

        <h1
          id="hero-heading"
          className="mx-auto max-w-3xl text-balance font-display text-5xl font-semibold leading-[1.05] md:text-7xl"
        >
          Leave more than assets. <span className="italic text-moss">Leave certainty.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-reading text-pretty text-lg leading-relaxed text-ink-soft md:text-xl">
          Your legacy, thoughtfully prepared — the people you love, the documents
          that matter, and the words only you can say, kept safe until they are
          needed most.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex min-h-[52px] items-center gap-2 rounded-button bg-moss px-7 text-base font-medium text-cotton shadow-paper-2 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-moss-deep"
          >
            Begin your legacy
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex min-h-[52px] items-center rounded-button border border-ink/15 bg-cotton/70 px-7 text-base font-medium text-ink transition-colors hover:border-ink/25 hover:bg-cotton"
          >
            See how it works
          </a>
        </div>
      </section>

      {/* Features — layered paper cards */}
      <section id="how-it-works" aria-labelledby="features-heading" className="relative z-10 py-16">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-bronze">
          Thoughtfully prepared
        </p>
        <h2 id="features-heading" className="mt-3 text-center font-display text-4xl md:text-5xl">
          Everything that matters, kept beautifully
        </h2>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </section>

      {/* Legacy Journey — a stitched paper timeline */}
      <section aria-labelledby="journey-heading" className="py-20">
        <div className="rounded-card bg-linen/70 px-6 py-14 paper-edge md:px-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-bronze">
              {LEGACY_JOURNEY.title}
            </p>
            <h2 id="journey-heading" className="mt-3 font-display text-4xl md:text-5xl">
              Delivered at exactly the right moment
            </h2>
            <p className="mt-4 text-ink-soft">
              Some things are needed right away. Others are better saved for a
              birthday, a wedding, or a future milestone. You set the course —
              Heirloom keeps your timing.
            </p>
          </div>

          <div className="relative mt-14">
            <div
              aria-hidden
              className="thread-stitch-horizontal absolute left-4 right-4 top-6 hidden h-px md:block"
            />
            <ol className="grid gap-6 md:grid-cols-4">
              {JOURNEY_STEPS.map((step) => (
                <li key={step.moment} className="relative">
                  <div className="flex flex-col items-start md:items-center md:text-center">
                    <span
                      className="z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-linen bg-ivory shadow-paper-1"
                      aria-hidden
                    >
                      <step.icon className="h-5 w-5 text-bronze" />
                    </span>
                    <div className="mt-4 rounded-card bg-ivory p-5 paper-edge">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-moss">
                        {step.moment}
                      </p>
                      <h3 className="mt-1 font-display text-xl">{step.label}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                        {step.detail}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Who it is for */}
      <section aria-labelledby="audience-heading" className="py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="audience-heading" className="font-display text-4xl">
            Built for thoughtful families
          </h2>
          <ul className="mt-10 grid gap-4 text-left sm:grid-cols-2">
            {FEATURE_AUDIENCE.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-card bg-cotton/80 p-5 paper-edge"
              >
                <Image
                  src="/heirloom-mark.svg"
                  alt=""
                  width={20}
                  height={20}
                  unoptimized
                  className="mt-1 h-5 w-5 opacity-60"
                />
                <span className="text-ink-soft">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Closing CTA + footer */}
      <section className="mt-8 rounded-card bg-moss px-6 py-16 text-center text-cotton shadow-paper-3 md:px-16">
        <h2 className="mx-auto max-w-2xl font-display text-4xl text-cotton md:text-5xl">
          Start today, gently
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-cotton/85">
          No pressure, no rush. Just the quiet confidence of knowing everything
          important is in its place.
        </p>
        <Link
          href="/register"
          className="mt-8 inline-flex min-h-[52px] items-center gap-2 rounded-button bg-cotton px-7 text-base font-medium text-moss-deep shadow-paper-2 transition-transform duration-300 hover:-translate-y-0.5"
        >
          <Lock className="h-4 w-4" aria-hidden />
          Begin your legacy
        </Link>
        <p className="mt-8 font-display text-lg italic text-cotton/80">
          {TAGLINES[0]}
        </p>
      </section>

      <footer className="mt-12 border-t border-ink/10 pt-8 text-center text-sm text-ink-faint">
        <p>© 2026 Heirloom — Digital Legacy Platform</p>
        <p className="mt-1">{TAGLINES[1]}</p>
      </footer>
    </div>
  );
}

function Monogram() {
  return (
    <span
      aria-hidden
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-moss/30 bg-ivory shadow-paper-1"
    >
      <Image src="/heirloom-mark.svg" alt="" width={22} height={22} unoptimized className="h-6 w-6" />
    </span>
  );
}

function FeatureCard({
  feature: { icon: Icon, tone, title, description },
}: {
  feature: Feature;
}) {
  const toneClasses = {
    moss: 'bg-moss-wash text-moss',
    burgundy: 'bg-burgundy-wash text-burgundy',
    indigo: 'bg-indigo-wash text-indigo',
    bronze: 'bg-bronze-wash text-bronze',
  } as const;

  return (
    <PaperLayer className="h-full">
      <div className="flex h-full flex-col gap-4 p-7">
        <span
          aria-hidden
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneClasses[tone]}`}
        >
          <Icon className="h-6 w-6" strokeWidth={1.8} />
        </span>
        <h3 className="font-display text-2xl">{title}</h3>
        <p className="text-sm leading-relaxed text-ink-soft">{description}</p>
      </div>
    </PaperLayer>
  );
}
