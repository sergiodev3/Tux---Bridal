"use client";

import { useCallback, useEffect, useState } from "react";

import type { FeaturedSuitRow } from "@/lib/data/featured-suits";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

import { ClaimCouponModal } from "./claim-coupon-modal";
import { SuitCard } from "./suit-card";

type Props = Readonly<{
  suits: FeaturedSuitRow[];
  dict: Dictionary;
  locale: Locale;
}>;

export function FeaturedSuitsGrid({ suits, dict, locale }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<FeaturedSuitRow | null>(null);

  const openFor = useCallback((suit: FeaturedSuitRow) => {
    setSelected(suit);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelected(null);
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [modalOpen]);

  return (
    <>
      <ul className="mt-10 grid list-none grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-2 xl:grid-cols-4">
        {suits.map((suit) => (
          <li key={suit.id}>
            <SuitCard
              suit={suit}
              dict={dict}
              actions={
                <button
                  type="button"
                  onClick={() => openFor(suit)}
                  className="w-full min-h-[48px] rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-stone-50 ring-1 ring-stone-800/30 transition hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
                >
                  {dict.claim.cardCta}
                </button>
              }
            />
          </li>
        ))}
      </ul>
      <ClaimCouponModal
        open={modalOpen}
        suit={selected}
        locale={locale}
        dict={dict}
        onClose={closeModal}
      />
    </>
  );
}
