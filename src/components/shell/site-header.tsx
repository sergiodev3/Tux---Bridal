import Link from "next/link";

import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

type Props = Readonly<{
  locale: Locale;
  dict: Dictionary;
}>;

export function SiteHeader({ locale, dict }: Props) {
  return (
    <header className="supports-backdrop-filter:bg-background/85 sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-page items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
        {/* Brand lockup */}
        <Link
          href={`/${locale}`}
          className="group rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span className="font-display text-2xl font-semibold tracking-tight text-foreground transition-[color] duration-(--animate-fast) group-hover:text-primary sm:text-3xl">
            {dict.shell.brand}
          </span>
        </Link>

        {/* Locale switcher */}
        <nav
          className="flex items-center rounded border border-border bg-card shadow-soft"
          aria-label={dict.shell.localeSwitcherAria}
        >
          <Link
            href="/en"
            className={[
              "rounded-l px-3 py-1.5 text-xs font-semibold uppercase tracking-widest",
              "transition-[background-color,color] duration-(--animate-fast)",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
              locale === "en"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            ].join(" ")}
            aria-current={locale === "en" ? "page" : undefined}
          >
            {dict.shell.english}
          </Link>
          <span
            className="h-5 w-px bg-border"
            aria-hidden="true"
          />
          <Link
            href="/es"
            className={[
              "rounded-r px-3 py-1.5 text-xs font-semibold uppercase tracking-widest",
              "transition-[background-color,color] duration-(--animate-fast)",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
              locale === "es"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            ].join(" ")}
            aria-current={locale === "es" ? "page" : undefined}
          >
            {dict.shell.spanish}
          </Link>
        </nav>
      </div>
    </header>
  );
}
