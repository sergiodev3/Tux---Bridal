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
  contact: {
    title: string;
    facebook: string;
    whatsapp: string;
    location: string;
    openInMaps: string;
    routeButton: string;
    whatsappPrefill: string;
  };
  claim: {
    cardCta: string;
    modalTitle: string;
    suitLabel: string;
    emailLabel: string;
    emailPlaceholder: string;
    submit: string;
    submitting: string;
    cancel: string;
    close: string;
    download: string;
    successTitle: string;
    successHint: string;
    successReusedHint: string;
    errorEmail: string;
    errorRateLimit: string;
    errorGeneric: string;
    errorNotFound: string;
  };
  pdf: {
    codeCaption: string;
    expiresCaption: string;
    footerEn: string;
    footerEs: string;
  };
};
