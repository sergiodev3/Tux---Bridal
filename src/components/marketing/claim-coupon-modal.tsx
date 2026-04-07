"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import {
  claimCouponAction,
  type ClaimCouponFailure,
  type ClaimCouponSuccess,
} from "@/actions/claim-coupon";
import type { FeaturedSuitRow } from "@/lib/data/featured-suits";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";
import {
  claimCouponFormSchema,
  type ClaimCouponFormInput,
} from "@/lib/validations/claim-coupon";

type Props = Readonly<{
  open: boolean;
  suit: FeaturedSuitRow | null;
  locale: Locale;
  dict: Dictionary;
  onClose: () => void;
}>;

function mapClaimError(
  code: ClaimCouponFailure["code"],
  dict: Dictionary,
): string {
  switch (code) {
    case "VALIDATION":
    case "INVALID_EMAIL":
      return dict.claim.errorEmail;
    case "RATE_LIMIT":
      return dict.claim.errorRateLimit;
    case "SUIT_NOT_FOUND":
      return dict.claim.errorNotFound;
    default:
      return dict.claim.errorGeneric;
  }
}

export function ClaimCouponModal({ open, suit, locale, dict, onClose }: Props) {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const [success, setSuccess] = useState<ClaimCouponSuccess | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const form = useForm<ClaimCouponFormInput>({
    resolver: zodResolver(claimCouponFormSchema),
    defaultValues: { email: "", suitCategoryId: "" },
  });

  const handleClose = useCallback(() => {
    setSuccess(null);
    setServerError(null);
    form.reset({ email: "", suitCategoryId: "" });
    onClose();
  }, [form, onClose]);

  useEffect(() => {
    if (open && suit) {
      setSuccess(null);
      setServerError(null);
      form.reset({ email: "", suitCategoryId: suit.id });
    }
  }, [open, suit, form]);

  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => emailRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  if (!open || !suit) {
    return null;
  }

  const pdfHref = success
    ? `/api/coupon-pdf?code=${encodeURIComponent(success.code)}&locale=${locale}`
    : "";

  const emailRegister = form.register("email");

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/50 p-4 sm:items-center"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-stone-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="claim-modal-title"
      >
        <h2
          id="claim-modal-title"
          className="font-display text-xl font-semibold text-stone-900"
        >
          {dict.claim.modalTitle}
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          <span className="font-medium text-stone-800">
            {dict.claim.suitLabel}:
          </span>{" "}
          {suit.name}
        </p>

        {success ? (
          <div className="mt-6 space-y-4">
            <p className="text-sm font-medium text-emerald-800">
              {dict.claim.successTitle}
            </p>
            <p className="text-sm text-stone-600">
              {success.reused
                ? dict.claim.successReusedHint
                : dict.claim.successHint}
            </p>
            <p className="font-mono text-lg font-semibold tracking-wider text-stone-900">
              {success.code}
            </p>
            <a
              href={pdfHref}
              className="flex min-h-[48px] items-center justify-center rounded-xl bg-stone-900 px-4 py-3 text-center text-sm font-semibold text-stone-50 ring-1 ring-stone-800/30 transition hover:bg-stone-800"
            >
              {dict.claim.download}
            </a>
            <button
              type="button"
              onClick={handleClose}
              className="w-full rounded-lg py-2 text-sm font-medium text-stone-600 hover:bg-stone-50"
            >
              {dict.claim.close}
            </button>
          </div>
        ) : (
          <form
            className="mt-6 space-y-4"
            onSubmit={form.handleSubmit(async (values) => {
              setServerError(null);
              setPending(true);
              try {
                const result = await claimCouponAction({
                  ...values,
                  locale,
                });
                if (result.ok) {
                  setSuccess(result);
                } else {
                  setServerError(mapClaimError(result.code, dict));
                }
              } finally {
                setPending(false);
              }
            })}
          >
            <input type="hidden" {...form.register("suitCategoryId")} />
            <div>
              <label
                htmlFor="claim-email"
                className="block text-sm font-medium text-stone-700"
              >
                {dict.claim.emailLabel}
              </label>
              <input
                id="claim-email"
                type="email"
                autoComplete="email"
                placeholder={dict.claim.emailPlaceholder}
                className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2.5 text-stone-900 shadow-sm outline-none ring-stone-400/30 placeholder:text-stone-400 focus:border-stone-500 focus:ring-2"
                {...emailRegister}
                ref={(el) => {
                  emailRegister.ref(el);
                  emailRef.current = el;
                }}
              />
              {form.formState.errors.email ? (
                <p className="mt-1 text-sm text-red-700">
                  {dict.claim.errorEmail}
                </p>
              ) : null}
            </div>

            {serverError ? (
              <p className="text-sm text-red-700" role="alert">
                {serverError}
              </p>
            ) : null}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50"
              >
                {dict.claim.cancel}
              </button>
              <button
                type="submit"
                disabled={pending}
                className="min-h-[48px] rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-stone-50 ring-1 ring-stone-800/30 disabled:opacity-60"
              >
                {pending ? dict.claim.submitting : dict.claim.submit}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
