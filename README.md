# Claude Chat Analyzer

A stateless, privacy-first dashboard that turns your Claude conversation exports into meaningful insights — word clouds, topic classification, trend timelines, and personal annotations. Everything runs in your browser. Nothing leaves your machine.

---

## What It Does

Upload your Claude chat export (`.json`) and the app gives you:

- **Word clouds** — per chat and per time period, built from the full conversation
- **Topic classification** — automatically tags each chat across 7 categories: Work, Learning, Creative, Technical, Planning, Personal, Research
- **Trend timeline** — stacked area chart showing how your thinking shifts across months, quarters, and years
- **Annotations** — add your own notes and tags to any chat or time period
- **Triple-threat export** — download your data as enriched JSON (original + computed + your annotations), CSV, PNG, or PDF

---

## Quick Start

**Requirements:** [Bun](https://bun.sh) runtime

```bash
# Install dependencies
bun install

# Start dev server
bun run dev
```

Open `http://localhost:5173` in your browser.

---

## Getting Your Claude Export

1. Go to [claude.ai](https://claude.ai)
2. Navigate to **Settings → Account → Export Data**
3. Download your export — you'll receive a `.json` file
4. Drop it into the upload zone

---

## Features

| Feature | Details |
|---------|---------|
| Upload | Drag-and-drop or file picker — `.json` only |
| Word clouds | d3-cloud, TF-IDF weighted, stopword filtered |
| Classification | Pure JS keyword taxonomy — no API calls |
| Time views | Month / Quarter / Year toggle |
| Annotations | Per-chat notes + tags, per-period reflections |
| Search | Filter by keyword, topic, tag, or top term |
| Themes | Benedict · Phoebe · Adriana · JJ (persists across sessions) |
| Export | JSON · CSV · PNG · PDF |
| Privacy | 100% client-side — no server, no database, no tracking |

---

## Tech Stack

| Layer | Library |
|-------|---------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 + Bun |
| Styling | Tailwind CSS v4 |
| Word clouds | d3-cloud |
| Charts | Recharts |
| NLP | Pure JS (TF-IDF + stopword list + keyword taxonomy) |
| State | React `useContext` + `useReducer` |
| Export | html-to-image · jsPDF · html2canvas |
| Font | Varta (Google Fonts) |

---

## Themes

| Name | Vibe | Accent |
|------|------|--------|
| Benedict | Dark & analytical | Purple |
| Phoebe | Warm & journal-like | Amber |
| Adriana | Bold & editorial | Hot pink |
| JJ | Black & white | Near-black |

All themes are WCAG AA compliant.

---

## Project Structure

```
src/
  components/
    ChatDetail/     # Chat view, conversation reader, annotation panel
    Dashboard/      # Shell, sidebar, chat list, cards, search
    Export/         # Export dropdown (JSON, CSV, PNG, PDF)
    Overview/       # Stats, trend chart, topic donut, global word cloud
    Period/         # Period view with merged word cloud and reflection
    UI/             # CollapsibleCard, ThemeSwitcher
    Upload/         # Drag-and-drop upload zone
    WordCloud/      # d3-cloud wrapper
  context/
    SessionContext  # App-wide chat state (useReducer)
    ThemeContext    # Skin selection + CSS variable injection
  lib/
    export          # PNG, PDF, CSV, JSON export helpers
    parser          # JSON validation + text extraction
    periods         # Grouping and formatting by month/quarter/year
    stopwords       # Static stopword list
    taxonomy        # Keyword → topic mapping
    tfidf           # TF-IDF scoring engine
    themes          # Theme definitions
    wordFrequency   # Frequency counter + merger
  types/            # Shared TypeScript types
```
