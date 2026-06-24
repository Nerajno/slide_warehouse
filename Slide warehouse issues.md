# Slide Warehouse — GitHub Issue Backlog

_Derived from PRD (`Prd.md`) audits: June 23 2026 (§19 PRD audit) and issue #3 (design/UX review, May 2026). All issues created on GitHub — numbers linked below._

**Labels in use:** `testing` · `architecture` · `tech-debt` · `security` · `accessibility` · `a11y` · `feature` · `ux` · `perf` · `content` · `seo` · `enhancement` · `docs` · `backlog` · `bug` · `P0` `P1` `P2` `P3` `P4`

---

## 🔴 P0 — Ship blockers _(from issue #3, May 2026 design/UX review)_

### [#20](https://github.com/Nerajno/slide_warehouse/issues/20) [BUG] OG URL domain mismatch breaks social share previews
**Labels:** `bug` `seo` `P0`
`meta-og:url` hardcoded to `slides.developingdvlpr.com` — Netlify deploy generates broken social share previews.
- [ ] Derive canonical URL from `useRequestURL()` or `NUXT_PUBLIC_SITE_URL` env var
- [ ] OG URL and `<link rel="canonical">` match on every route
- [ ] CI/Lighthouse confirms no canonical mismatch

### [#21](https://github.com/Nerajno/slide_warehouse/issues/21) [BUG] Speaking Circuit section displays "0 Events" with no empty state
**Labels:** `bug` `ux` `content` `P0`
History section renders bare "0 Events" counter — reads as broken; undermines credibility.
- [ ] Meaningful empty state when list empty (message + secondary CTA)
- [ ] Seed historical events (DevNexus 2026, OCC 2026, Nebraska.Code) — render ≥ 3 past events
- [ ] Section label → "Past Circuit" / "Past Events" when showing historical data
- [ ] Screen reader announces empty state message (not just "0")

---

## 🔴 P1 — Blockers / high-leverage

### [#4](https://github.com/Nerajno/slide_warehouse/issues/4) Add automated test suite (§7.8)
**Labels:** `testing` `P1`
No tests exist; five defects (BUG-1–5) found *after* build.
- [ ] Vitest unit: slide-counter `postMessage` handler (BUG-1)
- [ ] Vitest unit: version-switch logic (US-2.5) and URL state round-trip (§12)
- [ ] Playwright E2E: browse → view deck → back-nav scroll restore (BUG-2)
- [ ] One regression test per fixed bug (BUG-1–5)
- [ ] axe-core in CI against home + deck pages

### [#5](https://github.com/Nerajno/slide_warehouse/issues/5) Resolve data-layer source of truth (§7.4 / §12 / §14)
**Labels:** `architecture` `tech-debt` `P1`
PRD specifies `queryContent` + `content/decks/*.md`; `main` uses `data/decks.json` → `/api/decks` → `deckStore`.
- [ ] Decide: formally adopt JSON + server API **or** migrate back to Nuxt Content
- [ ] If JSON canonical, delete/relocate 5 orphaned `content/decks/*.md` files
- [ ] Align §7.4, §12, §14 Decision #1 with chosen layer

### [#6](https://github.com/Nerajno/slide_warehouse/issues/6) Harden iframe security (§7.5)
**Labels:** `security` `P1`
`sandbox="allow-scripts allow-same-origin"` is self-defeating; `postMessage` trusts `'*'`.
- [ ] Set iframe `sandbox="allow-scripts"` (drop `allow-same-origin`)
- [ ] Validate `e.origin` against site origin in message listener
- [ ] Pin target origin in reveal HTML `postMessage` calls (not `'*'`)

### [#22](https://github.com/Nerajno/slide_warehouse/issues/22) [UX] Standardize CTA button text across all deck cards
**Labels:** `ux` `content` `P1`
Hero uses "Open Deck →"; Browse grid uses "Open Deck" — inconsistency in a portfolio signals inattention.
- [ ] All CTAs: "Open deck" (sentence case) + right-arrow icon
- [ ] Hero "Most Recent" and Browse grid cards match exactly

