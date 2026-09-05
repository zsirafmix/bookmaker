import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { executeAiCompletion } from "@/lib/ai/model-router";
import { PROMPTS } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  try {
    const { action, selectedText, instruction, bookId } = await req.json();

    const book = bookId ? await db.getBookById(bookId) : null;
    const bookContext = book || { genre: "fantasy" as const, age_rating: "PG-13" as const };

    let promptDirective = instruction;
    switch (action) {
      case "rewrite":
        promptDirective = instruction || "Írd újra a szövegrészt stílusosabban, gördülékenyebben és érzékletesebben!";
        break;
      case "expand":
        promptDirective = "Bővítsd ki a jelenetet több érzékszervi részlettel, leírással és mélyebb belső monológokkal!";
        break;
      case "shorten":
        promptDirective = "Tömörítsd a szövegrészt, távolítsd el a felesleges szavakat, tedd feszesebbé!";
        break;
      case "dialogue":
        promptDirective = "Alakítsd át vagy egészítsd ki életszerű, feszültséggel teli párbeszédekkel a karakterek között!";
        break;
      case "dramatic":
        promptDirective = "Tedd a jelenetet sokkal drámaibbá, sötétebbé, felfokozott feszültségűvé!";
        break;
      case "continue":
        promptDirective = "Folytasd közvetlenül a jelenetet logikusan a következő bekezdésekkel!";
        break;
      default:
        promptDirective = instruction || "Javítsd és csiszold a szöveget.";
    }

    const revisedText = await executeAiCompletion({
      systemPrompt: PROMPTS.editorTools.system,
      userPrompt: PROMPTS.editorTools.buildDirectivePrompt(
        promptDirective,
        selectedText || "",
        book?.genre
      ),
      bookContext,
      temperature: 0.75,
      maxTokens: 2000,
    });

    return NextResponse.json({ success: true, result: revisedText.trim() });
  } catch (error: any) {
    console.error("AI tool error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
