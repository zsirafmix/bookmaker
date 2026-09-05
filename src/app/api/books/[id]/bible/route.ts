import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { StoryBible } from "@/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let bible = await db.getStoryBible(id);
  if (!bible) {
    bible = {
      id: "bible-" + Date.now(),
      book_id: id,
      world_rules: [],
      character_rules: [],
      timeline: [],
      relationships: [],
      themes: [],
      important_objects: [],
      open_mysteries: [],
      plot_threads: [],
      forbidden_contradictions: [],
      updated_at: new Date().toISOString(),
    };
    await db.saveStoryBible(id, bible);
  }
  return NextResponse.json({ success: true, storyBible: bible });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const existing = await db.getStoryBible(id);

    const updated: StoryBible = {
      id: existing?.id || "bible-" + Date.now(),
      book_id: id,
      world_rules: body.world_rules || existing?.world_rules || [],
      character_rules: body.character_rules || existing?.character_rules || [],
      timeline: body.timeline || existing?.timeline || [],
      relationships: body.relationships || existing?.relationships || [],
      themes: body.themes || existing?.themes || [],
      important_objects: body.important_objects || existing?.important_objects || [],
      open_mysteries: body.open_mysteries || existing?.open_mysteries || [],
      plot_threads: body.plot_threads || existing?.plot_threads || [],
      forbidden_contradictions: body.forbidden_contradictions || existing?.forbidden_contradictions || [],
      content_boundaries: body.content_boundaries || existing?.content_boundaries,
      updated_at: new Date().toISOString(),
    };

    await db.saveStoryBible(id, updated);
    return NextResponse.json({ success: true, storyBible: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
