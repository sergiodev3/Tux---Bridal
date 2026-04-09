import type { ContactLinks } from "@/lib/business/contact-links";
import type { Dictionary } from "@/lib/i18n/types";
import { ButtonLink } from "@/components/ui/button";
import { RouteDeepLinkButton } from "./route-deeplink-button";

type Props = Readonly<{
  dict: Dictionary;
  contactLinks: ContactLinks;
}>;

/* ── Inline SVG icons ────────────────────────────────────────────────── */

function FacebookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path d="M13.5 2h-3A5.5 5.5 0 0 0 5 7.5V9.5H3v3.5h2V22h4v-9h2.5l.5-3.5H9V7.5C9 6.67 9.67 6 10.5 6H13.5V2Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.395A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Zm0 18a8 8 0 0 1-4.073-1.105l-.29-.174-3.063.858.862-3.02-.192-.303A8 8 0 1 1 12 20Zm4.406-5.744c-.247-.124-1.462-.722-1.689-.805-.228-.082-.393-.123-.558.124-.165.247-.64.806-.784.972-.144.165-.29.186-.537.062-1.493-.747-2.474-1.333-3.459-3.022-.261-.449.261-.418.747-1.392.082-.165.04-.31-.021-.433-.062-.124-.558-1.345-.764-1.84-.2-.483-.406-.418-.558-.425h-.475c-.165 0-.433.062-.66.31-.226.247-.866.847-.866 2.065 0 1.218.887 2.395 1.011 2.56.124.165 1.745 2.664 4.23 3.736 1.572.68 2.188.737 2.975.62.476-.07 1.462-.598 1.668-1.176.206-.578.206-1.074.144-1.177-.062-.103-.227-.165-.474-.289Z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M11.54 22.351a.75.75 0 0 0 .92 0C12.9 21.896 20 16.5 20 11a8 8 0 1 0-16 0c0 5.5 7.1 10.896 7.54 11.351ZM12 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        clipRule="evenodd"
      />
    </svg>
  );
}


function AddressIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5 shrink-0 text-accent"
      aria-hidden="true"
    >
      <path d="M11.47 3.84a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 1-1.06 1.06l-.69-.69V19.5a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75v-3.75h-3V19.5a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75v-6.59l-.69.69a.75.75 0 1 1-1.06-1.06l8.69-8.69Z" />
    </svg>
  );
}

export function TrustBlock({ dict, contactLinks }: Props) {
  const lines = [dict.trust.line1, dict.trust.line2, dict.trust.line3];

  return (
    <section
      className="bg-primary px-5 py-16 text-primary-foreground sm:px-8 sm:py-20"
      aria-labelledby="trust-heading"
    >
      <div className="mx-auto max-w-3xl">
        {/* Heading */}
        <div className="text-center">
          <h2
            id="trust-heading"
            className="font-sans text-2xl font-black uppercase tracking-[-0.01em] text-primary-foreground sm:text-3xl"
          >
            {dict.trust.title}
          </h2>
          <div className="mx-auto mt-4 flex items-center justify-center gap-3">
            <span className="h-px flex-1 max-w-20 bg-primary-foreground/20" aria-hidden="true" />
            <span className="h-1.5 w-1.5 rotate-45 bg-accent" aria-hidden="true" />
            <span className="h-px flex-1 max-w-20 bg-primary-foreground/20" aria-hidden="true" />
          </div>
        </div>

        {/* Trust lines */}
        <ul className="mt-10 space-y-2.5 text-center">
          {lines.map((line) => (
            <li
              key={line}
              className="text-pretty text-sm leading-relaxed text-primary-foreground/70 sm:text-base"
            >
              {line}
            </li>
          ))}
        </ul>

        {/* ── Contact CTAs with icons ─────────────────────────────── */}
        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ButtonLink
            href={contactLinks.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            className="gap-2.5 text-primary-foreground ring-primary-foreground/35 hover:bg-primary-foreground/10"
          >
            <FacebookIcon />
            {dict.contact.facebook}
          </ButtonLink>

          <ButtonLink
            href={contactLinks.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="success"
            className="gap-2.5"
          >
            <WhatsAppIcon />
            {dict.contact.whatsapp}
          </ButtonLink>

          <ButtonLink
            href={contactLinks.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            className="gap-2.5 text-primary-foreground ring-primary-foreground/35 hover:bg-primary-foreground/10"
          >
            <MapPinIcon />
            {dict.contact.openInMaps}
          </ButtonLink>
        </div>

        {/* Directions — full width, centered */}
        <div className="mt-3">
          <RouteDeepLinkButton
            label={dict.contact.routeButton}
            googleUrl={contactLinks.routeGoogleUrl}
            appleUrl={contactLinks.routeAppleUrl}
            wazeUrl={contactLinks.routeWazeUrl}
          />
        </div>

        {/* Address card */}
        <div className="mt-8 flex items-start gap-3 border border-primary-foreground/15 bg-primary-foreground/8 px-6 py-5">
          <AddressIcon />
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-primary-foreground">
              {dict.contact.title}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-primary-foreground/65">
              {contactLinks.storeAddress}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
