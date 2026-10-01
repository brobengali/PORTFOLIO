import type { Metadata } from "next";
import { AssistantSection } from "@/components/sections/AssistantSection";

export const metadata: Metadata = {
  title: "Assistant — HireReel",
  description: "Upload PDFs and ask grounded questions powered by RAG (Gemini + ChromaDB).",
};

export default function AssistantPage() {
  return <AssistantSection />;
}
