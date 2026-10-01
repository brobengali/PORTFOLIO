import { format } from "date-fns";
import { getFreelancer } from "@/lib/demo-data";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { ReelPlayer } from "@/components/video/ReelPlayer";
import Link from "next/link";

export function ProfileSection({ id }: { id: string }) {
  const f = getFreelancer(id);

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[380px_1fr]">
      <ReelPlayer talent={f} active={false} />
      <div className="space-y-8">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-5xl">{f.name}</h1>
            {f.verified && <VerifiedBadge label="Identity + skills" />}
          </div>
          <p className="mt-2 text-[var(--muted)]">
            {f.role} · {f.location} · Joined {format(new Date(f.joinedAt), "MMM yyyy")}
          </p>
          <p className="mt-5 text-xl">{f.headline}</p>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">{f.bio}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            [`$${f.hourlyRate}`, "Hourly", "card"],
            [`★ ${f.rating}`, `${f.reviewCount} reviews`, "card card-violet"],
            [`${f.completionRate}%`, "Jobs completed", "card card-mint"],
            [f.responseTime, "Response", "card"],
          ].map(([n, l, cls]) => (
            <div key={l} className={`${cls} p-4`}>
              <div className="font-display text-2xl">{n}</div>
              <div className="text-xs opacity-80">{l}</div>
            </div>
          ))}
        </div>

        <div>
          <h2 className="font-display text-2xl">Verified skill audit</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {f.skills.map((s) => (
              <span key={s.name} className={`chip ${s.verified ? "bg-[var(--mint)] text-[var(--on-accent)]" : ""}`}>
                {s.name} {s.verified ? "✓" : ""}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl">Portfolio proof</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {f.portfolio.map((p) => (
              <li key={p.title}>
                <a className="font-semibold text-[var(--violet)] underline-offset-2 hover:underline" href={p.url} target="_blank" rel="noreferrer">
                  {p.kind}: {p.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-2xl">Client reviews</h2>
          {f.reviews.length === 0 && <p className="mt-2 text-sm text-[var(--muted)]">No reviews yet.</p>}
          {f.reviews.map((r) => (
            <blockquote key={r.id} className="card card-soft mt-3 p-4 text-sm">
              ★ {r.rating} — {r.client}: {r.text}
            </blockquote>
          ))}
        </div>

        <p className="text-sm text-[var(--muted)]">
          Total earnings displayed: ${f.earnings.toLocaleString()} · Availability: {f.availability}
        </p>
        <Link href="/messages" className="btn-primary px-6 py-3">
          Message & book interview
        </Link>
      </div>
    </div>
  );
}
