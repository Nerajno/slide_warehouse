# Slide Warehouse

A self-hosted Reveal.js presentation repository for browsing, searching, and sharing conference talks.

> **Demo:** _add link once deployed_
> **Status:** In active development — see [Known Issues](#known-issues--todo)

**Stack:** Nuxt 3 · Vue 3 · Reveal.js · Tailwind CSS · Pinia · Nuxt Content
**Deploy:** Netlify

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Routes](#routes)
- [Adding a Deck](#adding-a-deck)
- [Environment Variables](#environment-variables)
- [Design Tokens](#design-tokens)
- [Performance Targets](#performance-targets)
- [Known Issues / TODO](#known-issues--todo)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Browse, search, and filter decks by tag in real-time
- Sort by newest, oldest, or alphabetically
- Inline Reveal.js viewer (iframe-isolated) with fullscreen support
- Versioned presentations (`v1.html`, `v2.html`) with changelog
- Legacy presentation archive for pre-Reveal.js decks (PowerPoint, PDF, Keynote)
- Share button on every deck card — copies link to clipboard
- Light / dark / system theme toggle (persisted to `localStorage`)
- WCAG 2.2 AA compliant · Keyboard navigable · Skip-to-content link

---

## Prerequisites

| Requirement | Version  |
| ----------- | -------- |
| Node.js     | ≥ 20.x   |
| npm         | ≥ 10.x   |

---

## Setup

```bash
# Install dependencies
npm install

# Start dev server → http://localhost:3000
npm run dev

# Build for production (Netlify uses this)
npm run build
```

---

## Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start local dev server on port 3000  |
| `npm run build`     | Production build → `dist`            |
| `npm run preview`   | Preview production build locally     |
| `npm run lint`      | Run ESLint across the project        |
| `npm run typecheck` | Run `vue-tsc` type checking          |

---

## Project Structure

```
slide-warehouse/
├── assets/
│   └── css/
│       └── main.css          # Global styles, design tokens, focus rings
├── components/
│   ├── SiteNav.vue           # Fixed nav — logo, links, mobile hamburger
│   ├── SkipLink.vue          # Skip-to-content accessibility link
│   ├── DeckCard.vue          # Single deck card with share + copy button
│   ├── DeckGrid.vue          # Filterable/sortable deck grid
│   ├── DeckViewer.vue        # Reveal.js iframe viewer
│   ├── DeckSidebar.vue       # Deck metadata sidebar
│   ├── FeaturedDeck.vue      # Featured deck highlight banner
│   ├── FilterTags.vue        # Tag filter chip row
│   ├── SortDropdown.vue      # Sort select (newest/oldest/a-z/z-a)
│   ├── SearchBar.vue         # Deck search input
│   ├── ShareButton.vue       # Copy-link-to-clipboard button
│   ├── VersionSelector.vue   # Deck version picker
│   ├── VersionChangelog.vue  # Version history list
│   ├── LegacyDeckGrid.vue    # Legacy archive grid
│   ├── SpeakerBio.vue        # Speaker bio card
│   ├── SpeakerOverview.vue   # Speaker history / circuit timeline
│   ├── ResourceLinks.vue     # External resource links
│   └── TopicsExplorer.vue    # Tag/topic browsing grid
├── composables/
│   ├── useDecks.ts           # Deck data fetching + filtering logic
│   └── useTheme.ts           # Dark/light/system theme toggle
├── content/
│   ├── speaker.json          # Speaker bio, social links, pipeline
│   └── decks/                # One .md file per deck (Nuxt Content)
│       ├── back-to-basics.md
│       ├── networking-talk.md
│       ├── people-skills-technical-skills.md
│       ├── skills-to-bills.md
│       └── vue-router-deep-dive.md
├── data/                     # Static typed data (supplements content/)
├── layouts/
│   └── default.vue           # App shell — SkipLink, SiteNav, main, footer
├── pages/
│   ├── index.vue             # / — hero, deck grid, search + filters
│   ├── about.vue             # /about — speaker bio + case study
│   ├── decks/[id].vue        # /decks/:id — viewer + sidebar
│   └── legacy.vue            # /legacy — legacy archive
├── public/
│   └── reveals/              # Reveal.js HTML files (per deck, per version)
│       ├── back-to-basics/
│       │   ├── back-to-basics-vueverse.html        # v1
│       │   └── back-to-basics-boisecodecamp.html   # v2
│       ├── networking-talk/
│       │   ├── v1.html
│       │   └── networking-talk-revealjs-Boise2026.html
│       ├── people-skills/
│       ├── skills-to-bills/
│       └── vue-router-deep-dive/
├── stores/
│   └── decks.ts              # Pinia store — search, filter, sort state
├── types/                    # Shared TypeScript interfaces
├── netlify.toml              # Build command + publish dir (dist) + headers
├── nuxt.config.ts
└── tailwind.config.ts        # Semantic color tokens + font config
```

---

## Routes

| Path                     | Description                                            |
| ------------------------ | ------------------------------------------------------ |
| `/`                      | Hero section + deck grid + search + filters            |
| `/about`                 | Speaker bio, case study, speaking history              |
| `/decks/:id`             | Deck viewer + metadata sidebar                         |
| `/legacy`                | Legacy presentation archive (PowerPoint, PDF, Keynote) |
| `/reveals/:slug/*.html`  | Raw Reveal.js HTML (iframe source, versioned)          |

---

## Adding a Deck

### Reveal.js Presentations

1. Create `content/decks/{slug}.md` with frontmatter (see template below)
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

> **Adding a new version?** Increment `currentVersion`, add the new entry to `versions`, and drop `v2.html` into the same folder. The viewer picks it up automatically.

> **Note:** Legacy deck metadata is hardcoded in the component for now. Moving it to Nuxt Content is on the roadmap — see [Known Issues](#known-issues--todo).

---

## Environment Variables

No environment variables are required for local development or the default Netlify deploy.

If you add analytics or a CMS integration later, document variables here:

```bash
# .env.example
# NUXT_PUBLIC_ANALYTICS_ID=
```

---

## Design Tokens

| Token   | Value                                      |
| ------- | ------------------------------------------ |
| Accent  | Amber `#d97706`                            |
| Primary | Emerald `#059669`                          |
| Font    | Plus Jakarta Sans · JetBrains Mono (mono)  |

---

## Performance Targets

| Metric              | Target   |
| ------------------- | -------- |
| Lighthouse Perf     | ≥ 90     |
| Lighthouse A11y     | 100      |
| LCP                 | < 2.5s   |
| JS Bundle           | < 150 KB |

---

## Known Issues / TODO

- [ ] Legacy deck metadata is hardcoded in `LegacyDeckGrid.vue` — should move to Nuxt Content
- [ ] No test suite yet (unit tests for the Pinia store and component smoke tests are the priority)
- [ ] `slideCount` and `durationMinutes` in frontmatter are manually entered and not validated
- [ ] No 404 page for unknown deck slugs
- [ ] Share button falls back silently when the Clipboard API is unavailable (HTTP or old browsers)
- [ ] Reveal.js version is pinned via CDN in each HTML file — no central version control

---

## Contributing

1. Fork the repo and create a branch: `git checkout -b feat/your-feature`
2. Make your changes and run `npm run lint && npm run typecheck` before committing
3. Open a pull request with a short description of what changed and why
4. Keep PRs focused — one concern per PR makes review much easier

There's no formal test gate yet, but please don't break the Lighthouse accessibility score.

---

## License

MIT — see [LICENSE](./LICENSE) for details.

---
