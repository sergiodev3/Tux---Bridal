import { z } from "zod";

export const claimCouponFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "required")
    .email("invalid")
    .max(320, "too_long"),
  suitCategoryId: z.string().uuid(),
});

export type ClaimCouponFormInput = z.infer<typeof claimCouponFormSchema>;

export const claimCouponActionSchema = claimCouponFormSchema.extend({
  locale: z.enum(["en", "es"]),
});

export type ClaimCouponActionInput = z.infer<typeof claimCouponActionSchema>;
