"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw, Square, Video } from "lucide-react";

const PROMPTS = [
  { start: 0, end: 30, title: "Introduction", hint: "Name, role, and high-level passion in tech/design." },
  { start: 30, end: 75, title: "Core Skills & Top Project", hint: "Walk through tools and solved challenges." },
  { start: 75, end: 120, title: "Why Hire You", hint: "Availability, communication strengths, and work style." },
];

export function VisumeStudio() {
  const liveRef = useRef<HTMLVideoElement>(null);
  const playbackRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const meterRef = useRef<number>(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [level, setLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const prompt = PROMPTS.find((p) => seconds >= p.start && seconds < p.end) ?? PROMPTS[2];

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [stream, previewUrl]);

  useEffect(() => {
    if (!recording) return;
    const id = window.setInterval(() => {
      setSeconds((s) => {
        if (s >= 119) {
          stopRecording();
          return 120;
        }
        return s + 1;
      });
      setLevel(meterRef.current);
    }, 1000);
    return () => window.clearInterval(id);
  }, [recording]);

  async function startCamera() {
    setError(null);
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 1280 } },
        audio: true,
      });
      setStream(media);
      if (liveRef.current) {
        liveRef.current.srcObject = media;
        await liveRef.current.play();
      }
      const ctx = new AudioContext();
      const src = ctx.createMediaStreamSource(media);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      src.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(data);
        const amp = data.reduce((a, b) => a + Math.abs(b - 128), 0) / data.length;
        meterRef.current = Math.min(100, Math.round(amp * 4));
        requestAnimationFrame(tick);
      };
      tick();
    } catch {
      setError("Camera or microphone permission was denied. Enable MediaStream access to record.");
    }
  }

  function startRecording() {
    if (!stream) return;
    chunksRef.current = [];
    const rec = new MediaRecorder(stream);
    recorderRef.current = rec;
    rec.ondataavailable = (e) => {
      if (e.data.size) chunksRef.current.push(e.data);
    };
    rec.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: rec.mimeType || "video/webm" });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    };
    rec.start();
    setSeconds(0);
    setRecording(true);
    setPreviewUrl(null);
  }

  function stopRecording() {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    setRecording(false);
  }

  function retake() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSeconds(0);
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <section className="card overflow-hidden">
      <div className="border-b-[1.6px] border-[var(--line)] bg-[var(--bg-elev)] px-6 py-5">
        <h2 className="font-display text-3xl">
          2-Minute <span className="hl">Visume Studio</span>
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Guided prompts · webcam & mic · retake anytime</p>
      </div>
      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_300px]">
        <div className="relative aspect-[9/16] max-h-[70vh] overflow-hidden rounded-2xl border-[1.6px] border-[var(--line)] bg-black text-white">
          {previewUrl ? (
            <video ref={playbackRef} src={previewUrl} className="h-full w-full object-cover" controls />
          ) : (
            <video ref={liveRef} className="h-full w-full object-cover" muted playsInline />
          )}
          <div className="absolute left-3 top-3 chip font-mono text-sm text-[var(--ink)]">
            {mm}:{ss} / 02:00
          </div>
          <div className="absolute inset-x-3 bottom-3 rounded-xl border-[1.6px] border-[var(--line)] bg-[var(--surface)] p-3 text-[var(--ink)]">
            <p className="text-[11px] font-bold uppercase tracking-wide text-[var(--violet)]">
              {prompt.start.toString().padStart(2, "0")}:00 – {String(Math.floor(prompt.end / 60)).padStart(2, "0")}:
              {String(prompt.end % 60).padStart(2, "0")} · {prompt.title}
            </p>
            <p className="mt-1 text-sm">{prompt.hint}</p>
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-xs font-medium text-[var(--muted)]">Audio meter</p>
            <div className="h-3 overflow-hidden rounded-full border-[1.6px] border-[var(--line)] bg-[var(--surface)]">
              <div className="meter h-full" style={{ width: `${recording || stream ? level : 8}%` }} />
            </div>
          </div>
          {error && <p className="card card-soft p-3 text-sm">{error}</p>}
          <div className="flex flex-col gap-3">
            {!stream && (
              <button type="button" onClick={startCamera} className="btn-outline py-2.5 text-sm">
                <Video size={16} /> Enable camera
              </button>
            )}
            {stream && !recording && !previewUrl && (
              <button type="button" onClick={startRecording} className="btn-primary py-2.5 text-sm">
                Start recording
              </button>
            )}
            {recording && (
              <button type="button" onClick={stopRecording} className="btn-dark py-2.5 text-sm">
                <Square size={14} className="mr-2" /> Stop
              </button>
            )}
            {previewUrl && (
              <button type="button" onClick={retake} className="btn-outline py-2.5 text-sm">
                <RotateCcw size={14} /> Retake
              </button>
            )}
          </div>
          <ol className="space-y-3 text-sm">
            {PROMPTS.map((p, i) => (
              <li
                key={p.title}
                className={`flex gap-3 rounded-xl border-[1.6px] border-[var(--line)] p-3 ${
                  prompt.title === p.title ? "bg-[var(--violet-soft)] text-[var(--on-accent)]" : "bg-[var(--surface)]"
                }`}
              >
                <span className="num-badge h-8 w-8 shrink-0 text-xs">0{i + 1}</span>
                <span>
                  <strong>{p.title}</strong>
                  <span className="block text-[var(--muted)]">{p.hint}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
