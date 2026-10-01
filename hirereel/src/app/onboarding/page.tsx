"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import type { UserRole } from "@/types";

export default function OnboardingPage() {
  const { signIn, session } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(session?.name ?? "");
  const [email, setEmail] = useState(session?.email ?? "");
  const [role, setRole] = useState<UserRole>(session?.role ?? "freelancer");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    signIn({ name, email, role });
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="font-display text-5xl">
        Role & <span className="hl">profile</span>
      </h1>
      <p className="mt-4 text-lg text-[var(--muted)]">Choose how you show up on HireReel.</p>
      <form onSubmit={onSubmit} className="card mt-8 space-y-4 p-6">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="field" />
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="field" />
        <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="field">
          <option value="freelancer">Freelancer</option>
          <option value="client">Client</option>
          <option value="admin">Admin</option>
        </select>
        <button className="btn-primary w-full py-3" type="submit">
          Continue to dashboard
        </button>
      </form>
    </div>
  );
}
