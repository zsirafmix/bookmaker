import Link from "next/link";
import { db } from "@/lib/db";
import {
  BookOpen,
  PlusCircle,
  Clock,
  Sparkles,
  Flame,
  ArrowUpRight,
  Trash2,
} from "lucide-react";

export const revalidate = 0; // Mindig friss adat

export default async function DashboardPage() {
  const books = await db.getBooks();

  const totalWords = books.reduce((acc, b) => acc + (b.target_words || 0), 0);
  const totalChapters = books.reduce((acc, b) => acc + (b.target_chapters || 0), 0);

  const getGenreBadge = (genre: string) => {
    switch (genre) {
      case "erotica_adult":
        return { label: "Pornó / Erotika (18+)", color: "bg-rose-950/80 text-rose-300 border-rose-800/60" };
      case "horror_erotica_adult":
        return { label: "Horror-pornó (18+)", color: "bg-red-950/90 text-red-300 border-red-800/80 animate-pulse" };
      case "fantasy":
        return { label: "Fantasy", color: "bg-purple-950/80 text-purple-300 border-purple-800/60" };
      case "scifi":
        return { label: "Sci-Fi", color: "bg-cyan-950/80 text-cyan-300 border-cyan-800/60" };
      case "thriller":
        return { label: "Thriller", color: "bg-amber-950/80 text-amber-300 border-amber-800/60" };
      case "horror":
        return { label: "Horror", color: "bg-orange-950/80 text-orange-300 border-orange-800/60" };
      case "romance":
        return { label: "Romance", color: "bg-pink-950/80 text-pink-300 border-pink-800/60" };
      default:
        return { label: genre, color: "bg-slate-800 text-slate-300 border-slate-700" };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* HEADER & STATS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Könyvtáram</h1>
          <p className="text-sm text-slate-400 mt-1">
            Kezeld könyvprojektjeidet, kövesd a fejezetek előrehaladását és az AI pipeline állapotát.
          </p>
        </div>

        <Link
          href="/wizard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-900/30 transition-all hover:scale-105"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Új Könyv Indítása</span>
        </Link>
      </div>

      {/* STATS TILES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Összes Könyv</span>
          <p className="text-3xl font-black text-white mt-1">{books.length}</p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cél Terjedelem</span>
          <p className="text-3xl font-black text-purple-400 mt-1">
            {totalWords.toLocaleString("hu-HU")} <span className="text-sm font-normal text-slate-400">szó</span>
          </p>
        </div>
        <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tervezett Fejezetek</span>
          <p className="text-3xl font-black text-indigo-400 mt-1">{totalChapters} db</p>
        </div>
      </div>

      {/* BOOKS LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => {
          const badge = getGenreBadge(book.genre);
          return (
            <div
              key={book.id}
              className="bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-6 flex flex-col justify-between transition-all duration-200 group relative"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border ${badge.color} inline-flex items-center gap-1.5`}
                  >
                    {(book.genre === "erotica_adult" || book.genre === "horror_erotica_adult") && (
                      <Flame className="w-3 h-3 text-rose-400" />
                    )}
                    {badge.label}
                  </span>

                  <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                    {book.status}
                  </span>
                </div>

                <Link href={`/book/${book.id}`} className="block group-hover:text-purple-400 transition-colors">
                  <h2 className="text-xl font-bold text-white mb-1 leading-snug line-clamp-1">{book.title}</h2>
                  {book.subtitle && (
                    <p className="text-xs text-slate-400 italic mb-3 line-clamp-1">{book.subtitle}</p>
                  )}
                </Link>

                <p className="text-xs text-slate-400 line-clamp-3 mb-6 leading-relaxed">
                  {book.story_premise || "Nincs megadott alapötlet."}
                </p>
              </div>

              <div>
                <div className="border-t border-slate-800/80 pt-4 flex items-center justify-between text-xs text-slate-400 mb-4">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                    <span>{book.target_chapters} fejezet</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-300">
                      {book.target_words.toLocaleString("hu-HU")}
                    </span>{" "}
                    szó cél
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/book/${book.id}`}
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                  >
                    <span>Vezérlőpult</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/book/${book.id}/editor`}
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Szerkesztő</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
