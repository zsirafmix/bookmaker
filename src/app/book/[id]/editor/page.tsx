"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  BookOpen,
  ArrowLeft,
  Save,
  CheckCircle2,
  Clock,
  Download,
  ShieldCheck,
  AlertCircle,
  Flame,
  Loader2,
  ChevronRight,
  History,
  Wand2,
} from "lucide-react";
import { Book, Chapter, ChapterVersion } from "@/types";

export default function EditorPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const bookId = params.id as string;
  const initialChapterId = searchParams.get("chapterId");

  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [versions, setVersions] = useState<ChapterVersion[]>([]);
  const [content, setContent] = useState("");
  const [savingStatus, setSavingStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const [loading, setLoading] = useState(true);

  // AI eszközök állapota
  const [aiLoading, setAiLoading] = useState(false);
  const [aiStatusText, setAiStatusText] = useState("");
  const [continuityReport, setContinuityReport] = useState<any | null>(null);
  const [selectedText, setSelectedText] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Adatok betöltése
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/books/${bookId}`);
        const data = await res.json();
        if (data.success) {
          setBook(data.book);
          setChapters(data.chapters);

          let targetChap = data.chapters[0];
          if (initialChapterId) {
            const found = data.chapters.find((c: Chapter) => c.id === initialChapterId);
            if (found) targetChap = found;
          }
          if (targetChap) {
            setActiveChapter(targetChap);
            setContent(targetChap.content || "");
            loadVersions(targetChap.id);
          }
        }
      } catch (err) {
        console.error("Betöltési hiba:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [bookId, initialChapterId]);

  const loadVersions = async (chapId: string) => {
    try {
      const res = await fetch(`/api/chapters/${chapId}`);
      const data = await res.json();
      if (data.success && data.versions) {
        setVersions(data.versions);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 2. Autosave mechanizmus (Debounce 1.5 másodperc)
  const handleContentChange = (newVal: string) => {
    setContent(newVal);
    setSavingStatus("unsaved");

    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);

    autosaveTimerRef.current = setTimeout(() => {
      saveChapterContent(newVal);
    }, 1500);
  };

  const saveChapterContent = async (textToSave: string, createVersion = false) => {
    if (!activeChapter) return;
    setSavingStatus("saving");

    try {
      const res = await fetch(`/api/chapters/${activeChapter.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: textToSave,
          saveVersion: createVersion,
          versionAuthor: "user",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSavingStatus("saved");
        setActiveChapter(data.chapter);
        setChapters((prev) =>
          prev.map((c) => (c.id === data.chapter.id ? data.chapter : c))
        );
        if (createVersion) loadVersions(activeChapter.id);
      }
    } catch (err) {
      console.error("Autosave hiba:", err);
      setSavingStatus("unsaved");
    }
  };

  // Fejezetváltás
  const switchChapter = (chap: Chapter) => {
    if (activeChapter && content !== activeChapter.content) {
      saveChapterContent(content);
    }
    setActiveChapter(chap);
    setContent(chap.content || "");
    setContinuityReport(null);
    loadVersions(chap.id);
  };

  // 3. AI Novel Writer: Fejezet generálása
  const handleGenerateChapter = async () => {
    if (!activeChapter) return;
    setAiLoading(true);
    setAiStatusText("Fejezet próza írása (Novel Writer)...");
    try {
      const res = await fetch("/api/ai/chapter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterId: activeChapter.id }),
      });
      const data = await res.json();
      if (data.success) {
        setContent(data.chapter.content);
        setActiveChapter(data.chapter);
        setChapters((prev) =>
          prev.map((c) => (c.id === data.chapter.id ? data.chapter : c))
        );
        loadVersions(activeChapter.id);
        setSavingStatus("saved");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
      setAiStatusText("");
    }
  };

  // 4. AI Eszközök (Rewrite, Expand, Dialogue, Drama, Continue)
  const handleAiTool = async (action: string, customPrompt?: string) => {
    if (!activeChapter) return;
    setAiLoading(true);
    setAiStatusText(`AI művelet futtatása (${action})...`);

    // Ha van kijelölt szöveg, azt küldjük, különben a teljes bekezdést/szöveget
    const textToProcess = selectedText.trim() || content.slice(-1000);

    try {
      const res = await fetch("/api/ai/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          selectedText: textToProcess,
          instruction: customPrompt,
          bookId,
        }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        if (action === "continue") {
          const updated = content + "\n\n" + data.result;
          setContent(updated);
          saveChapterContent(updated, true);
        } else if (selectedText) {
          const updated = content.replace(selectedText, data.result);
          setContent(updated);
          saveChapterContent(updated, true);
        } else {
          // Ha nem volt kijelölve, hozzáfűzzük vagy felülírjuk
          const updated = content + "\n\n" + data.result;
          setContent(updated);
          saveChapterContent(updated, true);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
      setAiStatusText("");
    }
  };

  // 5. Konzisztencia-ellenőrzés
  const handleContinuityCheck = async () => {
    if (!activeChapter) return;
    setAiLoading(true);
    setAiStatusText("Konzisztencia-ellenőrzés Story Bible alapján...");
    try {
      const res = await fetch("/api/ai/continuity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chapterId: activeChapter.id }),
      });
      const data = await res.json();
      if (data.success) {
        setContinuityReport(data.report);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
      setAiStatusText("");
    }
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  if (loading || !activeChapter) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400">
        Szerkesztő betöltése...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
      {/* TOOLBAR */}
      <div className="border-b border-slate-800 bg-slate-950/80 px-6 py-2.5 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <Link
            href={`/book/${bookId}`}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xs font-bold text-slate-300">
              {book?.title} / <span className="text-purple-400">{activeChapter.chapter_number}. Fejezet</span>
            </h2>
            <p className="text-[11px] text-slate-500 line-clamp-1">{activeChapter.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          {/* MENTÉSJELZŐ */}
          <div className="flex items-center gap-1.5 font-medium">
            {savingStatus === "saved" && (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                <span className="text-slate-400">Mentve</span>
              </>
            )}
            {savingStatus === "saving" && (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                <span className="text-slate-400">Mentés...</span>
              </>
            )}
            {savingStatus === "unsaved" && (
              <>
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-400">Nem mentett</span>
              </>
            )}
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* SZÓSZÁMLÁLÓ */}
          <span className="font-semibold text-slate-300">
            {wordCount} / {activeChapter.target_words} szó
          </span>

          <div className="h-4 w-px bg-slate-800" />

          {/* EXPORT DROPDOWN */}
          <div className="flex items-center gap-1">
            <a
              href={`/api/export?bookId=${bookId}&format=markdown`}
              download
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Export Markdown"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* WORKSPACE: 3 OSZLOP */}
      <div className="flex-1 flex overflow-hidden">
        {/* BAL OSZLOP: FEJEZETEK */}
        <aside className="w-64 border-r border-slate-800/80 bg-slate-950/40 p-4 overflow-y-auto hidden md:block">
          <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Fejezetek</span>
            <span>{chapters.length} db</span>
          </div>

          <div className="space-y-1.5">
            {chapters.map((ch) => {
              const isActive = ch.id === activeChapter.id;
              return (
                <button
                  key={ch.id}
                  onClick={() => switchChapter(ch)}
                  className={`w-full text-left p-3 rounded-xl text-xs transition-all ${
                    isActive
                      ? "bg-purple-950/70 border border-purple-800/80 text-white font-semibold shadow-sm"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-purple-400 font-bold">
                      {ch.chapter_number}. Fejezet
                    </span>
                    {ch.content ? (
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-700" />
                    )}
                  </div>
                  <p className="line-clamp-1 text-slate-200">{ch.title}</p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {ch.word_count || 0} / {ch.target_words} szó
                  </p>
                </button>
              );
            })}
          </div>
        </aside>

        {/* KÖZÉPSŐ OSZLOP: PRÓZAÍRÓ TÉR */}
        <div className="flex-1 flex flex-col bg-slate-950 relative overflow-hidden">
          {aiLoading && (
            <div className="absolute top-4 right-4 z-20 bg-purple-950/90 border border-purple-700 px-4 py-2 rounded-xl text-xs font-semibold text-purple-200 flex items-center gap-2 shadow-xl animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              <span>{aiStatusText}</span>
            </div>
          )}

          {/* Konzisztencia jelentés felugró */}
          {continuityReport && (
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-start justify-between gap-4 text-xs">
              <div>
                <div className="flex items-center gap-2 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span className="text-white">Story Bible Konzisztencia Elemzés:</span>
                  <span
                    className={
                      continuityReport.status === "CONSISTENT"
                        ? "text-green-400"
                        : "text-amber-400"
                    }
                  >
                    {continuityReport.status}
                  </span>
                </div>
                <p className="text-slate-300">{continuityReport.notes}</p>
                {continuityReport.issues?.length > 0 && (
                  <ul className="mt-2 space-y-1 text-red-300">
                    {continuityReport.issues.map((iss: any, i: number) => (
                      <li key={i}>• {iss.description}</li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                onClick={() => setContinuityReport(null)}
                className="text-slate-500 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}

          {/* SZÖVEG BEVITELI MEZŐ */}
          <div className="flex-1 p-6 sm:p-10 max-w-4xl mx-auto w-full flex flex-col">
            <input
              type="text"
              value={activeChapter.title}
              onChange={(e) => {
                const updated = { ...activeChapter, title: e.target.value };
                setActiveChapter(updated);
                setChapters((prev) =>
                  prev.map((c) => (c.id === updated.id ? updated : c))
                );
              }}
              className="text-2xl sm:text-3xl font-extrabold bg-transparent text-white border-none focus:outline-none mb-6 tracking-tight"
            />

            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onSelect={(e) => {
                const target = e.target as HTMLTextAreaElement;
                setSelectedText(
                  target.value.substring(target.selectionStart, target.selectionEnd)
                );
              }}
              placeholder="Kezdd el írni a fejezetet, vagy használd a jobb oldali AI Novel Writer eszközt a fejezet megírásához..."
              className="flex-1 w-full bg-transparent text-slate-200 placeholder-slate-600 focus:outline-none resize-none text-base sm:text-lg leading-relaxed font-serif tracking-normal"
            />
          </div>
        </div>

        {/* JOBB OSZLOP: AI ESZKÖZÖK */}
        <aside className="w-72 border-l border-slate-800/80 bg-slate-950/40 p-5 overflow-y-auto space-y-6 hidden lg:block">
          <div>
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-3">
              AI Íróeszközök
            </span>

            {/* FŐ GOMB: FEJEZET GENERÁLÁSA */}
            <button
              onClick={handleGenerateChapter}
              disabled={aiLoading}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-md shadow-purple-950 transition-all flex items-center justify-center gap-2 mb-4"
            >
              <Sparkles className="w-4 h-4" />
              <span>✨ Fejezet Megírása (Novel Writer)</span>
            </button>

            {/* FOLYTATÁS */}
            <button
              onClick={() => handleAiTool("continue")}
              disabled={aiLoading}
              className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition-colors flex items-center justify-between mb-2"
            >
              <span>Jelenet Folytatása</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          {/* RÉSZLETES SZÖVEGSZINTŰ MŰVELETEK */}
          <div className="space-y-2 pt-4 border-t border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Kijelölés Csiszolása
            </span>

            {[
              { id: "rewrite", label: "✍ Átfogalmazás / Finomítás" },
              { id: "expand", label: "➕ Bővítés részletekkel" },
              { id: "dialogue", label: "💬 Párbeszéd hozzáadása" },
              { id: "dramatic", label: "🎭 Drámaiság fokozása" },
              { id: "shorten", label: "✂️ Feszesítés / Rövidítés" },
            ].map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleAiTool(tool.id)}
                disabled={aiLoading}
                className="w-full py-2 px-3 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-xs text-left transition-colors"
              >
                {tool.label}
              </button>
            ))}
          </div>

          {/* KONZISZTENCIA VIZSGÁLAT */}
          <div className="pt-4 border-t border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Konzisztencia
            </span>
            <button
              onClick={handleContinuityCheck}
              disabled={aiLoading}
              className="w-full py-2.5 px-3 rounded-xl bg-purple-950/40 hover:bg-purple-950/70 border border-purple-800 text-purple-300 text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Story Bible Ellenőrzés</span>
            </button>
          </div>

          {/* VERZIÓK */}
          {versions.length > 0 && (
            <div className="pt-4 border-t border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <History className="w-3.5 h-3.5 text-slate-500" />
                <span>Verziók ({versions.length})</span>
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {versions.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      if (confirm(`Visszatérsz a(z) ${v.version_number}. verzióra?`)) {
                        setContent(v.content);
                        saveChapterContent(v.content);
                      }
                    }}
                    className="w-full text-left p-2 rounded-lg bg-slate-900/40 hover:bg-slate-800 text-[11px] text-slate-400 flex items-center justify-between"
                  >
                    <span>v{v.version_number} ({v.created_by})</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(v.created_at).toLocaleTimeString("hu-HU", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
