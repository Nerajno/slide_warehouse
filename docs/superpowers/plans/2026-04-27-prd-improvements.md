# Slide Warehouse PRD Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve the Slide Warehouse Nuxt 3 app with a FOUC fix, hybrid rendering, data-driven deck API, full-viewport deck viewer, editorial homepage hero, DeckCard redesign, WCAG improvements, SEO, and security fixes.

**Architecture:** The data layer moves from `queryContent` to a static JSON manifest served via `/api/decks`; all filtering moves to client-side computed refs in the store. Theme FOUC is eliminated with an inline `<script>` in `<head>` that runs before Vue hydration. The deck viewer page becomes a full-viewport layout with a sticky top bar and duration switcher, dropping the sidebar.

**Tech Stack:** Nuxt 3, Vue 3 Composition API, Pinia, Tailwind CSS, TypeScript, Netlify (static + SSR hybrid)

---

## File Map

### Created
- `data/decks.json` — static deck manifest, source of truth for the API
- `server/api/decks.get.ts` — H3 handler that reads and returns `data/decks.json`

### Modified
- `nuxt.config.ts` — inline theme `<script>`, `routeRules` for hybrid rendering, keep existing prerender routes
- `plugins/theme.client.ts` — remove class-apply on mount (inline script does it), keep OS-preference listener
- `stores/deckStore.ts` — add `allDecks` + `pending` via `useAsyncData('/api/decks')`, expose them
- `composables/useDecks.ts` — filter `store.allDecks` client-side instead of using `queryContent`
- `pages/index.vue` — add dark editorial hero section before existing content
- `pages/decks/[id].vue` — full-viewport layout: sticky top bar + full-height iframe, fetch from `/api/decks`
- `pages/about.vue` — add full OG meta tags
- `pages/topics/[tag].vue` — fetch from `/api/decks`, add `aria-live`, improve OG meta
- `components/DeckCard.vue` — conference badge (amber), hover emerald glow, Fraunces title, duration chip link
- `components/FilterTags.vue` — add `aria-live="polite"` announcer for filter result count
- `app.vue` — add `<NuxtLoadingIndicator color="#34d399" />`

---

## Task 1: FOUC Fix — Inline Theme Script

**Files:**
- Modify: `nuxt.config.ts`
- Modify: `plugins/theme.client.ts`

- [ ] **Step 1: Add inline script to `nuxt.config.ts`**

Open `nuxt.config.ts`. Inside the existing `app.head` block, add a `script` array **before** the existing `link` array:

```ts
app: {
  head: {
    title: 'Slide Warehouse',
    script: [
      {
        children: `(function(){try{var t=localStorage.getItem('sw-theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})()`,
      },
    ],
    meta: [
      { name: 'description', content: 'Browse, search, and share Reveal.js presentations by @Nerajno' },
      { property: 'og:site_name', content: 'Slide Warehouse' },
    ],
    link: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
      },
    ],
  },
},
```

- [ ] **Step 2: Simplify `plugins/theme.client.ts`**

The inline script now sets the initial class. The plugin only needs to keep the OS-preference listener. Replace the entire file:

```ts
import { updateClass } from '~/composables/useTheme'

export default defineNuxtPlugin(() => {
  const stored = (localStorage.getItem('sw-theme') ?? 'system') as 'light' | 'dark' | 'system'
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (stored === 'system') updateClass('system')
  })
})
```

- [ ] **Step 3: Verify no FOUC**

```bash
npm run dev
```

Open `http://localhost:3000`, hard-refresh, toggle dark mode, then hard-refresh again.
Expected: page renders immediately in the correct theme with no flash.

- [ ] **Step 4: Commit**

```bash
git add nuxt.config.ts plugins/theme.client.ts
git commit -m "fix: eliminate FOUC with inline theme script in nuxt.config head"
```

---

## Task 2: Hybrid Rendering — Route Rules

