"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Sparkles,
  Plus,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";
import { Chapter, Book } from "@/types";

export default function OutlinePage() {
  const params = useParams();
  const bookId = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/books/${bookId}`);
        const data = await res.json();
        if (data.success) {
          setBook(data.book);
          setChapters(data.chapters);
        }
      } catch (err) {
        console.error("Hiba:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [bookId]);

  const handleRegenerateOutline = async () => {
    if (!confirm("Biztosan újra akarod generálni a fejezetvázlatot az AI-val?")) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/ai/outline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });
      const data = await res.json();
      if (data.success) {
        setChapters(data.chapters);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleAddChapter = async () => {
    try {
      const res = await fetch(`/api/books/${bookId}/chapters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapter_number: chapters.length + 1,
          title: `${chapters.length + 1}. Fejezet`,
          target_words: 3000,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setChapters([...chapters, data.chapter]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        Fejezetvázlat betöltése...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <Link
            href={`/book/${bookId}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Vissza a könyvhöz</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-indigo-400" />
            <span>Fejezetvázlat: {book?.title}</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Összesen {chapters.length} fejezet tervezve. Kattints egy fejezetre a részletek és jelenetek megtekintéséhez vagy a megíráshoz.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddChapter}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Új Fejezet</span>
          </button>

          <button
            onClick={handleRegenerateOutline}
            disabled={generating}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-950 transition-all"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generálás...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>✨ Vázlat Újragenerálása</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* FEJEZETEK KÁRTYÁK */}
      <div className="space-y-4">
        {chapters.map((ch) => (
          <div
            key={ch.id}
            className="bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800 p-6 rounded-2xl transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-300 font-bold text-sm flex items-center justify-center">
                  {ch.chapter_number}
                </span>
                <div>
                  <h3 className="text-lg font-bold text-white">{ch.title}</h3>
                  <span className="text-xs text-slate-400">
                    Cél: {ch.target_words} szó • Megírva: {ch.word_count || 0} szó
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-semibold uppercase px-2.5 py-1 rounded-md ${
                    ch.content
                      ? "bg-green-950 text-green-300 border border-green-800"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {ch.content ? "Megírva" : ch.status}
                </span>

                <Link
                  href={`/book/${bookId}/editor?chapterId=${ch.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-purple-300 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-800 transition-colors"
                >
                  <span>Szerkesztő</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* CÉL, KONFLIKTUS, HOOK */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-slate-800/80 text-xs">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                <span className="font-bold text-purple-400 uppercase tracking-wide block mb-1">
                  Fejezet Célja
                </span>
                <p className="text-slate-300 leading-relaxed">{ch.chapter_goal || "Nincs megadva"}</p>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                <span className="font-bold text-pink-400 uppercase tracking-wide block mb-1">
                  Fő Konfliktus
                </span>
                <p className="text-slate-300 leading-relaxed">{ch.conflict || "Nincs megadva"}</p>
              </div>
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                <span className="font-bold text-indigo-400 uppercase tracking-wide block mb-1">
                  Befejező Hook / Fordulat
                </span>
                <p className="text-slate-300 leading-relaxed">{ch.ending_hook || ch.turning_point || "Nincs megadva"}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
