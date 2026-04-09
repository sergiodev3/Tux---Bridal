import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      {/* Oversized display numeral */}
      <p className="font-display text-[6rem] font-semibold leading-none tracking-tight text-border sm:text-[8rem]">
        404
      </p>
      <div>
        <h1 className="font-sans text-xl font-bold uppercase tracking-[0.06em] text-foreground">
          Page Not Found
        </h1>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          The page you are looking for does not exist or the link is incorrect.
        </p>
      </div>
      <ButtonLink href="/en" className="uppercase tracking-[0.08em]">
        Return to Home
      </ButtonLink>
    </div>
  );
}
