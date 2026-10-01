"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { FilmMarquee } from "@/components/ui/FilmMarquee";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const LINKS = [
  { href: "/?view=waitlist", label: "Waitlist" },
  { href: "/?view=home", label: "Home" },
  { href: "/?view=discover", label: "Discover" },
  { href: "/search", label: "Search" },
  { href: "/?view=projects", label: "Projects" },
  { href: "/messages", label: "Messages" },
  { href: "/assistant", label: "Assistant" },
];

export function Navbar() {
  const pathname = usePathname();
  const params = useSearchParams();
  const { session, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const view = params.get("view");

  useEffect(() => {
    setReady(true);
  }, []);

  function active(href: string) {
    if (href.startsWith("/?")) {
      const v = new URLSearchParams(href.split("?")[1]).get("view");
      return pathname === "/" && (view === v || (!view && v === "waitlist"));
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-50">
      <FilmMarquee items={["Early access waves are filling up fast."]} />
      <div className="border-b-[1.6px] border-[var(--line)] bg-[var(--surface)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/?view=home" className="font-display text-2xl font-semibold tracking-tight">
            hirereel
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm transition-colors ${
                  ready && active(l.href)
                    ? "font-semibold text-[var(--ink)]"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            {session ? (
              <>
                <Link href="/dashboard" className="text-sm text-[var(--muted)]">
                  {session.name} · {session.role}
                </Link>
                <button type="button" onClick={signOut} className="text-sm font-medium text-[var(--violet)]">
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/onboarding" className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">
                  Onboarding
                </Link>
                <Link href="/signup" className="btn-dark px-5 py-2 text-sm">
                  Sign up
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button type="button" onClick={() => setOpen((v) => !v)} aria-label="Menu">
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="flex flex-col gap-3 border-b-[1.6px] border-[var(--line)] bg-[var(--surface)] px-4 py-4 md:hidden">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-[var(--muted)]">
              {l.label}
            </Link>
          ))}
          <Link href="/signup" onClick={() => setOpen(false)} className="btn-dark px-5 py-2 text-sm">
            Sign up
          </Link>
        </div>
      )}
    </header>
  );
}