**Files:**
- Modify: `nuxt.config.ts`

- [ ] **Step 1: Add `routeRules` to `nuxt.config.ts`**

Inside `defineNuxtConfig({...})`, add after `compatibilityDate`:

```ts
routeRules: {
  '/': { prerender: true },
  '/about': { prerender: true },
  '/decks/**': { ssr: true },
  '/topics/**': { ssr: true },
},
```

Full updated top of nuxt.config.ts (everything before `modules`):

```ts
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  routeRules: {
    '/': { prerender: true },
    '/about': { prerender: true },
    '/decks/**': { ssr: true },
    '/topics/**': { ssr: true },
  },
```

- [ ] **Step 2: Verify build succeeds**

```bash
npm run build
```

Expected: clean build, no errors. The `.output/` directory contains both prerendered HTML for `/` and `/about`, and SSR server routes for `/decks/**` and `/topics/**`.

- [ ] **Step 3: Commit**

```bash
git add nuxt.config.ts
git commit -m "feat: add hybrid rendering with routeRules (prerender home+about, SSR decks+topics)"
```

---

## Task 3: Deck Manifest — `data/decks.json` + API

**Files:**
- Create: `data/decks.json`
- Create: `server/api/decks.get.ts`

- [ ] **Step 1: Create `data/decks.json`**

```bash
mkdir -p data
```

Create `data/decks.json` with the three existing decks:

```json
[
  {
    "id": "people-skills-technical-skills",
    "title": "People Skills Are Technical Skills",
    "description": "Why soft skills are the hardest engineering problems — and how to debug them.",
    "tags": ["career", "soft-skills", "community"],
    "slideCount": 28,
    "durationMinutes": 45,
    "createdAt": "2025-06-15",
    "updatedAt": "2026-03-20",
    "revealBasePath": "/reveals/people-skills",
    "currentVersion": 2,
    "versions": [
      { "version": 1, "label": "Original — Connect.Tech 2025", "date": "2025-06-15", "revealFile": "v1.html" },
      { "version": 2, "label": "OrlandoCodeCamp26 Update", "date": "2026-03-20", "revealFile": "v2.html", "changes": "Updated branding, added speaker notes, new closing slide" }
    ],
    "featured": true,
    "resources": [
      { "label": "Blog post", "url": "" },
      { "label": "Recording", "url": "" }
    ],
    "events": ["Connect.Tech 2025", "Orlando Code Camp 2026"],
    "tier": "45min"
  },
  {
    "id": "skills-to-bills",
    "title": "Skills to Bills: Landing Your First Dev Job",
    "description": "A tactical roadmap for turning technical skills into a paying career — resume, portfolio, networking, and negotiation.",
    "tags": ["career", "community", "soft-skills"],
    "slideCount": 22,
    "durationMinutes": 30,
    "createdAt": "2025-03-01",
    "updatedAt": "2025-11-12",
    "revealBasePath": "/reveals/skills-to-bills",
    "currentVersion": 1,
    "versions": [
      { "version": 1, "label": "Original — TechBridge 2025", "date": "2025-03-01", "revealFile": "v1.html" }
    ],
    "resources": [
      { "label": "Blog post", "url": "" },
      { "label": "Recording", "url": "" }
    ],
    "events": ["TechBridge Spring 2025", "Orlando Devs 2025"],
    "tier": "30min"
  },
  {
    "id": "vue-router-deep-dive",
    "title": "Vue Router Deep Dive",
    "description": "From basic routes to nested layouts, guards, and dynamic segments — everything Vue Router.",
    "tags": ["vue", "javascript", "fundamentals"],
    "slideCount": 34,
    "durationMinutes": 60,
    "createdAt": "2025-09-10",
    "updatedAt": "2026-02-15",
    "revealBasePath": "/reveals/vue-router-deep-dive",
    "currentVersion": 2,
    "versions": [
      { "version": 1, "label": "Original — VueConf 2025", "date": "2025-09-10", "revealFile": "v1.html" },
      { "version": 2, "label": "DevNexus 2026 Update", "date": "2026-02-15", "revealFile": "v2.html", "changes": "Added Composition API examples, updated to Vue Router 4.x, new live-code demos" }
    ],
    "resources": [
      { "label": "Blog post", "url": "" },
      { "label": "Recording", "url": "" }
    ],
    "events": ["VueConf US 2025", "DevNexus 2026"],
    "tier": "60min"
  }
]
```

