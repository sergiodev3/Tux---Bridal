import type { Dictionary } from "@/lib/i18n/types";

import { SeasonCountdown } from "./season-countdown";

type Props = Readonly<{
  dict: Dictionary;
  seasonEndIso: string;
  staticEndLabel: string;
}>;

export function LandingHero({ dict, seasonEndIso, staticEndLabel }: Props) {
  return (
    <section
      className="border-b border-stone-200/80 bg-gradient-to-b from-amber-50/40 via-stone-50 to-stone-50 pb-12 pt-8 sm:pb-16 sm:pt-12"
      aria-labelledby="hero-heading"
    >
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <p className="mb-4 inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-900 ring-1 ring-amber-200/80 shadow-sm">
          {dict.marketing.eyebrow}
        </p>
        <h1
          id="hero-heading"
          className="font-display text-balance text-4xl font-semibold leading-tight text-stone-900 sm:text-5xl"
        >
          {dict.marketing.headline}
        </h1>
        <p className="mt-5 text-pretty text-lg leading-relaxed text-stone-600 sm:text-xl">
          {dict.marketing.subline}
        </p>

        <div className="mt-8 sm:mt-10">
          <SeasonCountdown
            endsAtIso={seasonEndIso}
            labels={dict.countdown}
            staticEndLabel={staticEndLabel}
          />
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <a
            href="#featured-suits"
            className="inline-flex min-h-[48px] min-w-[200px] items-center justify-center rounded-xl bg-stone-900 px-8 py-3.5 text-base font-semibold text-stone-50 shadow-lg ring-1 ring-stone-800/30 transition hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
          >
            {dict.marketing.ctaPrimary}
          </a>
          <span className="text-xs text-stone-500">
            {dict.marketing.ctaPrimaryHint}
          </span>
        </div>

        <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-stone-500">
          {dict.marketing.footnote}
        </p>
      </div>
    </section>
  );
}
