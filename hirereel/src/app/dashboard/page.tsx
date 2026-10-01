"use client";

import { useAuth } from "@/lib/auth-context";
import { VisumeStudio } from "@/components/video/VisumeStudio";
import { PROJECTS, FREELANCERS } from "@/lib/demo-data";
import Link from "next/link";

export default function DashboardPage() {
  const { session } = useAuth();
  const role = session?.role ?? "freelancer";

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-12">
      <div>
        <h1 className="font-display text-5xl">
          {role === "client" ? "Client ops" : role === "admin" ? "Admin console" : "Freelancer HQ"}
        </h1>
        <p className="mt-4 text-[var(--muted)]">
          Signed in as {session?.name ?? "Guest"} ({role}). Demo session uses local role switching — production
          path is NextAuth v5 with client / freelancer / admin.
        </p>
      </div>

      {role === "freelancer" && <VisumeStudio />}

      {role === "client" && (
        <div className="grid gap-6 md:grid-cols-2">
          {PROJECTS.map((p) => (
            <div key={p.id} className="card p-5">
              <h2 className="font-display text-2xl">{p.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{p.budgetLabel}</p>
              <Link href="/?view=projects" className="mt-4 inline-block text-sm font-semibold text-[var(--violet)]">
                Manage escrow →
              </Link>
            </div>
          ))}
        </div>
      )}

      {role === "admin" && (
        <div className="card card-soft p-5 text-sm">
          <p>Waitlist is stored in SQLite (prisma/dev.db).</p>
          <Link href="/admin/waitlist" className="mt-2 inline-block font-semibold text-[var(--violet)]">
            Open waitlist emails →
          </Link>
        </div>
      )}

      <div>
        <h2 className="font-display text-3xl">Suggested talent</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {FREELANCERS.slice(0, 4).map((f) => (
            <Link key={f.id} href={`/freelancer/${f.id}`} className="chip px-3 py-1.5 text-sm hover:bg-[var(--violet-soft)] hover:text-[var(--on-accent)]">
              {f.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