- [ ] **Step 2: Create `server/api/decks.get.ts`**

```ts
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { DeckFrontmatter } from '~/types'

export default defineEventHandler((): DeckFrontmatter[] => {
  const raw = readFileSync(resolve('data/decks.json'), 'utf-8')
  return JSON.parse(raw)
})
```

- [ ] **Step 3: Test the API endpoint**

```bash
npm run dev
```

Open `http://localhost:3000/api/decks`.
Expected: JSON array with the 3 decks.

- [ ] **Step 4: Commit**

```bash
git add data/decks.json server/api/decks.get.ts
git commit -m "feat: add data/decks.json manifest and /api/decks endpoint"
```

---

## Task 4: Refactor deckStore + useDecks to use `/api/decks`

**Files:**
- Modify: `stores/deckStore.ts`
- Modify: `composables/useDecks.ts`

- [ ] **Step 1: Refactor `stores/deckStore.ts`**

Replace the entire file:

```ts
import { defineStore } from 'pinia'
import type { Tag, SearchParams, DeckFrontmatter } from '~/types'

export const useDeckStore = defineStore('decks', () => {
  const { data: allDecks, pending } = useAsyncData(
    'decks',
    () => $fetch<DeckFrontmatter[]>('/api/decks'),
  )

  const searchQuery = ref('')
  const activeTags = ref<Tag[]>([])
  const sort = ref<SearchParams['sort']>('newest')

  function setSearch(q: string) { searchQuery.value = q }

  function toggleTag(tag: Tag) {
    const idx = activeTags.value.indexOf(tag)
    idx === -1 ? activeTags.value.push(tag) : activeTags.value.splice(idx, 1)
  }

  function clearFilters() {
    searchQuery.value = ''
    activeTags.value = []
    sort.value = 'newest'
  }

  function setSort(s: SearchParams['sort']) { sort.value = s }

  const hasActiveFilters = computed(
    () => searchQuery.value.length > 0 || activeTags.value.length > 0,
  )

  return {
    allDecks,
    pending,
    searchQuery,
    activeTags,
    sort,
    hasActiveFilters,
    setSearch,
    toggleTag,
    clearFilters,
    setSort,
  }
})
```

- [ ] **Step 2: Refactor `composables/useDecks.ts`**

Replace the entire file:

```ts
import type { Tag } from '~/types'

export function useDecks() {
  const store = useDeckStore()
  const route = useRoute()

  onMounted(() => {
    if (route.query.q) store.setSearch(String(route.query.q))
    if (route.query.tags) {
      const tags = String(route.query.tags).split(',') as Tag[]
      tags.forEach(t => store.toggleTag(t))
    }
    if (route.query.sort) store.setSort(route.query.sort as any)
  })

  const decks = computed(() => {
    let result = [...(store.allDecks ?? [])]

    if (store.searchQuery) {
      const q = store.searchQuery.toLowerCase()
      result = result.filter(d =>
        d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q),
      )
    }

    if (store.activeTags.length) {
      result = result.filter(d => store.activeTags.some(t => d.tags.includes(t)))
    }

    result.sort((a, b) => {
      if (store.sort === 'az') return a.title.localeCompare(b.title)
      if (store.sort === 'za') return b.title.localeCompare(a.title)
      if (store.sort === 'oldest') return a.updatedAt.localeCompare(b.updatedAt)
      return b.updatedAt.localeCompare(a.updatedAt)
    })

    return result
  })

  return { decks, pending: computed(() => store.pending) }
}
```

