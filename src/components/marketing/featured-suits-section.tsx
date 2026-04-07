import type { FeaturedSuitRow } from "@/lib/data/featured-suits";
import type { Dictionary } from "@/lib/i18n/types";

import { SuitCard } from "./suit-card";

type Props = Readonly<{
  suits: FeaturedSuitRow[];
  dict: Dictionary;
}>;

export function FeaturedSuitsSection({ suits, dict }: Props) {
  return (
    <section
      id="featured-suits"
      className="scroll-mt-20 px-5 py-14 sm:px-8 sm:py-20"
      aria-labelledby="featured-heading"
    >
      <div className="mx-auto max-w-6xl">
        <h2
          id="featured-heading"
          className="font-display text-center text-3xl font-semibold text-stone-900 sm:text-4xl"
        >
          {dict.featured.sectionTitle}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-stone-600 sm:text-base">
          {dict.featured.sectionSubtitle}
        </p>

        {suits.length === 0 ? (
          <p className="mx-auto mt-12 max-w-lg rounded-2xl bg-amber-50/80 px-6 py-8 text-center text-sm leading-relaxed text-amber-950 ring-1 ring-amber-200/80">
            {dict.featured.empty}
          </p>
        ) : (
          <ul className="mt-10 grid list-none grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-2 xl:grid-cols-4">
            {suits.map((suit) => (
              <li key={suit.id}>
                <SuitCard suit={suit} dict={dict} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
