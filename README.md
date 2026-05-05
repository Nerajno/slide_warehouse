# Slide Warehouse

A self-hosted Reveal.js presentation repository for browsing, searching, and sharing conference talks.

**Stack:** Nuxt 3 · Vue 3 · Reveal.js · Tailwind CSS · Pinia · Nuxt Content
**Deploy:** Netlify

## Features

- Browse, search, and filter decks by tag in real-time
- Sort by newest, oldest, or alphabetically
- Inline Reveal.js viewer (iframe-isolated) with fullscreen support
- Versioned presentations (`v1.html`, `v2.html`) with changelog
- Legacy presentation archive for pre-Reveal.js decks (PowerPoint, PDF, Keynote)
- Share button on every deck card — copies link to clipboard
- Light / dark / system theme toggle (persisted to localStorage)
- WCAG 2.2 AA compliant · Keyboard navigable · Skip-to-content link

## Routes

| Path                     | Description                                            |
| ------------------------ | ------------------------------------------------------ |
| `/`                      | Deck grid + search + filters                           |
| `/decks/:id`             | Deck viewer + metadata sidebar                         |
| `/legacy`                | Legacy presentation archive (PowerPoint, PDF, Keynote) |
| `/reveals/:id/v{n}.html` | Raw Reveal.js HTML (iframe source)                     |

## Adding a Deck

### Reveal.js Presentations

1. Create `content/decks/{slug}.md` with frontmatter
2. Add `public/reveals/{slug}/v1.html`
3. Push to Git — Netlify rebuilds automatically

### Legacy Presentations

1. Add presentation file to `public/legacy-files/` (PPTX, PDF, KEY, etc.)
2. Create thumbnail image in `public/legacy-thumbnails/`
3. Update `LegacyDeckGrid.vue` with presentation metadata
4. Push to Git — Netlify rebuilds automatically

```yaml
# content/decks/my-talk.md
---
id: "my-talk"
title: "My Talk"
description: "One sentence description."
tags: ["vue", "career"]
slideCount: 20
durationMinutes: 30
createdAt: "2026-04-14"
updatedAt: "2026-04-14"
revealBasePath: "/reveals/my-talk"
currentVersion: 1
versions:
  - version: 1
    label: "Original"
    date: "2026-04-14"
    revealFile: "v1.html"
---
```

## Setup

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # Netlify build output → .output/public
```

## Design Tokens

| Token   | Value                                     |
| ------- | ----------------------------------------- |
| Accent  | Amber `#d97706`                           |
| Font    | Plus Jakarta Sans · JetBrains Mono (mono) |
| Primary | Emerald `#059669`                         |

## Performance Targets

Lighthouse Performance ≥ 90 · Accessibility = 100 · LCP < 2.5s · Bundle < 150KB

---

*Progress over perfection.*
