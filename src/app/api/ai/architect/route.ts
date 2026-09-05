import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { executeAiCompletion } from "@/lib/ai/model-router";
import { PROMPTS } from "@/lib/ai/prompts";
import { Character, StoryBible } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { bookId, protagonistIdea } = await req.json();
    const book = await db.getBookById(bookId);
    if (!book) {
      return NextResponse.json({ success: false, error: "Könyv nem található" }, { status: 404 });
    }

    // 1. STORY ARCHITECT FUTTATÁSA
    const architectResponse = await executeAiCompletion({
      systemPrompt: PROMPTS.storyArchitect.system,
      userPrompt: PROMPTS.storyArchitect.buildUserPrompt(book),
      bookContext: book,
      jsonMode: true,
    });

    let architectData: any = {};
    try {
      architectData = JSON.parse(architectResponse);
    } catch {
      architectData = {
        premise: book.story_premise,
        central_conflict: "A rejtélyes konfliktus kibontakozása.",
        theme: "Vágy, hatalom és önfeláldozás.",
        stakes: "Minden elveszhet.",
      };
    }

    // 2. CHARACTER DESIGNER FUTTATÁSA
    const characterResponse = await executeAiCompletion({
      systemPrompt: PROMPTS.characterDesigner.system,
      userPrompt: PROMPTS.characterDesigner.buildUserPrompt(book, protagonistIdea),
      bookContext: book,
      jsonMode: true,
    });

    let charactersData: any = { characters: [] };
    try {
      charactersData = JSON.parse(characterResponse);
    } catch {
      charactersData = { characters: [] };
    }

    const createdCharacters: Character[] = (charactersData.characters || []).map(
      (c: any, index: number) => ({
        id: "char-" + Date.now() + "-" + index,
        book_id: book.id,
        name: c.name || `Szereplő ${index + 1}`,
        role: c.role || (index === 0 ? "protagonist" : "supporting"),
        age: c.age || (book.age_rating === "18_PLUS" ? 28 : 25),
        gender: c.gender || "",
        occupation: c.occupation || "",
        personality: c.personality || "",
        goal: c.goal || "",
        fear: c.fear || "",
        strength: c.strength || "",
        weakness: c.weakness || "",
        background: c.background || "",
        relationships: c.relationships || [],
        is_protagonist: c.is_protagonist ?? index === 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    );

    if (createdCharacters.length > 0) {
      await db.saveCharacters(book.id, createdCharacters);
    }

    // 3. STORY BIBLE INICIALIZÁLÁSA
    const newBible: StoryBible = {
      id: "bible-" + Date.now(),
      book_id: book.id,
      world_rules: [
        `${book.genre} stílusú konvenciók és alapszabályok érvényesek.`,
        `Hangulat: ${book.tone}`,
      ],
      character_rules: createdCharacters.map(
        (c) => `${c.name} (${c.role}): célja ${c.goal || "ismeretlen"}, félelme ${c.fear || "ismeretlen"}`
      ),
      timeline: [
        { timeframe: "Kezdetek", event: architectData.premise || book.story_premise },
      ],
      relationships: createdCharacters.flatMap((c) =>
        (c.relationships || []).map((r) => ({
          char_a: c.name,
          char_b: r.target_name,
          dynamic: r.relationship_type,
        }))
      ),
      themes: [architectData.theme || book.theme || "Önállóság és megpróbáltatás"],
      important_objects: [],
      open_mysteries: [
        { mystery: architectData.central_conflict || "A fő rejtély feloldása", status: "unrevealed" },
      ],
      plot_threads: [
        { id: "main-plot", name: "Főszál", status: "OPEN" },
      ],
      forbidden_contradictions: [
        "A karakterek életkora és alapvető fizikai jegyei nem változhatnak.",
        "A megállapított világ- és mágiaszabályok sérthetetlenek.",
      ],
      content_boundaries: {
        tone: book.genre === "horror_erotica_adult" ? "horror_erotica" : book.genre,
        kinks_included: book.heat_level === "hardcore" ? ["explicit_hardcore"] : [],
      },
      updated_at: new Date().toISOString(),
    };

    await db.saveStoryBible(book.id, newBible);

    // Frissítjük a könyv adatait
    book.story_premise = architectData.premise || book.story_premise;
    book.theme = architectData.theme || book.theme;
    book.status = "planning";
    await db.saveBook(book);

    return NextResponse.json({
      success: true,
      book,
      characters: createdCharacters,
      storyBible: newBible,
      architecture: architectData,
    });
  } catch (error: any) {
    console.error("Architect error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
