import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { executeAiCompletion } from "@/lib/ai/model-router";
import { PROMPTS } from "@/lib/ai/prompts";
import { Chapter } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { bookId } = await req.json();
    const book = await db.getBookById(bookId);
    if (!book) {
      return NextResponse.json({ success: false, error: "Könyv nem található" }, { status: 404 });
    }

    const characters = await db.getCharacters(bookId);
    const bible = await db.getStoryBible(bookId);

    const outlineResponse = await executeAiCompletion({
      systemPrompt: PROMPTS.outlineGenerator.system,
      userPrompt: PROMPTS.outlineGenerator.buildUserPrompt(book, characters, bible || undefined),
      bookContext: book,
      jsonMode: true,
    });

    let outlineData: any = { chapters: [] };
    try {
      outlineData = JSON.parse(outlineResponse);
    } catch {
      outlineData = { chapters: [] };
    }

    const wordsPerChapter = Math.round(
      (book.target_words || 50000) / (book.target_chapters || 15)
    );

    const generatedChapters: Chapter[] = (outlineData.chapters || []).map(
      (ch: any, idx: number) => ({
        id: "chap-" + Date.now() + "-" + (idx + 1),
        book_id: book.id,
        chapter_number: ch.chapter_number || idx + 1,
        title: ch.title || `${idx + 1}. Fejezet`,
        status: "planned",
        outline: ch.outline || "",
        chapter_goal: ch.chapter_goal || "",
        conflict: ch.conflict || "",
        turning_point: ch.turning_point || "",
        ending_hook: ch.ending_hook || "",
        target_words: ch.target_words || wordsPerChapter,
        content: "",
        summary: "",
        word_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    );

    if (generatedChapters.length > 0) {
      await db.saveChapters(book.id, generatedChapters);
      book.status = "outline_ready";
      await db.saveBook(book);
    }

    return NextResponse.json({
      success: true,
      chapters: generatedChapters,
    });
  } catch (error: any) {
    console.error("Outline error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
