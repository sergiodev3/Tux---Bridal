import type { FeaturedSuitRow } from "@/lib/data/featured-suits";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

import { FeaturedSuitsGrid } from "./featured-suits-grid";

type Props = Readonly<{
  suits: FeaturedSuitRow[];
  dict: Dictionary;
  locale: Locale;
}>;

export function FeaturedSuitsSection({ suits, dict, locale }: Props) {
  return (
    /* Light blue background — clear visual break from white hero above */
    <section
      id="featured-suits"
      className="scroll-mt-16 bg-sky-50 px-5 py-16 sm:px-8 sm:py-24"
      aria-labelledby="featured-heading"
    >
      <div className="mx-auto max-w-page">
        {/* Section header — JFW catalog style */}
        <div className="text-center">
          {/* Label — navy primary for contrast on sky-50 background */}
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-primary">
            {dict.featured.sectionSubtitle}
          </p>
          <h2
            id="featured-heading"
            className="font-sans text-3xl font-black uppercase tracking-[-0.01em] text-foreground sm:text-4xl"
          >
            {dict.featured.sectionTitle}
          </h2>
          {/* Decorative rule */}
          <div className="mx-auto mt-4 flex items-center justify-center gap-3">
            <span className="h-px flex-1 max-w-20 bg-border" aria-hidden="true" />
            <span className="h-1.5 w-1.5 rotate-45 bg-accent" aria-hidden="true" />
            <span className="h-px flex-1 max-w-20 bg-border" aria-hidden="true" />
          </div>
        </div>

        {suits.length === 0 ? (
          <div className="mx-auto mt-16 max-w-md border border-border bg-white px-8 py-10 text-center shadow-soft">
            <p className="text-sm leading-relaxed text-muted-foreground">
              {dict.featured.empty}
            </p>
          </div>
        ) : (
          <FeaturedSuitsGrid suits={suits} dict={dict} locale={locale} />
        )}
      </div>
    </section>
  );
}
