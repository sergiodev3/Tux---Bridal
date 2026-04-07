import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/shell/site-header";
import { type Locale, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

type Props = Readonly<{
  params: Promise<{ locale: string }>;
}>;

export default async function MarketingHomePage({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) {
    notFound();
  }
  const locale: Locale = localeParam;
  const dict = getDictionary(locale);

  return (
    <>
      <SiteHeader locale={locale} dict={dict} />
      <main className="px-5 pb-16 pt-6 sm:px-8 sm:pt-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-4 inline-flex rounded-full bg-amber-100/90 px-3 py-1 text-xs font-medium uppercase tracking-wider text-amber-900 ring-1 ring-amber-200/80">
            {dict.marketing.phaseBadge}
          </p>
          <h1 className="font-display text-balance text-4xl font-semibold leading-tight text-stone-900 sm:text-5xl">
            {dict.marketing.headline}
          </h1>
          <p className="mt-5 text-pretty text-lg leading-relaxed text-stone-600 sm:text-xl">
            {dict.marketing.subline}
          </p>

          <div className="mt-10 flex flex-col items-center gap-4">
            <span className="inline-flex rounded-xl bg-stone-900 px-8 py-3.5 text-base font-semibold text-stone-50 shadow-md ring-1 ring-stone-800/20">
              {dict.marketing.ctaPrimary}
            </span>
            <p className="max-w-md text-sm text-stone-500">
              {dict.marketing.footnote}
            </p>
          </div>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="rounded-lg bg-emerald-50 px-3 py-1.5 font-medium text-emerald-900 ring-1 ring-emerald-200/80">
              {dict.stock.inStock}
            </span>
            <span className="rounded-lg bg-amber-50 px-3 py-1.5 font-medium text-amber-900 ring-1 ring-amber-200/80">
              {dict.stock.specialOrder}
            </span>
          </div>
        </div>
      </main>
    </>
  );
}
