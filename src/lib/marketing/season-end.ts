import { getPublicEnv } from "@/lib/env";

/** Default: end of graduation / prom season, US Central (Weslaco area). */
const DEFAULT_SEASON_END_ISO = "2026-06-30T23:59:59-05:00";

export function getSeasonEndIso(): string {
  return getPublicEnv().NEXT_PUBLIC_SEASON_END_ISO ?? DEFAULT_SEASON_END_ISO;
}
