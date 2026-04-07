import type { Dictionary } from "@/lib/i18n/types";

type Props = Readonly<{
  dict: Dictionary;
}>;

export function TrustBlock({ dict }: Props) {
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
      </div>
    </section>
  );
}
