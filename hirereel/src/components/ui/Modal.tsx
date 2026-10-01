"use client";

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/60 p-4" onClick={onClose}>
      <div className="card pop-in w-full max-w-md p-5 text-[var(--ink)]" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-xl">{title}</h3>
          <button type="button" onClick={onClose} className="text-sm text-[var(--muted)] hover:text-[var(--ink)]">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
