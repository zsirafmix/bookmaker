import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import {
  BookOpen,
  Sparkles,
  ShieldCheck,
  FileText,
  Download,
  Users,
  CheckCircle2,
  ArrowRight,
  Flame,
} from "lucide-react";

export const revalidate = 0;

export default async function BookOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await db.getBookById(id);

  if (!book) {
    notFound();
  }

  const characters = await db.getCharacters(id);
  const chapters = await db.getChapters(id);
  const bible = await db.getStoryBible(id);

  const totalWordsWritten = chapters.reduce((acc, c) => acc + (c.word_count || 0), 0);
  const progressPercent = Math.min(
    100,
    Math.round((totalWordsWritten / (book.target_words || 1)) * 100)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
      {/* HEADER */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-950 text-purple-300 border border-purple-800 uppercase tracking-wide">
              {book.genre}
            </span>
            {book.age_rating === "18_PLUS" && (
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-red-950 text-red-300 border border-red-800 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                <span>18+ Felnőtt Tartalom</span>
              </span>
            )}
            <span className="text-xs text-slate-400 font-medium">{book.status}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{book.title}</h1>
          {book.subtitle && <p className="text-slate-400 text-sm mt-1 italic">{book.subtitle}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/book/${id}/editor`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-950/40 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            <span>Szerkesztő Megnyitása</span>
          </Link>

          <a
            href={`/api/export?bookId=${id}&format=markdown`}
            download
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export (MD)</span>
          </a>
        </div>
      </div>

      {/* PROGRESS BAR */}
      <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl">
        <div className="flex justify-between text-sm font-medium mb-2">
          <span className="text-slate-400">Haladás és Szómennyiség</span>
          <span className="text-white font-bold">
            {totalWordsWritten.toLocaleString("hu-HU")} / {book.target_words.toLocaleString("hu-HU")} szó ({progressPercent}%)
          </span>
        </div>
        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* WORKSPACE NAVIGATION TILES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href={`/book/${id}/bible`}
          className="bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 p-6 rounded-2xl transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1 flex items-center justify-between">
            <span>Story Bible</span>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Kanonikus szabályok, idősík, tiltott ellentmondások és a világ szabályai az AI számára.
          </p>
        </Link>

        <Link
          href={`/book/${id}/outline`}
          className="bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 p-6 rounded-2xl transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1 flex items-center justify-between">
            <span>Fejezetvázlat</span>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            A {chapters.length} fejezet céljai, konfliktusai, fordulópontjai és feszültségívei.
          </p>
        </Link>

        <Link
          href={`/book/${id}/editor`}
          className="bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800 hover:border-pink-500/50 p-6 rounded-2xl transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1 flex items-center justify-between">
            <span>Prose Editor</span>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Fókuszált regényíró felület, beépített AI eszközök (újraírás, bővítés, dialógus, kontinuitás).
          </p>
        </Link>
      </div>

      {/* CHARACTERS & CHAPTERS SNAPSHOT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Szereplők */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span>Szereplők ({characters.length})</span>
            </h2>
            <Link href={`/book/${id}/bible`} className="text-xs text-purple-400 hover:underline">
              Kezelés a Story Bible-ben
            </Link>
          </div>

          <div className="space-y-3">
            {characters.map((char) => (
              <div
                key={char.id}
                className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl flex items-start justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{char.name}</span>
                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-purple-300">
                      {char.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {char.age ? `${char.age} éves` : ""} {char.occupation ? `• ${char.occupation}` : ""}
                  </p>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                    <strong>Cél:</strong> {char.goal || "Nincs megadva"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fejezetek */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>Fejezetek ({chapters.length})</span>
            </h2>
            <Link href={`/book/${id}/outline`} className="text-xs text-indigo-400 hover:underline">
              Vázlat megtekintése
            </Link>
          </div>

          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-2">
            {chapters.map((ch) => (
              <Link
                key={ch.id}
                href={`/book/${id}/editor?chapterId=${ch.id}`}
                className="block bg-slate-950/80 hover:bg-slate-800/60 border border-slate-800/80 p-3.5 rounded-xl transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-400">{ch.chapter_number}. Fejezet</span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      ch.content
                        ? "bg-green-950 text-green-300 border border-green-800"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {ch.content ? "Kész" : ch.status}
                  </span>
                </div>
                <p className="font-bold text-sm text-white line-clamp-1">{ch.title}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span>{ch.word_count || 0} szó megírva</span>
                  <span className="text-purple-400 hover:underline">Megnyitás →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
