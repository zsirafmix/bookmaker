import Link from "next/link";
import {
  Plus,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Flame,
  FileText,
  Download,
  Layers,
  Cpu,
  ArrowRight,
  Zap,
  CheckCircle2,
  Clock,
  Compass,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* METRO START SCREEN HEADER */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-sans">
            Start
          </span>
          <span className="text-sm font-bold uppercase tracking-widest text-purple-400 bg-purple-950/80 px-2.5 py-1 border border-purple-800">
            StoryForge AI
          </span>
        </div>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
          Kontrollált fejezet-pipeline, beépített Story Bible és hibrid Model Router (Standard & 18+ Felnőtt / Horror-pornó).
        </p>
      </div>

      {/* METRO TILES GRID */}
      <div className="space-y-10">
        {/* CSOPORT 1: FŐ CSEMPÉK */}
        <div>
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span>Fő Alkalmazások</span>
            <div className="h-px bg-slate-800 flex-1" />
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[160px]">
            {/* 1. DUPLA SZÉLES CSEMPÉ: ÚJ KÖNYV (LILA) */}
            <Link
              href="/wizard"
              className="metro-tile sm:col-span-2 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 p-6 flex flex-col justify-between group shadow-xl border-b-4 border-purple-900"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 bg-black/20 flex items-center justify-center text-white">
                  <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-200" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider bg-black/30 px-2.5 py-1 text-purple-200">
                  6-Lépéses Varázsló
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                  Új Könyv Indítása
                </h3>
                <p className="text-xs text-purple-200/90 font-medium line-clamp-1 mt-0.5">
                  Alapötlet, karakterek, műfajok (Fantasy, 18+ Pornó, Horror-pornó), Story Bible generálás.
                </p>
              </div>
            </Link>

            {/* 2. KÖNYVTÁRAM (KÉK CSEMPÉ) */}
            <Link
              href="/dashboard"
              className="metro-tile bg-gradient-to-br from-blue-600 to-blue-800 p-6 flex flex-col justify-between shadow-xl border-b-4 border-blue-950"
            >
              <div className="flex items-start justify-between">
                <BookOpen className="w-8 h-8 text-white" />
                <span className="text-2xl font-black text-blue-200">PRO</span>
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  Könyvtáram
                </h3>
                <span className="text-[11px] text-blue-200 uppercase font-bold tracking-wider">
                  Minden Mű & Haladás →
                </span>
              </div>
            </Link>

            {/* 3. 18+ FELNŐTT & HORROR-PORNÓ ZÓNA (VÖRÖS CSEMPÉ) */}
            <Link
              href="/wizard"
              className="metro-tile bg-gradient-to-br from-rose-700 via-red-700 to-red-950 p-6 flex flex-col justify-between shadow-xl border-b-4 border-red-950"
            >
              <div className="flex items-start justify-between">
                <Flame className="w-8 h-8 text-red-100 animate-pulse" />
                <span className="text-[11px] font-black uppercase bg-black/40 px-2 py-0.5 text-red-200 border border-red-500/40">
                  18+ Uncensored
                </span>
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  Pornó & Horror-pornó
                </h3>
                <span className="text-[11px] text-red-200 font-medium">
                  Cenzúrázatlan Model Router aktív
                </span>
              </div>
            </Link>

            {/* 4. STORY BIBLE (SMARAGDZÖLD CSEMPÉ) */}
            <Link
              href="/book/sample-book-1/bible"
              className="metro-tile bg-gradient-to-br from-emerald-600 to-teal-800 p-6 flex flex-col justify-between shadow-xl border-b-4 border-emerald-950"
            >
              <div className="flex items-start justify-between">
                <ShieldCheck className="w-8 h-8 text-white" />
                <span className="text-[11px] font-bold uppercase bg-black/30 px-2 py-0.5 text-emerald-200">
                  Kanonikus Tények
                </span>
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  Story Bible
                </h3>
                <span className="text-[11px] text-emerald-100 font-medium">
                  Világszabályok & Idősík
                </span>
              </div>
            </Link>

            {/* 5. PROSE EDITOR (BOROSTYÁNSÁRGA/NARANCS CSEMPÉ) */}
            <Link
              href="/book/sample-book-1/editor"
              className="metro-tile bg-gradient-to-br from-amber-600 via-orange-600 to-amber-800 p-6 flex flex-col justify-between shadow-xl border-b-4 border-amber-950"
            >
              <div className="flex items-start justify-between">
                <FileText className="w-8 h-8 text-white" />
                <Sparkles className="w-5 h-5 text-amber-200" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">
                  Prose Editor
                </h3>
                <span className="text-[11px] text-amber-100 font-medium">
                  AI Író & Újraíró Eszközök
                </span>
              </div>
            </Link>

            {/* 6. DUPLA SZÉLES CSEMPÉ: FEJEZETVÁZLAT ÉS ÍV (INDIGO/CIÁN) */}
            <Link
              href="/book/sample-book-1/outline"
              className="metro-tile sm:col-span-2 bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 p-6 flex flex-col justify-between shadow-xl border-b-4 border-indigo-950"
            >
              <div className="flex items-start justify-between">
                <Layers className="w-8 h-8 text-indigo-200" />
                <span className="text-[11px] font-bold uppercase bg-black/40 px-2.5 py-1 text-indigo-300">
                  Fejezetszerkezet
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                  Fejezetvázlat & Cselekményív
                </h3>
                <p className="text-xs text-indigo-200 font-medium line-clamp-1">
                  Célok, konfliktusok, fordulópontok és befejező hookok fejezetenként.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* CSOPORT 2: A KONTROLLÁLT PIPELINE CSEMPÉI */}
        <div>
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span>Kontrollált Fejezet-Pipeline Folyamat</span>
            <div className="h-px bg-slate-800 flex-1" />
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { num: "01", name: "Könyvötlet", bg: "bg-purple-900", icon: Sparkles },
              { num: "02", name: "Karakterek", bg: "bg-indigo-900", icon: Compass },
              { num: "03", name: "Story Bible", bg: "bg-emerald-900", icon: ShieldCheck },
              { num: "04", name: "Történetív", bg: "bg-blue-900", icon: Zap },
              { num: "05", name: "Vázlat", bg: "bg-cyan-900", icon: Layers },
              { num: "06", name: "Prózaírás", bg: "bg-amber-900", icon: FileText },
              { num: "07", name: "Konzisztencia", bg: "bg-rose-900", icon: CheckCircle2 },
              { num: "08", name: "Következő", bg: "bg-slate-800", icon: ArrowRight },
            ].map((p) => (
              <div
                key={p.num}
                className={`metro-tile ${p.bg} p-4 flex flex-col justify-between h-28 border border-white/10`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-black text-white/50">{p.num}</span>
                  <p.icon className="w-4 h-4 text-white/80" />
                </div>
                <span className="text-xs font-black uppercase text-white tracking-wide">
                  {p.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CSOPORT 3: RENDSZERJELLEMZŐK ÉS TECHNOLÓGIA */}
        <div>
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span>Rendszerarchitektúra & Technológiák</span>
            <div className="h-px bg-slate-800 flex-1" />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="metro-tile bg-slate-900 p-6 border-l-4 border-purple-500">
              <span className="text-xs font-black text-purple-400 uppercase tracking-wider block mb-2">
                Hibrid Model Router
              </span>
              <h4 className="text-lg font-bold text-white mb-2">OpenAI & OpenRouter</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Standard könyvekhez GPT-4o, felnőtt és horror-pornó történetekhez pedig automatikus átirányítás cenzúrázatlan modellekre.
              </p>
            </div>

            <div className="metro-tile bg-slate-900 p-6 border-l-4 border-emerald-500">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider block mb-2">
                Igazság Forrása
              </span>
              <h4 className="text-lg font-bold text-white mb-2">Story Bible & Memória</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                A szereplők szemszíne, kapcsolati dinamikája és a világ fizikai szabályai rögzítve vannak; az AI sosem keveri össze őket.
              </p>
            </div>

            <div className="metro-tile bg-slate-900 p-6 border-l-4 border-blue-500">
              <span className="text-xs font-black text-blue-400 uppercase tracking-wider block mb-2">
                Élesítés Kész
              </span>
              <h4 className="text-lg font-bold text-white mb-2">Render.com Blueprint</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                A projekt tartalmazza a render.yaml konfigurációt, standalone Next.js builddel és azonnali GitHub integrációval.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
