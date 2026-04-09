import Image from "next/image";
import type { ReactNode } from "react";

import type { FeaturedSuitRow } from "@/lib/data/featured-suits";
import type { Dictionary } from "@/lib/i18n/types";
import { Card } from "@/components/ui/card";

type Props = Readonly<{
  suit: FeaturedSuitRow;
  dict: Dictionary;
  actions?: ReactNode;
}>;

export function SuitCard({ suit, dict, actions }: Props) {
  return (
    <Card className="group flex h-full flex-col overflow-hidden bg-white transition-shadow hover:shadow-floating">
      {/* Image — portrait-format, image-first */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-sky-50">
        {suit.image_url ? (
          <Image
            src={suit.image_url}
            alt={suit.name}
            fill
            className="object-cover transition-[transform] duration-400 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-secondary px-6 text-center">
            <span className="font-display text-6xl font-semibold text-muted-foreground/30">
              TB
            </span>
            <span className="mt-3 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground/60">
              {dict.featured.imagePlaceholder}
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="font-sans text-lg font-bold uppercase tracking-wide text-foreground">
          {suit.name}
        </h3>

        {suit.description ? (
          <p className="mt-2 line-clamp-2 text-base leading-relaxed text-foreground/70">
            {suit.description}
          </p>
        ) : null}

        {actions ? (
          <div className="mt-auto border-t border-border pt-4">{actions}</div>
        ) : null}
      </div>
    </Card>
  );
}
