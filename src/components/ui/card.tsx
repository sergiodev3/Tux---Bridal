import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type Props = HTMLAttributes<HTMLDivElement>;

/**
 * Crisp white card — clean separation from ivory page, precise radius,
 * editorial shadow modeled on formal retail product cards.
 */
export function Card({ className, ...props }: Props) {
  return (
    <div
      className={cn(
        "rounded border border-border bg-card text-card-foreground shadow-card transition-[box-shadow] duration-[var(--animate-base)] ease-out",
        className,
      )}
      {...props}
    />
  );
}
