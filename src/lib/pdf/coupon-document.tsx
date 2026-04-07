import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 44,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#1c1917",
  },
  logoBox: {
    width: 120,
    height: 48,
    borderWidth: 1,
    borderColor: "#d6d3d1",
    borderStyle: "solid",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 9,
    color: "#78716c",
    letterSpacing: 1,
  },
  businessName: {
    fontSize: 20,
    marginBottom: 6,
    fontFamily: "Helvetica-Bold",
  },
  address: {
    fontSize: 10,
    color: "#57534e",
    marginBottom: 2,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e7e5e4",
    marginVertical: 18,
  },
  suitName: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#1c1917",
    color: "#fafaf9",
    paddingVertical: 6,
    paddingHorizontal: 12,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginBottom: 16,
    textTransform: "uppercase",
  },
  badgeOrder: {
    backgroundColor: "#b45309",
  },
  discountHuge: {
    fontSize: 36,
    fontFamily: "Helvetica-Bold",
    color: "#92400e",
    marginBottom: 14,
  },
  codeLabel: {
    fontSize: 10,
    color: "#57534e",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  codeHuge: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 3,
    marginBottom: 16,
  },
  expires: {
    fontSize: 11,
    color: "#44403c",
  },
  footer: {
    marginTop: 28,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#e7e5e4",
    fontSize: 9,
    color: "#57534e",
    lineHeight: 1.4,
  },
});

export type CouponPdfDocumentProps = Readonly<{
  businessName: string;
  addressLine: string;
  phoneLine: string;
  suitName: string;
  stockTypeSnapshot: "in_stock" | "special_order";
  stockLabel: string;
  discountLine: string;
  codeCaption: string;
  code: string;
  expiresFormatted: string;
  expiresCaption: string;
  footerLineEn: string;
  footerLineEs: string;
}>;

export function CouponPdfDocument({
  businessName,
  addressLine,
  phoneLine,
  suitName,
  stockTypeSnapshot,
  stockLabel,
  discountLine,
  codeCaption,
  code,
  expiresFormatted,
  expiresCaption,
  footerLineEn,
  footerLineEs,
}: CouponPdfDocumentProps) {
  const badgeStyle =
    stockTypeSnapshot === "special_order"
      ? [styles.badge, styles.badgeOrder]
      : styles.badge;

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>LOGO</Text>
        </View>
        <Text style={styles.businessName}>{businessName}</Text>
        {addressLine ? <Text style={styles.address}>{addressLine}</Text> : null}
        {phoneLine ? <Text style={styles.address}>{phoneLine}</Text> : null}

        <View style={styles.divider} />

        <Text style={styles.suitName}>{suitName}</Text>
        <Text style={badgeStyle}>{stockLabel}</Text>

        <Text style={styles.discountHuge}>{discountLine}</Text>

        <Text style={styles.codeLabel}>{codeCaption}</Text>
        <Text style={styles.codeHuge}>{code}</Text>

        <Text style={styles.expires}>
          {expiresCaption} {expiresFormatted}
        </Text>

        <View style={styles.footer}>
          <Text>{footerLineEn}</Text>
          <Text style={{ marginTop: 4 }}>{footerLineEs}</Text>
        </View>
      </Page>
    </Document>
  );
}
