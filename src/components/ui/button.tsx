import Link from "next/link";
import type { LinkProps } from "next/link";
import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "destructive"
  | "outline"
  | "success";
type Size = "sm" | "md" | "lg";

/**
 * Visual variants:
 *  primary    — deep navy fill; main CTAs
 *  secondary  — cream fill; subdued actions
 *  ghost      — no fill; subtle in-context actions
 *  destructive— ruby fill; dangerous actions
 *  outline    — transparent with current-color border; works on any bg
 *  success    — forest-green fill; positive contact CTAs (WhatsApp etc.)
 */
const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground shadow-soft hover:brightness-[1.12] active:brightness-95",
  secondary:
    "bg-secondary text-secondary-foreground ring-1 ring-border hover:bg-muted active:brightness-95",
  ghost:
    "bg-transparent text-foreground hover:bg-muted active:bg-muted/70",
  destructive:
    "bg-destructive text-destructive-foreground shadow-soft hover:brightness-[1.12] active:brightness-95",
  outline:
    "bg-transparent ring-2 ring-current text-current hover:bg-current/10 active:bg-current/15",
  success:
    "bg-success text-success-foreground shadow-soft hover:brightness-[1.12] active:brightness-95",
};

const sizeClasses: Record<Size, string> = {
  sm: "min-h-9 px-4 py-1.5 text-sm",
  md: "min-h-11 px-5 py-2.5 text-sm",
  lg: "min-h-12 px-7 py-3 text-base",
};

/**
 * Shared base — formal, precise radii; explicit transition properties only.
 * Uppercase letter-spacing applied via size variant where needed by callers.
 */
const baseClasses =
  "inline-flex touch-manipulation select-none items-center justify-center gap-2 rounded font-semibold tracking-wide transition-[background-color,color,box-shadow,filter] duration-[var(--animate-fast)] ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-55";

type ButtonOwnProps = {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonProps = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    className,
    children,
    disabled,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <span
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
          <span>Loading…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
});

type ButtonLinkProps = ButtonOwnProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> &
  Pick<LinkProps, "href">;

/**
 * Uses a plain <a> for API routes (/api/*) and external URLs so the Next.js
 * router never intercepts file-download responses (which causes the link to
 * silently stop working after the first click due to prefetch caching).
 */
function isNativeAnchor(href: string | LinkProps["href"]): boolean {
  if (typeof href !== "string") return false;
  return href.startsWith("/api/") || /^https?:\/\//.test(href);
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  ...props
}: ButtonLinkProps) {
  const cls = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

  if (isNativeAnchor(href)) {
    return (
      <a href={href as string} className={cls} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} {...props}>
      {children}
    </Link>
  );
}