- [ ] **Step 3: Verify homepage still loads decks**

```bash
npm run dev
```

Open `http://localhost:3000`. Confirm: deck grid loads with 3 cards, search and tag filters still work.

- [ ] **Step 4: Commit**

```bash
git add stores/deckStore.ts composables/useDecks.ts
git commit -m "feat: refactor deckStore and useDecks to fetch from /api/decks"
```

---

## Task 5: Full-Viewport Deck Viewer

**Files:**
- Modify: `pages/decks/[id].vue`

- [ ] **Step 1: Rewrite `pages/decks/[id].vue`**

Replace the entire file. This layout uses flexbox to fill the viewport below the site header (56px = `h-14`).

```vue
<script setup lang="ts">
import type { DeckFrontmatter } from '~/types'

const route = useRoute()
const { addRecent } = useRecentDecks()

const { data: deck } = await useAsyncData(
  `deck-${route.params.id}`,
  () => $fetch<DeckFrontmatter[]>('/api/decks').then(
    all => all.find(d => d.id === route.params.id) ?? null,
  ),
)

if (!deck.value) throw createError({ statusCode: 404, message: 'Deck not found' })

const DURATIONS = ['30min', '45min', '60min'] as const
const selectedDuration = ref<string>(deck.value!.tier ?? '45min')
const selectedVersion = ref(deck.value!.currentVersion)

const revealSrc = computed(
  () => `${deck.value!.revealBasePath}/v${selectedVersion.value}.html`,
)

const lastEvent = computed(() => deck.value?.events?.at(-1) ?? '')

definePageMeta({ keepalive: true })
onMounted(() => addRecent(route.params.id as string))

useSeoMeta({
  title: () => `${deck.value?.title ?? 'Deck'} — Slide Warehouse`,
  description: () => deck.value?.description,
  ogTitle: () => deck.value?.title,
  ogDescription: () => deck.value?.description,
  ogSiteName: 'Slide Warehouse',
})

useHead({
  meta: [
    { property: 'og:type', content: 'article' },
  ],
})
</script>

<template>
  <div v-if="deck" class="flex flex-col" style="height: calc(100vh - 56px);">
    <!-- Top bar -->
    <div class="shrink-0 flex items-center justify-between gap-4 px-4 h-12 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <!-- Left: back + title + event badge -->
      <div class="flex items-center gap-3 min-w-0">
        <NuxtLink
          to="/"
          class="shrink-0 text-xs text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 focus:outline-none focus:underline transition-colors"
        >
          ← Back
        </NuxtLink>
        <span class="text-gray-200 dark:text-zinc-700 shrink-0" aria-hidden="true">|</span>
        <h1 class="font-display text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
          {{ deck.title }}
        </h1>
        <span
          v-if="lastEvent"
          class="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
        >
          {{ lastEvent }}
        </span>
      </div>

      <!-- Right: duration switcher -->
      <div class="flex items-center gap-1 shrink-0" role="group" aria-label="Select talk duration">
        <button
          v-for="d in DURATIONS"
          :key="d"
          :aria-pressed="selectedDuration === d"
          class="text-[11px] font-mono px-2.5 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600"
          :class="selectedDuration === d
            ? 'bg-emerald-600 text-white'
            : 'border border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-emerald-500 dark:hover:border-emerald-500'"
          @click="selectedDuration = d"
        >
          {{ d }}
        </button>
      </div>
    </div>

    <!-- Full-height iframe -->
    <div class="flex-1 min-h-0">
      <iframe
        :src="revealSrc"
        :title="`${deck.title} presentation`"
        sandbox="allow-scripts allow-same-origin"
        class="w-full h-full border-0"
        allow="fullscreen"
      />
    </div>
  </div>
</template>
```

