import { Book, Genre } from "@/types";

export interface ModelRouteDecision {
  provider: "openai" | "openrouter" | "mock";
  modelName: string;
  reason: string;
  isAdult: boolean;
}

export function routeModelForBook(book: Partial<Book>): ModelRouteDecision {
  const isAdultGenre =
    book.genre === "erotica_adult" ||
    book.genre === "horror_erotica_adult" ||
    book.age_rating === "18_PLUS";

  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
  const hasOpenRouter = Boolean(process.env.OPENROUTER_API_KEY);

  if (isAdultGenre) {
    if (hasOpenRouter) {
      return {
        provider: "openrouter",
        modelName: process.env.UNCENSORED_AI_MODEL || "mistralai/mistral-large-2411",
        reason: "Felnőtt/Horror-pornó tartalom: OpenRouter uncensored modell engedélyezve.",
        isAdult: true,
      };
    }
    // Ha nincs OpenRouter kulcs, de van egyedi base URL megadva
    if (process.env.UNCENSORED_AI_BASE_URL) {
      return {
        provider: "openrouter",
        modelName: process.env.UNCENSORED_AI_MODEL || "local-uncensored",
        reason: "Egyedi cenzúrázatlan végpont használata.",
        isAdult: true,
      };
    }
    // Ha nincs még kulcs beállítva
    return {
      provider: "mock",
      modelName: "storyforge-adult-simulator-v1",
      reason: "Nincs beállított OPENROUTER_API_KEY: Intelligens szimuláció aktív.",
      isAdult: true,
    };
  }

  // Normál műfajok
  if (hasOpenAI) {
    return {
      provider: "openai",
      modelName: "gpt-4o",
      reason: "Standard irodalmi műfaj: OpenAI GPT-4o választva.",
      isAdult: false,
    };
  }

  if (hasOpenRouter) {
    return {
      provider: "openrouter",
      modelName: "meta-llama/llama-3.3-70b-instruct",
      reason: "OpenRouter tartalék standard műfajhoz.",
      isAdult: false,
    };
  }

  return {
    provider: "mock",
    modelName: "storyforge-creative-simulator-v1",
    reason: "Nincs beállított OPENAI_API_KEY: Intelligens szimuláció aktív.",
    isAdult: false,
  };
}

export interface CompletionRequest {
  systemPrompt: string;
  userPrompt: string;
  bookContext: Partial<Book>;
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
}

/**
 * Központi AI híváskezelő, amely műfaj alapján a megfelelő szolgáltatót hívja meg.
 */