### [#23](https://github.com/Nerajno/slide_warehouse/issues/23) [BUG] Social links in About section are raw URLs instead of labeled text
**Labels:** `bug` `a11y` `ux` `P1`
Screen readers announce full URL strings; no visual hierarchy.
- [ ] Human-readable labels (e.g. "X / @Nerajno", "GitHub / @Nerajno")
- [ ] Icon prefix per link; `target="_blank" rel="noopener noreferrer"`
- [ ] WCAG 2.4.4: link purpose clear from text alone; 4.5:1 contrast both modes

### [#24](https://github.com/Nerajno/slide_warehouse/issues/24) [UX] Filter pills show no active/selected state after selection
**Labels:** `ux` `a11y` `P1`
No visible indication which filter is active after scrolling.
- [ ] Active pill: filled background (≥4.5:1 contrast) + dismiss icon (×)
- [ ] Result count: "Showing 3 of 5 decks" — reactive on filter change
- [ ] `aria-pressed="true"` when active, `"false"` when inactive

### [#25](https://github.com/Nerajno/slide_warehouse/issues/25) [UX] Stats counter — "Talks" vs "Decks" discrepancy
**Labels:** `ux` `content` `P1`
Hero shows 12 Talks / 9 Conferences but only 3 decks in Browse.
- [ ] Rename "Talks" → "Deliveries", or add tooltip explaining the distinction
- [ ] All four stat values manually verified before merge

---

## 🟠 P2 — Medium

### [#7](https://github.com/Nerajno/slide_warehouse/issues/7) Verify unconfirmed WCAG 2.2 criteria (§9 / §12 / §19)
**Labels:** `accessibility` `P2`
Specified but never confirmed in June audit.
- [ ] iframe has `title="Presentation: {deck title}"`
- [ ] Reduced motion (US-4.4) wraps transitions in `prefers-reduced-motion`
- [ ] Focus trapped inside viewer in fullscreen
- [ ] Manual screen-reader pass (NVDA/VoiceOver); record in §19
- [ ] Lighthouse a11y 98 → 100

### [#8](https://github.com/Nerajno/slide_warehouse/issues/8) Add privacy-respecting analytics (§10 Q2 / US-6.1 / §13)
**Labels:** `feature` `P2`
Unlocks §13 success metrics.
- [ ] Supabase table + Netlify Edge Function for per-deck view counts
- [ ] Recast "time to find a deck < 15s" as qualitative until measurable

### [#9](https://github.com/Nerajno/slide_warehouse/issues/9) Decide Nuxt Content v2 → v3 (§16 Issue 4)
**Labels:** `tech-debt` `P2`
Depends on #5. Currently `@nuxt/content@2.13.4`; §7.1 says v3 — active layer may be JSON anyway.
- [ ] Migrate to v3, or document Nuxt Content as legacy-only

### [#10](https://github.com/Nerajno/slide_warehouse/issues/10) Replace `[PLACEHOLDER]` resource URLs (§16 Issue 3)
**Labels:** `content` `P2`
- [ ] Fill real blog/recording URLs in deck data, or remove empty entries

### [#11](https://github.com/Nerajno/slide_warehouse/issues/11) Measure & record performance budget (§9 / §13)
**Labels:** `perf` `P2`
Lighthouse Performance and Netlify build time still "TBD".
- [ ] Run `npm run build`; record Lighthouse Performance (target ≥ 90)
- [ ] Record Netlify build time (target < 90s) in §9

### [#26](https://github.com/Nerajno/slide_warehouse/issues/26) [A11Y] Filter buttons missing aria-pressed; sort select missing visible label
**Labels:** `a11y` `P2`
- [ ] Each filter `<button>`: `aria-pressed="true/false"` per state
- [ ] Sort `<select>`: visible `<label>` via `for`/`id` pair
- [ ] axe/Lighthouse ≥ 90 after fix

### [#27](https://github.com/Nerajno/slide_warehouse/issues/27) [A11Y] Duplicate navigation — mobile nav needs aria-hidden when closed
**Labels:** `a11y` `P2`
Nav links appear twice in DOM; when mobile nav hidden visually, still in accessibility tree.
- [ ] Only one `<nav>` active in accessibility tree at a time
- [ ] Mobile nav: `aria-hidden="true"` + `tabindex="-1"` on all children when closed
- [ ] Focus: open → first nav link; close → menu toggle button

---

