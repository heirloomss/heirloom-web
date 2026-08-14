import Link from 'next/link';
import { 
  ArrowRight, 
  Lock, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import { PaperLayer } from '@/components/ui/PaperLayer';
import { Badge } from '@/components/ui/Badge';
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
              Heirloome
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
                Sign In
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                className="inline-flex h-10 items-center justify-center rounded-button bg-moss px-5 text-sm font-semibold text-cotton shadow-paper-2 transition-transform duration-200 hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero section */}
      <section className="relative z-10 py-16 md:py-24 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-bronze/30 bg-ivory px-4 py-1.5 shadow-paper-1">
            <Sparkles className="h-4 w-4 text-bronze" />
            <span className="text-xs font-semibold uppercase tracking-wider text-bronze">
              Self-Custody Legacy Planning
            </span>
          </div>

          <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl md:text-6xl lg:text-7xl leading-[1.15]">
            Protect Your Assets, Documents & Memories For the People You Love
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-ink-soft md:text-xl leading-relaxed">
            Heirloome securely stores your property deeds, tax records, and private letters, 
            and automatically releases funds to your beneficiaries via Stellar smart contracts when triggered.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="inline-flex min-h-[52px] items-center gap-2 rounded-button bg-moss px-8 text-base font-bold text-cotton shadow-paper-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-moss-deep"
            >
              <span>Create Your Vault</span>
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-[52px] items-center gap-2 rounded-button border border-ink/15 bg-ivory px-7 text-base font-semibold text-ink shadow-paper-1 transition-all duration-300 hover:bg-linen"
            >
              <Lock className="h-4 w-4 text-moss" aria-hidden />
              <span>Sign In</span>
            </Link>
          </div>

          {/* Trust points */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs font-medium text-ink-soft">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-moss" /> AES-256 Encryption at Rest
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-moss" /> 2-of-3 Guardian Verification
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-moss" /> Automated Stellar Distribution
            </span>
          </div>
        </div>

        {/* Hero Card Deck Preview Component */}
        <HeroCardDeck />
      </section>

      {/* How Heirloom Works (3 Step Process) */}
      <section className="py-16 border-t border-ink/10">
        <div className="text-center mb-12">
          <Badge tone="moss">Simple 3-Step Process</Badge>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mt-3">
            How Your Digital Legacy Is Protected & Delivered
          </h2>
          <p className="text-ink-soft text-base mt-2 max-w-xl mx-auto">
            Everything is configured in under 10 minutes, operating automatically without requiring manual intervention from your family.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="paper-diorama-frame paper-stack-deck p-8 flex flex-col items-start gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-moss-wash text-moss font-bold font-mono text-lg">
              01
            </span>
            <h3 className="font-display text-2xl font-bold text-ink">1. Build Your Vault</h3>
            <p className="text-sm text-ink-soft leading-relaxed">
              Upload critical documents (wills, deeds, insurance) and write personal letters or milestone videos. Every file is encrypted with AES-256-GCM the moment it reaches us, and only ever stored as ciphertext.
            </p>
          </div>

          <div className="paper-diorama-frame paper-stack-deck p-8 flex flex-col items-start gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-burgundy-wash text-burgundy font-bold font-mono text-lg">
              02
            </span>
            <h3 className="font-display text-2xl font-bold text-ink">2. Set Rules & Guardians</h3>
            <p className="text-sm text-ink-soft leading-relaxed">
              Designate percentage asset splits for your beneficiaries on Stellar, and select 2-3 trusted guardians (relatives or lawyers) who will verify your status if you ever miss a check-in.
            </p>
          </div>

          <div className="paper-diorama-frame paper-stack-deck p-8 flex flex-col items-start gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bronze-wash text-bronze font-bold font-mono text-lg">
              03
            </span>
            <h3 className="font-display text-2xl font-bold text-ink">3. Automated Safe Release</h3>
            <p className="text-sm text-ink-soft leading-relaxed">
              Periodic email check-ins ensure you are active. If an unverified period occurs, guardians confirm your status and Stellar smart contracts seamlessly transfer assets to your beneficiaries.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 border-t border-ink/10">
        <div className="text-center mb-12">
          <Badge tone="bronze">Built For Security & Longevity</Badge>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mt-3">
            Every Layer Engineered For Certainty
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => (
            <FeatureCard key={idx} feature={feature} />
          ))}
        </div>
      </section>

      {/* Legacy Journey Timeline Section */}
      <section className="py-16 border-t border-ink/10">
        <div className="text-center mb-12">
          <Badge tone="burgundy">{LEGACY_JOURNEY.title}</Badge>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mt-3">
            Delivered At The Right Moment
          </h2>
          <p className="text-ink-soft text-base mt-2 max-w-xl mx-auto">
            {LEGACY_JOURNEY.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {JOURNEY_STEPS.map((step, idx) => (
            <div key={idx} className="paper-diorama-frame paper-stack-deck p-7 flex items-start gap-5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ivory shadow-paper-1 border border-ink/10 text-moss">
                <step.icon className="h-6 w-6" strokeWidth={1.8} />
              </span>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-bronze">{step.moment}</span>
                <h3 className="font-display text-xl font-bold text-ink">{step.label}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Who Heirloom Is For */}
      <section className="py-16 border-t border-ink/10">
        <div className="paper-diorama-frame p-8 md:p-12">
          <div className="max-w-2xl">
            <Badge tone="moss">Who Uses Heirloome</Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mt-3">
              Designed For Anyone Who Wants Certainty
            </h2>
            <p className="text-ink-soft text-base mt-2">
              Whether managing family estates, tokenized savings, or personal memories, Heirloome ensures your loved ones are never left in the dark.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            {FEATURE_AUDIENCE.map((aud, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 rounded-card bg-ivory border border-ink/10 shadow-paper-1">
                <CheckCircle2 className="h-5 w-5 text-moss shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-ink leading-relaxed">{aud}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 border-t border-ink/10">
        <div className="text-center mb-12">
          <Badge tone="moss">Clear Answers</Badge>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mt-3">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
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
      </section>

      {/* Closing CTA with Primary Paper Diorama Frame & Gold Wax Seal */}
      <section className="paper-diorama-frame mt-12 px-6 py-16 text-center text-ink shadow-diorama md:px-16 relative overflow-hidden bg-ivory border border-ink/15">
        <div className="relative z-10 space-y-5">
          <HeirloomLogo size={64} className="mx-auto mb-3 shadow-paper-3 rounded-2xl" />
          <h2 className="mx-auto max-w-2xl font-display text-4xl text-ink md:text-5xl font-bold leading-tight">
            Prepare Your Digital Legacy Today
          </h2>
          <p className="mx-auto max-w-xl text-ink-soft text-base leading-relaxed">
            Takes less than 10 minutes to setup. Safeguard your family&apos;s financial inheritance, encrypted property deeds, and personal letters.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex min-h-[54px] items-center gap-2 rounded-button bg-moss px-9 text-base font-bold text-cotton shadow-paper-3 transition-transform duration-300 hover:-translate-y-0.5 hover:bg-moss-deep"
            >
              <Lock className="h-4 w-4" aria-hidden />
              <span>Begin your legacy now</span>
            </Link>
          </div>
          <p className="pt-4 font-display text-lg italic text-bronze">
            {TAGLINES[0]}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 border-t border-ink/10 pt-8 text-center text-sm text-ink-faint">
        <p>© 2026 Heirloome — Digital Legacy Platform</p>
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
