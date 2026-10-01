"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Pause, Play, Share2, Volume2, VolumeX } from "lucide-react";
import type { Freelancer } from "@/types";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { Modal } from "@/components/ui/Modal";
import Link from "next/link";

export function ReelPlayer({
  talent,
  active = true,
}: {
  talent: Freelancer;
  active?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [inView, setInView] = useState(active);
  const [hireOpen, setHireOpen] = useState(false);
  const [failed, setFailed] = useState(false);

  const shouldPlay = active && inView;

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio > 0.45),
      { threshold: [0, 0.45, 0.8] },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (el) el.muted = muted;
  }, [muted]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    setFailed(false);

    const tryPlay = () => {
      if (!shouldPlay) {
        el.pause();
        setPlaying(false);
        return;
      }
      el.muted = muted;
      const p = el.play();
      if (p) {
        p.then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
    };

    tryPlay();
    el.addEventListener("canplay", tryPlay);
    el.addEventListener("loadeddata", tryPlay);
    return () => {
      el.removeEventListener("canplay", tryPlay);
      el.removeEventListener("loadeddata", tryPlay);
    };
  }, [shouldPlay, talent.videoUrl, muted]);

  function togglePlay() {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      el.pause();
      setPlaying(false);
    }
  }

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto h-[78vh] w-full max-w-[420px] overflow-hidden rounded-[20px] bg-black text-white glow-ring"
    >
      <video
        key={talent.videoUrl}
        ref={videoRef}
        src={talent.videoUrl}
        poster={talent.poster}
        className="h-full w-full object-cover"
        loop
        playsInline
        muted={muted}
        autoPlay={shouldPlay}
        preload="auto"
        controls={false}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setFailed(true);
          setPlaying(false);
        }}
      />

      {failed && (
        <div className="absolute inset-0 grid place-items-center bg-black text-center text-sm text-white/70">
          Video failed to load
          <br />
          {talent.videoUrl}
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

      <div className="absolute right-3 top-1/3 z-10 flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          className="grid h-10 w-10 place-items-center rounded-full border-[1.6px] border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] shadow-[3px_3px_0_0_var(--shadow)]"
          aria-label="Toggle sound"
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <button
          type="button"
          onClick={togglePlay}
          className="grid h-10 w-10 place-items-center rounded-full border-[1.6px] border-[var(--line)] bg-[var(--violet)] text-white shadow-[3px_3px_0_0_var(--shadow)]"
          aria-label="Play or pause"
        >
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full border-[1.6px] border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] shadow-[3px_3px_0_0_var(--shadow)]"
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          aria-label="Share"
        >
          <Share2 size={18} />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 space-y-3 p-4">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-2xl">{talent.name}</h3>
          {talent.verified && <VerifiedBadge />}
        </div>
        <p className="text-sm text-white/85">{talent.headline}</p>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="chip text-[var(--ink)]">${talent.hourlyRate}/hr</span>
          <span className="chip bg-[var(--sun)] text-[var(--on-accent)]">★ {talent.rating}</span>
          <span className="chip text-[var(--ink)]">
            <MapPin size={12} /> {talent.location}
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          {talent.tags.map((t) => (
            <span key={t} className="chip bg-[var(--violet-soft)] text-[var(--on-accent)]">
              {t}
            </span>
          ))}
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => setHireOpen(true)} className="btn-primary flex-1 py-2.5 text-sm">
            Hire / Book Interview
          </button>
          <Link href={`/freelancer/${talent.id}`} className="btn-outline flex-1 py-2.5 text-sm">
            View Portfolio
          </Link>
        </div>
      </div>

      <Modal open={hireOpen} title={`Hire ${talent.name}`} onClose={() => setHireOpen(false)}>
        <p className="mb-4 text-sm text-[var(--muted)]">
          Milestone escrow holds funds until you approve the deliverable. Propose a kickoff interview or send a contract.
        </p>
        <Link href="/messages" className="btn-primary mb-3 w-full py-2.5 text-sm">
          Open chat
        </Link>
        <Link href="/?view=projects" className="btn-outline w-full py-2.5 text-sm">
          Attach to a project
        </Link>
      </Modal>
    </div>
  );
}
