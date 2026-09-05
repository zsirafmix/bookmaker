"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Flame,
  ShieldAlert,
  Check,
  BookOpen,
  User,
  Globe,
  Palette,
  Layers,
  Loader2,
} from "lucide-react";
import { Genre, AgeRating, HeatLevel } from "@/types";

export default function WizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form állapotok
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    genre: "fantasy" as Genre,
    story_premise: "",
    // Step 2: Főhős
    protagonistType: "custom" as "custom" | "ai",
    protagonistName: "",
    protagonistAge: 28,
    protagonistGender: "nő",
    protagonistOccupation: "",
    protagonistGoal: "",
    protagonistFear: "",
    protagonistStrength: "",
    protagonistWeakness: "",
    // Step 3: Világ
    worldType: "modern",
    worldDescription: "",
    // Step 4: Stílus
    tone: "Filmszerű és sötét",
    pov: "third_person_limited" as "first_person" | "third_person_limited" | "third_person_omniscient",
    tense: "past" as "past" | "present",
    heat_level: "none" as HeatLevel,
    age_rating: "PG-13" as AgeRating,
    ageConfirmed: false,
    // Step 5: Terjedelem
    target_words: 60000,
    target_chapters: 15,
  });

  const handleGenreChange = (newGenre: Genre) => {
    const isAdult = newGenre === "erotica_adult" || newGenre === "horror_erotica_adult";
    setFormData((prev) => ({
      ...prev,
      genre: newGenre,
      age_rating: isAdult ? "18_PLUS" : "PG-13",
      heat_level: isAdult ? "explicit" : "none",
    }));
  };

  const isAdultSelected =
    formData.genre === "erotica_adult" || formData.genre === "horror_erotica_adult";

  const handleFinish = async () => {
    if (isAdultSelected && !formData.ageConfirmed) {
      setError("A felnőtt/horror-pornó kategóriához el kell fogadnod a 18+ nyilatkozatot!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Könyv létrehozása
      const bookRes = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title || "Névtelen Mű",
          subtitle: formData.subtitle,
          genre: formData.genre,
          story_premise: formData.story_premise,
          pov: formData.pov,
          tense: formData.tense,
          tone: formData.tone,
          target_words: formData.target_words,
          target_chapters: formData.target_chapters,
          age_rating: formData.age_rating,
          heat_level: formData.heat_level,
          content_warnings: isAdultSelected ? ["explicit_adult_content"] : [],
        }),
      });

      const bookData = await bookRes.json();
      if (!bookData.success) throw new Error(bookData.error || "Könyv létrehozási hiba");

      const bookId = bookData.book.id;

      // 2. Story Architect futtatása
      const architectRes = await fetch("/api/ai/architect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId,
          protagonistIdea:
            formData.protagonistType === "custom"
              ? `${formData.protagonistName}, ${formData.protagonistAge} éves ${formData.protagonistOccupation}. Célja: ${formData.protagonistGoal}. Félelme: ${formData.protagonistFear}.`
              : undefined,
        }),
      });

      const architectData = await architectRes.json();
      if (!architectData.success) throw new Error(architectData.error || "Story Architect hiba");

      // 3. Fejezetvázlat generálása
      const outlineRes = await fetch("/api/ai/outline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });

      await outlineRes.json();

      // Sikeres, navigáció a könyv vezérlőpultjára!
      router.push(`/book/${bookId}`);
    } catch (err: any) {
      setError(err.message || "Ismeretlen hiba történt a generálás során.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 w-full">
      {/* LÉPÉSEK FEJLÉC */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
            {step}. Lépés a 6-ból
          </span>
          <span className="text-xs text-slate-400">StoryForge AI Varázsló</span>
        </div>

        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-200 text-sm flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* TARTALOM LÉPÉSENKÉNT */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-2xl shadow-xl backdrop-blur-sm">
        {/* STEP 1: ALAPÖTLET ÉS MŰFAJ */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Miről szóljon a történeted?</h2>
              <p className="text-sm text-slate-400">
                Add meg a munkacímet és a kiinduló alapötletet. Az AI erre fogja alapozni az egész világot.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">
                  Könyv Címe *
                </label>
                <input
                  type="text"
                  placeholder="pl. A Vörös Kripta Titka"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">
                  Alcím (opcionális)
                </label>
                <input
                  type="text"
                  placeholder="pl. A tiltott vágyak krónikája"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">
                  Műfaj Kiválasztása *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "fantasy", label: "Fantasy", icon: Sparkles, color: "bg-purple-900 border-purple-500" },
                    { id: "thriller", label: "Thriller", icon: Layers, color: "bg-amber-900 border-amber-500" },
                    { id: "romance", label: "Romance", icon: Palette, color: "bg-pink-900 border-pink-500" },
                    { id: "scifi", label: "Sci-Fi", icon: Globe, color: "bg-cyan-900 border-cyan-500" },
                    { id: "horror", label: "Horror", icon: ShieldAlert, color: "bg-orange-950 border-orange-600" },
                    { id: "crime", label: "Krimi / Bűnügyi", icon: BookOpen, color: "bg-blue-900 border-blue-500" },
                    { id: "adventure", label: "Kaland", icon: Globe, color: "bg-emerald-900 border-emerald-500" },
                    { id: "erotica_adult", label: "🔞 Pornó / Erotika (18+)", icon: Flame, adult: true, color: "bg-rose-950 border-rose-600" },
                    { id: "horror_erotica_adult", label: "🩸 Horror-pornó (18+)", icon: Flame, adult: true, color: "bg-red-950 border-red-600" },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => handleGenreChange(g.id as Genre)}
                      className={`metro-tile p-4 border-2 text-left font-black flex flex-col justify-between h-28 transition-all ${
                        formData.genre === g.id
                          ? `${g.color} text-white ring-2 ring-white/50`
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <g.icon className={`w-6 h-6 ${g.adult ? "text-red-400 animate-pulse" : "text-purple-400"}`} />
                        {formData.genre === g.id && (
                          <span className="text-[10px] uppercase font-black px-2 py-0.5 bg-black/40 text-white">
                            Kiválasztva ✓
                          </span>
                        )}
                      </div>
                      <span className="text-sm uppercase tracking-tight">{g.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {isAdultSelected && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wide">
                    <Flame className="w-4 h-4" />
                    <span>Felnőtt / Extrém Fikció (18+)</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Kifejezett anatómiai és erotikus/horrorisztikus leírások engedélyezettek. A kérést a Model Router cenzúrázatlan modellre (OpenRouter) irányítja át.
                  </p>
                  <label className="flex items-center gap-2.5 pt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.ageConfirmed}
                      onChange={(e) => setFormData({ ...formData, ageConfirmed: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-700 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-xs font-semibold text-white">
                      Megerősítem, hogy elmúltam 18 éves.
                    </span>
                  </label>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">
                  Történet Alapötlete *
                </label>
                <textarea
                  rows={4}
                  placeholder="Írd le néhány mondatban az alapötletet: ki a főszereplő, milyen konfliktussal szembesül, milyen világban játszódik..."
                  value={formData.story_premise}
                  onChange={(e) => setFormData({ ...formData, story_premise: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: FŐHŐS */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Ki a főhősöd?</h2>
              <p className="text-sm text-slate-400">
                A mély és ellentmondásos karakterek teszik a történetet letehetetlenné.
              </p>
            </div>

            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, protagonistType: "custom" })}
                className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  formData.protagonistType === "custom"
                    ? "bg-purple-950/60 border-purple-500 text-white"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                Saját főhős megadása
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, protagonistType: "ai" })}
                className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  formData.protagonistType === "ai"
                    ? "bg-purple-950/60 border-purple-500 text-white"
                    : "bg-slate-950 border-slate-800 text-slate-400"
                }`}
              >
                ✨ AI alkossa meg
              </button>
            </div>

            {formData.protagonistType === "custom" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Név</label>
                  <input
                    type="text"
                    placeholder="pl. Anna Kovács"
                    value={formData.protagonistName}
                    onChange={(e) => setFormData({ ...formData, protagonistName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Életkor & Foglalkozás</label>
                  <input
                    type="text"
                    placeholder="pl. 28 éves, régész"
                    value={formData.protagonistOccupation}
                    onChange={(e) => setFormData({ ...formData, protagonistOccupation: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Legnagyobb cél</label>
                  <input
                    type="text"
                    placeholder="pl. Megtalálni az apja expedícióját"
                    value={formData.protagonistGoal}
                    onChange={(e) => setFormData({ ...formData, protagonistGoal: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Legnagyobb félelem</label>
                  <input
                    type="text"
                    placeholder="pl. A bezártság és a kiszolgáltatottság"
                    value={formData.protagonistFear}
                    onChange={(e) => setFormData({ ...formData, protagonistFear: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-purple-950/20 border border-purple-800/40 text-center">
                <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-slate-200 font-semibold">
                  Az AI automatikusan megalkotja a műfajhoz és az alapötlethez legtökéletesebb főhőst és ellenlábast!
                </p>
              </div>
            )}
          </div>
        )}

        {/* STEP 3: VILÁG & HELYSZÍN */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Helyszín és Világépítés</h2>
              <p className="text-sm text-slate-400">
                Hol játszódik a történet? Milyen szabályok érvényesek ebben a világban?
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: "modern", label: "Modern valóság" },
                { id: "gothic", label: "Gótikus / Kastély" },
                { id: "fantasy", label: "Magas Fantasy" },
                { id: "scifi", label: "Sci-Fi / Jövő" },
                { id: "historical", label: "Történelmi kor" },
                { id: "custom", label: "Egyedi világ" },
              ].map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, worldType: w.id })}
                  className={`p-4 rounded-xl border text-sm font-semibold transition-all ${
                    formData.worldType === w.id
                      ? "bg-purple-950/80 border-purple-500 text-white"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">
                Világ leírása és különleges szabályai
              </label>
              <textarea
                rows={3}
                placeholder="pl. A hegyek mélyén elrejtett kastély, ahonnan naplemente után senki sem távozhat élve..."
                value={formData.worldDescription}
                onChange={(e) => setFormData({ ...formData, worldDescription: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-white text-sm"
              />
            </div>
          </div>
        )}

        {/* STEP 4: STÍLUS & HANGULAT */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Stílus, Hangulat és Narráció</h2>
              <p className="text-sm text-slate-400">
                Határozd meg a regény ritmusát, a narrátori perspektívát és az érzelmi tónust.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                "🎬 Filmszerű",
                "🌑 Sötét gótikus",
                "🌹 Romantikus",
                "⚔️ Epikus",
                "🔍 Rejtélyes",
                "⚡ Gyors tempójú",
                "🖋️ Lírai próza",
                "😂 Humoros / Szatirikus",
              ].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData({ ...formData, tone: t })}
                  className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                    formData.tone === t
                      ? "bg-purple-950/80 border-purple-500 text-white"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">
                  Nézőpont (POV)
                </label>
                <select
                  value={formData.pov}
                  onChange={(e) => setFormData({ ...formData, pov: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm"
                >
                  <option value="third_person_limited">E/3 Személyű Korlátozott (Ajánlott)</option>
                  <option value="first_person">E/1 Személyű (Én-elbeszélő)</option>
                  <option value="third_person_omniscient">E/3 Személyű Mindentudó</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wide">
                  Igeidő
                </label>
                <select
                  value={formData.tense}
                  onChange={(e) => setFormData({ ...formData, tense: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm"
                >
                  <option value="past">Múlt idő (Klasszikus regény)</option>
                  <option value="present">Jelen idő (Közvetlen feszültség)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: TERJEDELEM ÉS FEJEZETSZÁM */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Terjedelem és Fejezetszám</h2>
              <p className="text-sm text-slate-400">
                Milyen hosszú könyvet szeretnél generálni? A rendszer fejezetekre osztja az arányokat.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { words: 20000, chapters: 8, label: "Kisregény (Novella)" },
                { words: 50000, chapters: 15, label: "Rövid Regény" },
                { words: 80000, chapters: 20, label: "Standard Regény" },
                { words: 120000, chapters: 30, label: "Nagyregény" },
              ].map((opt) => (
                <button
                  key={opt.words}
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      target_words: opt.words,
                      target_chapters: opt.chapters,
                    })
                  }
                  className={`p-4 rounded-xl border text-center transition-all ${
                    formData.target_words === opt.words
                      ? "bg-purple-950/80 border-purple-500 text-white"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <p className="font-bold text-sm text-white">{opt.label}</p>
                  <p className="text-xs text-purple-400 mt-1">
                    {opt.words.toLocaleString("hu-HU")} szó
                  </p>
                  <p className="text-[11px] text-slate-500">{opt.chapters} fejezet</p>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Egyedi szómennyiség</label>
                <input
                  type="number"
                  value={formData.target_words}
                  onChange={(e) => setFormData({ ...formData, target_words: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Fejezetszám</label>
                <input
                  type="number"
                  value={formData.target_chapters}
                  onChange={(e) => setFormData({ ...formData, target_chapters: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: ÁTTEKINTÉS ÉS GENERÁLÁS */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Minden készen áll!</h2>
              <p className="text-sm text-slate-400">
                Tekintsd át a paramétereket, majd indítsd el a Story Architect és Outline pipeline-t.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-6 rounded-xl space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Cím:</span>
                <span className="font-bold text-white">{formData.title || "Névtelen Mű"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Műfaj:</span>
                <span className="font-semibold text-purple-400">{formData.genre}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Hangulat:</span>
                <span className="text-slate-200">{formData.tone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Nézőpont:</span>
                <span className="text-slate-200">{formData.pov}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Terjedelem:</span>
                <span className="font-bold text-white">
                  {formData.target_words.toLocaleString("hu-HU")} szó ({formData.target_chapters} fejezet)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* NAVIGÁCIÓS GOMBOK */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              disabled={loading}
              onClick={() => setStep(step - 1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-800 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Vissza</span>
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !formData.title.trim()) {
                  setError("Kérlek, adj meg egy könyvcímet!");
                  return;
                }
                setError(null);
                setStep(step + 1);
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow-md shadow-purple-950 transition-colors"
            >
              <span>Tovább</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleFinish}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-bold shadow-xl shadow-purple-950 transition-all hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Story Architect Futtatása...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>🚀 Könyv és Story Bible Létrehozása</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