- [ ] **Step 2: Verify deck viewer renders full-height**

```bash
npm run dev
```

Open `http://localhost:3000/decks/vue-router-deep-dive`.
Expected:
- Top bar shows "← Back | Vue Router Deep Dive | DevNexus 2026"
- Duration buttons 30min / 45min / 60min appear; 60min is active (emerald bg)
- iframe fills the remaining viewport height with no scrollbar
- Clicking a duration button changes its active state

- [ ] **Step 3: Commit**

```bash
git add pages/decks/\[id\].vue
git commit -m "feat: full-viewport deck viewer with sticky top bar and duration switcher"
```

---

## Task 6: Homepage Hero — Dark Editorial

**Files:**
- Modify: `pages/index.vue`

- [ ] **Step 1: Add dark editorial hero to `pages/index.vue`**

Replace the entire `<template>` block (keep `<script setup>` unchanged):

```vue
<template>
  <div>
    <!-- Dark editorial hero -->
    <section class="relative bg-zinc-950 overflow-hidden">
      <!-- Grain texture overlay -->
      <div
        class="absolute inset-0 opacity-[0.04] pointer-events-none"
        aria-hidden="true"
        style="background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")"
      />
      <!-- Emerald top-accent line -->
      <div class="absolute top-0 inset-x-0 h-px bg-emerald-500" aria-hidden="true" />
      <div class="relative max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <!-- Amber mono eyebrow -->
        <p class="font-mono text-[0.65rem] uppercase tracking-widest text-amber-400 mb-5">
          Conference Presentations · slides.developingdvlpr.com
        </p>
        <!-- Fraunces headline with emerald italic accent -->
        <h1 class="font-display text-5xl sm:text-7xl font-semibold text-white leading-[0.95] tracking-tight mb-6">
          Talks that<br><em class="text-emerald-400 italic">connect.</em>
        </h1>
        <p class="text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed">
          Browse, search, and share Reveal.js presentation decks — from conference stages to your screen.
        </p>
      </div>
    </section>

    <FeaturedDeck />
    <TopicsExplorer />
    <SpeakerOverview />
    <div class="border-t border-gray-200 dark:border-gray-800" />
    <div class="max-w-6xl mx-auto px-4 py-8">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Presentations</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Browse, search, and share Reveal.js decks.</p>

      <!-- Recently Viewed -->
      <div v-if="recentDecks.length" class="mb-6">
        <p class="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Recently Viewed</p>
        <div class="flex gap-3 overflow-x-auto pb-2">
          <div v-for="deck in recentDecks" :key="deck.id" class="w-48 shrink-0">
            <DeckCard :deck="deck" />
          </div>
        </div>
      </div>

      <!-- Search + Sort row -->
      <div class="flex flex-col sm:flex-row gap-3 mb-4">
        <div class="flex-1">
          <SearchBar />
        </div>
        <SortDropdown />
      </div>

      <!-- Filter Tags -->
      <div class="mb-6 overflow-x-auto">
        <FilterTags :decks="allDecks" />
      </div>

      <!-- Grid -->
      <DeckGrid :decks="allDecks" :pending="pending" />
    </div>
  </div>
</template>
```

- [ ] **Step 2: Add homepage SEO to the `<script setup>` block**

Add after the existing `recentDecks` computed:

```ts
useSeoMeta({
  title: 'Slide Warehouse — Conference Presentations by @Nerajno',
  description: 'Browse, search, and share Reveal.js presentation decks by Nerando Johnson — software developer and international conference speaker.',
  ogTitle: 'Slide Warehouse',
  ogDescription: 'Conference presentation decks by @Nerajno — browse, search, and share.',
  ogSiteName: 'Slide Warehouse',
  twitterCard: 'summary_large_image',
})
```

- [ ] **Step 3: Verify hero renders**

```bash
npm run dev
```

