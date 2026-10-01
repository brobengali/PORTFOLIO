import { NextResponse } from "next/server";
import { addWaitlistEntry, getWaitlistPayload } from "@/lib/waitlist-store";
import type { UserRole } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const exportAll = searchParams.get("export") === "true";
  const payload = await getWaitlistPayload(exportAll);
  return NextResponse.json(payload);
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    role?: UserRole;
    referredBy?: string;
  };

  if (!body.email || !body.role) {
    return NextResponse.json({ error: "email and role are required" }, { status: 400 });
  }

  const allowed: UserRole[] = ["client", "freelancer", "admin"];
  if (!allowed.includes(body.role)) {
    return NextResponse.json({ error: "invalid role" }, { status: 400 });
  }

  const result = await addWaitlistEntry({
    email: body.email,
    role: body.role,
    referredBy: body.referredBy,
  });

  return NextResponse.json(result);
}
