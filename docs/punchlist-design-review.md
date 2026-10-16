# Design Review Punchlist

Source: `/impeccable` critique + technical audit, 2026-07-28 (critique **26/40** Acceptable, audit **14/20** Good). Report-only at the time; nothing fixed.
Re-checked against `main` @ `7324eee` on 2026-10-16. Line numbers are from that commit.

Status: ☐ open · ◐ partially fixed · ☑ done · Tracking issue: [#70]

## P0 — broken

- [ ] [#59] **Duration pills do nothing** — `pages/decks/[id].vue:20,40-43,150-153`
  - `selectedDuration` toggles `aria-pressed` but `revealSrc` only reads `selectedVersion`. Control lies about state (WCAG 4.1.2).
  - Fix: feed duration into `revealSrc` (per-tier reveal file in `versions`, see `.claude/rules/content-schema.md`), **or** remove the pills until tier files exist.
  - Done when: picking a pill changes the iframe `src`, or the pills are gone.
  - Effort: S (remove) / M (wire up + content).

## P1 — dead ends

- [ ] [#60] **Old versions unreachable** — `pages/decks/[id].vue:21`
  - `selectedVersion` fixed to `currentVersion`; no UI to pick v1 etc.
  - Fix: version select in the top bar when `deck.versions.length > 1`.
  - Done when: a deck with 2+ versions can show each one.
  - Effort: S.

- [ ] [#61] **`/topics` and `/legacy` not linked** — `components/SiteNav.vue`, `components/SiteFooter.vue`
  - Both pages exist; neither nav nor footer links them.
  - Fix: add Topics to nav; Legacy to footer (or nav).
  - Done when: both are reachable by clicking from `/`.
  - Effort: XS.

- [ ] [#62] **Tag chips are not links** — `components/DeckCard.vue:38`, `components/DecksSection.vue:202`
  - `<span>`s; `/topics/[tag]` exists but nothing points to it.
  - Fix: `NuxtLink` to `/topics/<tag>`. Watch nesting: DeckCard is itself a link, so no `<a>` inside `<a>`.
  - Done when: clicking a tag opens its topic page; no nested-link warnings.
  - Effort: S.

## P2 — gaps

- [ ] [#63] **No booking CTA on deck page** — `pages/decks/[id].vue` top bar / below viewer
  - Decided: CTA gets its own colour treatment, **outside** the emerald/amber system, so it reads as the one conversion action.
  - Fix: add token (e.g. `--sw-cta`) in `assets/css/tokens.css` (light + `.dark`), button class in `component.css`, place on deck page.
  - Done when: CTA visible on every deck page, passes AA in both themes.
  - Effort: S.

- [ ] [#64] **Heading skip H1 → H3 on topics pages** — `pages/topics/index.vue:30`, `pages/topics/[tag].vue:46`, `components/DeckCard.vue:32`
  - Page has H1, cards render H3, no H2 between.
  - Fix: add an H2 section heading (visible or `sr-only`) above the card grid.
  - Done when: axe/heading outline shows no skipped level.
  - Effort: XS.

- [ ] [#65] **Keyboard trap in deck iframe** — `pages/decks/[id].vue:167`
  - Bare `sandbox="allow-scripts"` iframe; reveal.js swallows keys once focused.
  - Fix: adopt `components/DeckViewer.vue` (decided) with its controls outside the frame, plus a visible "exit presentation" / skip-past link after the frame.
  - Done when: Tab can always move focus past the viewer.
  - Effort: M (see Systemic below — DeckViewer needs token cleanup first).

- [ ] [#66] **Stats render 0 before hydration** — `components/HeroSection.vue:38`
  - `displayValues` starts at `0`; SSR HTML and no-JS users see zeros.
  - Fix: initialise to real values on the server; only reset to 0 on the client right before animating.
  - Done when: view-source of `/` shows real numbers.
  - Effort: XS.

## P3 — polish

- [ ] [#67] **Breadcrumb / divider separators low contrast** — `pages/decks/[id].vue:100,102` (`--sw-border-2`), `:116` (`--sw-border`)
  - Measured 1.27:1 in light mode. They are `aria-hidden` (decorative), so not a hard AA failure, but they read as broken.
  - Fix: use `--sw-text-3`.
  - Done when: separators visibly legible in light mode.
  - Effort: XS.

- [ ] ◐ [#68] **Touch targets under 44px** — site-wide
  - Since review: `.sw-filter-pill` grows to 44px on `pointer: coarse` (`assets/css/component.css:131`). `.sw-tag` is still 22px (`component.css:95`); status chips, share button not re-measured.
  - Fix: same coarse-pointer rule for remaining interactive elements (tags once they become links).
  - Done when: audit at 390px reports 0 interactive targets < 44px.
  - Effort: S.

## Systemic — theming drift

- [ ] [#69] **Hardcoded colours / hand-written `dark:` outside tokens**

  | File | `dark:` | hardcoded | Used? |
  |---|---|---|---|
  | `components/DeckViewer.vue` | 11 | 11 | no — adopt (P2 above) |
  | `components/SpeakerOverview.vue` | 5 | 31 | no |
  | `components/SortDropdown.vue` | 2 | 2 | no |
  | `components/ShareButton.vue` | 1 | 1 | yes — `DeckCard.vue` |
  | `components/SpeakerBio.vue` | 0 | 1 (`text-white`) | check |
  | `components/OgImage/DeckCard.vue` | 0 | 6 | yes — OG render needs literals, **leave** |

  - Fix: delete `SpeakerOverview.vue` and `SortDropdown.vue` (dead); move `DeckViewer.vue` and `ShareButton.vue` onto `--sw-*` tokens.
  - Done when: `grep -rc "dark:" components pages` is 0 outside OG image.
  - Effort: S.

## Suggested order

1. P0 duration pills
2. Quick XS wins: nav links, H2, SSR stats, separators
3. Tags as links, plus their touch targets
4. Theming cleanup, then adopt DeckViewer, which also fixes the keyboard trap
5. Version picker, booking CTA

[#59]: https://github.com/Nerajno/slide_warehouse/issues/59
[#60]: https://github.com/Nerajno/slide_warehouse/issues/60
[#61]: https://github.com/Nerajno/slide_warehouse/issues/61
[#62]: https://github.com/Nerajno/slide_warehouse/issues/62
[#63]: https://github.com/Nerajno/slide_warehouse/issues/63
[#64]: https://github.com/Nerajno/slide_warehouse/issues/64
[#65]: https://github.com/Nerajno/slide_warehouse/issues/65
[#66]: https://github.com/Nerajno/slide_warehouse/issues/66
[#67]: https://github.com/Nerajno/slide_warehouse/issues/67
[#68]: https://github.com/Nerajno/slide_warehouse/issues/68
[#69]: https://github.com/Nerajno/slide_warehouse/issues/69
[#70]: https://github.com/Nerajno/slide_warehouse/issues/70