Open `http://localhost:3000`.
Expected:
- Dark zinc-950 hero at the top with a single-pixel emerald line at the very top
- Amber mono eyebrow text
- Large Fraunces headline with "connect." in emerald italic
- Zinc-400 body copy
- Existing FeaturedDeck / TopicsExplorer / grid below

- [ ] **Step 4: Commit**

```bash
git add pages/index.vue
git commit -m "feat: add dark editorial hero to homepage with amber eyebrow and Fraunces headline"
```

---

## Task 7: DeckCard — Conference Badge, Hover Glow, Fraunces Title

**Files:**
- Modify: `components/DeckCard.vue`

- [ ] **Step 1: Rewrite `components/DeckCard.vue`**

Replace the entire file:

```vue
<script setup lang="ts">
import type { DeckFrontmatter } from '~/types'
import { TAG_COLORS } from '~/types'

const props = defineProps<{ deck: DeckFrontmatter }>()

const gradient = computed(() => {
  const tag = props.deck.tags?.[0]
  return tag ? TAG_COLORS[tag] : 'from-gray-400 to-gray-500'
})

const latestEvent = computed(() => props.deck.events?.at(-1) ?? '')
</script>

<template>
  <div
    class="group relative rounded-card border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all duration-150 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-[0_0_0_1px_theme(colors.emerald.500/50),0_4px_20px_-4px_theme(colors.emerald.500/25)]"
    role="article"
  >
    <!-- Conference badge (amber) -->
    <div v-if="latestEvent" class="absolute top-2 left-2 z-10">
      <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 leading-none">
        {{ latestEvent }}
      </span>
    </div>

    <!-- Share button -->
    <div class="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
      <ShareButton :url="`/decks/${deck.id}`" compact />
    </div>

    <NuxtLink
      :to="`/decks/${deck.id}`"
      class="block focus:outline-none focus:ring-2 focus:ring-emerald-600 rounded-card"
      :aria-label="deck.title"
    >
      <!-- Thumbnail -->
      <div
        class="h-32 rounded-t-card bg-gradient-to-br"
        :class="gradient"
        :aria-label="`Preview of ${deck.title}`"
        role="img"
      >
        <div class="h-full flex items-end p-3">
          <!-- Duration chip link -->
          <NuxtLink
            :to="`/?tier=${deck.tier ?? deck.durationMinutes + 'min'}`"
            class="text-[10px] font-mono text-white/80 uppercase tracking-widest hover:text-white transition-colors"
            @click.stop
          >
            {{ deck.tier ?? deck.durationMinutes + 'min' }}
          </NuxtLink>
        </div>
      </div>

      <!-- Content -->
      <div class="p-4">
        <!-- Fraunces title -->
        <h3 class="font-display text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug mb-1">
          {{ deck.title }}
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
          {{ deck.description }}
        </p>

        <!-- Tags -->
        <div class="flex flex-wrap gap-1 mb-3">
          <span
            v-for="tag in deck.tags"
            :key="tag"
            class="text-[11px] px-2 py-0.5 rounded-tag bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
          >{{ tag }}</span>
        </div>

        <!-- Stats -->
        <div class="flex items-center gap-3 text-[11px] text-gray-400 font-mono">
          <span>{{ deck.slideCount }} slides</span>
          <span>{{ deck.durationMinutes }}min</span>
          <span v-if="deck.versions?.length > 1">v{{ deck.currentVersion }}</span>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>
```

- [ ] **Step 2: Verify card appearance**

```bash
npm run dev
```

Open `http://localhost:3000`.
Expected:
- Cards show amber conference badge top-left (e.g. "Orlando Code Camp 2026")
- Hovering a card shows a green border + subtle emerald glow
- Card title uses Fraunces (display font, slightly serif)
- Duration chip in thumbnail bottom-left is clickable

- [ ] **Step 3: Commit**

