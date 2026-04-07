import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import type { FeaturedSuitRow } from "@/lib/data/featured-suits";
import type { Dictionary } from "@/lib/i18n/types";

import { StockTypeBadge } from "./stock-type-badge";

type Props = Readonly<{
  suit: FeaturedSuitRow;
  dict: Dictionary;
  actions?: ReactNode;
}>;

export function SuitCard({ suit, dict, actions }: Props) {
  const discountLabel = dict.featured.discount.replace(
    "{percent}",
    String(suit.discount_percent),
  );

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-stone-200/80">
      <div className="relative aspect-[3/4] w-full bg-stone-100">
        {suit.image_url ? (
          <Image
            src={suit.image_url}
            alt={suit.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-stone-200 via-stone-50 to-amber-100/50 px-6 text-center">
            <span className="font-display text-5xl font-semibold text-stone-300/90">
              TB
            </span>
            <span className="mt-3 text-xs font-medium uppercase tracking-wider text-stone-400">
              {dict.featured.imagePlaceholder}
            </span>
          </div>
        )}
        <div className="absolute left-3 top-3 max-w-[calc(100%-1.5rem)]">
          <StockTypeBadge stockType={suit.stock_type} dict={dict} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div>
          <h3 className="font-display text-xl font-semibold leading-snug text-stone-900">
            {suit.name}
          </h3>
          {suit.description ? (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-600">
              {suit.description}
            </p>
          ) : null}
        </div>

        <p className="font-display text-2xl font-semibold text-amber-800">
          {discountLabel}
        </p>

        {suit.jfw_url ? (
          <Link
            href={suit.jfw_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-stone-700 underline decoration-stone-300 underline-offset-4 transition-colors hover:text-stone-900 hover:decoration-stone-500"
          >
            {dict.featured.seePhotos}
          </Link>
        ) : null}
        {actions ? (
          <div className="mt-4 border-t border-stone-100 pt-4">{actions}</div>
        ) : null}
      </div>
    </article>
  );
}
