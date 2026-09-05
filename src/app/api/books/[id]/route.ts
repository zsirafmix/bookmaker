import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const book = await db.getBookById(id);
    if (!book) {
      return NextResponse.json({ success: false, error: "Könyv nem található" }, { status: 404 });
    }

    const characters = await db.getCharacters(id);
    const chapters = await db.getChapters(id);
    const storyBible = await db.getStoryBible(id);

    return NextResponse.json({
      success: true,
      book,
      characters,
      chapters,
      storyBible,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const book = await db.getBookById(id);
    if (!book) {
      return NextResponse.json({ success: false, error: "Könyv nem található" }, { status: 404 });
    }

    const body = await req.json();
    const updated = { ...book, ...body, id, updated_at: new Date().toISOString() };
    await db.saveBook(updated);

    return NextResponse.json({ success: true, book: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.deleteBook(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