```bash
git add components/DeckCard.vue
git commit -m "feat: DeckCard with amber conference badge, emerald hover glow, Fraunces title, duration chip link"
```

---

## Task 8: WCAG Fixes

**Files:**
- Modify: `components/FilterTags.vue`
- Modify: `pages/topics/[tag].vue`

- [ ] **Step 1: Add `aria-live` to `FilterTags.vue`**

In `FilterTags.vue`, add a visually-hidden live region that announces the current result count. The `<template>` block currently starts with `<div class="flex items-center gap-2 flex-wrap">`. Wrap it and add the announcer:

Replace the entire `<template>`:

```vue
<template>
  <div>
    <!-- Visually hidden live region announces filter results to screen readers -->
    <span
      aria-live="polite"
      aria-atomic="true"
      class="sr-only"
    >
      {{ store.hasActiveFilters
        ? `${props.decks.length} deck${props.decks.length === 1 ? '' : 's'} shown`
        : '' }}
    </span>

    <div class="flex items-center gap-2 flex-wrap">
      <button
        :aria-pressed="store.activeTags.length === 0"
        class="h-8 px-3 rounded-tag text-xs font-medium transition-colors"
        :class="store.activeTags.length === 0
          ? 'bg-emerald-600 text-white'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
        @click="clearAll"
      >
        All
      </button>

      <button
        v-for="tag in ALL_TAGS.filter(t => tagCount(t) > 0)"
        :key="tag"
        role="button"
        :aria-pressed="store.activeTags.includes(tag)"
        class="h-8 px-3 rounded-tag text-xs font-medium flex items-center gap-1.5 transition-colors"
        :class="[
          store.activeTags.includes(tag)
            ? 'bg-emerald-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700',
        ]"
        @click="toggle(tag)"
      >
        {{ tag }}
        <span
          class="text-[10px] px-1 rounded-full"
          :class="store.activeTags.includes(tag)
            ? 'bg-emerald-500 text-white'
            : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'"
        >{{ tagCount(tag) }}</span>
      </button>

      <button
        v-if="store.hasActiveFilters"
        class="h-8 px-3 text-xs text-gray-500 dark:text-gray-400 underline"
        @click="clearAll"
      >
        Clear filters
      </button>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Add `aria-live` to topics page result count**

In `pages/topics/[tag].vue`, find the paragraph showing deck count:

```html
<p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
  {{ decks?.length ?? 0 }} {{ (decks?.length ?? 0) === 1 ? 'deck' : 'decks' }} tagged
  <span class="font-mono text-emerald-600 dark:text-emerald-400">{{ tag }}</span>
</p>
```

Replace with (add `aria-live` and `aria-atomic`):

```html
<p
  class="text-sm text-gray-500 dark:text-gray-400 mb-6"
  aria-live="polite"
  aria-atomic="true"
>
  {{ decks?.length ?? 0 }} {{ (decks?.length ?? 0) === 1 ? 'deck' : 'decks' }} tagged
  <span class="font-mono text-emerald-600 dark:text-emerald-400">{{ tag.value }}</span>
</p>
```

- [ ] **Step 3: Verify `aria-pressed` is set on duration buttons**

The duration buttons in `pages/decks/[id].vue` (Task 5) already have `:aria-pressed="selectedDuration === d"`. Confirm this is present.

- [ ] **Step 4: Verify theme toggle `aria-label` in layout**

`layouts/default.vue` already has `:aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"`. Confirm it is present.

- [ ] **Step 5: Commit**

```bash
git add components/FilterTags.vue pages/topics/\[tag\].vue
git commit -m "fix: WCAG — aria-live on filter results, aria-live on topics count"
```

---

## Task 9: `app.vue` — Loading Indicator

**Files:**
- Modify: `app.vue`

- [ ] **Step 1: Add `NuxtLoadingIndicator` to `app.vue`**

Replace the entire file:

