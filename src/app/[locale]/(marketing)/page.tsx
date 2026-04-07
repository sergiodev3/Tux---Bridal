import { notFound } from "next/navigation";

import { FeaturedSuitsSection } from "@/components/marketing/featured-suits-section";
import { LandingHero } from "@/components/marketing/landing-hero";
import { TrustBlock } from "@/components/marketing/trust-block";
import { SiteHeader } from "@/components/shell/site-header";
import { getFeaturedSuits } from "@/lib/data/featured-suits";
import { type Locale, isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getSeasonEndIso } from "@/lib/marketing/season-end";

export const dynamic = "force-dynamic";

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

  const seasonEndIso = getSeasonEndIso();
  const staticEndLabel = new Intl.DateTimeFormat(
    locale === "es" ? "es-US" : "en-US",
    {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "America/Chicago",
    },
  ).format(new Date(seasonEndIso));

  const suits = await getFeaturedSuits();

  return (
    <>
      <SiteHeader locale={locale} dict={dict} />
      <main>
        <LandingHero
          dict={dict}
          seasonEndIso={seasonEndIso}
          staticEndLabel={staticEndLabel}
        />
        <FeaturedSuitsSection suits={suits} dict={dict} />
        <TrustBlock dict={dict} />
      </main>
    </>
  );
}
