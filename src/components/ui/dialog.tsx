import type { MouseEvent, ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type Props = Readonly<{
  open: boolean;
  onBackdropMouseDown?: (event: MouseEvent<HTMLDivElement>) => void;
  children: ReactNode;
}>;

/**
 * Dialog primitive — strong backdrop scrim (formal modal feel),
 * crisp card panel with editorial shadow, contained scroll, overscroll lock.
 */
export function Dialog({ open, onBackdropMouseDown, children }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/60 p-4 backdrop-blur-[2px] sm:items-center"
      role="presentation"
      onMouseDown={onBackdropMouseDown}
    >
      <div
        className={cn(
          "max-h-[90vh] w-full max-w-md overflow-y-auto overscroll-contain",
          "rounded border border-border bg-card p-6 text-card-foreground shadow-floating",
          "transition-[opacity,transform] duration-[var(--animate-base)] ease-out",
        )}
      >
        {children}
      </div>
    </div>
  );
}
