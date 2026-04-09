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
        className="mx-auto h-24 max-w-sm animate-pulse rounded border border-border bg-muted"
        aria-hidden
      />
    );
  }

  const endMs = new Date(endsAtIso).getTime();
  const remainingMs = endMs - now;

  if (remainingMs <= 0) {
    return (
      <p className="text-center text-sm font-semibold uppercase tracking-wider text-accent">
        {labels.ended}
      </p>
    );
  }

  if (reducedMotion) {
    return (
      <p className="text-center text-sm leading-relaxed text-muted-foreground">
        <span className="font-semibold text-foreground">{labels.label}:</span>{" "}
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
    <div className="mx-auto w-full max-w-sm">
      <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-accent">
        {labels.label}
      </p>
      <div
        className="grid grid-cols-4 gap-2"
        role="timer"
        aria-live="polite"
        aria-label={`${labels.label}: ${days} ${labels.days}, ${hours} ${labels.hours}, ${minutes} ${labels.minutes}, ${seconds} ${labels.seconds}`}
      >
        {cells.map((cell) => (
          <div
            key={cell.label}
            className="rounded border border-border bg-card px-1 py-3 text-center shadow-soft"
          >
            <div className="font-display text-3xl font-semibold tabular-nums text-foreground">
              {cell.value}
            </div>
            <div className="mt-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              {cell.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
