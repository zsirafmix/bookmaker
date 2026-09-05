import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import {
  Sparkles,
  ShieldCheck,
  FileText,
  Download,
  Users,
  ArrowRight,
  Flame,
  LayoutGrid,
  BookOpen,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
      {/* METRO HEADER */}
      <div className="bg-slate-900 border-l-8 border-purple-600 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 text-xs font-black uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-800">
              {book.genre}
            </span>
            {book.age_rating === "18_PLUS" && (
              <span className="px-3 py-1 text-xs font-black uppercase tracking-wider bg-red-950 text-red-300 border border-red-800 flex items-center gap-1.5 animate-pulse">
                <Flame className="w-4 h-4" />
                <span>18+ Felnőtt Zóna</span>
              </span>
            )}
            <span className="text-xs font-black uppercase tracking-widest text-slate-400 bg-black/40 px-2 py-1">
              {book.status}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white font-sans">
            {book.title}
          </h1>
          {book.subtitle && (
            <p className="text-slate-400 text-sm mt-1 italic">{book.subtitle}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            href={`/book/${id}/editor`}
            className="metro-tile inline-flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-purple-900/40"
          >
            <Sparkles className="w-5 h-5" />
            <span>Szerkesztő Megnyitása</span>
          </Link>

          <a
            href={`/api/export?bookId=${id}&format=markdown`}
            download
            className="metro-tile inline-flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider"
          >
            <Download className="w-4 h-4" />
            <span>Export (MD)</span>
          </a>
        </div>
      </div>

      {/* METRO HALADÁS SÁV & STATISZTIKA CSEMPÉK */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="metro-tile sm:col-span-2 bg-slate-900 p-6 flex flex-col justify-between border-b-4 border-purple-600">
          <div className="flex justify-between text-xs font-black uppercase tracking-wider mb-2">
            <span className="text-slate-400">Könyv Előrehaladása</span>
            <span className="text-purple-400">{progressPercent}% Elkészült</span>
          </div>
          <div className="w-full bg-slate-950 h-5 border border-slate-800 mb-2">
            <div
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 h-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-bold text-slate-300">
            <span>{totalWordsWritten.toLocaleString("hu-HU")} szó megírva</span>
            <span>Cél: {book.target_words.toLocaleString("hu-HU")} szó</span>
          </div>
        </div>

        <div className="metro-tile bg-blue-700 p-6 flex flex-col justify-between text-white border-b-4 border-blue-900">
          <span className="text-xs font-black uppercase tracking-widest text-blue-200">
            Fejezetek
          </span>
          <p className="text-4xl font-black">{chapters.length}</p>
          <span className="text-[11px] text-blue-200 font-semibold uppercase">
            Tervezett egységek
          </span>
        </div>

        <div className="metro-tile bg-emerald-700 p-6 flex flex-col justify-between text-white border-b-4 border-emerald-900">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-200">
            Szereplők
          </span>
          <p className="text-4xl font-black">{characters.length}</p>
          <span className="text-[11px] text-emerald-200 font-semibold uppercase">
            Story Bible nyilvántartás
          </span>
        </div>
      </div>

      {/* WORKSPACE METRO CSEMPÉK */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href={`/book/${id}/editor`}
          className="metro-tile bg-gradient-to-br from-purple-700 to-indigo-900 p-8 flex flex-col justify-between min-h-[220px] shadow-xl border-b-4 border-purple-950"
        >
          <div className="flex justify-between items-start">
            <Sparkles className="w-10 h-10 text-white" />
            <span className="text-xs font-black uppercase bg-black/30 px-3 py-1 text-purple-200">
              Fő Eszköz
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-1">
              Prose Editor
            </h3>
            <p className="text-xs text-purple-200 font-medium">
              Prózaírás, fejezetgenerálás, AI újraírás, bővítés és kontinuitás-vizsgálat.
            </p>
          </div>
        </Link>

        <Link
          href={`/book/${id}/bible`}
          className="metro-tile bg-gradient-to-br from-emerald-700 to-teal-900 p-8 flex flex-col justify-between min-h-[220px] shadow-xl border-b-4 border-emerald-950"
        >
          <div className="flex justify-between items-start">
            <ShieldCheck className="w-10 h-10 text-white" />
            <span className="text-xs font-black uppercase bg-black/30 px-3 py-1 text-emerald-200">
              Kanonikus
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-1">
              Story Bible
            </h3>
            <p className="text-xs text-emerald-200 font-medium">
              Világszabályok, karakterjellemzők, tiltott ellentmondások és felnőtt határok.
            </p>
          </div>
        </Link>

        <Link
          href={`/book/${id}/outline`}
          className="metro-tile bg-gradient-to-br from-indigo-700 to-slate-900 p-8 flex flex-col justify-between min-h-[220px] shadow-xl border-b-4 border-indigo-950"
        >
          <div className="flex justify-between items-start">
            <FileText className="w-10 h-10 text-white" />
            <span className="text-xs font-black uppercase bg-black/30 px-3 py-1 text-indigo-200">
              Struktúra
            </span>
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-1">
              Fejezetvázlat
            </h3>
            <p className="text-xs text-indigo-200 font-medium">
              Dinamikus cselekményív, célok, konfliktusok és cliffhangerek.
            </p>
          </div>
        </Link>
      </div>

      {/* RÉSZLETES BLOKKOK: SZEREPLŐK ÉS FEJEZETEK METRO LISTA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Szereplők csempék */}
        <div className="bg-slate-900 p-6 border-l-4 border-purple-600">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <h2 className="text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span>Szereplők ({characters.length})</span>
            </h2>
            <Link
              href={`/book/${id}/bible`}
              className="text-xs font-bold text-purple-400 hover:underline uppercase tracking-wide"
            >
              Story Bible →
            </Link>
          </div>

          <div className="space-y-3">
            {characters.map((char) => (
              <div
                key={char.id}
                className="metro-tile bg-slate-950 p-4 border border-slate-800 flex items-start justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-sm uppercase tracking-tight">
                      {char.name}
                    </span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-purple-900/60 text-purple-300">
                      {char.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {char.age ? `${char.age} éves` : ""} {char.occupation ? `• ${char.occupation}` : ""}
                  </p>
                  <p className="text-xs text-slate-300 mt-2">
                    <strong className="text-purple-400">Cél:</strong> {char.goal || "Nincs megadva"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fejezetek csempék */}
        <div className="bg-slate-900 p-6 border-l-4 border-indigo-600">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <h2 className="text-base font-black uppercase tracking-wider text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>Fejezetek ({chapters.length})</span>
            </h2>
            <Link
              href={`/book/${id}/outline`}
              className="text-xs font-bold text-indigo-400 hover:underline uppercase tracking-wide"
            >
              Vázlat →
            </Link>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-2">
            {chapters.map((ch) => (
              <Link
                key={ch.id}
                href={`/book/${id}/editor?chapterId=${ch.id}`}
                className="metro-tile block bg-slate-950 p-4 border border-slate-800 hover:border-purple-500"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-black text-purple-400 uppercase tracking-wide">
                    {ch.chapter_number}. Fejezet
                  </span>
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 ${
                      ch.content
                        ? "bg-green-900 text-green-200"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {ch.content ? "Kész ✓" : ch.status}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white line-clamp-1">{ch.title}</h4>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span>{ch.word_count || 0} szó megírva</span>
                  <span className="text-purple-400 font-bold uppercase">Szerkesztés →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
