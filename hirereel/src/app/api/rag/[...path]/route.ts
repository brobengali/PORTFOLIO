import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side proxy for the RAG chatbot backend (services/rag-chatbot, Django REST).
 *
 *   /api/rag/health            -> {RAG_API_URL}/health/
 *   /api/rag/documents         -> {RAG_API_URL}/api/documents/
 *   /api/rag/chat              -> {RAG_API_URL}/api/chat/
 *   ...
 *
 * No login required: the first time a visitor touches the assistant we silently register a
 * private guest account on the backend and keep its DRF token in an httpOnly cookie. Every
 * visitor therefore gets an isolated document space without ever seeing a sign-in form.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RAG_API_URL = (process.env.RAG_API_URL ?? "http://localhost:8000").replace(/\/+$/, "");
const TOKEN_COOKIE = "hirereel_rag_token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year — the guest workspace lives as long as the cookie

type Ctx = { params: Promise<{ path: string[] }> };

function targetUrl(segments: string[], search: string) {
  const path = segments.join("/");
  const base = path === "health" ? `${RAG_API_URL}/health/` : `${RAG_API_URL}/api/${path}/`;
  return `${base}${search}`;
}

function setToken(res: NextResponse, token: string) {
  res.cookies.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

function offline() {
  return NextResponse.json(
    {
      error: `RAG backend is not reachable at ${RAG_API_URL}. Start services/rag-chatbot and set RAG_API_URL.`,
      offline: true,
    },
    { status: 502 },
  );
}

function randomId(bytes: number) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Registers an anonymous guest account on the backend and returns its token. */
async function provisionGuest(): Promise<string | null> {
  const id = randomId(10);
  const username = `guest_${id}`;
  const password = `g${randomId(16)}A`; // passes Django's length/numeric/common validators
  try {
    const res = await fetch(`${RAG_API_URL}/api/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email: `${username}@guest.hirereel.local`, password }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { token?: string };
    return typeof data.token === "string" ? data.token : null;
  } catch {
    return null;
  }
}

async function forward(req: NextRequest, path: string[], token: string | null, body: BodyInit | undefined) {
  const headers = new Headers();
  if (token) headers.set("Authorization", `Token ${token}`);
  const accept = req.headers.get("accept");
  if (accept) headers.set("Accept", accept);
  const contentType = req.headers.get("content-type") ?? "";
  if (body !== undefined && !contentType.includes("multipart/form-data") && contentType) {
    headers.set("Content-Type", contentType);
  }
  return fetch(targetUrl(path, req.nextUrl.search), {
    method: req.method,
    headers,
    body,
    redirect: "manual",
    cache: "no-store",
  });
}

async function proxy(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  const route = path.join("/");

  // Auth endpoints are handled internally; never expose them.
  if (route.startsWith("auth/")) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  // Health is unauthenticated.
  if (route === "health") {
    try {
      const up = await fetch(targetUrl(path, ""), { cache: "no-store" });
      return NextResponse.json(await up.json().catch(() => ({ status: up.ok ? "ok" : "error" })), {
        status: up.status,
      });
    } catch {
      return offline();
    }
  }

  // Read the body once so we can replay it if we need to re-provision the guest.
  let body: BodyInit | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    const contentType = req.headers.get("content-type") ?? "";
    body = contentType.includes("multipart/form-data") ? await req.formData() : await req.text();
  }

  let token = req.cookies.get(TOKEN_COOKIE)?.value ?? null;
  let issuedToken: string | null = null;

  if (!token) {
    token = issuedToken = await provisionGuest();
    if (!token) return offline();
  }

  let upstream: Response;
  try {
    upstream = await forward(req, path, token, body);
    // Stale/revoked token (e.g. backend DB reset): provision a fresh guest and retry once.
    if (upstream.status === 401 && !issuedToken) {
      token = issuedToken = await provisionGuest();
      if (!token) return offline();
      upstream = await forward(req, path, token, body);
    }
  } catch {
    return offline();
  }

  const res =
    upstream.status === 204
      ? new NextResponse(null, { status: 204 })
      : new NextResponse(upstream.body, {
          status: upstream.status,
          headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
        });

  if (issuedToken) setToken(res, issuedToken);
  return res;
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE };
