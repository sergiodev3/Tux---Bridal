import type { Dictionary } from "@/lib/i18n/types";

type Props = Readonly<{
  stockType: "in_stock" | "special_order";
  dict: Dictionary;
}>;

export function StockTypeBadge({ stockType, dict }: Props) {
  const label =
    stockType === "in_stock" ? dict.stock.inStock : dict.stock.specialOrder;

  const isWalkIn = stockType === "in_stock";

  return (
    <span
      className={`inline-block max-w-full rounded-md px-2.5 py-1.5 text-center text-[11px] font-bold uppercase leading-tight tracking-wide sm:text-xs ${
        isWalkIn
          ? "bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-800/30"
          : "bg-amber-600 text-white shadow-sm ring-1 ring-amber-800/30"
      }`}
    >
      {label}
    </span>
  );
}
