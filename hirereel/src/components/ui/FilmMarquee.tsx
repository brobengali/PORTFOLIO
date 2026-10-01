import Link from "next/link";

export function FilmMarquee({ items }: { items: string[] }) {
  return (
    <div className="bg-[var(--violet)] px-4 py-2 text-center text-xs font-medium text-white">
      {items[0]}{" "}
      <Link href="/?view=waitlist" className="font-semibold underline underline-offset-2">
        Grab your spot now →
      </Link>
    </div>
  );
}
