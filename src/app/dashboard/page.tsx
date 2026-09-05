import Link from "next/link";
import { db } from "@/lib/db";
import {
  BookOpen,
  Plus,
  Flame,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  FileText,
} from "lucide-react";

export const revalidate = 0;

export default async function DashboardPage() {
  const books = await db.getBooks();

  const totalWords = books.reduce((acc, b) => acc + (b.target_words || 0), 0);
  const totalChapters = books.reduce((acc, b) => acc + (b.target_chapters || 0), 0);

  const getTileTheme = (genre: string) => {
    switch (genre) {
      case "horror_erotica_adult":
        return {
          bg: "bg-gradient-to-br from-red-950 via-red-900 to-slate-950",
          border: "border-red-700",
          badge: "bg-red-800 text-white",
          accent: "text-red-400",
          label: "🩸 Horror-pornó (18+)",
        };
      case "erotica_adult":
        return {
          bg: "bg-gradient-to-br from-rose-950 via-pink-950 to-slate-950",
          border: "border-rose-700",
          badge: "bg-rose-800 text-white",
          accent: "text-rose-400",
          label: "🔞 Pornó / Erotika (18+)",
        };
      case "fantasy":
        return {
          bg: "bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950",
          border: "border-purple-700",
          badge: "bg-purple-800 text-white",
          accent: "text-purple-400",
          label: "Fantasy",
        };
      case "scifi":
        return {
          bg: "bg-gradient-to-br from-cyan-950 via-blue-950 to-slate-950",
          border: "border-cyan-700",
          badge: "bg-cyan-800 text-white",
          accent: "text-cyan-400",
          label: "Sci-Fi",
        };
      case "thriller":
        return {
          bg: "bg-gradient-to-br from-amber-950 via-orange-950 to-slate-950",
          border: "border-amber-700",
          badge: "bg-amber-800 text-white",
          accent: "text-amber-400",
          label: "Thriller",
        };
      default:
        return {
          bg: "bg-gradient-to-br from-slate-900 via-slate-950 to-black",
          border: "border-slate-700",
          badge: "bg-slate-800 text-white",
          accent: "text-purple-400",
          label: genre,
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* METRO HEADER */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-sans">
            Könyvtáram
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Windows 8 Metro nézet: Könyvprojektek, előrehaladás és közvetlen elérés.
          </p>
        </div>

        <Link
          href="/wizard"
          className="metro-tile inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-purple-900/40"
        >
          <Plus className="w-5 h-5" />
          <span>+ Új Könyv Indítása</span>
        </Link>
      </div>

      {/* NAGY STATISZTIKA CSEMPÉK */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="metro-tile bg-blue-700 p-6 flex flex-col justify-between text-white shadow-lg">
          <span className="text-xs font-black uppercase tracking-widest text-blue-200">
            Aktív Könyvprojektek
          </span>
          <p className="text-5xl font-black mt-2 font-sans">{books.length}</p>
          <span className="text-[11px] text-blue-200 mt-2 font-semibold uppercase">
            StoryForge Könyvtár
          </span>
        </div>

        <div className="metro-tile bg-purple-700 p-6 flex flex-col justify-between text-white shadow-lg">
          <span className="text-xs font-black uppercase tracking-widest text-purple-200">
            Összes Tervezett Szó
          </span>
          <p className="text-4xl sm:text-5xl font-black mt-2 font-sans tracking-tight">
            {totalWords.toLocaleString("hu-HU")}
          </p>
          <span className="text-[11px] text-purple-200 mt-2 font-semibold uppercase">
            Teljes terjedelem cél
          </span>
        </div>

        <div className="metro-tile bg-emerald-700 p-6 flex flex-col justify-between text-white shadow-lg">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-200">
            Tervezett Fejezetek
          </span>
          <p className="text-5xl font-black mt-2 font-sans">{totalChapters}</p>
          <span className="text-[11px] text-emerald-200 mt-2 font-semibold uppercase">
            Kontrollált Fejezet-Pipeline
          </span>
        </div>
      </div>

      {/* KÖNYVEK METRO CSEMPÉK HÁLÓJA */}
      <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
        <span>Könyv Csempék</span>
        <div className="h-px bg-slate-800 flex-1" />
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => {
          const theme = getTileTheme(book.genre);
          return (
            <div
              key={book.id}
              className={`metro-tile ${theme.bg} border-2 ${theme.border} p-6 flex flex-col justify-between shadow-2xl relative min-h-[320px]`}
            >
              {/* Felső sáv: Műfaj jelvény és státusz */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span
                    className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 ${theme.badge} inline-flex items-center gap-1.5`}
                  >
                    {(book.genre === "erotica_adult" || book.genre === "horror_erotica_adult") && (
                      <Flame className="w-3.5 h-3.5" />
                    )}
                    <span>{theme.label}</span>
                  </span>

                  <span className="text-[10px] uppercase font-black tracking-widest bg-black/50 px-2 py-0.5 text-slate-300">
                    {book.status}
                  </span>
                </div>

                {/* Cím és alcím */}
                <Link href={`/book/${book.id}`} className="block group">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-purple-300 transition-colors line-clamp-1">
                    {book.title}
                  </h3>
                  {book.subtitle && (
                    <p className="text-xs text-slate-300 italic mb-2 line-clamp-1">
                      {book.subtitle}
                    </p>
                  )}
                </Link>

                <p className="text-xs text-slate-300 line-clamp-3 mt-2 leading-relaxed">
                  {book.story_premise || "Nincs megadott alapötlet."}
                </p>
              </div>

              {/* Alsó panel: Számok és csempés gyorsgombok */}
              <div className="pt-4 border-t border-white/10 mt-6 space-y-4">
                <div className="flex justify-between items-center text-xs font-bold text-slate-300">
                  <span>{book.target_chapters} fejezet</span>
                  <span className={theme.accent}>
                    {book.target_words.toLocaleString("hu-HU")} szó cél
                  </span>
                </div>

                {/* Gyorsgombok mint kis Metro csempék */}
                <div className="grid grid-cols-3 gap-2">
                  <Link
                    href={`/book/${book.id}/editor`}
                    className="bg-purple-600 hover:bg-purple-500 text-white p-2.5 flex flex-col items-center justify-center text-center transition-colors shadow"
                  >
                    <Sparkles className="w-4 h-4 mb-1" />
                    <span className="text-[10px] font-black uppercase">Editor</span>
                  </Link>

                  <Link
                    href={`/book/${book.id}/bible`}
                    className="bg-emerald-700 hover:bg-emerald-600 text-white p-2.5 flex flex-col items-center justify-center text-center transition-colors shadow"
                  >
                    <ShieldCheck className="w-4 h-4 mb-1" />
                    <span className="text-[10px] font-black uppercase">Bible</span>
                  </Link>

                  <Link
                    href={`/book/${book.id}`}
                    className="bg-slate-800 hover:bg-slate-700 text-white p-2.5 flex flex-col items-center justify-center text-center transition-colors shadow"
                  >
                    <ArrowRight className="w-4 h-4 mb-1" />
                    <span className="text-[10px] font-black uppercase">Megnyit</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {/* ÚJ KÖNYV GYORS CSEMPÉ */}
        <Link
          href="/wizard"
          className="metro-tile border-2 border-dashed border-slate-700 hover:border-purple-500 bg-slate-950/60 hover:bg-purple-950/20 p-8 flex flex-col items-center justify-center text-center group min-h-[320px] transition-all"
        >
          <div className="w-16 h-16 bg-purple-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
            <Plus className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">
            + Új Könyv Készítése
          </h3>
          <p className="text-xs text-slate-400 mt-2 max-w-xs">
            Indítsd el a 6-lépéses varázslót új történet, Story Bible és vázlat generálásához.
          </p>
        </Link>
      </div>
    </div>
  );
}
