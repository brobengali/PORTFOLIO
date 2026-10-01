"use client";

import { useState } from "react";
import { PROJECTS } from "@/lib/demo-data";
import type { MilestoneStatus } from "@/types";

const LABELS: Record<MilestoneStatus, string> = {
  funded: "In escrow",
  in_review: "Deliverable in review",
  revision: "Revision requested",
  released: "Released",
  pending: "Not funded",
};

const STATUS_BG: Record<MilestoneStatus, string> = {
  funded: "bg-[var(--violet-soft)] text-[var(--on-accent)]",
  in_review: "bg-[var(--sun)] text-[var(--on-accent)]",
  revision: "bg-[var(--pink)] text-[var(--on-accent)]",
  released: "bg-[var(--mint)] text-[var(--on-accent)]",
  pending: "",
};

export function ProjectsSection() {
  const [note, setNote] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-12">
      <div>
        <h1 className="font-display text-5xl">
          Contract <span className="hl">marketplace</span>
        </h1>
        <p className="mt-4 text-lg text-[var(--muted)]">
          Fixed-price or hourly. Clients fund milestones into escrow; funds release after review.
        </p>
      </div>
      {PROJECTS.map((p) => (
        <article key={p.id} className="card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl">{p.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">
                {p.client} · {p.budgetType} · {p.budgetLabel}
              </p>
            </div>
            <button
              type="button"
              className="btn-primary px-4 py-2 text-sm"
              onClick={() => setNote(`Proposal sent for “${p.title}”. Client will review in-app.`)}
            >
              Submit proposal
            </button>
          </div>
          <p className="mt-4 text-sm leading-relaxed">{p.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {p.skills.map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </div>
          <ul className="mt-5 space-y-2 text-sm">
            {p.milestones.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between rounded-xl border-[1.6px] border-[var(--line)] bg-[var(--bg-elev)] px-4 py-2.5"
              >
                <span>
                  {m.title} {m.amount ? `· $${m.amount}` : ""}
                </span>
                <span className={`chip ${STATUS_BG[m.status]}`}>{LABELS[m.status]}</span>
              </li>
            ))}
          </ul>
        </article>
      ))}
      {note && <p className="card card-mint p-4 text-sm font-medium">{note}</p>}
    </div>
  );
}
