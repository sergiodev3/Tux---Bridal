import { z } from "zod";

const optionalUrl = z.preprocess(
  (value) => (typeof value === "string" && value === "" ? undefined : value),
  z.string().url().optional(),
);

const optionalString = z.preprocess(
  (value) => (typeof value === "string" && value === "" ? undefined : value),
  z.string().optional(),
);

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: optionalUrl,
  NEXT_PUBLIC_BUSINESS_NAME: optionalString,
  NEXT_PUBLIC_BUSINESS_PHONE: optionalString,
  NEXT_PUBLIC_BUSINESS_ADDRESS: optionalString,
  NEXT_PUBLIC_JFW_PRODUCT_BASE_URL: optionalUrl,
});

const serverEnvSchema = clientEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

function readClientEnv(): Record<string, string | undefined> {
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_BUSINESS_NAME: process.env.NEXT_PUBLIC_BUSINESS_NAME,
    NEXT_PUBLIC_BUSINESS_PHONE: process.env.NEXT_PUBLIC_BUSINESS_PHONE,
    NEXT_PUBLIC_BUSINESS_ADDRESS: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS,
    NEXT_PUBLIC_JFW_PRODUCT_BASE_URL:
      process.env.NEXT_PUBLIC_JFW_PRODUCT_BASE_URL,
  };
}

/** Validated public env — safe to use in Client Components and Server Components. */
export function getPublicEnv(): ClientEnv {
  return clientEnvSchema.parse(readClientEnv());
}

/**
 * Full server env including `SUPABASE_SERVICE_ROLE_KEY`.
 * Call only from Server Components, Server Actions, Route Handlers, or other server-only code.
 */
export function getServerEnv(): ServerEnv {
  return serverEnvSchema.parse({
    ...readClientEnv(),
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
}
