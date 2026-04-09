import type { Dictionary } from "@/lib/i18n/types";

type Props = Readonly<{
  stockType: "in_stock" | "special_order";
  dict: Dictionary;
}>;

/**
 * Flush-left badge pinned to the card image edge.
 * In-stock: forest green — clear positive availability signal.
 * Special order: accent gold — premium, considered choice.
 */
export function StockTypeBadge({ stockType, dict }: Props) {
  const label =
    stockType === "in_stock" ? dict.stock.inStock : dict.stock.specialOrder;

  const isWalkIn = stockType === "in_stock";

  return (
    <span
      className={[
        "inline-block rounded-r px-2.5 py-1.5 text-[10px] font-bold uppercase leading-tight tracking-[0.1em]",
        isWalkIn
          ? "bg-success text-success-foreground"
          : "bg-accent text-accent-foreground",
      ].join(" ")}
    >
      {label}
    </span>
  );
}
