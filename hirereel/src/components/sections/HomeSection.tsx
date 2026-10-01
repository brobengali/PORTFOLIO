"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FREELANCERS, LIVE_METRICS } from "@/lib/demo-data";
import { VisumeStudio } from "@/components/video/VisumeStudio";
import { ReelPlayer } from "@/components/video/ReelPlayer";

export function HomeSection() {
  const featured = FREELANCERS.slice(0, 3);

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-5xl leading-[1.08] md:text-6xl">
            Hiring managers get 6 seconds.
            <br />
            <span className="hl mt-3">You get 2 minutes.</span>
          </h1>
          <p className="mt-7 max-w-lg text-lg leading-relaxed text-[var(--muted)]">
            Record a visume, earn verified skill badges, and land contracts without cold cover letters.
            Clients browse a Reels-style feed and hire with milestone escrow.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/?view=discover" className="btn-primary px-6 py-3">
              Open talent feed <ArrowRight size={16} />
            </Link>
            <Link href="/search" className="btn-outline px-6 py-3">
              Search talent
            </Link>
          </div>
        </motion.div>
        <div className="grid grid-cols-2 gap-5">
          {[
            [LIVE_METRICS.visumes.toLocaleString(), "Visumes", "card"],
            [LIVE_METRICS.hires.toLocaleString(), "Hires closed", "card card-violet"],
            [`${LIVE_METRICS.avgDecisionSec}s`, "Avg. decision", "card card-mint"],
            [`${Math.round(LIVE_METRICS.verifiedRate * 100)}%`, "Verified talent", "card"],
          ].map(([n, l, cls], i) => (
            <motion.div
              key={l}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className={`${cls} p-6`}
            >
              <div className="font-display text-4xl">{n}</div>
              <div className="mt-1 text-sm opacity-80">{l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-tint py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-center text-4xl">
            How it <span className="hl hl-pink">works</span>
          </h2>
          <p className="mt-3 text-center text-[var(--muted)]">No tutorials. No confusion. Record, verify, get hired.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              ["Record", "2-minute guided visume with intro, skills, and why-hire-you beats.", ""],
              ["Verify", "Skill audits, GitHub proof, ratings, completion rate, response time.", "mint"],
              ["Hire", "Feed, filters, chat, interview slots, and escrow-backed milestones.", "sun"],
            ].map(([t, d, c], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card p-6"
              >
                <span className={`num-badge ${c}`}>0{i + 1}</span>
                <h3 className="font-display mt-5 text-2xl">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-4xl">Featured visumes</h2>
          <Link href="/discover" className="text-sm font-semibold text-[var(--violet)]">
            Full feed →
          </Link>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          {featured.map((f) => (
            <ReelPlayer key={f.id} talent={f} active />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <VisumeStudio />
      </section>
    </div>
  );
}
