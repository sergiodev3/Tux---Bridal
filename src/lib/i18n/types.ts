export type Dictionary = {
  meta: {
    title: string;
    description: string;
  };
  shell: {
    brand: string;
    localeSwitcherAria: string;
    english: string;
    spanish: string;
  };
  marketing: {
    eyebrow: string;
    headline: string;
    subline: string;
    ctaPrimary: string;
    ctaPrimaryHint: string;
    footnote: string;
  };
  countdown: {
    label: string;
    ended: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  featured: {
    sectionTitle: string;
    sectionSubtitle: string;
    empty: string;
    /** Use `{percent}` placeholder. */
    discount: string;
    seePhotos: string;
    imagePlaceholder: string;
  };
  stock: {
    inStock: string;
    specialOrder: string;
  };
  trust: {
    title: string;
    line1: string;
    line2: string;
    line3: string;
  };
};
