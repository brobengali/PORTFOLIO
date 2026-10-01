"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, Mail, UserRound, Video } from "lucide-react";
import type { UserRole, WaitlistStats } from "@/types";

function LiveCount({ value }: { value: number }) {
  const motionValue = useMotionValue(value);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest).toLocaleString());
  const prev = useRef(value);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: prev.current === 0 ? 0.2 : 0.85,
      ease: [0.22, 1, 0.36, 1],
    });
    prev.current = value;
    return () => controls.stop();
  }, [motionValue, value]);

  return <motion.span>{rounded}</motion.span>;
}

export function WaitlistSection() {
  const [stats, setStats] = useState<WaitlistStats | null>(null);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("freelancer");
  const params = useSearchParams();
  const [referredBy, setReferredBy] = useState(params.get("ref") ?? "");
  const [result, setResult] = useState<{ referralCode: string; position: number; incremented: boolean } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/waitlist", { cache: "no-store" });
        const data = await res.json();
        if (!cancelled && data.stats) setStats(data.stats);
      } catch {
        /* ignore */
      }
    }
    load();
    const id = window.setInterval(load, 4000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role, referredBy }),
    });
    const data = await res.json();
    if (data.incremented) {
      setBump(true);
      window.setTimeout(() => setBump(false), 1600);
    }
    setResult({
      referralCode: data.referralCode,
      position: data.position,
      incremented: Boolean(data.incremented),
    });
    if (data.stats) setStats(data.stats);
    setBusy(false);
  }

  const share =
    typeof window !== "undefined" && result
      ? `${window.location.origin}/?view=waitlist&ref=${result.referralCode}`
      : "";

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-display text-5xl leading-[1.08] md:text-6xl">
            Showcase your 2-min visume.
            <br />
            <span className="hl mt-3">Get hired fast.</span>
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-relaxed text-[var(--muted)]">
            Traditional 2-page PDFs miss energy and personality. HireReel is video-first hiring for{" "}
            <strong className="text-[var(--ink)]">top 1% freelance talent.</strong>
          </p>
          <a href="#join" className="btn-primary mt-8 px-6 py-3">
            Claim my wave seat <ArrowRight size={16} />
          </a>
          {stats && (
            <p className="mt-5 text-sm text-[var(--muted)]">
              <strong className="text-[var(--ink)]">{stats.total.toLocaleString()}</strong> people are already
              waiting. Join before this wave fills.
            </p>
          )}
        </motion.div>

        <div className="space-y-4">
          {[
            {
              icon: <Video size={14} />,
              tag: "Visume recorded",
              body: "2:00 · Intro, core skills, why hire you",
              cls: "card card-violet",
            },
            {
              icon: <UserRound size={14} />,
              tag: "Verified badges",
              body: "React · Next.js · Figma — skill audit passed",
              cls: "card",
            },
            {
              icon: <Mail size={14} />,
              tag: "Interview booked",
              body: "“Loved the reel. Free for a quick call Thursday?”",
              cls: "card card-mint",
            },
          ].map((c, i) => (
            <motion.div
              key={c.tag}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.12 }}
              className={`${c.cls} p-5`}
            >
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] opacity-80">
                <span className="grid h-6 w-6 place-items-center rounded-full border-[1.6px] border-current">
                  {c.icon}
                </span>
                {c.tag}
              </p>
              <p className="mt-3 text-sm">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-tint py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { k: "In queue", v: stats ? <LiveCount value={stats.total} /> : "—", n: "01", c: "" },
              { k: "Current wave", v: stats ? `#${stats.wave}` : "—", n: "02", c: "mint" },
              { k: "Seats left", v: stats?.remaining ?? "—", n: "03", c: "sun" },
            ].map((card) => (
              <motion.div key={card.k} layout className={`card p-6 ${bump && card.n === "01" ? "pop-in" : ""}`}>
                <span className={`num-badge ${card.c}`}>{card.n}</span>
                <div className="font-display mt-4 text-4xl">{card.v}</div>
                <div className="mt-1 text-sm text-[var(--muted)]">{card.k}</div>
                {bump && card.n === "01" && (
                  <div className="mt-2 text-xs font-semibold text-[var(--ok)]">+1 just joined</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="join" className="mx-auto max-w-2xl px-4 py-16">
        <h2 className="font-display text-center text-4xl">
          Join the <span className="hl hl-pink">waitlist</span>
        </h2>
        <p className="mt-3 text-center text-[var(--muted)]">Takes 30 seconds. Move up the queue with referrals.</p>

        <form onSubmit={onSubmit} className="card mt-8 space-y-4 p-6">
          <label className="block text-sm font-medium">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field mt-1"
              placeholder="you@studio.dev"
            />
          </label>
          <label className="block text-sm font-medium">
            Role
            <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="field mt-1">
              <option value="freelancer">Freelancer</option>
              <option value="client">Client / Recruiter</option>
            </select>
          </label>
          <label className="block text-sm font-medium">
            Referral code <span className="font-normal text-[var(--muted)]">(optional)</span>
            <input
              value={referredBy}
              onChange={(e) => setReferredBy(e.target.value)}
              className="field mt-1"
              placeholder="HR-XXXX"
            />
          </label>
          <button disabled={busy} className="btn-primary w-full py-3" type="submit">
            {busy ? "Joining…" : "Claim my wave seat"} <ArrowRight size={16} />
          </button>
        </form>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="card card-mint mt-6 p-6"
          >
            <p className="font-display text-2xl">You’re in — queue position #{result.position}</p>
            <p className="mt-2 text-sm">
              {result.incremented
                ? "The live counter just went up by 1. Share your link to climb faster."
                : "You’re already on the list — the counter stays the same for repeat emails."}
            </p>
            <p className="mt-2 text-sm">
              Your referral code: <strong>{result.referralCode}</strong>. Each successful referral moves you up
              the queue.
            </p>
            <p className="mt-2 break-all text-sm font-medium">{share}</p>
          </motion.div>
        )}
      </section>
    </div>
  );
}
