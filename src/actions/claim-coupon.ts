"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServiceClient } from "@/lib/supabase/service";
import {
  claimCouponActionSchema,
  type ClaimCouponActionInput,
} from "@/lib/validations/claim-coupon";

export type ClaimCouponSuccess = Readonly<{
  ok: true;
  code: string;
  reused: boolean;
  discountPercent: number;
  expiresAt: string;
  suitName: string;
  stockTypeSnapshot: "in_stock" | "special_order";
}>;

export type ClaimCouponFailure = Readonly<{
  ok: false;
  code:
    | "VALIDATION"
    | "INVALID_EMAIL"
    | "SUIT_NOT_FOUND"
    | "RATE_LIMIT"
    | "UNKNOWN";
}>;

export type ClaimCouponResult = ClaimCouponSuccess | ClaimCouponFailure;

function parseRpcPayload(data: unknown): Omit<ClaimCouponSuccess, "ok"> | null {
  if (!data || typeof data !== "object") return null;
  const o = data as Record<string, unknown>;
  if (typeof o.code !== "string") return null;
  const stock = o.stock_type_snapshot;
  const stockTypeSnapshot =
    stock === "special_order" ? "special_order" : "in_stock";
  const expiresRaw = o.expires_at;
  const expiresAt =
    typeof expiresRaw === "string"
      ? expiresRaw
      : expiresRaw instanceof Date
        ? expiresRaw.toISOString()
        : String(expiresRaw ?? "");
  if (!expiresAt) return null;
  const discountPercent = Number(o.discount_percent);
  if (Number.isNaN(discountPercent)) return null;
  const suitName = typeof o.suit_name === "string" ? o.suit_name : "";
  return {
    code: o.code,
    reused: Boolean(o.reused),
    discountPercent,
    expiresAt,
    suitName,
    stockTypeSnapshot,
  };
}

function rpcErrorToCode(
  message: string,
  details: string,
): ClaimCouponFailure["code"] {
  const blob = `${message} ${details}`.toUpperCase();
  if (blob.includes("RATE_LIMIT")) return "RATE_LIMIT";
  if (blob.includes("INVALID_EMAIL")) return "INVALID_EMAIL";
  if (blob.includes("SUIT_NOT_FOUND")) return "SUIT_NOT_FOUND";
  if (blob.includes("CODE_GEN_FAILED")) return "UNKNOWN";
  return "UNKNOWN";
}

export async function claimCouponAction(
  raw: unknown,
): Promise<ClaimCouponResult> {
  const parsed = claimCouponActionSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, code: "VALIDATION" };
  }

  const input: ClaimCouponActionInput = parsed.data;
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase.rpc("claim_coupon", {
    p_email: input.email.toLowerCase(),
    p_suit_category_id: input.suitCategoryId,
    p_source: "qr_flyer",
  });

  if (error) {
    const msg = error.message ?? "";
    const details = error.details ?? "";
    return { ok: false, code: rpcErrorToCode(msg, details) };
  }

  const payload = parseRpcPayload(data);
  if (!payload) {
    return { ok: false, code: "UNKNOWN" };
  }

  revalidatePath(`/${input.locale}`);

  return { ok: true, ...payload };
}
