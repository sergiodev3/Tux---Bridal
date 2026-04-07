"use client";

import { useEffect, useState } from "react";

import type { Dictionary } from "@/lib/i18n/types";

type Labels = Dictionary["countdown"];

type Props = Readonly<{
  endsAtIso: string;
  labels: Labels;
  /** Shown when `prefers-reduced-motion: reduce` instead of a ticking timer. */
  staticEndLabel: string;
}>;

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

export function SeasonCountdown({ endsAtIso, labels, staticEndLabel }: Props) {
  const [now, setNow] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setNow(Date.now());
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setReducedMotion(reduced);
    if (reduced) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (now === null) {
    return (
      <div
        className="mx-auto h-[5.5rem] max-w-md animate-pulse rounded-2xl bg-stone-200/70"
        aria-hidden
      />
    );
  }

  const endMs = new Date(endsAtIso).getTime();
  const remainingMs = endMs - now;

  if (remainingMs <= 0) {
    return (
      <p className="text-center text-sm font-medium leading-relaxed text-amber-900">
        {labels.ended}
      </p>
    );
  }

  if (reducedMotion) {
    return (
      <p className="text-center text-sm leading-relaxed text-stone-600">
        <span className="font-semibold text-stone-800">{labels.label}:</span>{" "}
        {staticEndLabel}
      </p>
    );
  }

  const totalSec = Math.floor(remainingMs / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  const cells = [
    { value: pad2(days), label: labels.days },
    { value: pad2(hours), label: labels.hours },
    { value: pad2(minutes), label: labels.minutes },
    { value: pad2(seconds), label: labels.seconds },
  ];

  return (
    <div className="mx-auto w-full max-w-md">
      <p className="mb-3 text-center text-xs font-medium uppercase tracking-widest text-stone-500">
        {labels.label}
      </p>
      <div
        className="grid grid-cols-4 gap-2 sm:gap-3"
        role="timer"
        aria-live="polite"
        aria-label={`${labels.label}: ${days} ${labels.days}, ${hours} ${labels.hours}, ${minutes} ${labels.minutes}, ${seconds} ${labels.seconds}`}
      >
        {cells.map((cell) => (
          <div
            key={cell.label}
            className="rounded-xl bg-white/90 px-1 py-3 text-center shadow-sm ring-1 ring-stone-200/90 sm:py-4"
          >
            <div className="font-display text-2xl font-semibold tabular-nums text-stone-900 sm:text-3xl">
              {cell.value}
            </div>
            <div className="mt-1 text-[10px] font-medium uppercase tracking-wide text-stone-500 sm:text-xs">
              {cell.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
