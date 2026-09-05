import { Book, Character, Chapter, StoryBible, ChapterVersion, Memory } from "@/types";

// Helyi memóriatároló fallback kezdeti működéshez és teszteléshez
interface Store {
  books: Map<string, Book>;
  characters: Map<string, Character[]>;
  storyBibles: Map<string, StoryBible>;
  chapters: Map<string, Chapter[]>;
  versions: Map<string, ChapterVersion[]>;
  memories: Map<string, Memory[]>;
}

// Globális singleton tároló
const globalStore: Store = (globalThis as unknown as { __storyforge_store?: Store }).__storyforge_store || {
  books: new Map<string, Book>(),
  characters: new Map<string, Character[]>(),
  storyBibles: new Map<string, StoryBible>(),
  chapters: new Map<string, Chapter[]>(),
  versions: new Map<string, ChapterVersion[]>(),
  memories: new Map<string, Memory[]>(),
};

(globalThis as unknown as { __storyforge_store?: Store }).__storyforge_store = globalStore;

// Kezdeti minta adatok betöltése, ha üres
if (globalStore.books.size === 0) {
  const sampleBook: Book = {
    id: "sample-book-1",
    title: "A Karmazsin Titok",
    subtitle: "A tiltott birodalom krónikái",
    language: "hu",
    genre: "horror_erotica_adult",
    tone: "Sötét, érzéki, feszültséggel teli",
    target_audience: "Felnőtt olvasók (18+)",
    pov: "third_person_limited",
    tense: "past",
    target_words: 60000,
    target_chapters: 12,
    status: "writing",
    story_premise: "Egy fiatal kutatónő felkeresi az elhagyatott gótikus kastélyt, ahol a vérvonalának sötét, erotikus és démoni titkai várnak rá.",
    theme: "Szenvedély és alászállás az ismeretlenbe",
    age_rating: "18_PLUS",
    heat_level: "explicit",
    content_warnings: ["explicit_sexual_content", "dark_themes", "body_horror"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  globalStore.books.set(sampleBook.id, sampleBook);

  const sampleCharacters: Character[] = [
    {
      id: "char-1",
      book_id: sampleBook.id,
      name: "Anna Vance",
      role: "protagonist",
      age: 27,
      gender: "nő",
      occupation: "Történész és okkult kutató",
      personality: "Kíváncsi, elszánt, belső gátlásaival küzdő",
      goal: "Felfedni az öröksége rejtett záradékát",
      fear: "A kontroll teljes elvesztése",
      strength: "Éles intellektus és kitartás",
      weakness: "Könnyen enged a kísértésnek",
      relationships: [{ target_name: "Valerius", relationship_type: "bonyolult vágy / veszedelmes szövetség", status: "aktív" }],
      is_protagonist: true,
    },
    {
      id: "char-2",
      book_id: sampleBook.id,
      name: "Lord Valerius",
      role: "antagonist",
      age: 38,
      gender: "férfi",
      occupation: "A kastély őrzője",
      personality: "Titokzatos, domináns, vonzó és kegyetlenül éleseszű",
      goal: "Beavatni Annát a vérvonal rituáléjába",
      fear: "A kastély pecsétjének megtörése",
      strength: "Pszichikai fölény és hipnotikus kisugárzás",
      weakness: "Anna iránti növekvő megszállottsága",
      relationships: [{ target_name: "Anna Vance", relationship_type: "kísértő és mester", status: "feszült" }],
      is_protagonist: false,
    },
  ];

  globalStore.characters.set(sampleBook.id, sampleCharacters);

  const sampleChapters: Chapter[] = [
    {
      id: "chap-1",
      book_id: sampleBook.id,
      chapter_number: 1,
      title: "A rozsdás vaskapu",
      status: "approved",
      target_words: 2800,
      content: `A köd nehéz, nedves lepelként telepedett a Blackwood-birtok fái közé. Anna kocsija még az út szélén állt, de a motor már kihűlt. Ujjai a táskája hűvös bőrére kulcsolódtak, ahogy a hatalmas kovácsoltvas kapura nézett.

A levegőben ózon és száraz avar szaga keveredett, de volt benne valami más is: egy nehéz, szinte édeskés illat, amely azonnal felgyorsította a szívverését.

— Még visszafordulhatsz — suttogta önmagának, de a lábai már vittek előre.

Amikor a tenyere megérintette a rozsdás kilincset, egy különös, meleg áramütésszerű lüktetés futott végig a karján. A kapu halk, szinte sóhajtásszerű nyikorgással engedett a nyomásnak. Belépett a birtokra, és tudta, hogy a régi élete ezzel végleg a kapun kívül rekedt.`,
      summary: "Anna megérkezik a kastélyhoz és átlépi a tiltott határt.",
      word_count: 124,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "chap-2",
      book_id: sampleBook.id,
      chapter_number: 2,
      title: "Érintés a tükörteremben",
      status: "writing",
      target_words: 3200,
      content: "",
      summary: "Anna és Valerius első személyes találkozása a kastély szívében.",
      word_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  globalStore.chapters.set(sampleBook.id, sampleChapters);

  const sampleBible: StoryBible = {
    id: "bible-1",
    book_id: sampleBook.id,
    world_rules: [
      "A kastély határait naplemente után nem szabad elhagyni.",
      "A tükrök nem a valóságot, hanem a belső elfojtott vágyakat mutatják.",
    ],
    character_rules: [
      "Anna szeme mély borostyán színű.",
      "Valerius bal kézfején ősi rituális heg fut végig.",
    ],
    timeline: [
      { timeframe: "1. nap este", event: "Anna megérkezik a kastélyba." },
      { timeframe: "2. nap hajnal", event: "A könyvtárban felfedezik a vérszerződést." },
    ],
    relationships: [
      { char_a: "Anna", char_b: "Valerius", dynamic: "Szexuális és hatalmi feszültség" },
    ],
    themes: ["A test és a lélek határai", "A tiltott tudás ára"],
    important_objects: [
      { name: "A rubin pecsétgyűrű", significance: "Megnyitja a kastély alatti labirintust." },
    ],
    open_mysteries: [
      { mystery: "Mi történt Anna nagyanyjával azon a harminc évvel ezelőtti éjszakán?", status: "unrevealed" },
    ],
    plot_threads: [
      { id: "heritage", name: "Az örökség titka", status: "OPEN" },
    ],
    forbidden_contradictions: [
      "Valerius nem léphet be nappal a kriptába.",
      "Anna nem árulhatja el a külvilágnak a kastély létezését.",
    ],
    content_boundaries: {
      tone: "dark_erotic_thriller",
      kinks_included: ["dominance", "sensory_deprivation"],
    },
    updated_at: new Date().toISOString(),
  };

  globalStore.storyBibles.set(sampleBook.id, sampleBible);
}

export const db = {
  // BOOKS
  async getBooks(): Promise<Book[]> {
    return Array.from(globalStore.books.values()).sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  },

  async getBookById(id: string): Promise<Book | null> {
    return globalStore.books.get(id) || null;
  },

  async saveBook(book: Book): Promise<Book> {
    book.updated_at = new Date().toISOString();
    globalStore.books.set(book.id, book);
    return book;
  },

  async deleteBook(id: string): Promise<boolean> {
    globalStore.books.delete(id);
    globalStore.characters.delete(id);
    globalStore.chapters.delete(id);
    globalStore.storyBibles.delete(id);
    return true;
  },

  // CHARACTERS
  async getCharacters(bookId: string): Promise<Character[]> {
    return globalStore.characters.get(bookId) || [];
  },

  async saveCharacters(bookId: string, characters: Character[]): Promise<Character[]> {
    globalStore.characters.set(bookId, characters);
    return characters;
  },

  // STORY BIBLE
  async getStoryBible(bookId: string): Promise<StoryBible | null> {
    return globalStore.storyBibles.get(bookId) || null;
  },

  async saveStoryBible(bookId: string, bible: StoryBible): Promise<StoryBible> {
    bible.updated_at = new Date().toISOString();
    globalStore.storyBibles.set(bookId, bible);
    return bible;
  },

  // CHAPTERS
  async getChapters(bookId: string): Promise<Chapter[]> {
    const list = globalStore.chapters.get(bookId) || [];
    return [...list].sort((a, b) => a.chapter_number - b.chapter_number);
  },

  async getChapterById(id: string): Promise<Chapter | null> {
    for (const chapters of globalStore.chapters.values()) {
      const found = chapters.find((c) => c.id === id);
      if (found) return found;
    }
    return null;
  },

  async saveChapters(bookId: string, chapters: Chapter[]): Promise<Chapter[]> {
    globalStore.chapters.set(bookId, chapters);
    return chapters;
  },

  async saveChapter(chapter: Chapter): Promise<Chapter> {
    chapter.updated_at = new Date().toISOString();
    chapter.word_count = chapter.content
      ? chapter.content.trim().split(/\s+/).filter(Boolean).length
      : 0;

    const list = globalStore.chapters.get(chapter.book_id) || [];
    const index = list.findIndex((c) => c.id === chapter.id);
    if (index >= 0) {
      list[index] = chapter;
    } else {
      list.push(chapter);
    }
    globalStore.chapters.set(chapter.book_id, list);

    // Frissítjük a könyv szószámát is
    const book = globalStore.books.get(chapter.book_id);
    if (book) {
      const totalWords = list.reduce((acc, c) => acc + c.word_count, 0);
      book.updated_at = new Date().toISOString();
      globalStore.books.set(book.id, book);
    }

    return chapter;
  },

  // VERSIONS
  async getVersions(chapterId: string): Promise<ChapterVersion[]> {
    return globalStore.versions.get(chapterId) || [];
  },

  async saveVersion(
    chapterId: string,
    content: string,
    createdBy: "ai" | "user" | "ai_rewrite"
  ): Promise<ChapterVersion> {
    const list = globalStore.versions.get(chapterId) || [];
    const newVersion: ChapterVersion = {
      id: "v-" + Date.now(),
      chapter_id: chapterId,
      version_number: list.length + 1,
      content,
      created_by: createdBy,
      created_at: new Date().toISOString(),
    };
    list.unshift(newVersion);
    globalStore.versions.set(chapterId, list);
    return newVersion;
  },
};
