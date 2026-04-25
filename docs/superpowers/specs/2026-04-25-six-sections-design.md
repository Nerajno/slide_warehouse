# Design: Six New Sections — Slide Warehouse
_2026-04-25_

## Overview
Add 2 new pages, 5 new components, 1 new composable, and update 7 existing files to expand Slide Warehouse with an About page, topic-filtered deck browsing, a featured deck banner, a topics explorer, resource links, version changelog, and a speaker bio.

---

## Data Layer

### `types/index.ts`
Add to existing file:
```ts
export interface Resource { label: string; url: string }
export interface TopicStat { tag: string; count: number }
```
Extend `SpeakerData`:
```ts
bio: string
socialHandles: { x: string; github: string; devto: string }
links: Resource[]
```
Extend `DeckFrontmatter`:
```ts
featured?: boolean
resources?: Resource[]
```
Note: `TalkStatus` already exists — do not re-add.

### `stores/deckStore.ts`
No deck state added. Store remains UI-only (search, tags, sort). Tag stats live in `useTopics.ts`.

### `composables/useTopics.ts`
Single source for tag statistics. Fetches all decks via `queryContent('decks').find()`. Returns:
```ts
tagStats: ComputedRef<Record<string, number>>
// e.g. { vue: 2, nuxt: 1, career: 3 }
```
Used by `TopicsExplorer.vue` and `pages/topics/[tag].vue`.

### `content/speaker.json`
Add fields:
```json
"bio": "Nerando Johnson is a software developer and international conference speaker...",
"socialHandles": { "x": "nerajno", "github": "Nerajno", "devto": "nerajno" },
"links": [
  { "label": "Blog", "url": "https://developingdvlpr.com" },
  { "label": "GitHub", "url": "https://github.com/Nerajno" }
]
```

### `content/decks/*.md`
Add to all three decks:
```yaml
resources:
  - label: "Blog post"
    url: ""
  - label: "Recording"
    url: ""
```
Add only to `people-skills-technical-skills.md`:
```yaml
featured: true
```

---

## New Components

### `components/FeaturedDeck.vue`
- Self-fetching: `queryContent('decks').where({ featured: true }).findOne()`
- Renders nothing (`v-if`) if no featured deck found
- Full-width banner layout: thumbnail gradient div + title (Fraunces/font-display) + description + tag chips + "Open deck →" NuxtLink to `/decks/${deck.id}`
- Design tokens: emerald border, card bg `#161b22`, grid-line overlay on thumbnail

### `components/TopicsExplorer.vue`
- Uses `useTopics()` composable
- Renders a responsive card grid (2–4 columns)
- Each card: tag name + deck count badge + click navigates to `/topics/${tag}`
- Hides tags where count === 0
- Uses `TAG_COLORS` from `types/index.ts` for card accent colors

### `components/ResourceLinks.vue`
- Props: `resources: Resource[]`
- Renders nothing if `resources` is empty or undefined
- Collapsible: header with toggle chevron, expands to list of external links
- Each item: label + `<a target="_blank" rel="noopener">` link

### `components/VersionChangelog.vue`
- Props: `versions: DeckVersion[]`
- Sorts versions newest-first by version number
- Timeline layout: version badge + label + date + optional notes (`changes` field)
- Renders nothing if versions empty

### `components/SpeakerBio.vue`
- Self-fetching: `queryContent<SpeakerData>('speaker').findOne()`
- Avatar: initials circle (emerald background, white text, 3rem)
- Bio text paragraph
- Social links row: X, GitHub, dev.to, and any `links` entries from speaker.json
- Used only on `pages/about.vue`

---

## New Pages

### `pages/about.vue`
Three sections stacked vertically:
1. `<SpeakerBio />` — bio block
2. Stats strip — reuse same 4-stat grid from SpeakerOverview (Decks, Slides, Talks, Conferences) via a fresh `queryContent` call
3. Links row — renders `speaker.links` as pill buttons

### `pages/topics/[tag].vue`
```ts
const tag = useRoute().params.tag as string
const { data: decks } = await useAsyncData(`topic-${tag}`, () =>
  queryContent('decks').where({ tags: { $contains: tag } }).find()
)
```
- H1: tag name (capitalize)
- Back link `← All decks` → `/`
- `<DeckGrid :decks="decks" />`
- 0-result state: friendly empty message

---

## Modified Files

### `components/DeckSidebar.vue`
No new props. `DeckFrontmatter` already arrives via the existing `deck` prop. After extending the interface with `resources?: Resource[]`, DeckSidebar renders `<ResourceLinks :resources="deck.resources" />` and `<VersionChangelog :versions="deck.versions" />` with conditional `<hr>` separators.

### `pages/decks/[id].vue`
No change needed — already passes `:deck="deck"`. New fields flow automatically.

### `pages/index.vue`
Add above the existing hero div:
```html
<FeaturedDeck />
<TopicsExplorer />
```

### `components/FilterTags.vue`
- Filter out tags where `tagCount(tag) === 0` before rendering
- Apply `opacity-40 pointer-events-none` class for any tag with count 0 (belt-and-suspenders)

### `layouts/default.vue`
Add `<NuxtLink to="/about">` in the header nav between the `@Nerajno` handle and dark mode toggle.

---

## Design Tokens
| Token | Value |
|---|---|
| Primary | emerald `#059669` |
| Accent | amber `#d97706` |
| Font display | Plus Jakarta Sans (font-display) |
| Font mono | JetBrains Mono (font-mono) |
| Dark bg | `#0d1117` |
| Card bg | `#161b22` |
| Border | `#2a3347` |

---

## Out of Scope
- Authentication
- CMS editing
- Analytics
- Search within topics page (uses existing DeckGrid filtering)
