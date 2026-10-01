"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FREELANCERS } from "@/lib/demo-data";
import type { AvailabilityStatus, ExperienceLevel, SortOption } from "@/types";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";

const SKILLS = ["React", "Next.js", "Python", "Figma", "UI/UX", "AI/ML"];

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [skill, setSkill] = useState("");
  const [experience, setExperience] = useState<ExperienceLevel | "">("");
  const [availability, setAvailability] = useState<AvailabilityStatus | "">("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [maxRate, setMaxRate] = useState(200);
  const [language, setLanguage] = useState("");
  const [sort, setSort] = useState<SortOption>("relevance");

  const results = useMemo(() => {
    let list = FREELANCERS.filter((f) => {
      const hay = `${f.name} ${f.role} ${f.headline} ${f.tags.join(" ")}`.toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) return false;
      if (skill && !f.tags.some((t) => t.toLowerCase().includes(skill.toLowerCase())) && !f.skills.some((s) => s.name === skill))
        return false;
      if (experience && f.experience !== experience) return false;
      if (availability && f.availability !== availability) return false;
      if (verifiedOnly && !f.verified) return false;
      if (f.hourlyRate > maxRate) return false;
      if (language && !f.languages.some((l) => l.toLowerCase().includes(language.toLowerCase()))) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === "rate_asc") return a.hourlyRate - b.hourlyRate;
      if (sort === "rate_desc") return b.hourlyRate - a.hourlyRate;
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "newest") return +new Date(b.joinedAt) - +new Date(a.joinedAt);
      return b.rating * 10 + (b.verified ? 5 : 0) - (a.rating * 10 + (a.verified ? 5 : 0));
    });
    return list;
  }, [q, skill, experience, availability, verifiedOnly, maxRate, language, sort]);

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[280px_1fr]">
      <aside className="card h-fit space-y-4 p-5">
        <h2 className="font-display text-2xl">Filters</h2>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search talent" className="field text-sm" />
        <label className="block text-xs font-medium text-[var(--muted)]">
          Skill
          <select value={skill} onChange={(e) => setSkill(e.target.value)} className="field mt-1 text-sm">
            <option value="">All</option>
            {SKILLS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-medium text-[var(--muted)]">
          Experience
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value as ExperienceLevel | "")}
            className="field mt-1 text-sm"
          >
            <option value="">Any</option>
            <option value="entry">entry</option>
            <option value="intermediate">intermediate</option>
            <option value="expert">expert</option>
          </select>
        </label>
        <label className="block text-xs font-medium text-[var(--muted)]">
          Availability
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value as AvailabilityStatus | "")}
            className="field mt-1 text-sm"
          >
            <option value="">Any</option>
            <option value="available">available</option>
            <option value="limited">limited</option>
            <option value="booked">booked</option>
          </select>
        </label>
        <label className="block text-xs font-medium text-[var(--muted)]">
          Language
          <input
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="field mt-1 text-sm"
            placeholder="English, Hindi…"
          />
        </label>
        <label className="block text-xs font-medium text-[var(--muted)]">
          Max hourly ${maxRate}
          <input
            type="range"
            min={40}
            max={200}
            value={maxRate}
            onChange={(e) => setMaxRate(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--violet)]"
          />
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="accent-[var(--violet)]"
          />
          Verified only
        </label>
        <label className="block text-xs font-medium text-[var(--muted)]">
          Sort
          <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)} className="field mt-1 text-sm">
            <option value="relevance">relevance</option>
            <option value="rate_asc">rate low → high</option>
            <option value="rate_desc">rate high → low</option>
            <option value="rating">verified rating</option>
            <option value="newest">newest members</option>
          </select>
        </label>
      </aside>

      <section className="space-y-5">
        <h1 className="font-display text-4xl">
          {results.length} talent <span className="hl">matches</span>
        </h1>
        {results.map((f) => (
          <Link
            key={f.id}
            href={`/freelancer/${f.id}`}
            className="card flex gap-4 p-4 transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={f.poster}
              alt=""
              className="h-24 w-20 rounded-xl border-[1.6px] border-[var(--line)] object-cover"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <strong className="font-display text-lg">{f.name}</strong>
                {f.verified && <VerifiedBadge />}
              </div>
              <p className="text-sm text-[var(--muted)]">
                {f.role} · ${f.hourlyRate}/hr · ★ {f.rating} · {f.experience}
              </p>
              <p className="mt-1 truncate text-sm">{f.headline}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
