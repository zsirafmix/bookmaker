# StoryForge AI – Professzionális AI Könyvíró Rendszer

A **StoryForge AI** egy modern, full-stack irodalmi és regényíró alkalmazás, amely Next.js 15 App Router, TypeScript, Tailwind CSS, Supabase / PostgreSQL és egy intelligens hibrid **Model Router** segítségével épít fel komplett, akár 50 000–100 000 szavas könyveket kontrollált fejezet-pipeline-on keresztül.

---

## 🌟 Főbb Képességek

1. **Kontrollált Fejezet Pipeline**:
   - `Könyvötlet` ➜ `Karakterek` ➜ `Story Bible` ➜ `Történetív` ➜ `Fejezetvázlat` ➜ `Prózaírás` ➜ `Konzisztencia-ellenőrzés` ➜ `Következő fejezet`.
   - Nem egyetlen hatalmas és feledékeny prompttal ír, hanem fejezetről fejezetre haladva tartja fenn a cselekmény és a karakterek következetességét.
2. **Hibrid Model Router (Minden műfaj támogatása)**:
   - **Standard műfajok** (Fantasy, Thriller, Sci-Fi, Krimi stb.): OpenAI API (`gpt-4o`, `gpt-4o-mini`).
   - **Felnőtt / Extrém műfajok** (🔞 Pornó / Erotika, 🩸 Horror-pornó / Splatterpunk): Cenzúrázatlan modellek [OpenRouter](https://openrouter.ai/) vagy egyedi LLM végponton keresztül, kikerülve a puritán biztonsági szűrőket.
   - **Intelligens szimuláció / Mock mód**: API kulcsok hiányában is azonnal kipróbálható a teljes UI és generálási folyamat.
3. **Story Bible mint az Igazság Forrása**:
   - Világszabályok, kanonikus karaktertulajdonságok, idősík (timeline), tiltott ellentmondások, nyitott rejtélyek és történetszálak követése.
4. **Fejlett Prózaszerkesztő (Prose Editor)**:
   - Autosave (debounce-olt mentés), verziótörténet (v1, v2...), szószámláló és célkövetés.
   - AI íróeszközök: Jelenet folytatása, átfogalmazás, bővítés, dialógus dúsítás, drámaiság fokozása és kontinuitás-vizsgálat.
5. **Azonnali Export**:
   - Markdown (`.md`), sima szöveges fájl (`.txt`), valamint nyomtatható / PDF-be menthető formázott HTML (`.html`).

---

## 🚀 Futtatás Lokálisan

### 1. Előfeltételek
- Node.js 18+ (ajánlott: Node 20+)
- npm vagy yarn

### 2. Telepítés és Indítás
```bash
# Függőségek telepítése (ha még nem történt meg)
npm install

# Fejlesztői szerver indítása
npm run dev
```

Nyisd meg a böngészőben: [http://localhost:3000](http://localhost:3000)

### 3. Környezeti Változók (.env)
Másold le a mellékelt `.env.example` fájlt `.env.local` néven:
```bash
cp .env.example .env.local
```

Állítsd be a kívánt kulcsokat:
- `OPENAI_API_KEY`: Standard könyvekhez (GPT-4o).
- `OPENROUTER_API_KEY`: Felnőtt és horror-pornó műfajokhoz (OpenRouter).
- `DATABASE_URL` / `NEXT_PUBLIC_SUPABASE_URL`: Opcionális, perzisztens Supabase adatbázishoz (a mellékelt séma a `supabase/migrations/01_initial_schema.sql` alatt található).

---

## 📦 Feltöltés GitHub-ra

Hozd létre a GitHub repódat (pl. `storyforge-ai`), majd futtasd a helyi terminálban:

```bash
cd /home/zsiraf/.gemini/antigravity/scratch/storyforge-ai

# Git ellenőrzése
git status

# GitHub távoli repository hozzáadása (cseréld a sajátodra!)
git remote add origin https://github.com/FELHASZNALONEV/storyforge-ai.git

# Ág átnevezése és feltöltés
git branch -M main
git push -u origin main
```

---

## 🌐 Telepítés Render.com-ra

A projekt gyökérkönyvtárában található egy előre konfigurált `render.yaml` Blueprint fájl, amely automatikusan beállítja a Web Service-t.

### 1. Lépés: Render fiók összekötése
1. Jelentkezz be a [Render.com](https://render.com) felületére.
2. Kattints a **New +** gombra a jobb felső sarokban, és válaszd a **Blueprint** opciót.
3. Válaszd ki a feltöltött GitHub repository-t (`storyforge-ai`).

### 2. Lépés: Környezeti változók megadása Renderen
A Render automatikusan beolvassa a `render.yaml` fájlt, és bekéri a szükséges környezeti változókat:
- `OPENAI_API_KEY` (opcionális, de ajánlott standard műfajokhoz)
- `OPENROUTER_API_KEY` (felnőtt / horror-pornó műfajokhoz)
- `NEXT_PUBLIC_APP_URL` (a Render által adott `https://storyforge-ai.onrender.com` cím)

### 3. Lépés: Deploy
Kattints az **Apply** gombra. A Render lefordítja a Next.js projektet (`npm run build`) és elindítja a webszolgáltatást (`npm run start`).

---

## 📂 Architektúra és Mappaszerkezet

```
storyforge-ai/
├── render.yaml                   # Render.com Blueprint specifikáció
├── supabase/
│   └── migrations/
│       └── 01_initial_schema.sql # Teljes PostgreSQL / pgvector séma
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai/               # AI végpontok (architect, outline, chapter, tools, continuity)
│   │   │   ├── books/            # Könyv CRUD és alkönyvtárak
│   │   │   ├── chapters/         # Fejezetkezelés és verziók
│   │   │   └── export/           # Export (MD, TXT, HTML)
│   │   ├── book/
│   │   │   └── [id]/
│   │   │       ├── bible/        # Story Bible képernyő
│   │   │       ├── outline/      # Fejezetvázlat tervező
│   │   │       ├── editor/       # Prose Editor és AI eszközök
│   │   │       └── page.tsx      # Könyv vezérlőpult
│   │   ├── dashboard/            # Felhasználói könyvtár
│   │   ├── wizard/               # 6-lépéses könyvépítő varázsló
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx              # Landing page
│   ├── components/
│   │   └── layout/
│   │       └── Navbar.tsx
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── model-router.ts   # Hibrid routing (OpenAI vs OpenRouter vs Simulator)
│   │   │   └── prompts/          # Verziózott, moduláris prompt könyvtár
│   │   └── db/
│   │       └── index.ts          # Adatbázis interfész memóriatárolóval
│   └── types/
│       └── index.ts              # TypeScript típusdefiníciók
├── package.json
└── tsconfig.json
```
