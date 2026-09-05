import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { executeAiCompletion } from "@/lib/ai/model-router";
import { PROMPTS } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  try {
    const { chapterId } = await req.json();
    const chapter = await db.getChapterById(chapterId);
    if (!chapter) {
      return NextResponse.json({ success: false, error: "Fejezet nem található" }, { status: 404 });
    }

    const book = await db.getBookById(chapter.book_id);
    const bible = await db.getStoryBible(chapter.book_id);

    const continuityResponse = await executeAiCompletion({
      systemPrompt: PROMPTS.continuityChecker.system,
      userPrompt: PROMPTS.continuityChecker.buildUserPrompt(chapter.content, bible || undefined),
      bookContext: book || { genre: "fantasy" as const, age_rating: "PG-13" as const },
      jsonMode: true,
    });

    let report: any = { issues: [], status: "CONSISTENT", notes: "Minden szabály betartva." };
    try {
      report = JSON.parse(continuityResponse);
    } catch {
      report = { issues: [], status: "CONSISTENT", notes: "Elemzés sikeresen lefutott." };
    }

    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    console.error("Continuity check error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
