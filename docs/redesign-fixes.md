# Redesign Fix List

Source: Impeccable design critique + flow audit, 2026-11-01. Two independent passes (design review, detector + browser/code audit) on the live dev build, desktop 1440px and mobile 390px, light and dark themes.

## Scores

- **Design health (Nielsen):** 24/36, Good (heuristic 10 n/a for a portfolio surface)
- **Technical audit:** 16/20, Good

| Audit dimension | Score | Key finding |
|---|---|---|
| Accessibility | 3 | Contrast passes both themes; nested live regions double-announce |
| Performance | 3 | Thumbs lazy and sized; PDFs up to 4.7MB, one Reveal file 5.5MB |
| Theming | 4 | Full `--sw-*` token system; only the OG card hard-codes colors (renderer limit) |
| Responsive | 3 | No overflow at 390px; many touch targets 24–36px; deck viewer portrait on mobile |
| Implementation integrity | 3 | Deck h1 smaller than h2s; 3 placeholder legacy entries |

The weakest area is the visitor flow (how an organizer gets from landing to booking), not the visual system.

## Open decisions

These need an answer before redesign work starts:

1. **Home page focus.** Booking pitch (speaker and topics first), archive-first (keep the current focus, add name and Book CTA), or split (home pitches, decks get their own page)?
2. **Scope.** P1 only, P1 + P2, or everything?
3. **Legacy archive.** Delete placeholders only, also add it to the nav / sort / open PDFs inline, or merge legacy talks into the main deck list?

## P1: fix before anything else

- [ ] **Broken placeholder legacy entries**
  - Where: `content/legacy/css-mastery-2020.md`, `intro-to-javascript-2018.md`, `react-patterns-2019.md`
  - Problem: they point to files missing from `public/legacy-files/` (`.key`, `.pptx`, `.pdf`), so both the Download button and the thumbnail return 404. They look like seed data.
  - Fix: delete the entries, or supply the files. Add a test that fails when a legacy entry's file or thumbnail is missing.
  - Command: `$impeccable harden`
- [ ] **Speaker is anonymous above the fold**
  - Where: `components/HeroSection.vue:100-104`
  - Problem: the hero ("Talks that connect.") describes the tool ("Browse, search, and share Reveal.js presentation decks") rather than the speaker. The name first appears in the footer, and "Reveal.js" is jargon to an event organizer.
  - Fix: put the name, a one-line positioning, the core topics and a Book CTA in the hero.
  - Command: `$impeccable clarify`
- [ ] **No share control on the deck page**
  - Where: `pages/decks/[id].vue`
  - Problem: sharing is the last step of the attendee journey. The only "Copy link" on the page belongs to a Related Talks card and copies a different deck.
  - Fix: add `ShareButton` (copy, plus Web Share on mobile) to the deck top bar. The copied URL must include `?v=`.
  - Command: `$impeccable harden`
- [ ] **Mobile deck viewer is letterboxed**
  - Where: `pages/decks/[id].vue:220`
  - Problem: a 16:9 slide sits in a ~620px portrait frame and reads as mostly blank.
  - Fix: `aspect-ratio: 16/9` with a max-height, and the booking CTA directly below.
  - Command: `$impeccable adapt`

## P2: next pass

- [ ] **Weak, crowded deck page header**
  - Where: `pages/decks/[id].vue:151-202`, h1 at `:160`
  - Problem: the h1 is `text-base` (15px) while the section h2s are 20px. One row carries back, title, conference, location, status, version and length.
  - Fix: give the title a real scale and split the metadata into its own row.
  - Command: `$impeccable typeset`
- [ ] **Booking path is long and has no fallback**
  - Problem: "Book this talk" sits below the fold on both desktop and mobile, and the About page has no booking CTA of its own. Booking is mailto-only and fails silently without a mail client.
  - Fix: show the email address as text next to the button, add a booking CTA to About, and raise the deck-page CTA.
  - Command: `$impeccable clarify`
- [ ] **Legacy archive is hard to find and disordered**
  - Where: `components/SiteFooter.vue:59`, `components/LegacyDeckGrid.vue:46,64`
  - Problem: the archive is only linked from the footer. Cards are unsorted. Tags are plain spans, not links. `download` forces a save instead of opening the PDF. Broken thumbnails can stay visible because `@error` fires before hydration. The "About This Collection" box is filler.
  - Fix: add a nav entry, sort by date, open PDFs inline, link the tags, and handle image errors after mount.
  - Command: `$impeccable layout`
