import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type FeaturedSuitRow = {
  id: string;
  name: string;
  description: string;
  discount_percent: number;
  stock_type: "in_stock" | "special_order";
  image_url: string | null;
  jfw_url: string | null;
};

function normalizeStockType(value: unknown): "in_stock" | "special_order" {
  return value === "special_order" ? "special_order" : "in_stock";
}

export async function getFeaturedSuits(): Promise<FeaturedSuitRow[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("suit_categories")
    .select(
      "id, name, description, discount_percent, stock_type, image_url, jfw_url",
    )
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: true })
    .limit(4);

  if (error) {
    console.error("[getFeaturedSuits]", error.message);
    return [];
  }

  if (!data?.length) {
    return [];
  }

  return data.map((row) => ({
    id: row.id as string,
    name: row.name as string,
    description: (row.description as string) ?? "",
    discount_percent: Number(row.discount_percent),
    stock_type: normalizeStockType(row.stock_type),
    image_url: (row.image_url as string | null) ?? null,
    jfw_url: (row.jfw_url as string | null) ?? null,
  }));
}
