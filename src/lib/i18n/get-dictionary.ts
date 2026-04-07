import { notFound } from "next/navigation";

import type { Locale } from "./config";
import { isLocale } from "./config";
import { en } from "./en";
import { es } from "./es";
import type { Dictionary } from "./types";

const map: Record<Locale, Dictionary> = {
  en,
  es,
};

export function getDictionary(locale: string): Dictionary {
  if (!isLocale(locale)) {
    notFound();
  }
  return map[locale];
}
