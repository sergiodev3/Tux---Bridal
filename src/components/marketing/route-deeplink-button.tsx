"use client";

import { useEffect, useState } from "react";

import { ButtonLink } from "@/components/ui/button";

type Props = Readonly<{
  label: string;
  googleUrl: string;
  appleUrl: string;
  wazeUrl: string;
}>;

function NavigateIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </svg>
  );
}

function detectRouteUrl(
  googleUrl: string,
  appleUrl: string,
  wazeUrl: string,
): string {
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
  /* Start with googleUrl — same as what the server renders, avoiding mismatch.
     After hydration, swap to the device-appropriate URL via useEffect. */
  const [href, setHref] = useState(googleUrl);

  useEffect(() => {
    setHref(detectRouteUrl(googleUrl, appleUrl, wazeUrl));
  }, [googleUrl, appleUrl, wazeUrl]);

  return (
    <ButtonLink
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      variant="outline"
      className="w-full gap-2.5 text-primary-foreground ring-primary-foreground/35 hover:bg-primary-foreground/10"
    >
      <NavigateIcon />
      {label}
    </ButtonLink>
  );
}
