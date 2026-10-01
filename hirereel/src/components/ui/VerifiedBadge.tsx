"use client";

import { BadgeCheck } from "lucide-react";

export function VerifiedBadge({ label = "Verified" }: { label?: string }) {
  return (
    <span className="chip bg-[var(--mint)] text-[var(--on-accent)]">
      <BadgeCheck size={12} />
      {label}
    </span>
  );
}
