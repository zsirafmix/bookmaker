import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Zap,
  Cpu,
  BookmarkCheck,
  FileText,
  Flame,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-800/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/25 via-slate-950 to-slate-950 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-900/30 border border-purple-700/40 text-purple-300 text-xs font-semibold mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kontrollált Fejezet-Pipeline & Hibrid Model Router</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
            Ne csak promptolj. <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
              Építs komplett regényt
            </span>{" "}
            fejezetről fejezetre.
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            A legtöbb AI „megír egy fejezetet”, majd azonnal elfelejti a szereplők nevét, a cselekményszálakat és a világ szabályait. A <strong>StoryForge AI</strong> a Story Bible, a beépített szemantikus memória és a kontinuitás-ellenőrzés segítségével garantálja az 50 000+ szavas történeti következetességet.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/wizard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-xl shadow-purple-950/50 hover:scale-[1.02] transition-all"
            >
              <span>Új Könyv Indítása (Varázsló)</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:text-white transition-all"
            >
              <BookOpen className="w-5 h-5 text-slate-400" />
              <span>Meglévő Könyvtár</span>
            </Link>
          </div>
        </div>
      </section>

      {/* PIPELINE SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-900/40 border-b border-slate-800/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2">
              A Legfontosabb Technikai Alapelv
            </h2>
            <p className="text-2xl sm:text-3xl font-bold text-white">
              Hogyan tartja fenn az AI a történeti konzisztenciát?
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { step: "1", title: "Könyvötlet", icon: Sparkles },
              { step: "2", title: "Karakterek", icon: BookmarkCheck },
              { step: "3", title: "Story Bible", icon: ShieldCheck },
              { step: "4", title: "Történetív", icon: Zap },
              { step: "5", title: "Vázlat", icon: FileText },
              { step: "6", title: "Fejezetírás", icon: Cpu },
              { step: "7", title: "Konzisztencia", icon: CheckCircle2 },
              { step: "8", title: "Következő", icon: ArrowRight },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex flex-col items-center text-center relative group hover:border-purple-500/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-950/60 text-purple-400 flex items-center justify-center font-bold text-xs mb-2 border border-purple-800/50">
                  {item.step}
                </div>
                <item.icon className="w-5 h-5 text-slate-400 mb-2 group-hover:text-purple-400 transition-colors" />
                <span className="text-xs font-semibold text-slate-200">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6 border border-purple-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Story Bible mint az Igazság Forrása</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Kanonikus szabályok, a karakterek el nem felejthető fizikai vonásai, nyitott rejtélyek és történetszálak. A generátor sosem tér el az alapvető tényektől.
            </p>
          </div>

          <div className="bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-6 border border-pink-500/20">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Hibrid Model Router (Minden Műfaj)</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Standard irodalomhoz OpenAI (GPT-4o), míg a 18+ Pornó és Horror-pornó (Splatterpunk) műfajokhoz korlátok nélküli cenzúrázatlan modellek (OpenRouter / Mistral / Llama) automatikus kiválasztása.
            </p>
          </div>

          <div className="bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 border border-indigo-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Fókuszált Editor és Export</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Fejlett szövegszerkesztő beépített AI eszközökkel: folytatás, újraírás, dialógus dúsítás, drámaiság fokozása és azonnali exportálás Markdown, TXT vagy nyomtatható formátumban.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
