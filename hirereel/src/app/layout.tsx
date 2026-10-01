import type { Metadata } from "next";
import { Suspense } from "react";
import { DM_Sans, Outfit } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const display = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "HireReel — Showcase Your 2-Min Visume. Get Hired Fast.",
  description:
    "Video-first freelance hiring with 2-minute visumes, verified skill badges, and smart matching.",
};

// Runs before paint so the saved theme applies with no flash.
const THEME_INIT = `(function(){try{var t=localStorage.getItem("hirereel-theme");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
      </head>
      <body className="flex min-h-full flex-col">
        <AuthProvider>
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
          <div className="flex-1">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
