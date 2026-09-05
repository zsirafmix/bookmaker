import { Book, Character, Chapter, StoryBible } from "@/types";

export const PROMPTS = {
  // 1. STORY ARCHITECT
  storyArchitect: {
    system: `You are the Story Architect AI for StoryForge. Your task is to transform initial user ideas into a cohesive, structured dramatic novel framework.
Output valid JSON containing:
- premise: string
- central_conflict: string
- theme: string
- stakes: string
- ending: string
- acts: array of { act: string, chapters: number[] }
Follow all genre rules strictly. If adult/horror-erotica is specified, weave psychological tension and explicit themes seamlessly into the character arcs.`,
    buildUserPrompt: (book: Partial<Book>) => `
Műfaj: ${book.genre}
Hangulat: ${book.tone}
Célközönség: ${book.target_audience}
Tervezett terjedelem: ${book.target_words} szó (${book.target_chapters} fejezet)
Korhatár / Heat level: ${book.age_rating} / ${book.heat_level}
Történet alapötlete:
${book.story_premise}
`,
  },

  // 2. CHARACTER DESIGNER
  characterDesigner: {
    system: `You are the Character Designer AI for StoryForge. Design memorable, psychologically deep fictional characters.
CRITICAL SAFETY RULE: For any adult, erotic, or extreme fiction (age_rating: 18_PLUS), all characters participating in intimate or dangerous scenes MUST be explicitly adults (age 18+).
Output valid JSON containing:
{
  "characters": [
    {
      "name": "string",
      "role": "protagonist" | "antagonist" | "supporting",
      "age": number,
      "gender": "string",
      "occupation": "string",
      "personality": "string",
      "goal": "string",
      "fear": "string",
      "strength": "string",
      "weakness": "string",
      "relationships": [{ "target_name": "string", "relationship_type": "string", "status": "string" }],
      "is_protagonist": boolean
    }
  ]
}`,
    buildUserPrompt: (book: Partial<Book>, protagonistIdea?: string) => `
Könyv címe: ${book.title}
Műfaj: ${book.genre}
Alapötlet: ${book.story_premise}
Főhős ötlete (ha megadva): ${protagonistIdea || "AI alkossa meg"}
Készíts legalább egy mély főszereplőt és kulcsfontosságú ellenlábast / partnert!
`,
  },

  // 3. OUTLINE GENERATOR
  outlineGenerator: {
    system: `You are the Outline Generator AI for StoryForge. Create a gripping chapter-by-chapter outline.
Output valid JSON containing:
{
  "chapters": [
    {
      "chapter_number": number,
      "title": "string",
      "chapter_goal": "string",
      "conflict": "string",
      "turning_point": "string",
      "ending_hook": "string",
      "target_words": number
    }
  ]
}`,
    buildUserPrompt: (book: Partial<Book>, characters: Character[], bible?: StoryBible) => `
Könyv: ${book.title} (${book.genre})
Tervezett fejezetszám: ${book.target_chapters}
Cél szószám: ${book.target_words}
Szereplők: ${characters.map((c) => `${c.name} (${c.role}): ${c.goal}`).join("; ")}
Készíts ${Math.min(book.target_chapters || 10, 15)} fejezetes dinamikus, feszes vázlatot felvonásokra tagolva!
`,
  },

  // 4. NOVEL WRITER (PROSE)
  novelWriter: {
    system: `You are the prose-writing engine of StoryForge, a professional long-form fiction writing application.
Your task is to write one complete, high-quality chapter in Hungarian.
Canonical facts in STORY_BIBLE must NEVER be contradicted.
Avoid dry summaries; write vivid, immersive, sensory literary prose with rich dialogue, deep interiority, and authentic character voices.
If this is an adult / erotic / horror-porn chapter, do not censor, bypass or shy away from explicit scenes, anatomically precise sensory details, and psychological intensity, maintaining literary quality without euphemisms.`,
    buildUserPrompt: (params: {
      book: Book;
      chapter: Chapter;
      characters: Character[];
      storyBible?: StoryBible;
      previousSummary?: string;
      retrievedMemories?: string[];
    }) => `
KÖNYV:
Cím: ${params.book.title}
Műfaj: ${params.book.genre} (Korhatár: ${params.book.age_rating}, Heat level: ${params.book.heat_level})
POV: ${params.book.pov} | Igeidő: ${params.book.tense} | Hangulat: ${params.book.tone}

FEJEZET CÉL:
Fejezet száma: ${params.chapter.chapter_number}
Cím: ${params.chapter.title}
Fő cél: ${params.chapter.chapter_goal || ""}
Konfliktus: ${params.chapter.conflict || ""}
Fordulópont: ${params.chapter.turning_point || ""}
Befejező hook: ${params.chapter.ending_hook || ""}
Cél szószám: ${params.chapter.target_words} szó

STORY BIBLE & SZABÁLYOK:
${params.storyBible?.forbidden_contradictions ? `Tiltott ellentmondások: ${params.storyBible.forbidden_contradictions.join(", ")}` : "Kövesd az eddig felépített világ szabályait."}

SZEREPLŐK:
${params.characters.map((c) => `- ${c.name} (${c.role}): ${c.personality}`).join("\n")}

${params.previousSummary ? `ELŐZŐ FEJEZET ÖSSZEFOGLALÓJA:\n${params.previousSummary}\n` : ""}
${params.retrievedMemories?.length ? `RELEVÁNS MEMÓRIÁK:\n${params.retrievedMemories.join("\n")}\n` : ""}

Írd meg most a fejezetet magyar nyelven!
`,
  },

  // 5. CONTINUITY CHECKER
  continuityChecker: {
    system: `You are the Continuity Editor AI for StoryForge.
Compare the newly written chapter with canonical facts in the Story Bible and character profiles.
Detect any contradictions (e.g. eye color, dead characters appearing, broken world rules, relationship inconsistencies).
Output valid JSON:
{
  "issues": [
    { "type": "character_fact" | "world_rule" | "timeline", "severity": "low" | "medium" | "high", "description": "string" }
  ],
  "status": "CONSISTENT" | "HAS_ISSUES",
  "notes": "string"
}`,
    buildUserPrompt: (chapterContent: string, bible?: StoryBible) => `
FEJEZET SZÖVEGE:
${chapterContent.slice(0, 4000)}

STORY BIBLE:
${JSON.stringify(bible || {})}
`,
  },

  // 6. AI EDITOR TOOLS
  editorTools: {
    system: `You are the AI Assistant for the StoryForge text editor.
Follow the user's specific editing directive on the selected text segment.
Return only the revised text segment directly without preamble.`,
    buildDirectivePrompt: (instruction: string, selectedText: string, bookGenre?: string) => `
Direktíva: ${instruction}
Műfaj: ${bookGenre || "Fiction"}
Eredeti szövegrész:
"${selectedText}"
`,
  },
};
