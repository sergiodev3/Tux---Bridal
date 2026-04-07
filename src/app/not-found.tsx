import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-stone-50 px-6 text-center">
      <h1 className="font-display text-2xl font-semibold text-stone-900">
        Page not found
      </h1>
      <p className="max-w-sm text-stone-600">
        The page you are looking for does not exist or the link is incorrect.
      </p>
      <Link
        href="/en"
        className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-stone-50"
      >
        Go to home (English)
      </Link>
    </div>
  );
}
