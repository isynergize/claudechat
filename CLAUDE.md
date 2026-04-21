# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun install        # Install dependencies
bun run dev        # Start dev server (Vite, port 5173)
bun run build      # TypeScript check + production build
bun run lint       # ESLint check
bun run preview    # Preview production build
```

There is no test suite — verify features manually via the dev server.

## Architecture

**Privacy-first, 100% client-side SPA.** No backend, no API calls, no data leaves the browser. Users upload a Claude export `.json` and everything — parsing, analysis, visualization — runs locally.

### Data Flow

1. `UploadZone` accepts a drag-dropped `.json` file
2. `lib/parser.ts` validates the JSON structure and extracts message text
3. `lib/wordFrequency.ts`, `lib/tfidf.ts`, `lib/taxonomy.ts` compute `AnnotatedChat.computed` fields
4. Enriched chats are stored in `SessionContext` (useReducer)
5. `App.tsx` switches between `UploadZone` and `DashboardShell` based on `state.chats.length`

### State Management

Two React contexts:

- **`SessionContext`** — primary app state: `AnnotatedChat[]`, active selections (period, chat), search/topic filters, per-period reflections. All mutations go through typed `useReducer` actions.
- **`ThemeContext`** — active theme + localStorage persistence; injects CSS custom properties (`--bg`, `--accent`, etc.) into the DOM root.

### Core Data Types (`src/types/index.ts`)

```
Chat            — raw export shape: uuid, name, created_at, chat_messages[]
Message         — uuid, sender ('human'|'assistant'), text, created_at
AnnotatedChat   — Chat + computed (topics, topTerms, wordFrequencies) + user (note, tags)
```

### Analysis Engines (`src/lib/`)

| File | Responsibility |
|------|----------------|
| `parser.ts` | JSON validation, message text extraction |
| `wordFrequency.ts` | Tokenizer (>3 chars, stopword filter), top-100 frequency map |
| `tfidf.ts` | TF-IDF per chat → top-10 unique terms |
| `taxonomy.ts` | 7-category keyword classifier (Work, Learning, Creative, Technical, Planning, Personal, Research) |
| `periods.ts` | Date → period key (`YYYY`, `YYYY-Qn`, `YYYY-MM`), grouping, label formatting |
| `export.ts` | `exportJSON`, `exportCSV`, `exportElementAsPng`, `exportElementAsPdf` |
| `themes.ts` | 4 theme definitions with WCAG AA-compliant color variables |

### UI Structure (`src/components/`)

- **`Dashboard/`** — three-pane shell: `Sidebar` (nav + theme), `ChatList` (filtered list with `SearchBar`), main content area
- **`Overview/`** — global stats cards, stacked-area trend chart (Recharts), topic pie chart, global word cloud
- **`Period/`** — month/quarter/year view: merged word cloud, reflection textarea
- **`ChatDetail/`** — message reader + `AnnotationPanel` (per-chat notes and tags)
- **`Export/`** — dropdown menu triggering export helpers
- **`WordCloud/`** — d3-cloud wrapper component
- **`UI/`** — shared primitives: `CollapsibleCard`, `ThemeSwitcher`

### Theming

Themes (Benedict, Phoebe, Adriana, JJ) are pure CSS custom property swaps. `ThemeContext` writes variables to `document.documentElement` — no class toggling. Add new themes in `lib/themes.ts` and register them there.

## Tech Stack

React 19, TypeScript 6, Vite 8, Bun, Tailwind CSS v4, Recharts, d3-cloud, html-to-image, html2canvas, jsPDF.
