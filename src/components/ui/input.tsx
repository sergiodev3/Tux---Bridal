import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

/**
 * Base input — restrained styling that reads as professional/formal.
 * Square radius matches the card/button visual language.
 */
export function Input({ className, invalid = false, ...props }: Props) {
  return (
    <input
      className={cn(
        "w-full min-h-11 rounded border bg-card px-3 py-2.5 text-sm text-card-foreground shadow-soft outline-none",
        "transition-[border-color,box-shadow] duration-[var(--animate-fast)]",
        "placeholder:text-muted-foreground/70",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
        invalid
          ? "border-destructive focus-visible:ring-destructive"
          : "border-border hover:border-muted-foreground/50",
        className,
      )}
      {...props}
    />
  );
}
