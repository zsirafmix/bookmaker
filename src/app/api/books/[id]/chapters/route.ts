import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Chapter } from "@/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const chapters = await db.getChapters(id);
  return NextResponse.json({ success: true, chapters });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const chapters = await db.getChapters(id);

    const newChap: Chapter = {
      id: "chap-" + Date.now(),
      book_id: id,
      chapter_number: body.chapter_number || chapters.length + 1,
      title: body.title || `${chapters.length + 1}. Fejezet`,
      status: body.status || "planned",
      outline: body.outline || "",
      chapter_goal: body.chapter_goal || "",
      conflict: body.conflict || "",
      turning_point: body.turning_point || "",
      ending_hook: body.ending_hook || "",
      target_words: Number(body.target_words) || 3000,
      content: body.content || "",
      summary: body.summary || "",
      word_count: body.content ? body.content.trim().split(/\s+/).filter(Boolean).length : 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await db.saveChapter(newChap);
    return NextResponse.json({ success: true, chapter: newChap });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
