import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";

import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tux & Bridal 4 Less",
    template: "%s | Tux & Bridal 4 Less",
  },
  description:
    "Formal suit rentals in Weslaco, TX — graduations, quinceañeras, weddings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${dmSans.variable} ${cormorant.variable} min-h-dvh bg-background font-sans text-foreground antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-100 rounded bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground focus-visible:not-sr-only"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
