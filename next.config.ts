import type { NextConfig } from "next";

function supabaseStorageHost(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return undefined;
  try {
    return new URL(raw).hostname;
  } catch {
    return undefined;
  }
}

const supabaseHost = supabaseStorageHost();

const jfwPatterns = [
  {
    protocol: "https" as const,
    hostname: "www.jimsformalwear.com",
    pathname: "/**",
  },
  {
    protocol: "https" as const,
    hostname: "jimsformalwear.com",
    pathname: "/**",
  },
];

const nextConfig: NextConfig = {
  serverExternalPackages: ["@react-pdf/renderer"],
  images: {
    remotePatterns: [
      ...(supabaseHost
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHost,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
      ...jfwPatterns,
    ],
  },
};

export default nextConfig;
