"use client";

import Link from "next/link";
import { LayoutGrid, Plus, BookOpen, Sparkles, Flame } from "lucide-react";

export default function Navbar() {
  return (
    <header className="border-b border-slate-800 bg-slate-950 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-purple-600 flex items-center justify-center shadow-md group-hover:bg-purple-500 transition-colors">
            <LayoutGrid className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-white uppercase font-sans">
              StoryForge <span className="text-purple-400">AI</span>
            </span>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest -mt-1">
              Start Screen / Könyvíró
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>Könyvtár</span>
          </Link>

          <Link
            href="/wizard"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white bg-purple-600 hover:bg-purple-500 px-5 py-2.5 shadow-lg shadow-purple-900/30 transition-all hover:brightness-110 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Új Könyv</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
