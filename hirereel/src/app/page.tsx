"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AmbientBackdrop } from "@/components/ui/AmbientBackdrop";
import { WaitlistSection } from "@/components/sections/WaitlistSection";
import { HomeSection } from "@/components/sections/HomeSection";
import { DiscoverSection } from "@/components/sections/DiscoverSection";
import { ProfileSection } from "@/components/sections/ProfileSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import type { AppView } from "@/types";

function ViewSwitch() {
  const params = useSearchParams();
  const view = (params.get("view") as AppView | null) ?? "waitlist";
  const id = params.get("id") ?? "f-aria";
  const ref = params.get("ref");

  return (
    <>
      {view === "waitlist" && <WaitlistSection key={ref ?? "wait"} />}
      {view === "home" && <HomeSection />}
      {view === "discover" && <DiscoverSection />}
      {view === "profile" && <ProfileSection id={id} />}
      {view === "projects" && <ProjectsSection />}
    </>
  );
}

export default function Page() {
  return (
    <main>
      <AmbientBackdrop />
      <Suspense fallback={<div className="p-10 text-[var(--muted)]">Loading HireReel…</div>}>
        <ViewSwitch />
      </Suspense>
    </main>
  );
}
