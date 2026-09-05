import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const chapter = await db.getChapterById(id);
  if (!chapter) {
    return NextResponse.json({ success: false, error: "Fejezet nem található" }, { status: 404 });
  }

  const versions = await db.getVersions(id);
  return NextResponse.json({ success: true, chapter, versions });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const chapter = await db.getChapterById(id);
    if (!chapter) {
      return NextResponse.json({ success: false, error: "Fejezet nem található" }, { status: 404 });
    }

    const body = await req.json();

    // Ha jelentős tartalomváltozás történt és kérik a verzió mentését
    if (body.saveVersion && body.content && body.content !== chapter.content) {
      await db.saveVersion(id, chapter.content, body.versionAuthor || "user");
    }

    const updated = {
      ...chapter,
      ...body,
      id,
      updated_at: new Date().toISOString(),
    };

    const saved = await db.saveChapter(updated);
    return NextResponse.json({ success: true, chapter: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
