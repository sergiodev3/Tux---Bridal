"use client";

import type { FeaturedSuitRow } from "@/lib/data/featured-suits";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { ButtonLink } from "@/components/ui/button";

import { SuitCard } from "./suit-card";

type Props = Readonly<{
  suits: FeaturedSuitRow[];
  dict: Dictionary;
  locale: Locale;
}>;

export function FeaturedSuitsGrid({ suits, dict, locale }: Props) {
  return (
    <ul className="mt-12 grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {suits.map((suit) => (
        <li key={suit.id}>
          <SuitCard
            suit={suit}
            dict={dict}
            actions={
              <ButtonLink
                href={`/api/coupon-pdf?locale=${locale}`}
                className="w-full uppercase tracking-widest"
              >
                {dict.claim.cardCta}
              </ButtonLink>
            }
          />
        </li>
      ))}
    </ul>
  );
}
