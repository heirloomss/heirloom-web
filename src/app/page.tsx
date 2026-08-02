import Link from 'next/link';
import { 
  ArrowRight, 
  Lock, 
  Shield, 
  CheckCircle2, 
  FileText, 
  HeartHandshake, 
  Mail, 
  Clock, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { PaperLayer } from '@/components/ui/PaperLayer';
import { Badge } from '@/components/ui/Badge';
import { WaxSeal } from '@/components/ui/WaxSeal';
import { HeroCardDeck } from '@/components/cards/HeroCardDeck';
import { HeirloomLogo } from '@/components/ui/HeirloomLogo';
import {
  FEATURES,
  JOURNEY_STEPS,
  LEGACY_JOURNEY,
  FEATURE_AUDIENCE,
  TAGLINES,
  FAQS,
  type Feature,
} from '@/lib/content';

export default function LandingPage() {
  return (
    <div className="relative mx-auto max-w-content px-4 pb-24 pt-6 sm:px-6 md:px-10 lg:px-16">
      {/* Top bar header with Official Heirloom Logo */}
      <header className="relative z-20 flex items-center justify-between py-6 border-b border-ink/10">
        <div className="flex items-center gap-3.5">
          <HeirloomLogo size={42} className="shadow-paper-2 rounded-xl" />
          <div className="flex flex-col">
            <span className="font-display text-2xl font-bold tracking-wide text-ink">
              Heirloom
            </span>
            <span className="text-[10px] font-bold tracking-widest text-bronze uppercase">
              Digital Legacy Platform
            </span>
          </div>
        </div>
        <nav aria-label="Primary navigation">
          <ul className="flex items-center gap-4 sm:gap-8">
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
                className="inline-flex min-h-[44px] items-center gap-2 rounded-button bg-moss px-6 text-sm font-semibold text-cotton shadow-paper-2 transition-all duration-300 hover:-translate-y-0.5 hover:bg-moss-deep"
              >
                <span>Begin your legacy</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section - 3D Paper Diorama Theme */}
      <section aria-labelledby="hero-heading" className="relative z-10 pb-16 pt-12 text-center md:pt-16">
        <div className="mx-auto max-w-4xl space-y-6">
          <Badge tone="gold" className="mx-auto inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold tracking-wide uppercase shadow-paper-2 border border-gold/40">
            <Shield className="h-4 w-4 text-bronze" aria-hidden />
            <span>Digital Legacy & Asset Inheritance Platform</span>
          </Badge>

          <h1
            id="hero-heading"
            className="mx-auto max-w-4xl text-balance font-display text-4xl font-semibold leading-[1.1] text-ink sm:text-6xl md:text-7xl"
          >
            Protect Your Assets, Documents & Memories <br className="hidden sm:inline" />
            <span className="italic text-moss font-normal">For the People You Love</span>
          </h1>

          <p className="mx-auto max-w-2xl text-balance text-base leading-relaxed text-ink-soft sm:text-lg md:text-xl">
            Heirloom lets you securely store encrypted property deeds and wills, automatically distribute financial funds using smart contracts, and schedule time-released personal letters — delivered automatically when needed.
          </p>

          <div className="pt-2 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex min-h-[54px] w-full sm:w-auto items-center justify-center gap-2 rounded-button bg-moss px-9 text-base font-semibold text-cotton shadow-paper-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-moss-deep"
            >
              <span>Begin your legacy</span>
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex min-h-[54px] w-full sm:w-auto items-center justify-center rounded-button border border-ink/15 bg-cotton/90 px-8 text-base font-semibold text-ink transition-all hover:border-ink/30 hover:bg-cotton shadow-paper-1"
            >
              See how it works
            </a>
          </div>
        </div>

        {/* Dynamic 3D Paper Diorama Showcase Deck */}
        <HeroCardDeck />
      </section>

      {/* 3-Step Process Cards with Paper Stack Deck */}
      <section className="relative z-10 py-12 border-y border-ink/10 my-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-bronze">
            3-Step Physical Inheritance Workflow
          </p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl text-ink font-semibold">
            How Heirloom Protects Your Digital Legacy
          </h2>
          <p className="mt-2 text-sm text-ink-soft">
            Set up once in under 10 minutes. Your loved ones get total certainty when it matters most.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="paper-stack-deck rounded-card bg-ivory p-7 shadow-paper-2 border border-moss/20 paper-edge relative space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-moss-wash text-moss font-display text-xl font-bold">
                1
              </div>
              <WaxSeal tone="moss" size="sm" text="I" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-ink">Build Your Vault</h3>
            <p className="text-sm leading-relaxed text-ink-soft">
              Upload encrypted property deeds, passports, life insurance, and wills. Record audio or video messages for family milestones.
            </p>
          </div>

          <div className="paper-stack-deck rounded-card bg-ivory p-7 shadow-paper-2 border border-indigo/20 paper-edge relative space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-wash text-indigo font-display text-xl font-bold">
                2
              </div>
              <WaxSeal tone="gold" size="sm" text="II" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-ink">Set Beneficiaries & Rules</h3>
            <p className="text-sm leading-relaxed text-ink-soft">
              Assign exact percentage splits for funds (USDC/XLM) and appoint 2–3 trusted guardians (family member or lawyer) to verify status.
            </p>
          </div>

          <div className="paper-stack-deck rounded-card bg-ivory p-7 shadow-paper-2 border border-burgundy/20 paper-edge relative space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-burgundy-wash text-burgundy font-display text-xl font-bold">
                3
              </div>
              <WaxSeal tone="burgundy" size="sm" text="III" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-ink">Automated Safe Release</h3>
            <p className="text-sm leading-relaxed text-ink-soft">
              Monthly 1-click &quot;I&apos;m Here&quot; check-ins keep items private. If missed and confirmed by guardians, your plan executes seamlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="how-it-works" aria-labelledby="features-heading" className="relative z-10 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-bronze">
            Complete Platform Capabilities
          </p>
          <h2 id="features-heading" className="mt-2 font-display text-4xl md:text-5xl font-semibold">
            Everything Needed to Safeguard Your Legacy
          </h2>
          <p className="mt-3 text-ink-soft text-base">
            Designed for human warmth, absolute security, and clear execution.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </section>

      {/* Legacy Journey Timeline Section with Stitched Needle Lines */}
      <section aria-labelledby="journey-heading" className="py-16">
        <div className="paper-diorama-frame px-6 py-14 md:px-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-bronze">
              {LEGACY_JOURNEY.title}
            </p>
            <h2 id="journey-heading" className="mt-2 font-display text-4xl md:text-5xl font-semibold">
              Delivered at Exactly the Right Moment
            </h2>
            <p className="mt-4 text-ink-soft">
              {LEGACY_JOURNEY.subtitle}
            </p>
          </div>

          <div className="relative mt-14">
            <div
              aria-hidden
              className="thread-stitch-horizontal absolute left-4 right-4 top-6 hidden h-1 md:block"
            />
            <ol className="grid gap-6 md:grid-cols-4">
              {JOURNEY_STEPS.map((step) => (
                <li key={step.moment} className="relative">
                  <div className="flex flex-col items-start md:items-center md:text-center">
                    <span
                      className="z-10 flex h-14 w-14 items-center justify-center rounded-full border-4 border-linen bg-ivory shadow-paper-2"
                      aria-hidden
                    >
                      <step.icon className="h-6 w-6 text-bronze" />
                    </span>
                    <div className="paper-stack-deck mt-4 rounded-card bg-ivory p-5 paper-edge w-full border border-ink/10">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-moss">
                        {step.moment}
                      </p>
                      <h3 className="mt-1 font-display text-xl font-semibold text-ink">{step.label}</h3>
                      <p className="mt-2 text-xs leading-relaxed text-ink-soft">
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

      {/* Target Audience Section */}
      <section aria-labelledby="audience-heading" className="py-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-bronze">
            Designed for You
          </p>
          <h2 id="audience-heading" className="mt-2 font-display text-4xl font-semibold">
            Built for Thoughtful Families & Asset Holders
          </h2>
          <ul className="mt-8 grid gap-4 text-left sm:grid-cols-2">
            {FEATURE_AUDIENCE.map((item) => (
              <li
                key={item}
                className="paper-stack-deck flex items-start gap-3.5 rounded-card bg-cotton p-5 shadow-paper-2 border border-ink/10"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-moss shrink-0" />
                <span className="text-sm text-ink-soft leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Frequently Asked Questions with Dog-Ear Paper Cards */}
      <section className="py-12 border-t border-ink/10">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-10">
            <Badge tone="gold" className="mx-auto mb-3 border border-gold/40">
              <HelpCircle className="mr-1.5 h-3.5 w-3.5" aria-hidden />
              Clear Answers
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl text-ink font-semibold">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="paper-dogear paper-stack-deck rounded-card bg-ivory p-6 shadow-paper-2 border border-ink/10">
                <h3 className="font-display text-xl font-semibold text-ink flex items-center gap-2">
                  <span className="text-moss font-mono text-sm font-bold">0{idx + 1}.</span>
                  {faq.question}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft pl-6">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA with Wax Seal Backdrop */}
      <section className="paper-diorama-frame mt-12 bg-moss px-6 py-16 text-center text-cotton shadow-diorama md:px-16 relative overflow-hidden">
        <div className="relative z-10">
          <WaxSeal tone="gold" size="lg" text="H" className="mx-auto mb-4" />
          <h2 className="mx-auto max-w-2xl font-display text-4xl text-cotton md:text-5xl font-semibold">
            Prepare Your Digital Legacy Today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-cotton/90 text-base leading-relaxed">
            Takes less than 10 minutes to setup. Give your family peace of mind, protected documents, and clear financial inheritance.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex min-h-[54px] items-center gap-2 rounded-button bg-cotton px-9 text-base font-semibold text-moss-deep shadow-paper-3 transition-transform duration-300 hover:-translate-y-0.5"
          >
            <Lock className="h-4 w-4" aria-hidden />
            <span>Begin your legacy now</span>
          </Link>
          <p className="mt-8 font-display text-lg italic text-cotton/80">
            {TAGLINES[0]}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 border-t border-ink/10 pt-8 text-center text-sm text-ink-faint">
        <p>© 2026 Heirloom — Digital Legacy Platform</p>
        <p className="mt-1">{TAGLINES[1]}</p>
      </footer>
    </div>
  );
}

function FeatureCard({
  feature: { icon: Icon, tone, title, subtitle, description },
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
    <PaperLayer deck tone="ivory" className="h-full">
      <div className="flex h-full flex-col gap-3 p-7">
        <div className="flex items-center justify-between">
          <span
            aria-hidden
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${toneClasses[tone]}`}
          >
            <Icon className="h-6 w-6" strokeWidth={1.8} />
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink-soft bg-linen/80 px-3 py-1 rounded-full border border-ink/10">
            {subtitle}
          </span>
        </div>
        <h3 className="font-display text-2xl font-semibold text-ink mt-2">{title}</h3>
        <p className="text-sm leading-relaxed text-ink-soft">{description}</p>
      </div>
    </PaperLayer>
  );
}
