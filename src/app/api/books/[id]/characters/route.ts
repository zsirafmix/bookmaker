import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Character } from "@/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const characters = await db.getCharacters(id);
  return NextResponse.json({ success: true, characters });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const characters = await db.getCharacters(id);

    const newChar: Character = {
      id: "char-" + Date.now(),
      book_id: id,
      name: body.name || "Új szereplő",
      role: body.role || "supporting",
      age: body.age ? Number(body.age) : undefined,
      gender: body.gender || "",
      occupation: body.occupation || "",
      personality: body.personality || "",
      goal: body.goal || "",
      fear: body.fear || "",
      strength: body.strength || "",
      weakness: body.weakness || "",
      background: body.background || "",
      relationships: body.relationships || [],
      is_protagonist: Boolean(body.is_protagonist),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    characters.push(newChar);
    await db.saveCharacters(id, characters);

    return NextResponse.json({ success: true, character: newChar });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
