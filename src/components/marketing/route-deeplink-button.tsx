"use client";

type Props = Readonly<{
  label: string;
  googleUrl: string;
  appleUrl: string;
  wazeUrl: string;
}>;

function chooseRouteUrl(googleUrl: string, appleUrl: string, wazeUrl: string): string {
  if (typeof navigator === "undefined") return googleUrl;
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) {
    return appleUrl;
  }
  if (ua.includes("android")) {
    return wazeUrl;
  }
  return googleUrl;
}

export function RouteDeepLinkButton({
  label,
  googleUrl,
  appleUrl,
  wazeUrl,
}: Props) {
  const href = chooseRouteUrl(googleUrl, appleUrl, wazeUrl);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-stone-50 ring-1 ring-stone-800/30 hover:bg-stone-800"
    >
      {label}
    </a>
  );
}
