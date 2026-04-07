import "server-only";

import type { Dictionary } from "@/lib/i18n/types";
import { getPublicEnv } from "@/lib/env";

export type ContactLinks = Readonly<{
  facebookUrl: string;
  whatsappUrl: string;
  storeAddress: string;
  mapsUrl: string;
}>;

const DEFAULT_FACEBOOK_URL = "https://www.facebook.com/tuxbri4less/";
const DEFAULT_STORE_ADDRESS =
  "166 S Texas Blvd, Weslaco, TX, United States, 78596";
const DEFAULT_MAPS_URL =
  "https://maps.google.com/?q=166+S+Texas+Blvd,+Weslaco,+TX+78596";
const DEFAULT_WHATSAPP_PHONE = "9569684500";

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("1")) return digits;
  if (digits.length === 10) return `1${digits}`;
  return digits;
}

export function getBusinessContactLinks(dict: Dictionary): ContactLinks {
  const env = getPublicEnv();
  const facebookUrl = env.NEXT_PUBLIC_FACEBOOK_URL ?? DEFAULT_FACEBOOK_URL;
  const storeAddress = env.NEXT_PUBLIC_STORE_ADDRESS ?? DEFAULT_STORE_ADDRESS;
  const mapsUrl = env.NEXT_PUBLIC_STORE_MAPS_URL ?? DEFAULT_MAPS_URL;

  const rawPhone = env.NEXT_PUBLIC_WHATSAPP_PHONE ?? DEFAULT_WHATSAPP_PHONE;
  const phone = normalizePhone(rawPhone);
  const message = dict.contact.whatsappPrefill;
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return {
    facebookUrl,
    whatsappUrl,
    storeAddress,
    mapsUrl,
  };
}
