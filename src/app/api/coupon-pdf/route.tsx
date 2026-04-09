import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";

import { CouponPdfDocument } from "@/lib/pdf/coupon-document";
import { getPublicEnv } from "@/lib/env";
import { isLocale, type Locale } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get("locale") ?? "en";
  const locale: Locale = isLocale(localeParam) ? localeParam : "en";

  const env = getPublicEnv();
  const businessName = env.NEXT_PUBLIC_BUSINESS_NAME ?? "Tux & Bridal 4 Less";
  const addressLine = env.NEXT_PUBLIC_BUSINESS_ADDRESS ?? "Weslaco, TX";
  const phoneLine = env.NEXT_PUBLIC_BUSINESS_PHONE ?? "";
  const facebookUrl = env.NEXT_PUBLIC_FACEBOOK_URL ?? "https://www.facebook.com/tuxbri4less/";

  try {
    const buffer = await renderToBuffer(
      <CouponPdfDocument
        businessName={businessName}
        addressLine={addressLine}
        phoneLine={phoneLine}
        facebookUrl={facebookUrl}
        locale={locale}
      />,
    );

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="tux-bridal-prom-coupon.pdf"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (e) {
    console.error("[coupon-pdf] render", e);
    return NextResponse.json({ error: "render_failed" }, { status: 500 });
  }
}
