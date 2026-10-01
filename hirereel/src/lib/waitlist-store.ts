import { prisma } from "@/lib/prisma";
import type { UserRole, WaitlistEntry, WaitlistStats } from "@/types";

const WAVE_CAPACITIES = [500, 2000, 8000, 20000];
const DEFAULT_SOCIAL_PROOF_BASE = 1847;

function referralCode(email: string) {
  const seed = email.replace(/[^a-z0-9]/gi, "").slice(0, 4).toUpperCase() || "HR";
  return `HR-${seed}${Math.random().toString(36).slice(2, 4).toUpperCase()}`;
}

async function ensureSettings() {
  return prisma.waitlistSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, socialProofBase: DEFAULT_SOCIAL_PROOF_BASE },
  });
}

async function seedIfEmpty() {
  const count = await prisma.waitlistSignup.count();
  if (count > 0) return;
  await prisma.waitlistSignup.createMany({
    data: [
      {
        email: "maya@studio.dev",
        role: "freelancer",
        referralCode: "HR-MAYA8K",
        createdAt: new Date("2026-08-12T09:00:00.000Z"),
      },
      {
        email: "arjun@hireops.io",
        role: "client",
        referralCode: "HR-ARJN21",
        referredBy: "HR-MAYA8K",
        createdAt: new Date("2026-08-18T14:22:00.000Z"),
      },
      {
        email: "rahul@hirereel.dev",
        role: "freelancer",
        referralCode: "HR-RAHUHW",
        referredBy: "HR-MAYA8K",
        createdAt: new Date("2026-09-17T18:41:37.805Z"),
      },
    ],
  });
}

async function loadEntries(): Promise<WaitlistEntry[]> {
  await ensureSettings();
  await seedIfEmpty();
  const rows = await prisma.waitlistSignup.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map((row) => ({
    id: row.id,
    email: row.email,
    role: row.role as UserRole,
    referralCode: row.referralCode,
    referredBy: row.referredBy ?? undefined,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function computeStats(entries: WaitlistEntry[]): Promise<WaitlistStats> {
  const settings = await ensureSettings();
  const joinedCount = entries.length;
  const total = settings.socialProofBase + joinedCount;
  let remaining = total;
  let wave = 1;
  let capacity = WAVE_CAPACITIES[0];
  for (let i = 0; i < WAVE_CAPACITIES.length; i++) {
    capacity = WAVE_CAPACITIES[i];
    if (remaining <= capacity) {
      wave = i + 1;
      break;
    }
    remaining -= capacity;
    wave = i + 1;
  }
  const byRole: Record<string, number> = {};
  for (const e of entries) {
    byRole[e.role] = (byRole[e.role] ?? 0) + 1;
  }
  return {
    total,
    joinedCount,
    byRole,
    wave,
    capacity,
    remaining: Math.max(capacity - remaining, 0),
  };
}

function queuePosition(entries: WaitlistEntry[], id: string) {
  const scored = entries
    .map((e, index) => {
      const referrals = entries.filter((x) => x.referredBy === e.referralCode).length;
      return { e, score: referrals * 12 - index };
    })
    .sort((a, b) => b.score - a.score);
  return scored.findIndex((s) => s.e.id === id) + 1;
}

export async function getWaitlistPayload(exportAll = false) {
  const entries = await loadEntries();
  const stats = await computeStats(entries);
  if (exportAll) {
    return { stats, entries };
  }
  return { stats };
}

export async function addWaitlistEntry(input: {
  email: string;
  role: UserRole;
  referredBy?: string;
}) {
  const entries = await loadEntries();
  const email = input.email.trim().toLowerCase();
  const existing = entries.find((e) => e.email === email);
  if (existing) {
    return {
      ok: true as const,
      duplicate: true,
      incremented: false,
      referralCode: existing.referralCode,
      position: queuePosition(entries, existing.id),
      stats: await computeStats(entries),
    };
  }

  const referredBy = input.referredBy?.trim().toUpperCase();
  const validRef =
    referredBy && entries.some((e) => e.referralCode === referredBy) ? referredBy : undefined;

  const created = await prisma.waitlistSignup.create({
    data: {
      email,
      role: input.role,
      referralCode: referralCode(email),
      referredBy: validRef,
    },
  });

  const nextEntries = await loadEntries();
  return {
    ok: true as const,
    duplicate: false,
    incremented: true,
    referralCode: created.referralCode,
    position: queuePosition(nextEntries, created.id),
    stats: await computeStats(nextEntries),
  };
}
