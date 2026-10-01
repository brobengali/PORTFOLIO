"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";
import { useAuth } from "@/lib/auth-context";
import type { UserRole } from "@/types";

export default function SignupPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("freelancer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    await bcrypt.hash(password, 8);
    signIn({ name, email, role });
    router.push("/onboarding");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="font-display text-5xl">
        Create your <span className="hl">HireReel</span> account
      </h1>
      <p className="mt-4 text-lg text-[var(--muted)]">Role-specific registration for clients and freelancers.</p>
      <div className="mt-8 grid grid-cols-2 gap-4">
        {(["freelancer", "client"] as UserRole[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`${role === r ? "btn-primary" : "btn-outline"} py-3 capitalize`}
          >
            {r}
          </button>
        ))}
      </div>
      <form onSubmit={onSubmit} className="card mt-6 space-y-4 p-6">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="field" />
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="field" />
        <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="field" />
        <button className="btn-dark w-full py-3" type="submit">
          Sign up as {role}
        </button>
      </form>
    </div>
  );
}
