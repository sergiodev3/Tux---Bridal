import {
  Document,
  Link,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import type { Locale } from "@/lib/i18n/config";

/* ── Brand tokens (react-pdf uses inline styles, not CSS vars) ───────────── */
const NAVY = "#1e2d4a";
const GOLD = "#8c6e2e";
const IVORY = "#f8f5ef";
const DARK = "#1a1f2e";
const MUTED = "#3e3934";
const BORDER = "#cec9bf";
const WHITE = "#ffffff";
const LIGHT_GOLD_BG = "#fdf3e0";

const styles = StyleSheet.create({
  page: {
    backgroundColor: IVORY,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: DARK,
  },

  /* ── Navy header band ──────────────────────────────────────────────────── */
  header: {
    backgroundColor: NAVY,
    paddingVertical: 20,
    paddingHorizontal: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerBrand: {
    color: IVORY,
    fontFamily: "Helvetica-Bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  headerSub: {
    color: GOLD,
    fontSize: 9,
    marginTop: 3,
    letterSpacing: 1,
  },
  headerBadge: {
    color: GOLD,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
  },

  /* ── Gold accent strip ─────────────────────────────────────────────────── */
  goldStrip: {
    backgroundColor: GOLD,
    height: 4,
  },

  /* ── Main body ─────────────────────────────────────────────────────────── */
  body: {
    paddingHorizontal: 36,
    paddingTop: 24,
    paddingBottom: 16,
  },

  /* ── Eyebrow label ─────────────────────────────────────────────────────── */
  eyebrow: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: GOLD,
    letterSpacing: 2,
    marginBottom: 10,
  },

  /* ── Discount hero ─────────────────────────────────────────────────────── */
  discountBox: {
    backgroundColor: NAVY,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 20,
    alignItems: "center",
  },
  discountAmount: {
    fontFamily: "Helvetica-Bold",
    fontSize: 56,
    color: GOLD,
    lineHeight: 1,
  },
  discountOff: {
    fontFamily: "Helvetica-Bold",
    fontSize: 20,
    color: GOLD,
    letterSpacing: 2,
  },
  discountSub: {
    fontSize: 13,
    color: IVORY,
    fontFamily: "Helvetica-Bold",
    marginTop: 8,
    letterSpacing: 0.5,
  },
  discountNote: {
    fontSize: 9,
    color: "#b0a89a",
    marginTop: 4,
  },

  /* ── Divider ───────────────────────────────────────────────────────────── */
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    marginVertical: 14,
  },

  /* ── Giveaway section ──────────────────────────────────────────────────── */
  giveawayHeader: {
    fontFamily: "Helvetica-Bold",
    fontSize: 14,
    color: NAVY,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  giveawayPrizeLine: {
    fontSize: 10,
    color: DARK,
    marginBottom: 4,
    lineHeight: 1.6,
  },
  giveawayPrizeBold: {
    fontFamily: "Helvetica-Bold",
    color: GOLD,
    fontSize: 11,
  },

  /* ── Winner info box ───────────────────────────────────────────────────── */
  winnerBox: {
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 10,
    marginTop: 10,
    marginBottom: 14,
  },
  winnerLine: {
    fontSize: 9,
    color: MUTED,
    marginBottom: 3,
    lineHeight: 1.6,
  },

  /* ── Extra entries ─────────────────────────────────────────────────────── */
  extraTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: NAVY,
    letterSpacing: 1.5,
    marginBottom: 5,
  },
  entryRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  entryBullet: {
    width: 12,
    color: GOLD,
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
  entryText: {
    fontSize: 10,
    color: DARK,
    flex: 1,
  },

  /* ── Facebook CTA ──────────────────────────────────────────────────────── */
  fbBox: {
    backgroundColor: LIGHT_GOLD_BG,
    borderWidth: 1,
    borderColor: GOLD,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  fbLabel: {
    fontSize: 9,
    color: MUTED,
  },
  fbLink: {
    fontSize: 9,
    color: NAVY,
    fontFamily: "Helvetica-Bold",
    textDecoration: "underline",
  },

  /* ── Terms ─────────────────────────────────────────────────────────────── */
  termsTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7.5,
    color: MUTED,
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  termsText: {
    fontSize: 7.5,
    color: MUTED,
    lineHeight: 1.5,
  },

  /* ── Footer redemption band ────────────────────────────────────────────── */
  footer: {
    backgroundColor: NAVY,
    paddingVertical: 14,
    paddingHorizontal: 36,
    alignItems: "center",
  },
  footerText: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: GOLD,
    letterSpacing: 2,
  },
  footerSub: {
    fontSize: 8,
    color: IVORY,
    marginTop: 4,
    letterSpacing: 0.5,
  },
});

export type CouponPdfDocumentProps = Readonly<{
  businessName: string;
  addressLine: string;
  phoneLine: string;
  facebookUrl: string;
  locale: Locale;
}>;

export function CouponPdfDocument({
  businessName,
  addressLine,
  phoneLine,
  facebookUrl,
  locale,
}: CouponPdfDocumentProps) {
  const isEs = locale === "es";

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>

        {/* ── Navy header ───────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerBrand}>{businessName}</Text>
            {addressLine ? (
              <Text style={styles.headerSub}>
                {addressLine}{phoneLine ? `  |  ${phoneLine}` : ""}
              </Text>
            ) : null}
          </View>
          <Text style={styles.headerBadge}>
            {isEs ? "CUPON OFICIAL" : "OFFICIAL COUPON"}
          </Text>
        </View>
        <View style={styles.goldStrip} />

        {/* ── Body ──────────────────────────────────────────────────────── */}
        <View style={styles.body}>

          {/* Eyebrow */}
          <Text style={styles.eyebrow}>
            {isEs
              ? "ESPECIAL PROM -- TIEMPO LIMITADO"
              : "PROM SPECIAL -- LIMITED TIME"}
          </Text>

          {/* Discount hero box */}
          <View style={styles.discountBox}>
            <Text style={styles.discountAmount}>$10</Text>
            <Text style={styles.discountOff}>{isEs ? "DE DESCUENTO" : "OFF"}</Text>
            <Text style={styles.discountSub}>
              {isEs
                ? "EN TU RENTA DE TRAJE PARA PROM"
                : "YOUR PROM TUXEDO RENTAL"}
            </Text>
            <Text style={styles.discountNote}>
              {isEs
                ? "Un cupon por renta  |  Solo en tienda"
                : "One coupon per rental  |  In-store only"}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Giveaway heading */}
          <Text style={styles.giveawayHeader}>
            {isEs ? "BIG SAVINGS + GIVEAWAY" : "BIG SAVINGS + GIVEAWAY"}
          </Text>

          {/* Prize */}
          <Text style={styles.giveawayPrizeLine}>
            {isEs
              ? "Obtén $10 de descuento en tu renta "
              : "Get $10 OFF your rental "}
            <Text style={styles.giveawayPrizeBold}>
              {isEs ? "Y PARTICIPA PARA GANAR " : "AND ENTER TO WIN "}
            </Text>
            {isEs
              ? "una tarjeta de regalo de $50 a un restaurante local."
              : "a $50 Gift Card to a local restaurant."}
          </Text>

          {/* Winner info box */}
          <View style={styles.winnerBox}>
            <Text style={styles.winnerLine}>
              {isEs
                ? "Ganador anunciado el 31 de mayo de 2026."
                : "One winner selected on May 31, 2026."}
            </Text>
            <Text style={styles.winnerLine}>
              {isEs
                ? "El nombre del ganador sera publicado en la pagina de Facebook."
                : "Winner's name will be posted on our Facebook page."}
            </Text>
            <Text style={styles.winnerLine}>
              {isEs
                ? "El ganador debe presentar ticket o recibo de renta para recibir la tarjeta de regalo."
                : "Winner must have ticket or receipt of rental to receive gift card."}
            </Text>
            <Text style={styles.winnerLine}>
              {isEs
                ? "El ganador debe aceptar que Tux & Bridal 4 Less tome una foto para Facebook y la tienda con fines de promocion."
                : "Winner must consent to allow Tux & Bridal 4 Less to take a photo and post on Facebook and in-store for promotion."}
            </Text>
          </View>

          {/* Extra entries */}
          <Text style={styles.extraTitle}>
            {isEs
              ? "GANA UNA ENTRADA EXTRA SI:"
              : "GET ONE EXTRA ENTRY IF YOU:"}
          </Text>
          <View style={styles.entryRow}>
            <Text style={styles.entryBullet}>*</Text>
            <Text style={styles.entryText}>
              {isEs ? "Nos sigues en Facebook" : "Follow us on Facebook"}
            </Text>
          </View>
          <View style={styles.entryRow}>
            <Text style={styles.entryBullet}>*</Text>
            <Text style={styles.entryText}>
              {isEs ? "Compartes la publicacion" : "Share the post"}
            </Text>
          </View>
          <View style={styles.entryRow}>
            <Text style={styles.entryBullet}>*</Text>
            <Text style={styles.entryText}>
              {isEs ? "Etiquetas a un amigo" : "Tag a friend"}
            </Text>
          </View>

          {/* Facebook link */}
          <View style={styles.fbBox}>
            <Text style={styles.fbLabel}>
              {isEs ? "Siguenos en Facebook:" : "Find us on Facebook:"}
            </Text>
            <Link src={facebookUrl} style={styles.fbLink}>
              {facebookUrl}
            </Link>
          </View>

          <View style={styles.divider} />

          {/* Terms */}
          <Text style={styles.termsTitle}>
            {isEs ? "TERMINOS Y CONDICIONES" : "TERMS & CONDITIONS"}
          </Text>
          <Text style={styles.termsText}>
            {isEs
              ? "Un cupon por renta de traje. Valido unicamente en tienda. Valido hasta el 31 de mayo de 2026. No es transferible ni canjeable por efectivo. Tux & Bridal 4 Less se reserva el derecho de modificar o cancelar esta promocion en cualquier momento."
              : "One coupon per tuxedo rental. Valid in-store only. Valid through May 31, 2026. Not transferable or redeemable for cash. Tux & Bridal 4 Less reserves the right to modify or cancel this promotion at any time."}
          </Text>

        </View>

        {/* ── Footer redemption band ─────────────────────────────────────── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {isEs
              ? "MOSTRAR ESTE CUPON AL MOMENTO DE LA RENTA"
              : "SHOW THIS COUPON AT TIME OF RENTAL"}
          </Text>
          <Text style={styles.footerSub}>
            {isEs
              ? "Presenta este cupon en tienda para canjearlo."
              : "Present this coupon in-store to redeem."}
          </Text>
        </View>

      </Page>
    </Document>
  );
}