## 🟢 P3 — Phase 2/3 features

### [#12](https://github.com/Nerajno/slide_warehouse/issues/12) US-2.6 — Keyboard shortcut hints modal
**Labels:** `feature` `P3`
- [ ] Modal listing viewer shortcuts; opens on `?`; focus-trapped; ESC closes

### [#13](https://github.com/Nerajno/slide_warehouse/issues/13) US-2.7 — Search autocomplete / type-ahead
**Labels:** `feature` `P3`
- [ ] Debounced suggestions from title/tags; keyboard-navigable; `role="listbox"`

### [#14](https://github.com/Nerajno/slide_warehouse/issues/14) US-3.3 — "Recently Updated" quick filter
**Labels:** `feature` `P3`
- [ ] Toggle sort/filter by `updatedAt`; deep-linkable via URL state

### [#15](https://github.com/Nerajno/slide_warehouse/issues/15) GAP-9 (Phase 2) — Per-deck dynamic OG images
**Labels:** `feature` `P3`
- [ ] `@nuxtjs/og-image`; per-deck card with title + tag color; replaces static `og-default.png`

### [#28](https://github.com/Nerajno/slide_warehouse/issues/28) [ENHANCEMENT] Add "Copy link" button to each deck card
**Labels:** `enhancement` `ux` `P3`
- [ ] Icon-only button per card with `aria-label="Copy link to [deck title]"`
- [ ] Copies full absolute deck URL via Clipboard API
- [ ] Toast "Link copied!" — 2.5s auto-dismiss; `aria-live="polite"` region
- [ ] Clipboard API fallback (show URL in prompt)

### [#29](https://github.com/Nerajno/slide_warehouse/issues/29) [ENHANCEMENT] Scroll-animated stat counters with prefers-reduced-motion support
**Labels:** `enhancement` `ux` `a11y` `P3`
- [ ] Count 0 → final value on viewport entry (fires once); `IntersectionObserver`; 800–1200ms ease-out
- [ ] `prefers-reduced-motion: reduce`: show final values immediately
- [ ] CLS = 0; no floating point display artifacts

### [#30](https://github.com/Nerajno/slide_warehouse/issues/30) [ENHANCEMENT] Promote "Book a Talk" CTA to persistent nav position
**Labels:** `enhancement` `ux` `P3`
- [ ] "Book a talk" in primary nav (desktop) and hamburger menu (mobile, last item + accent)
- [ ] Links to About/Contact or `mailto:iamnerandojohnson@gmail.com`
- [ ] `aria-label="Email Nerando to book a talk"` if mailto; no layout shift

### [#31](https://github.com/Nerajno/slide_warehouse/issues/31) [ENHANCEMENT] Add breadcrumb / back navigation on deck pages
**Labels:** `enhancement` `ux` `a11y` `P3`
- [ ] "← All decks" above deck title; navigates to `/#decks`
- [ ] `<nav aria-label="Breadcrumb">` with `<ol>` markup (WCAG 2.4.8)
- [ ] Min 44×44px touch target on mobile; not shown on homepage

---

## ⚪ Backlog (Phase 4)

### [#16](https://github.com/Nerajno/slide_warehouse/issues/16) US-3.2 — PDF export (decided: Phase 4)
**Labels:** `feature` `backlog` `P4`
- [ ] GitHub Actions generates PDF per deck on push; "Download PDF" links to committed file

### [#17](https://github.com/Nerajno/slide_warehouse/issues/17) Multi-speaker support (§14 Decision #2 / §17)
**Labels:** `feature` `backlog`
- [ ] Add `author` field to deck schema (no migration); trigger = second speaker commits content

### [#18](https://github.com/Nerajno/slide_warehouse/issues/18) Deck comparison view (§17)
**Labels:** `feature` `backlog`
- [ ] Side-by-side iframes with namespaced `postMessage` routing per frame

---

## 📄 Docs

### [#19](https://github.com/Nerajno/slide_warehouse/issues/19) Restructure the stacked PRD
**Labels:** `docs`
File holds three PRDs with colliding §1 numbering.
- [ ] One current-state spec at top; archive v1.0 ACs + April review into appendix
- [ ] §19 becomes living front matter

---

## Issue index (all 28 issues)

