"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from "lucide-react";
import { StoryBible, Character, Book } from "@/types";

export default function StoryBiblePage() {
  const params = useParams();
  const bookId = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [bible, setBible] = useState<StoryBible | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "rules" | "characters" | "timeline" | "plot_threads" | "contradictions" | "boundaries"
  >("rules");

  // Új elem hozzáadásához átmeneti mezők
  const [newRule, setNewRule] = useState("");
  const [newContradiction, setNewContradiction] = useState("");
  const [newThreadName, setNewThreadName] = useState("");
  const [newTimelineEvent, setNewTimelineEvent] = useState({ timeframe: "", event: "" });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/books/${bookId}`);
        const data = await res.json();
        if (data.success) {
          setBook(data.book);
          setBible(data.storyBible);
          setCharacters(data.characters);
        }
      } catch (err) {
        console.error("Bible betöltési hiba:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [bookId]);

  const handleSaveBible = async () => {
    if (!bible) return;
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch(`/api/books/${bookId}/bible`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bible),
      });
      const data = await res.json();
      if (data.success) {
        setBible(data.storyBible);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Mentési hiba:", err);
    } finally {
      setSaving(false);
    }
  };

  const addWorldRule = () => {
    if (!newRule.trim() || !bible) return;
    setBible({
      ...bible,
      world_rules: [...bible.world_rules, newRule.trim()],
    });
    setNewRule("");
  };

  const removeWorldRule = (index: number) => {
    if (!bible) return;
    setBible({
      ...bible,
      world_rules: bible.world_rules.filter((_, i) => i !== index),
    });
  };

  const addContradiction = () => {
    if (!newContradiction.trim() || !bible) return;
    setBible({
      ...bible,
      forbidden_contradictions: [...bible.forbidden_contradictions, newContradiction.trim()],
    });
    setNewContradiction("");
  };

  const removeContradiction = (index: number) => {
    if (!bible) return;
    setBible({
      ...bible,
      forbidden_contradictions: bible.forbidden_contradictions.filter((_, i) => i !== index),
    });
  };

  const addPlotThread = () => {
    if (!newThreadName.trim() || !bible) return;
    setBible({
      ...bible,
      plot_threads: [
        ...bible.plot_threads,
        { id: "thread-" + Date.now(), name: newThreadName.trim(), status: "OPEN" },
      ],
    });
    setNewThreadName("");
  };

  const togglePlotThread = (index: number) => {
    if (!bible) return;
    const updated = [...bible.plot_threads];
    updated[index].status = updated[index].status === "OPEN" ? "RESOLVED" : "OPEN";
    setBible({ ...bible, plot_threads: updated });
  };

  if (loading || !bible) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">
        Story Bible betöltése...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-6">
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
            <ShieldCheck className="w-8 h-8 text-purple-400" />
            <span>Story Bible: {book?.title}</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Az AI számára a kanonikus valóság és igazság forrása. Az itt megadott szabályokat sosem írhatja felül.
          </p>
        </div>

        <button
          onClick={handleSaveBible}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-950 transition-all"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-green-300" />
              <span>Elmentve!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>{saving ? "Mentés..." : "Story Bible Mentése"}</span>
            </>
          )}
        </button>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: "rules", label: "Világszabályok" },
          { id: "characters", label: "Szereplők" },
          { id: "contradictions", label: "Tiltott Ellentmondások" },
          { id: "timeline", label: "Idősík" },
          { id: "plot_threads", label: "Történeti Szálak" },
          { id: "boundaries", label: "Tartalmi Határok (18+)" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === t.id
                ? "bg-purple-600 text-white shadow-md shadow-purple-950/40"
                : "bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB TARTALOM */}
      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
        {/* 1. VILÁGSZABÁLYOK */}
        {activeTab === "rules" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Világszabályok & Mágiarendszer</h2>
              <p className="text-xs text-slate-400">
                Olyan tények a világról, amelyeket az AI generáláskor nem szeghet meg (pl. fizikai törvények, időjárás, társadalom).
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Új szabály felvétele (pl. A kastély kapuja csak holdtöltekor nyílik ki)..."
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addWorldRule()}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={addWorldRule}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Hozzáadás</span>
              </button>
            </div>

            <div className="space-y-2">
              {bible.world_rules.map((rule, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between text-sm text-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-purple-950 text-purple-400 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>{rule}</span>
                  </div>
                  <button
                    onClick={() => removeWorldRule(idx)}
                    className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. SZEREPLŐK */}
        {activeTab === "characters" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-1">Karakterek Kanonikus Jellemzői</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {characters.map((c) => (
                <div key={c.id} className="bg-slate-950 border border-slate-800 p-5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{c.name}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-purple-300">
                      {c.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    {c.age ? `${c.age} éves` : ""} {c.occupation ? `• ${c.occupation}` : ""}
                  </p>
                  <p className="text-xs text-slate-300">
                    <strong>Cél:</strong> {c.goal}
                  </p>
                  <p className="text-xs text-slate-300">
                    <strong>Félelem:</strong> {c.fear}
                  </p>
                  <p className="text-xs text-slate-300">
                    <strong>Erősség / Gyengeség:</strong> {c.strength} / {c.weakness}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. TILTOTT ELLENTMONDÁSOK */}
        {activeTab === "contradictions" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>Tiltott Ellentmondások (Forbidden Contradictions)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Szigorú kikötések, amelyeket a Continuity Editor azonnal hibának jelöl (pl. szem színének megváltozása, halott karakter visszatérése).
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Új tiltás (pl. Anna szeme barna, sosem lehet kék)..."
                value={newContradiction}
                onChange={(e) => setNewContradiction(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addContradiction()}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={addContradiction}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Hozzáadás</span>
              </button>
            </div>

            <div className="space-y-2">
              {bible.forbidden_contradictions.map((c, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/80 border border-amber-950/50 p-3.5 rounded-xl flex items-center justify-between text-sm text-amber-200"
                >
                  <span>⚠️ {c}</span>
                  <button
                    onClick={() => removeContradiction(idx)}
                    className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. IDŐSÍK */}
        {activeTab === "timeline" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-1">Kronológia & Idősík</h2>
            <div className="space-y-3">
              {bible.timeline.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center gap-4"
                >
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wide min-w-[120px]">
                    {item.timeframe}
                  </span>
                  <span className="text-sm text-slate-200">{item.event}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. TÖRTÉNETI SZÁLAK */}
        {activeTab === "plot_threads" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-1">Nyitott Rejtélyek és Szálak</h2>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Új történetszál neve (pl. Ki mérgezte meg a királyt?)..."
                value={newThreadName}
                onChange={(e) => setNewThreadName(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={addPlotThread}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Hozzáadás</span>
              </button>
            </div>

            <div className="space-y-2">
              {bible.plot_threads.map((thread, idx) => (
                <div
                  key={thread.id || idx}
                  className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between"
                >
                  <span className="text-sm font-semibold text-white">{thread.name}</span>
                  <button
                    onClick={() => togglePlotThread(idx)}
                    className={`text-xs font-bold px-3 py-1 rounded-lg transition-colors ${
                      thread.status === "OPEN"
                        ? "bg-amber-950 text-amber-300 border border-amber-800"
                        : "bg-green-950 text-green-300 border border-green-800"
                    }`}
                  >
                    {thread.status === "OPEN" ? "NYITOTT SZÁL" : "LEZÁRVA ✓"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. TARTALMI HATÁROK (18+) */}
        {activeTab === "boundaries" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <Flame className="w-5 h-5 text-red-400" />
              <span>Felnőtt / 18+ Tartalmi Határok és Kifejezésmód</span>
            </h2>
            <p className="text-xs text-slate-400">
              Itt rögzítheted a szexuális, pszichológiai vagy horror-jellegű jelenetek határait és stílusát az uncensored modellek számára.
            </p>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 text-sm text-slate-300">
              <p>
                <strong>Tónus:</strong> {bible.content_boundaries?.tone || "Standard"}
              </p>
              <p>
                <strong>Fétisek / Kiemelt elemek:</strong>{" "}
                {bible.content_boundaries?.kinks_included?.join(", ") || "Nincs megadva"}
              </p>
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-800">
                Az AI Novel Writer közvetlenül a jelenet intenzitásához igazítja a nyelvezetet ezen szabályok mentén.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
