"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, FileText, LoaderCircle, Lock, Paperclip, Send, Sparkles, Trash2, Upload } from "lucide-react";
import { format } from "date-fns";
import { rag, type RagChatMessage, type RagDocument } from "@/lib/rag-client";

type Phase = "checking" | "offline" | "ready";

const STATUS_CHIP: Record<RagDocument["status"], string> = {
  pending: "",
  processing: "bg-[var(--sun)] text-[var(--on-accent)]",
  processed: "bg-[var(--mint)] text-[var(--on-accent)]",
  failed: "bg-[var(--pink)] text-[var(--on-accent)]",
};

export function AssistantSection() {
  const [phase, setPhase] = useState<Phase>("checking");
  const [documents, setDocuments] = useState<RagDocument[]>([]);
  const [messages, setMessages] = useState<RagChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadWorkspace = useCallback(async () => {
    const [docs, history] = await Promise.all([rag.documents(), rag.history()]);
    setDocuments(docs);
    setMessages([...history].reverse());
  }, []);

  const boot = useCallback(async () => {
    try {
      await rag.health();
      // First call auto-provisions a private guest workspace via the proxy — no login needed.
      await loadWorkspace();
      setPhase("ready");
    } catch {
      setPhase("offline");
    }
  }, [loadWorkspace]);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) void boot();
    });
    return () => {
      cancelled = true;
    };
  }, [boot]);

  // Poll while any document is still being processed.
  const busy = documents.some((d) => d.status === "pending" || d.status === "processing");
  useEffect(() => {
    if (phase !== "ready" || !busy) return;
    const t = setInterval(() => rag.documents().then(setDocuments).catch(() => undefined), 4000);
    return () => clearInterval(t);
  }, [phase, busy]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="chip bg-[var(--violet-soft)] text-[var(--on-accent)]">
            <Sparkles size={12} /> RAG assistant · Gemini + ChromaDB
          </span>
          <h1 className="font-display mt-4 text-5xl leading-[1.05] md:text-6xl">
            Ask your <span className="hl">documents</span>.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-[var(--muted)]">
            Upload resumes, briefs, or contracts as PDFs and get grounded answers with page-level sources.
          </p>
        </div>
        {phase === "ready" && (
          <span className="chip bg-[var(--mint)] px-3 py-1.5 text-[var(--on-accent)]">
            <Lock size={12} /> Free · no sign-up · private to this browser
          </span>
        )}
      </div>

      <div className="mt-10">
        {phase === "checking" && (
          <div className="card flex items-center gap-3 p-6 text-[var(--muted)]">
            <LoaderCircle className="animate-spin" size={18} /> Connecting to the assistant…
          </div>
        )}
        {phase === "offline" && (
          <OfflineCard
            onRetry={() => {
              setPhase("checking");
              setError(null);
              void boot();
            }}
          />
        )}
        {phase === "ready" && (
          <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
            <DocumentsPanel
              documents={documents}
              onChange={setDocuments}
              onError={setError}
            />
            <ChatPanel documents={documents} messages={messages} onChange={setMessages} onError={setError} />
          </div>
        )}
        {error && (
          <p className="card card-soft mt-6 p-4 text-sm">
            {error}{" "}
            <button type="button" className="ml-2 font-semibold text-[var(--violet)]" onClick={() => setError(null)}>
              Dismiss
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function OfflineCard({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-3">
        <span className="num-badge sun h-10 w-10 text-sm">!</span>
        <h2 className="font-display text-2xl">Assistant backend is offline</h2>
      </div>
      <p className="mt-3 text-[var(--muted)]">
        The RAG service lives in <code className="chip font-mono">services/rag-chatbot</code>. Start it, then retry.
      </p>
      <pre className="field mt-4 overflow-x-auto whitespace-pre font-mono text-xs leading-6">
{`cd services/rag-chatbot
python -m venv .venv && .venv\\Scripts\\activate   # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
copy .env.example .env                              # add GEMINI_API_KEY + SECRET_KEY
python manage.py migrate
python manage.py runserver 8000`}
      </pre>
      <button type="button" onClick={onRetry} className="btn-primary mt-5 px-5 py-2.5 text-sm">
        Retry connection
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function DocumentsPanel({
  documents,
  onChange,
  onError,
}: {
  documents: RagDocument[];
  onChange: (docs: RagDocument[]) => void;
  onError: (msg: string | null) => void;
}) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(e: FormEvent) {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    onError(null);
    try {
      await rag.upload(title.trim() || file.name.replace(/\.pdf$/i, ""), file);
      onChange(await rag.documents());
      setTitle("");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (ex) {
      onError(ex instanceof Error ? ex.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: number) {
    try {
      await rag.deleteDocument(id);
      onChange(documents.filter((d) => d.id !== id));
    } catch (ex) {
      onError(ex instanceof Error ? ex.message : "Delete failed.");
    }
  }

  return (
    <aside className="card h-fit p-5">
      <div className="flex items-center gap-2">
        <span className="num-badge h-9 w-9 text-xs">
          <FileText size={16} />
        </span>
        <h2 className="font-display text-2xl">Documents</h2>
        <span className="chip ml-auto">{documents.length}</span>
      </div>

      <form onSubmit={upload} className="mt-5 space-y-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (optional)"
          className="field text-sm"
        />
        <label className="field flex cursor-pointer items-center gap-2 text-sm text-[var(--muted)]">
          <Paperclip size={16} />
          <span className="truncate">{file ? file.name : "Choose a PDF (max 10 MB)"}</span>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </label>
        <button type="submit" disabled={!file || uploading} className="btn-primary w-full py-2.5 text-sm">
          {uploading ? (
            <>
              <LoaderCircle size={16} className="animate-spin" /> Indexing…
            </>
          ) : (
            <>
              <Upload size={16} /> Upload & index
            </>
          )}
        </button>
      </form>

      <ul className="mt-5 space-y-2">
        {documents.length === 0 && (
          <li className="rounded-xl border-[1.6px] border-dashed border-[var(--line)] p-4 text-center text-sm text-[var(--muted)]">
            No documents yet. Upload a PDF to start asking questions.
          </li>
        )}
        <AnimatePresence initial={false}>
          {documents.map((d) => (
            <motion.li
              key={d.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="flex items-start gap-3 rounded-xl border-[1.6px] border-[var(--line)] bg-[var(--bg-elev)] p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{d.title}</p>
                <p className="text-xs text-[var(--muted)]">
                  {d.chunk_count} chunks · {format(new Date(d.created_at), "MMM d, HH:mm")}
                </p>
                <span className={`chip mt-2 capitalize ${STATUS_CHIP[d.status]}`}>
                  {(d.status === "pending" || d.status === "processing") && (
                    <LoaderCircle size={10} className="animate-spin" />
                  )}
                  {d.status}
                </span>
              </div>
              <button
                type="button"
                onClick={() => remove(d.id)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-[1.6px] border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--ink)]"
                aria-label={`Delete ${d.title}`}
              >
                <Trash2 size={14} />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </aside>
  );
}

/* ------------------------------------------------------------------ */

function ChatPanel({
  documents,
  messages,
  onChange,
  onError,
}: {
  documents: RagDocument[];
  messages: RagChatMessage[];
  onChange: (msgs: RagChatMessage[]) => void;
  onError: (msg: string | null) => void;
}) {
  const [question, setQuestion] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const titleById = useMemo(() => new Map(documents.map((d) => [d.id, d.title])), [documents]);
  const hasIndexed = documents.some((d) => d.status === "processed");

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, thinking]);

  async function ask(e: FormEvent) {
    e.preventDefault();
    const q = question.trim();
    if (!q || thinking) return;
    setThinking(true);
    onError(null);
    setQuestion("");
    try {
      const reply = await rag.ask(q);
      onChange([...messages, reply]);
    } catch (ex) {
      setQuestion(q);
      onError(ex instanceof Error ? ex.message : "The assistant could not answer.");
    } finally {
      setThinking(false);
    }
  }

  async function remove(id: number) {
    try {
      await rag.deleteMessage(id);
      onChange(messages.filter((m) => m.id !== id));
    } catch (ex) {
      onError(ex instanceof Error ? ex.message : "Delete failed.");
    }
  }

  return (
    <section className="card flex min-h-[70vh] flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b-[1.6px] border-[var(--line)] bg-[var(--bg-elev)] px-5 py-4">
        <span className="num-badge mint h-9 w-9 text-xs">
          <Bot size={16} />
        </span>
        <div>
          <h2 className="font-display text-2xl">Chat</h2>
          <p className="text-xs text-[var(--muted)]">Answers are grounded only in your uploaded PDFs.</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.length === 0 && !thinking && (
          <div className="grid h-full place-items-center text-center">
            <div className="max-w-sm">
              <p className="font-display text-2xl">
                {hasIndexed ? "Ask anything about your documents." : "Upload a PDF to get started."}
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Try: “Summarize this candidate’s experience” or “What are the payment terms?”
              </p>
            </div>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="group space-y-2"
            >
              <div className="ml-auto max-w-[80%] rounded-2xl border-[1.6px] border-[var(--line)] bg-[var(--violet)] px-4 py-2.5 text-sm text-white">
                {m.question}
              </div>
              <div className="max-w-[85%] rounded-2xl border-[1.6px] border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm shadow-[4px_4px_0_0_var(--shadow)]">
                <p className="whitespace-pre-wrap leading-relaxed">{m.answer}</p>
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {dedupeSources(m.sources).map((s, i) => (
                      <span key={i} className="chip bg-[var(--violet-soft)] text-[var(--on-accent)]">
                        <FileText size={10} />
                        {s.document_id != null ? titleById.get(s.document_id) ?? `Doc ${s.document_id}` : "Source"}
                        {s.page != null ? ` · p.${s.page}` : ""}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-2 flex items-center gap-3 text-[10px] text-[var(--muted)]">
                  <span>{format(new Date(m.created_at), "PP · HH:mm")}</span>
                  <button
                    type="button"
                    onClick={() => remove(m.id)}
                    className="opacity-0 transition-opacity group-hover:opacity-100 hover:text-[var(--ink)]"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {thinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="inline-flex items-center gap-2 rounded-2xl border-[1.6px] border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]"
          >
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-2 w-2 rounded-full bg-[var(--violet)]"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                />
              ))}
            </span>
            Reading your documents…
          </motion.div>
        )}
      </div>

      <form onSubmit={ask} className="flex gap-3 border-t-[1.6px] border-[var(--line)] p-4">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="field flex-1 text-sm"
          placeholder={hasIndexed ? "Ask a question about your documents…" : "Upload a PDF first…"}
          maxLength={2000}
          disabled={thinking}
        />
        <button type="submit" disabled={!question.trim() || thinking} className="btn-primary px-5 text-sm">
          <Send size={16} /> Ask
        </button>
      </form>
    </section>
  );
}

function dedupeSources(sources: NonNullable<RagChatMessage["sources"]>) {
  const seen = new Set<string>();
  return sources.filter((s) => {
    const key = `${s.document_id}:${s.page}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}