```vue
<template>
  <NuxtLoadingIndicator color="#34d399" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

- [ ] **Step 2: Verify indicator appears on navigation**

```bash
npm run dev
```

Navigate between pages. Expected: a thin emerald-400 (#34d399) progress bar appears at the very top of the viewport during page transitions.

- [ ] **Step 3: Commit**

```bash
git add app.vue
git commit -m "feat: add NuxtLoadingIndicator with emerald color to app.vue"
```

---

## Task 10: SEO — OG Tags for About and Topics Pages

**Files:**
- Modify: `pages/about.vue`
- Modify: `pages/topics/[tag].vue`

- [ ] **Step 1: Improve `pages/about.vue` SEO**

The existing `useSeoMeta` call only sets title and description. Replace it with:

```ts
useSeoMeta({
  title: 'About Nerando Johnson — Slide Warehouse',
  description: 'Nerando Johnson is a software developer, international conference speaker, and community builder. Speaker since 2019.',
  ogTitle: 'About Nerando Johnson',
  ogDescription: 'Software developer, conference speaker, and community builder. Browse all presentation decks at Slide Warehouse.',
  ogSiteName: 'Slide Warehouse',
  twitterCard: 'summary',
  twitterSite: '@nerajno',
})

useHead({
  meta: [{ property: 'og:type', content: 'profile' }],
})
```

- [ ] **Step 2: Improve `pages/topics/[tag].vue` SEO**

The existing `useSeoMeta` call has a bug (`${tag}` should be `${tag.value}`). Replace the entire SEO block:

```ts
useSeoMeta({
  title: () => `${displayTag.value} Decks — Slide Warehouse`,
  description: () => `All presentation decks by Nerando Johnson tagged with "${displayTag.value}". Browse Reveal.js slides at Slide Warehouse.`,
  ogTitle: () => `${displayTag.value} Decks`,
  ogDescription: () => `Browse all "${displayTag.value}" presentation decks at Slide Warehouse.`,
  ogSiteName: 'Slide Warehouse',
  twitterCard: 'summary',
})
```

- [ ] **Step 3: Commit**

```bash
git add pages/about.vue pages/topics/\[tag\].vue
git commit -m "fix: improve OG meta on about and topics pages, fix tag.value bug in topics SEO"
```

---

## Task 11: Security — `npm audit fix`

**Files:**
- `package.json` (possibly)
- `package-lock.json`

- [ ] **Step 1: Run audit fix**

```bash
npm audit fix
```

Expected: vulnerabilities reduced. Note which ones remain.

- [ ] **Step 2: Check remaining vulnerabilities**

```bash
npm audit
```

If critical vulnerabilities remain, check whether they are in direct dependencies or transitive. If transitive, check whether `overrides` can resolve them (similar to the `chokidar` override already in `package.json`).

For example, if a critical vuln is in package `foo` version `<1.2.3`, add to the `overrides` block in `package.json`:

```json
"overrides": {
  "chokidar": "^3.6.0",
  "foo": "^1.2.3"
}
```

Then run `npm install` again.

- [ ] **Step 3: Verify build still works after audit fixes**

```bash
npm run build
```

Expected: clean build, no new errors.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "fix: npm audit — resolve package vulnerabilities"
```

---

## Task 12: Final Build Verification

- [ ] **Step 1: Full production build**

```bash
npm run build
```

Expected: clean build, no TypeScript errors, prerendered `/` and `/about` in output.

- [ ] **Step 2: Preview the production build**

```bash
npm run preview
```

Check:
- `http://localhost:3000` — dark hero renders, decks grid loads from `/api/decks`
- `http://localhost:3000/about` — stats and bio render
- `http://localhost:3000/decks/vue-router-deep-dive` — full-height iframe, duration switcher active on 60min
- `http://localhost:3000/topics/career` — decks listed, aria-live on result count

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "chore: final build verification — all PRD improvements complete"
```