| # | Title | Priority | Source |
|---|---|---|---|
| [#4](https://github.com/Nerajno/slide_warehouse/issues/4) | Add automated test suite | P1 | PRD §7.8 |
| [#5](https://github.com/Nerajno/slide_warehouse/issues/5) | Resolve data-layer source of truth | P1 | PRD §7.4 |
| [#6](https://github.com/Nerajno/slide_warehouse/issues/6) | Harden iframe security | P1 | PRD §7.5 |
| [#7](https://github.com/Nerajno/slide_warehouse/issues/7) | Verify unconfirmed WCAG 2.2 criteria | P2 | PRD §9 |
| [#8](https://github.com/Nerajno/slide_warehouse/issues/8) | Add privacy-respecting analytics | P2 | PRD §10 |
| [#9](https://github.com/Nerajno/slide_warehouse/issues/9) | Decide Nuxt Content v2 → v3 | P2 | PRD §16 |
| [#10](https://github.com/Nerajno/slide_warehouse/issues/10) | Replace [PLACEHOLDER] resource URLs | P2 | PRD §16 |
| [#11](https://github.com/Nerajno/slide_warehouse/issues/11) | Measure & record performance budget | P2 | PRD §9 |
| [#12](https://github.com/Nerajno/slide_warehouse/issues/12) | Keyboard shortcut hints modal | P3 | PRD US-2.6 |
| [#13](https://github.com/Nerajno/slide_warehouse/issues/13) | Search autocomplete / type-ahead | P3 | PRD US-2.7 |
| [#14](https://github.com/Nerajno/slide_warehouse/issues/14) | "Recently Updated" quick filter | P3 | PRD US-3.3 |
| [#15](https://github.com/Nerajno/slide_warehouse/issues/15) | Per-deck dynamic OG images | P3 | PRD GAP-9 |
| [#16](https://github.com/Nerajno/slide_warehouse/issues/16) | PDF export | P4 | PRD US-3.2 |
| [#17](https://github.com/Nerajno/slide_warehouse/issues/17) | Multi-speaker support | backlog | PRD §17 |
| [#18](https://github.com/Nerajno/slide_warehouse/issues/18) | Deck comparison view | backlog | PRD §17 |
| [#19](https://github.com/Nerajno/slide_warehouse/issues/19) | Restructure the stacked PRD | docs | PRD structure |
| [#20](https://github.com/Nerajno/slide_warehouse/issues/20) | [BUG] OG URL domain mismatch | P0 | Issue #3 |
| [#21](https://github.com/Nerajno/slide_warehouse/issues/21) | [BUG] Speaking Circuit "0 Events" empty state | P0 | Issue #3 |
| [#22](https://github.com/Nerajno/slide_warehouse/issues/22) | [UX] Standardize CTA button text | P1 | Issue #3 |
| [#23](https://github.com/Nerajno/slide_warehouse/issues/23) | [BUG] Social links are raw URLs | P1 | Issue #3 |
| [#24](https://github.com/Nerajno/slide_warehouse/issues/24) | [UX] Filter pills no active state | P1 | Issue #3 |
| [#25](https://github.com/Nerajno/slide_warehouse/issues/25) | [UX] Stats "Talks" vs "Decks" discrepancy | P1 | Issue #3 |
| [#26](https://github.com/Nerajno/slide_warehouse/issues/26) | [A11Y] aria-pressed + sort label missing | P2 | Issue #3 |
| [#27](https://github.com/Nerajno/slide_warehouse/issues/27) | [A11Y] Duplicate nav / aria-hidden | P2 | Issue #3 |
| [#28](https://github.com/Nerajno/slide_warehouse/issues/28) | [ENHANCEMENT] Copy link per deck card | P3 | Issue #3 |
| [#29](https://github.com/Nerajno/slide_warehouse/issues/29) | [ENHANCEMENT] Scroll-animated stat counters | P3 | Issue #3 |
| [#30](https://github.com/Nerajno/slide_warehouse/issues/30) | [ENHANCEMENT] Book a Talk in nav | P3 | Issue #3 |
| [#31](https://github.com/Nerajno/slide_warehouse/issues/31) | [ENHANCEMENT] Deck page breadcrumb | P3 | Issue #3 |
