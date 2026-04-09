"use client";

import { useEffect, useRef, useState } from "react";

import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import { ButtonLink, Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

type Props = Readonly<{
  locale: Locale;
  dict: Dictionary;
}>;

export function GiveawayModal({ locale, dict }: Props) {
  const [open, setOpen] = useState(false);
  const g = dict.giveaway;
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  /* Show on every page load after a brief delay */
  useEffect(() => {
    const id = window.setTimeout(() => setOpen(true), 1500);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => closeBtnRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function handleClose() {
    setOpen(false);
  }

  if (!open) return null;

  return (
    <Dialog
      open={open}
      onBackdropMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="giveaway-modal-title">

        {/* ── Eyebrow ───────────────────────────────────────────────────── */}
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
          {g.eyebrow}
        </p>

        {/* ── Title ─────────────────────────────────────────────────────── */}
        <h2
          id="giveaway-modal-title"
          className="font-sans text-2xl font-black uppercase leading-none tracking-[-0.01em] text-foreground sm:text-3xl"
        >
          {g.title}
        </h2>

        {/* ── Gold rule ─────────────────────────────────────────────────── */}
        <div className="my-4 flex items-center gap-3" aria-hidden="true">
          <span className="h-px flex-1 bg-border" />
          <span className="h-1.5 w-1.5 rotate-45 bg-accent" />
          <span className="h-px flex-1 bg-border" />
        </div>

        {/* ── Discount highlight ────────────────────────────────────────── */}
        <div className="rounded border border-primary bg-primary px-5 py-4 text-center">
          <p className="font-sans text-4xl font-black leading-none text-accent">
            $10 OFF
          </p>
          <p className="mt-1.5 text-sm font-bold uppercase tracking-wide text-primary-foreground">
            {g.discount.replace("$10 OFF ", "").replace("$10 de descuento en tu ", "")}
          </p>
        </div>

        {/* ── Prize line ────────────────────────────────────────────────── */}
        <p className="mt-4 text-center text-base font-semibold leading-relaxed text-foreground">
          {g.subtitle}
          <br />
          <span className="font-bold text-accent">{g.winPrize}</span>
        </p>

        {/* ── Winner info ───────────────────────────────────────────────── */}
        <div className="mt-4 rounded border border-border bg-muted/40 px-4 py-3 text-sm leading-relaxed text-foreground/80">
          <p>{g.winDate}</p>
          <p>{g.winFb}</p>
        </div>

        {/* ── Extra entries ─────────────────────────────────────────────── */}
        <div className="mt-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
            {g.extraEntry}
          </p>
          <ul className="space-y-1.5 text-sm text-foreground">
            <li className="flex items-center gap-2">
              <span className="text-accent">•</span>
              {g.entryFollow}
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent">•</span>
              {g.entryShare}
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent">•</span>
              {g.entryTag}
            </li>
          </ul>
        </div>

        {/* ── Must show reminder ────────────────────────────────────────── */}
        <p className="mt-4 rounded border border-accent/40 bg-accent/10 px-4 py-2.5 text-center text-xs font-bold uppercase tracking-[0.12em] text-primary">
          {g.showAtRental}
        </p>

        {/* ── Taglines ──────────────────────────────────────────────────── */}
        <p className="mt-3 text-center text-sm font-semibold text-foreground">
          {g.stopBy} {g.dontMiss}
        </p>

        {/* ── Actions ───────────────────────────────────────────────────── */}
        <div className="mt-5 flex flex-col gap-2.5">
          <ButtonLink
            href={`/api/coupon-pdf?locale=${locale}`}
            size="lg"
            className="w-full font-black uppercase tracking-widest"
            onClick={handleClose}
          >
            {g.cta}
          </ButtonLink>
          <Button
            ref={closeBtnRef}
            type="button"
            variant="ghost"
            onClick={handleClose}
            className="w-full text-sm text-muted-foreground"
          >
            {g.close}
          </Button>
        </div>

      </div>
    </Dialog>
  );
}
