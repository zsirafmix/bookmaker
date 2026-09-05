import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get("bookId");
    const format = searchParams.get("format") || "markdown"; // 'markdown', 'txt', 'html'

    if (!bookId) {
      return NextResponse.json({ success: false, error: "Hiányzó bookId" }, { status: 400 });
    }

    const book = await db.getBookById(bookId);
    if (!book) {
      return NextResponse.json({ success: false, error: "Könyv nem található" }, { status: 404 });
    }

    const chapters = await db.getChapters(bookId);
    const characters = await db.getCharacters(bookId);

    if (format === "txt") {
      let txt = `${book.title.toUpperCase()}\n`;
      if (book.subtitle) txt += `${book.subtitle}\n`;
      txt += `\nMűfaj: ${book.genre} | Terjedelem: ${book.target_words} szó cél\n`;
      txt += `========================================================\n\n`;

      for (const ch of chapters) {
        txt += `\n\n--- ${ch.chapter_number}. FEJEZET: ${ch.title} ---\n\n`;
        txt += ch.content || "(A fejezet még üres.)";
        txt += `\n\n`;
      }

      return new NextResponse(txt, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": `attachment; filename="${encodeURIComponent(book.title)}.txt"`,
        },
      });
    }

    if (format === "html") {
      const html = `<!DOCTYPE html>
<html lang="hu">
<head>
  <meta charset="utf-8">
  <title>${book.title}</title>
  <style>
    body { font-family: 'Georgia', serif; line-height: 1.8; max-width: 800px; margin: 40px auto; padding: 20px; color: #111; }
    h1 { text-align: center; font-size: 2.5em; margin-bottom: 5px; }
    .subtitle { text-align: center; color: #555; font-style: italic; margin-bottom: 40px; }
    .chapter-title { font-size: 1.8em; margin-top: 60px; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
    p { text-indent: 1.5em; margin-bottom: 0.8em; }
    @media print { .page-break { page-break-before: always; } }
  </style>
</head>
<body>
  <h1>${book.title}</h1>
  ${book.subtitle ? `<div class="subtitle">${book.subtitle}</div>` : ""}
  ${chapters
    .map(
      (ch) => `
    <div class="page-break"></div>
    <h2 class="chapter-title">${ch.chapter_number}. Fejezet: ${ch.title}</h2>
    ${(ch.content || "")
      .split("\n\n")
      .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
      .join("")}
  `
    )
    .join("")}
</body>
</html>`;

      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": `attachment; filename="${encodeURIComponent(book.title)}.html"`,
        },
      });
    }

    // Alapértelmezett: Markdown
    let md = `# ${book.title}\n`;
    if (book.subtitle) md += `*${book.subtitle}*\n\n`;
    md += `**Műfaj:** ${book.genre} | **Hangulat:** ${book.tone} | **Korhatár:** ${book.age_rating}\n\n`;
    md += `## Tartalomjegyzék\n\n`;
    chapters.forEach((c) => {
      md += `- [${c.chapter_number}. Fejezet: ${c.title}](#fejezet-${c.chapter_number})\n`;
    });
    md += `\n---\n\n`;

    for (const ch of chapters) {
      md += `## ${ch.chapter_number}. Fejezet: ${ch.title} {#fejezet-${ch.chapter_number}}\n\n`;
      md += ch.content ? ch.content + "\n\n" : "*(A fejezet még üres)*\n\n";
    }

    return new NextResponse(md, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(book.title)}.md"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
