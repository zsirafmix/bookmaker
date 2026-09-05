"use client";

import Link from "next/link";
import { BookOpen, PlusCircle, Sparkles, ShieldAlert } from "lucide-react";

export default function Navbar() {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-900/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
              StoryForge AI
            </span>
            <span className="block text-[10px] text-purple-400 font-medium uppercase tracking-wider -mt-1">
              Könyvíró Rendszer
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800/60 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>Könyvtáram</span>
          </Link>

          <Link
            href="/wizard"
            className="flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-4 py-2 rounded-lg shadow-md shadow-purple-900/20 hover:shadow-purple-900/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Új Könyv</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
