"use client";

import { useState } from "react";
import { CONVERSATIONS } from "@/lib/demo-data";
import { format } from "date-fns";

export default function MessagesPage() {
  const [active, setActive] = useState(CONVERSATIONS[0].id);
  const [draft, setDraft] = useState("");
  const [slot, setSlot] = useState("");
  const thread = CONVERSATIONS.find((c) => c.id === active) ?? CONVERSATIONS[0];
  const [extra, setExtra] = useState<string[]>([]);

  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-4 py-10 md:grid-cols-[260px_1fr]">
      <aside className="space-y-3">
        {CONVERSATIONS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActive(c.id)}
            className={`card w-full p-4 text-left text-sm ${active === c.id ? "card-soft" : ""}`}
          >
            <div className="font-semibold">{c.peerName}</div>
            <div className="truncate text-[var(--muted)]">{c.lastMessage}</div>
          </button>
        ))}
      </aside>
      <section className="card flex min-h-[60vh] flex-col p-5">
        <h1 className="font-display text-2xl">{thread.peerName}</h1>
        <div className="mt-4 flex-1 space-y-3 overflow-y-auto">
          {thread.messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-[80%] rounded-2xl border-[1.6px] border-[var(--line)] px-4 py-2.5 text-sm ${
                m.fromMe ? "ml-auto bg-[var(--violet)] text-white" : "bg-[var(--bg-elev)]"
              }`}
            >
              <p>{m.text}</p>
              {m.attachment && <p className="mt-1 text-xs opacity-80">Attachment: {m.attachment}</p>}
              <p className="mt-1 text-[10px] opacity-70">{m.at}</p>
            </div>
          ))}
          {extra.map((t, i) => (
            <div
              key={i}
              className="ml-auto max-w-[80%] rounded-2xl border-[1.6px] border-[var(--line)] bg-[var(--violet)] px-4 py-2.5 text-sm text-white"
            >
              {t}
            </div>
          ))}
        </div>
        <form
          className="mt-4 flex gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.trim()) return;
            setExtra((x) => [...x, draft]);
            setDraft("");
          }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="field flex-1 text-sm"
            placeholder="Message or attach a file name…"
          />
          <button className="btn-dark px-5 text-sm" type="submit">
            Send
          </button>
        </form>
        <div className="mt-5 border-t-[1.6px] border-[var(--line)] pt-4">
          <p className="text-sm font-semibold">1-on-1 interview booker</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <input
              type="datetime-local"
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              className="field w-auto text-sm"
            />
            <button
              type="button"
              className="btn-outline px-4 py-2 text-sm"
              onClick={() => {
                if (!slot) return;
                setExtra((x) => [
                  ...x,
                  `Proposed interview: ${format(new Date(slot), "PPpp")} · room https://meet.hirereel.app/${thread.id}`,
                ]);
              }}
            >
              Propose slot + call room
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
