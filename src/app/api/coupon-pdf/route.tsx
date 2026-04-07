import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";

import { CouponPdfDocument } from "@/lib/pdf/coupon-document";
import { getPublicEnv } from "@/lib/env";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export const dynamic = "force-dynamic";

type CouponPdfRow = {
  code: string;
  discount_percent: number;
  stock_type_snapshot: string;
  expires_at: string;
  suit_categories: { name: string } | null;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const codeRaw = searchParams.get("code")?.trim();
  const localeParam = searchParams.get("locale") ?? "en";
  const locale: Locale = isLocale(localeParam) ? localeParam : "en";

  if (!codeRaw) {
    return NextResponse.json({ error: "missing_code" }, { status: 400 });
  }

  const code = codeRaw.toUpperCase();

  const supabase = createSupabaseServiceClient();
  const { data, error } = await supabase
    .from("coupons")
    .select(
      `
      code,
      discount_percent,
      stock_type_snapshot,
      expires_at,
      suit_categories ( name )
    `,
    )
    .eq("code", code)
    .maybeSingle();

  if (error) {
    console.error("[coupon-pdf]", error.message);
    return NextResponse.json({ error: "lookup_failed" }, { status: 500 });
  }

  const row = data as CouponPdfRow | null;
  if (!row) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const env = getPublicEnv();
  const dict = getDictionary(locale);

  const businessName = env.NEXT_PUBLIC_BUSINESS_NAME ?? "Tux Bridal";
  const addressLine = env.NEXT_PUBLIC_BUSINESS_ADDRESS ?? "Weslaco, TX";
  const phoneLine = env.NEXT_PUBLIC_BUSINESS_PHONE ?? "";

  const suitName = row.suit_categories?.name ?? "Formal suit";
  const stockTypeSnapshot =
    row.stock_type_snapshot === "special_order" ? "special_order" : "in_stock";
  const stockLabel =
    stockTypeSnapshot === "in_stock"
      ? dict.stock.inStock
      : dict.stock.specialOrder;

  const discountLine = dict.featured.discount.replace(
    "{percent}",
    String(row.discount_percent),
  );

  const expiresFormatted = new Intl.DateTimeFormat(
    locale === "es" ? "es-US" : "en-US",
    {
      dateStyle: "long",
      timeZone: "America/Chicago",
    },
  ).format(new Date(row.expires_at));

  try {
    const buffer = await renderToBuffer(
      <CouponPdfDocument
        businessName={businessName}
        addressLine={addressLine}
        phoneLine={phoneLine}
        suitName={suitName}
        stockTypeSnapshot={stockTypeSnapshot}
        stockLabel={stockLabel}
        discountLine={discountLine}
        codeCaption={dict.pdf.codeCaption}
        code={row.code}
        expiresCaption={dict.pdf.expiresCaption}
        expiresFormatted={expiresFormatted}
        footerLineEn={dict.pdf.footerEn}
        footerLineEs={dict.pdf.footerEs}
      />,
    );

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="tux-bridal-coupon-${row.code}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("[coupon-pdf] render", e);
    return NextResponse.json({ error: "render_failed" }, { status: 500 });
  }
}
