import { getWaitlistPayload } from "@/lib/waitlist-store";
import { format } from "date-fns";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminWaitlistPage() {
  const { stats, entries = [] } = await getWaitlistPayload(true);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="chip">Admin · SQLite prisma/dev.db</p>
      <h1 className="font-display mt-4 text-5xl">
        Waitlist <span className="hl">signups</span>
      </h1>
      <p className="mt-4 text-[var(--muted)]">
        Displayed counter: <strong className="text-[var(--ink)]">{stats.total.toLocaleString()}</strong> (base +{" "}
        {stats.joinedCount} real emails)
      </p>

      <div className="card mt-8 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="border-b-[1.6px] border-[var(--line)] bg-[var(--bg-elev)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Referral</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => (
              <tr key={e.id} className="border-t border-[var(--line)]/15">
                <td className="px-4 py-3 text-[var(--muted)]">{i + 1}</td>
                <td className="px-4 py-3 font-medium">{e.email}</td>
                <td className="px-4 py-3 capitalize">{e.role}</td>
                <td className="px-4 py-3">{e.referralCode}</td>
                <td className="px-4 py-3 text-[var(--muted)]">{format(new Date(e.createdAt), "PPp")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-5 text-sm text-[var(--muted)]">
        Raw JSON:{" "}
        <Link className="font-semibold text-[var(--violet)]" href="/api/waitlist?export=true">
          /api/waitlist?export=true
        </Link>
      </p>
    </div>
  );
}
