import type { Dictionary } from "@/lib/i18n/types";
import type { ContactLinks } from "@/lib/business/contact-links";

type Props = Readonly<{
  dict: Dictionary;
  contactLinks: ContactLinks;
}>;

export function TrustBlock({ dict, contactLinks }: Props) {
  const lines = [dict.trust.line1, dict.trust.line2, dict.trust.line3];

  return (
    <section
      className="border-t border-stone-200/90 bg-stone-100/50 px-5 py-14 sm:px-8 sm:py-16"
      aria-labelledby="trust-heading"
    >
      <div className="mx-auto max-w-3xl">
        <h2
          id="trust-heading"
          className="font-display text-center text-2xl font-semibold text-stone-900 sm:text-3xl"
        >
          {dict.trust.title}
        </h2>
        <ul className="mt-8 space-y-4 text-center sm:mt-10 sm:space-y-5">
          {lines.map((line) => (
            <li
              key={line}
              className="text-pretty text-sm leading-relaxed text-stone-700 sm:text-base"
            >
              {line}
            </li>
          ))}
        </ul>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <a
            href={contactLinks.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-stone-900 ring-1 ring-stone-200 hover:bg-stone-50"
          >
            {dict.contact.facebook}
          </a>
          <a
            href={contactLinks.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white ring-1 ring-emerald-800/30 hover:bg-emerald-800"
          >
            {dict.contact.whatsapp}
          </a>
          <a
            href={contactLinks.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-stone-50 ring-1 ring-stone-800/30 hover:bg-stone-800"
          >
            {dict.contact.openInMaps}
          </a>
        </div>

        <div className="mt-6 rounded-2xl bg-white px-5 py-4 text-center ring-1 ring-stone-200/80">
          <p className="text-sm font-semibold text-stone-900">{dict.contact.title}</p>
          <p className="mt-1 text-sm text-stone-700">{contactLinks.storeAddress}</p>
        </div>
      </div>
    </section>
  );
}
