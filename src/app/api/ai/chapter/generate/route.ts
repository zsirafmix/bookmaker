import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { executeAiCompletion, routeModelForBook } from "@/lib/ai/model-router";
import { PROMPTS } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  try {
    const { chapterId, customInstructions } = await req.json();
    const chapter = await db.getChapterById(chapterId);
    if (!chapter) {
      return NextResponse.json({ success: false, error: "Fejezet nem található" }, { status: 404 });
    }

    const book = await db.getBookById(chapter.book_id);
    if (!book) {
      return NextResponse.json({ success: false, error: "Könyv nem található" }, { status: 404 });
    }

    const characters = await db.getCharacters(book.id);
    const bible = await db.getStoryBible(book.id);

    // Előző fejezet összefoglalójának lekérése
    const allChapters = await db.getChapters(book.id);
    const prevChapter = allChapters.find(
      (c) => c.chapter_number === chapter.chapter_number - 1
    );

    let userPrompt = PROMPTS.novelWriter.buildUserPrompt({
      book,
      chapter,
      characters,
      storyBible: bible || undefined,
      previousSummary: prevChapter?.summary || prevChapter?.content?.slice(0, 500),
    });

    if (customInstructions) {
      userPrompt += `\nFELHASZNÁLÓI KÜLÖNLEGES UTASÍTÁS:\n${customInstructions}\n`;
    }

    const generatedProse = await executeAiCompletion({
      systemPrompt: PROMPTS.novelWriter.system,
      userPrompt,
      bookContext: book,
      temperature: 0.8,
      maxTokens: 3500,
    });

    // Mentés
    chapter.content = generatedProse;
    chapter.status = "generated";
    await db.saveChapter(chapter);

    // Verziótárolás
    await db.saveVersion(chapter.id, generatedProse, "ai");

    const routeInfo = routeModelForBook(book);

    return NextResponse.json({
      success: true,
      chapter,
      modelUsed: routeInfo.modelName,
      provider: routeInfo.provider,
    });
  } catch (error: any) {
    console.error("Generate chapter error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
