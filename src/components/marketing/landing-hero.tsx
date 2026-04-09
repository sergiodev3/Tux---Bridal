import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { ButtonLink } from "@/components/ui/button";

import { SeasonCountdown } from "./season-countdown";

type Props = Readonly<{
  dict: Dictionary;
  locale: Locale;
  seasonEndIso: string;
  staticEndLabel: string;
}>;

export function LandingHero({ dict, locale, seasonEndIso, staticEndLabel }: Props) {
  return (
    <section
      className="border-b border-border bg-white pb-16 pt-12 sm:pb-24 sm:pt-18"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        {/* Eyebrow — navy primary for maximum contrast on white */}
        <p className="mb-7 inline-flex items-center gap-2 border-b-2 border-accent pb-2 text-sm font-bold uppercase tracking-[0.16em] text-primary">
          {dict.marketing.eyebrow}
        </p>

        {/* Hero heading */}
        <h1
          id="hero-heading"
          className="font-sans text-balance text-4xl font-black uppercase leading-none tracking-[-0.01em] text-foreground sm:text-5xl lg:text-6xl"
        >
          {dict.marketing.headline}
        </h1>

        {/* Decorative rule */}
        <div className="mx-auto mt-7 flex items-center justify-center gap-3">
          <span className="h-px flex-1 max-w-20 bg-border" aria-hidden="true" />
          <span className="h-1.5 w-1.5 rotate-45 bg-accent" aria-hidden="true" />
          <span className="h-px flex-1 max-w-20 bg-border" aria-hidden="true" />
        </div>

        {/* Subline */}
        <p className="mt-6 text-pretty text-lg leading-relaxed text-foreground/75 sm:text-xl">
          {dict.marketing.subline}
        </p>

        {/* Countdown */}
        <div className="mt-10 sm:mt-12">
          <SeasonCountdown
            endsAtIso={seasonEndIso}
            labels={dict.countdown}
            staticEndLabel={staticEndLabel}
          />
        </div>

        {/* Primary CTA — directly downloads the coupon PDF */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <ButtonLink
            href={`/api/coupon-pdf?locale=${locale}`}
            size="lg"
            className="min-w-[220px] text-sm font-black uppercase tracking-widest"
          >
            {dict.marketing.ctaPrimary}
          </ButtonLink>
          {/* Scroll hint to suit catalog */}
          <a
            href="#featured-suits"
            className="text-sm font-medium text-foreground/60 underline-offset-2 hover:underline"
          >
            {dict.marketing.ctaPrimaryHint}
          </a>
        </div>

        {/* Footnote */}
        <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
          {dict.marketing.footnote}
        </p>
      </div>
    </section>
  );
}
