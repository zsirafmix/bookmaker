import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Book } from "@/types";

export async function GET() {
  try {
    const books = await db.getBooks();
    return NextResponse.json({ success: true, books });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newBook: Book = {
      id: "book-" + Date.now(),
      title: body.title || "Névtelen Könyv",
      subtitle: body.subtitle || "",
      language: body.language || "hu",
      genre: body.genre || "fantasy",
      subgenre: body.subgenre || "",
      tone: body.tone || "Kiegyensúlyozott",
      target_audience: body.target_audience || "Felnőtt",
      pov: body.pov || "third_person_limited",
      tense: body.tense || "past",
      target_words: Number(body.target_words) || 50000,
      target_chapters: Number(body.target_chapters) || 15,
      status: "planning",
      story_premise: body.story_premise || "",
      theme: body.theme || "",
      age_rating: body.age_rating || "PG-13",
      heat_level: body.heat_level || "none",
      content_warnings: body.content_warnings || [],
      cover_url: body.cover_url || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const savedBook = await db.saveBook(newBook);
    return NextResponse.json({ success: true, book: savedBook }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