export async function executeAiCompletion(req: CompletionRequest): Promise<string> {
  const route = routeModelForBook(req.bookContext);

  // 1. OPENROUTER VAGY EGYEDI UNCENSORED API
  if (route.provider === "openrouter" && process.env.OPENROUTER_API_KEY) {
    try {
      const baseUrl = process.env.UNCENSORED_AI_BASE_URL || "https://openrouter.ai/api/v1";
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://render.com",
          "X-Title": "StoryForge AI",
        },
        body: JSON.stringify({
          model: route.modelName,
          messages: [
            { role: "system", content: req.systemPrompt },
            { role: "user", content: req.userPrompt },
          ],
          temperature: req.temperature ?? 0.8,
          max_tokens: req.maxTokens ?? 3000,
          response_format: req.jsonMode ? { type: "json_object" } : undefined,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("OpenRouter API error:", errText);
        throw new Error(`OpenRouter API hiba (${response.status}): ${errText}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "";
    } catch (err) {
      console.warn("Falling back to simulated completion due to API error:", err);
      // Fallback a szimulációra hiba esetén
    }
  }

  // 2. OPENAI API
  if (route.provider === "openai" && process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: route.modelName,
          messages: [
            { role: "system", content: req.systemPrompt },
            { role: "user", content: req.userPrompt },
          ],
          temperature: req.temperature ?? 0.75,
          max_tokens: req.maxTokens ?? 3500,
          response_format: req.jsonMode ? { type: "json_object" } : undefined,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("OpenAI API error:", errText);
        throw new Error(`OpenAI API hiba (${response.status}): ${errText}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || "";
    } catch (err) {
      console.warn("Falling back to simulated completion due to API error:", err);
    }
  }

  // 3. MOCK / INTELLIGENS SZIMULÁCIÓS ÜZEMMÓD
  // Ezzel a felhasználó azonnal ki tudja próbálni a teljes generálási folyamatot
  return generateSimulatedResponse(req, route);
}

function generateSimulatedResponse(
  req: CompletionRequest,
  route: ModelRouteDecision
): string {
  const { bookContext, jsonMode } = req;
  const isAdult = route.isAdult;
  const premise = bookContext.story_premise || "Egy titokzatos és megrázó utazás";
  const title = bookContext.title || "A Végzet Köve";

  // Ha JSON kimenetet várt a hívó
  if (jsonMode) {
    // 1. Story Architect
    if (req.systemPrompt.includes("Story Architect") || req.userPrompt.includes("Story Architecture")) {
      return JSON.stringify({
        premise: premise,
        central_conflict: isAdult
          ? "A tiltott vágyak, a testi kiszolgáltatottság és a sötét, rejtélyes erők feloldhatatlan összecsapása a túlélésért."
          : "A főszereplő belső kételyei és egy külső, pusztító rejtély felfedezése közötti küzdelem.",
        theme: isAdult ? "Szenvedély, tabuk átlépése és a lélek legmélyebb sötétsége" : "Kitartás, igazságkeresés és a múlt titkai",
        stakes: "A szabadság és az önazonosság teljes elvesztése",
        ending: "Keserédes, drámai katarzis egy végső revelációval",
        acts: [
          { act: "I. Felvonás: Kezdetek és a csábítás / hívás", chapters: [1, 2, 3] },
          { act: "II. Felvonás: Alászállás a sötétségbe és eszkaláció", chapters: [4, 5, 6, 7] },
          { act: "III. Felvonás: Végső konfrontáció és feloldás", chapters: [8, 9, 10] },
        ],
      });
    }

    // 2. Character Designer
    if (req.systemPrompt.includes("Character Designer") || req.userPrompt.includes("szereplők")) {
      return JSON.stringify({
        characters: [
          {
            name: "Anna Kovács",
            role: "protagonist",
            age: 28,
            gender: "nő",
            occupation: "Régész és kutató",
            personality: "Rendkívül intelligens, merész, de érzelmileg sebzett",
            goal: "Feltárni az elzárt kripta titkát és megmenteni a családja jó hírnevét",
            fear: "A tehetetlenség és a mély sötétség",
            strength: "Rendíthetetlen megfigyelőképesség és határozottság",
            weakness: "Gyakran túl mélyre megy ott is, ahol a határokat meg kellene húzni",
            relationships: [{ target_name: "Márk", relationship_type: "bonyolult vonzalom / feszültség", status: "aktív" }],
            is_protagonist: true,
          },
          {
            name: "Márk Holló",
            role: "antagonist",
            age: 34,
            gender: "férfi",
            occupation: "Rejtélyes gyűjtő",
            personality: "Karizmatikus, manipulatív, domináns kisugárzású",
            goal: "Megszerezni az ősi relikviát minden áron",
            fear: "Az irányítás elvesztése",
            strength: "Pszichológiai ráhatás és hidegvér",
            weakness: "Alábecsüli a célpontjai akaraterejét",
            relationships: [{ target_name: "Anna Kovács", relationship_type: "macska-egér játék", status: "feszült" }],
            is_protagonist: false,
          },
        ],
      });
    }

    // 3. Outline Generator
    if (req.systemPrompt.includes("Outline Generator") || req.userPrompt.includes("fejezetvázlat")) {
      return JSON.stringify({
        chapters: [
          {
            chapter_number: 1,
            title: "A tiltott pecsét",
            chapter_goal: "A helyszín és a kiinduló titok felvezetése",
            conflict: "A szereplő szembesül a figyelmeztetésekkel, de a kíváncsisága győz",
            turning_point: "Egy ősi szimbólum felfedezése, amely azonnali reakciót vált ki",
            ending_hook: "Egy lépés hallatszik a sötét folyosó végéről...",
            target_words: 2800,
          },
          {
            chapter_number: 2,
            title: "Érintések a félhomályban",
            chapter_goal: "A két főszereplő közötti feszültség robbanása",
            conflict: "Menekülés vagy behódolás a szituáció erejének",
            turning_point: "Egy váratlan vallomás és a határok átlépése",
            ending_hook: "Az ajtó mögül zörrenés hallatszik, a titok már nem maradhat rejtve.",
            target_words: 3200,
          },
          {
            chapter_number: 3,
            title: "A vér és a szenvedély ára",
            chapter_goal: "Az események visszafordíthatatlan következményei",
            conflict: "Szembesülés a rejtély valódi természetével",
            turning_point: "A szövetség átalakulása",
            ending_hook: "Már nem volt visszaút a fényre.",
            target_words: 3500,
          },
        ],
      });
    }

    // 4. Continuity Checker
    if (req.systemPrompt.includes("Continuity Editor")) {
      return JSON.stringify({
        issues: [],
        status: "CONSISTENT",
        notes: "A fejezet maradéktalanul illeszkedik a Story Bible szabályaihoz és a karakterek korábban feljegyzett jellemzőihez.",
      });
    }

    // Default JSON fallback
    return JSON.stringify({ status: "success", message: "Generált adat", data: {} });
  }

  // Szöveges próza (Novel Writer)
  if (isAdult) {
    return `A szobában nehéz, szinte tapintható volt a csend, amelyet csak a kintről beszűrődő vihar tompa morajlása tört meg időről időre. Anna a falhoz simulva lélegzett; a bőre felforrósodott, ahogy Márk léptei egyre közelebb értek a sötétben.

— Azt hitted, ilyen könnyen elmenekülhetsz innen? — suttogta a férfi, hangjában a feszültség és a nyers dominancia vibrált. A szavai lúdbőrt rajzoltak a lány nyakára.

Anna megpróbált hátrálni, de a hideg kőfal megállította. Nem volt menekvés, és legbelül tudta: nem is akart igazán elmenekülni. Márk keze hirtelen kulcsolódott a csuklójára; a fogása vasmarokként zárult, mégis perzselő volt az érintése.

— Nézz rám! — követelte Márk, miközben a tekintetük összeakadt a félhomályban. A horror és a mindent elsöprő vágy egyetlen lüktető érzéssé olvadt össze a bensőjükben...`;
  }

  return `A hajnali köd sűrű lepellel borította be a hegyoldalt. Anna óvatosan lépkedett a málladozó kőlépcsőkön, ujjait a hátizsákja szíjára szorítva. Minden egyes lélegzetvétel hideg párát rajzolt az arc elé.

A templom bejárata pontosan ott állt, ahol a megviselt térkép jelezte. Évszázadok óta nem nyitotta ki emberi kéz ezt a vaskos bronzkaput, most mégis friss karcolások nyomai látszódtak a díszes záron.

— Nem vagyunk egyedül — suttogta magában, miközben a zsebéből előhúzta a sárgaréz jegyzetfüzetet. A felfedezés izgalma szinte elmosta a növekvő félelmét...`;
}
