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

const nextConfig: NextConfig = {
  serverExternalPackages: ["@react-pdf/renderer"],
  ...(supabaseHost
    ? {
        images: {
          remotePatterns: [
            {
              protocol: "https",
              hostname: supabaseHost,
              pathname: "/storage/v1/object/public/**",
            },
          ],
        },
      }
    : {}),
};

export default nextConfig;