- [ ] **Inconsistent event naming**
  - Problem: the skills-to-bills row says "Orlando Devs 2025" while the slide says "TechBridge 2025".
  - Fix: pick one source of truth in the deck frontmatter.
  - Command: `$impeccable polish`
- [ ] **Double screen-reader announcements** (WCAG 4.1.3)
  - Where: `components/DeckGrid.vue:8` (`aria-live` on the grid) and `:25` (`role=status` inside it); `components/DecksSection.vue:108-109,179,243`
  - Fix: keep one sr-only status line that announces the result count.
  - Command: `$impeccable harden`
- [ ] **Small touch targets**
  - Problem: tag chips are 24px, filter pills 32px, the share button 32×32, footer links 36px, the `developingdvlpr.com` link 19px. These pass WCAG 2.5.8 but fall short of 44px.
  - Fix: pad the hit areas to 44px.
  - Command: `$impeccable adapt`
- [ ] **Heavy assets**
  - Where: `public/legacy-files/*.pdf` (1.2–4.7MB), `public/reveals/2026-10-13-skills-to-bills-techbash/v1.html` (5.5MB, inlined assets), GIFs in `public/reveals/*/assets` (0.6–1MB)
  - Fix: compress the PDFs, convert the GIFs to video, and extract the inlined assets.
  - Command: `$impeccable optimize`
- [ ] **Bad topic returns 200**
  - Problem: `/topics/<unknown>` renders "0 decks" with status 200.
  - Fix: return a real 404, matching the deck 404.
  - Command: `$impeccable harden`

## P3: polish

- [ ] **Home deck section overload:** 8 tag pills, a 5-option sort and search for 5 decks. The nav has 7 items, including two mail/Book controls. Consider curating by theme. (`$impeccable distill`)
- [ ] **Duplicate back paths on the deck page:** the breadcrumb and "← Back" duplicate each other, and Back is hard-coded to `/`. Keep one.
- [ ] **Jargon:** "Copy deck path" (icon-only), bare "v2", "Deliveries". (`$impeccable clarify`)
- [ ] **Topic tile colors carry no meaning:** they cycle by position at `pages/topics/index.vue:14`.
- [ ] **Ordering and data:** the "Featured" deck sorts 4th, and one legacy card says 2017 while its filename says 2018.
- [ ] **Copy and layout:** 9 em-dashes in home body copy; the `/legacy` intro runs ~100ch (cap with `max-w-prose`); the skip link animates `top` (`assets/css/tokens.css:310`).
- [ ] **Theme icon:** check a possible mismatch between the toggle icon and the theme on first load (unconfirmed).

## Flow audit

1. **Event organizer: land → understand → find talk → book**
   - Path: hero → Browse → scroll → Open deck → scroll → Book (≥3 clicks and 2 long scrolls).
   - Friction: the speaker is never named above the fold; the first deck on mobile sits ~1650px down; the Book CTA is below the fold.
2. **Attendee: find the deck they saw → view → share**
   - Path: search takes 2–3 steps, well under the 15s target.
   - Friction: there is no share for the current deck, and the event-name mismatch causes doubt that it's the right deck.
3. **Legacy: browse → open a PDF**
   - Path: the only entry is a footer link.
   - Friction: 3 of 10 downloads are dead, files force-download, and the cards are unsorted.

**Edge states:** `/decks/does-not-exist` returns a real 404 with a recovery link (good). Empty search gives a helpful message and a reset (good). `/topics/<unknown>` returns 200 (fix).

## Keep (what's working)

- **Semantic color:** a two-hue system with one meaning each (emerald = archive, amber = upcoming), documented and applied consistently.
- **Careful edge states:** distinct empty states, row-matched skeletons, skip links including one past the iframe, and keyboard hints.
- **Linkable versions:** the version picker labels each delivery by its event, and `?v=` makes that delivery shareable.
- **Solid foundations:** full token system, both themes passing contrast, reduced motion honored, landmarks and heading order correct, alt text everywhere, a labelled search combobox, and a sandboxed deck iframe.

## Detector notes

- **Overused font:** `overused-font` on Plus Jakarta Sans (`components/OgImage/DeckCard.vue:10`). This is the brand font, so it's low priority.
- **False positive:** `ai-color-palette` ×6 on `/topics`. The cards are dark text on pale tints, and the detector matches on hue only.
