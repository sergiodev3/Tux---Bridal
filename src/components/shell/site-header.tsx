import Link from "next/link";

import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

type Props = Readonly<{
  locale: Locale;
  dict: Dictionary;
}>;

export function SiteHeader({ locale, dict }: Props) {
  return (
    <header className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
      <Link
        href={`/${locale}`}
        className="font-display text-xl font-semibold tracking-tight text-stone-900 sm:text-2xl"
      >
        {dict.shell.brand}
      </Link>
      <nav
        className="flex items-center gap-1 rounded-full bg-white/80 px-1 py-1 shadow-sm ring-1 ring-stone-200/80 backdrop-blur-sm"
        aria-label={dict.shell.localeSwitcherAria}
      >
        <Link
          href="/en"
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            locale === "en"
              ? "bg-stone-900 text-stone-50"
              : "text-stone-600 hover:bg-stone-100"
          }`}
          aria-current={locale === "en" ? "page" : undefined}
        >
          {dict.shell.english}
        </Link>
        <Link
          href="/es"
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
            locale === "es"
              ? "bg-stone-900 text-stone-50"
              : "text-stone-600 hover:bg-stone-100"
          }`}
          aria-current={locale === "es" ? "page" : undefined}
        >
          {dict.shell.spanish}
        </Link>
      </nav>
    </header>
  );
}
