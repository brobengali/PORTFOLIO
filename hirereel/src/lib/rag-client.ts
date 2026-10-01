/**
 * Browser-side client for the RAG assistant, talking to the Next.js proxy at /api/rag/*.
 * No login needed — the proxy provisions a private guest workspace per visitor automatically.
 */

export type RagDocumentStatus = "pending" | "processing" | "processed" | "failed";

export interface RagDocument {
  id: number;
  title: string;
  file: string;
  file_type: string;
  status: RagDocumentStatus;
  created_at: string;
  updated_at: string;
  chunk_count: number;
}

export interface RagSource {
  document_id: number | null;
  page: number | null;
  chunk_index: number | null;
}

export interface RagChatMessage {
  id: number;
  question: string;
  answer: string;
  created_at: string;
  sources?: RagSource[];
}

export class RagError extends Error {
  status: number;
  offline: boolean;
  constructor(message: string, status: number, offline = false) {
    super(message);
    this.status = status;
    this.offline = offline;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`/api/rag/${path}`, { ...init, cache: "no-store" });
  if (res.status === 204) return undefined as T;

  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { error: text };
  }

  if (!res.ok) {
    const payload = (data ?? {}) as Record<string, unknown>;
    const message =
      (typeof payload.error === "string" && payload.error) ||
      (typeof payload.detail === "string" && payload.detail) ||
      firstFieldError(payload) ||
      `Request failed (${res.status})`;
    throw new RagError(message, res.status, payload.offline === true);
  }
  return data as T;
}

function firstFieldError(payload: Record<string, unknown>): string | null {
  for (const [key, value] of Object.entries(payload)) {
    if (Array.isArray(value) && typeof value[0] === "string") return `${key}: ${value[0]}`;
    if (typeof value === "string" && key !== "offline") return `${key}: ${value}`;
  }
  return null;
}

const json = (body: unknown): RequestInit => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const rag = {
  health: () => request<{ status: string }>("health"),

  documents: () => request<RagDocument[]>("documents"),
  upload: (title: string, file: File) => {
    const form = new FormData();
    form.append("title", title);
    form.append("file", file);
    return request<RagDocument>("documents", { method: "POST", body: form });
  },
  deleteDocument: (id: number) => request<void>(`documents/${id}`, { method: "DELETE" }),

  history: () => request<RagChatMessage[]>("chat/history"),
  ask: (question: string) => request<RagChatMessage>("chat", json({ question })),
  deleteMessage: (id: number) => request<void>(`chat/${id}`, { method: "DELETE" }),
};
