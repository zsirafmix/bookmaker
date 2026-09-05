import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "StoryForge AI – Hosszú Távú AI Könyvíró Alkalmazás",
  description: "Írj teljes regényeket fejezetről fejezetre kontrollált AI architektúrával, Story Bible-lel és következetes karaktermemóriával.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col selection:bg-purple-500/30 selection:text-purple-200">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} StoryForge AI – Tervezve Next.js, Supabase & Hibrid Model Router alapon</p>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Standard (OpenAI) & 18+ Felnőtt/Horror-pornó (OpenRouter)</span>
              <span>•</span>
              <span>Render.com Ready</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
