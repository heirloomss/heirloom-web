import { HeroSection } from '@/components/dashboard/HeroSection';
import { StatCards } from '@/components/dashboard/StatCards';
import { LifeCheckInCard } from '@/components/dashboard/LifeCheckInCard';
import { LegacyJourneyTimeline } from '@/components/timeline/LegacyJourneyTimeline';
import { FamilyTimeline } from '@/components/timeline/FamilyTimeline';
import { FadeIn } from '@/components/ui/Motion';

export default function DashboardPage() {
  return (
    <div className="space-y-14">
      <HeroSection />

      <FadeIn delay={0.1}>
        <StatCards />
      </FadeIn>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <FadeIn delay={0.15}>
          <LifeCheckInCard />
        </FadeIn>

        <FadeIn delay={0.2} className="rounded-card bg-linen/50 p-7 paper-edge">
          <h2 className="font-display text-2xl">Your Legacy Journey</h2>
          <p className="mt-1 text-sm text-ink-soft">
            The moments your love reaches them, in the order you chose.
          </p>
          <div className="mt-6">
            <LegacyJourneyTimeline />
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={0.25}>
        <div className="rounded-card bg-cotton/60 p-7 paper-edge">
          <h2 className="font-display text-2xl">A quiet record of care</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Everything you have done to prepare, in order.
          </p>
          <div className="mt-6">
            <FamilyTimeline limit={4} />
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
