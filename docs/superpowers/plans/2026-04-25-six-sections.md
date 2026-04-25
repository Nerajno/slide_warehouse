# Six Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 2 pages, 5 components, and 1 composable to expand Slide Warehouse with an About page, topic browsing, a featured deck banner, resource links, version changelog, and a speaker bio.

**Architecture:** Foundation-first order — types and content before composables, composables before components, components before pages. Each task is independently committable. No deck state is added to the Pinia store; `useTopics.ts` owns tag statistics via `queryContent`.

**Tech Stack:** Nuxt 3, Vue 3 Composition API, Pinia, Nuxt Content v2, Tailwind CSS, TypeScript

---

## File Map

### Created
- `composables/useTopics.ts` — tag statistics from all decks
- `components/FeaturedDeck.vue` — full-width featured deck banner
- `components/TopicsExplorer.vue` — tag card grid, navigates to /topics/:tag
- `components/ResourceLinks.vue` — collapsible external links section
- `components/VersionChangelog.vue` — deck version timeline
- `components/SpeakerBio.vue` — avatar + bio + social links, used on about page
- `pages/about.vue` — speaker bio page
- `pages/topics/[tag].vue` — decks filtered by tag

### Modified
- `types/index.ts` — add Resource, TopicStat; extend SpeakerData, DeckFrontmatter
- `content/speaker.json` — add bio, socialHandles, links
- `content/decks/people-skills-technical-skills.md` — add featured, resources
- `content/decks/skills-to-bills.md` — add resources
- `content/decks/vue-router-deep-dive.md` — add resources
- `components/FilterTags.vue` — hide zero-count tags
- `components/DeckSidebar.vue` — add ResourceLinks + VersionChangelog
- `layouts/default.vue` — add About nav link

---

## Task 1: Extend Types

**Files:**
- Modify: `types/index.ts`

- [ ] **Step 1: Add Resource, TopicStat interfaces and extend SpeakerData + DeckFrontmatter**

Open `types/index.ts`. Add after the `TalkStatus` line (line 48) and before `ConferencePipelineItem`:

```ts
export interface Resource { label: string; url: string }
export interface TopicStat { tag: string; count: number }
```

Extend `SpeakerData` interface — replace the existing interface with:

```ts
export interface SpeakerData {
  bio: string
  socialHandles: { x: string; github: string; devto: string }
  links: Resource[]
  stats: { totalTalks: number; conferencesCount: number; since: number }
  recentTalk: {
    title: string
    conference: string
    hashtag: string
    location: string
    date: string
    durationMinutes: number
    deckSlug: string
    recordingUrl: string | null
  }
  pipeline: ConferencePipelineItem[]
}
```

Extend `DeckFrontmatter` — add two optional fields before `events?`:

```ts
featured?: boolean
resources?: Resource[]
```

Full updated `DeckFrontmatter`:

```ts
export interface DeckFrontmatter {
  id: string
  title: string
  description: string
  tags: Tag[]
  slideCount: number
  durationMinutes: number
  createdAt: string
  updatedAt: string
  revealBasePath: string
  currentVersion: number
  versions: DeckVersion[]
  featured?: boolean
  resources?: Resource[]
  events?: string[]
  thumbnail?: string
  tier?: '30min' | '45min' | '60min'
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx nuxi typecheck
```

Expected: no errors related to the new types. (Existing errors for yet-to-be-updated content are fine at this stage.)

- [ ] **Step 3: Commit**

```bash
git add types/index.ts
git commit -m "feat: extend types with Resource, TopicStat, SpeakerData bio fields, DeckFrontmatter featured/resources"
```

---

## Task 2: Update Content Files

**Files:**
- Modify: `content/speaker.json`
- Modify: `content/decks/people-skills-technical-skills.md`
- Modify: `content/decks/skills-to-bills.md`
- Modify: `content/decks/vue-router-deep-dive.md`

- [ ] **Step 1: Update speaker.json**

Replace the entire file with:

```json
{
  "bio": "Nerando Johnson is a software developer, international conference speaker, and community builder. He has spoken at conferences across the US since 2019, focusing on career development, soft skills, and frontend engineering. When he's not on stage, he's writing at developingdvlpr.com or contributing to open source.",
  "socialHandles": {
    "x": "nerajno",
    "github": "Nerajno",
    "devto": "nerajno"
  },
  "links": [
    { "label": "Blog", "url": "https://developingdvlpr.com" },
    { "label": "GitHub", "url": "https://github.com/Nerajno" }
  ],
  "stats": {
    "totalTalks": 12,
    "conferencesCount": 9,
    "since": 2019
  },
  "recentTalk": {
    "title": "People Skills Are Technical Skills",
    "conference": "Orlando Code Camp 2026",
    "hashtag": "#OrlandoCodeCamp26",
    "location": "Orlando, FL",
    "date": "2026-04-01",
    "durationMinutes": 45,
    "deckSlug": "people-skills-are-technical-skills",
    "recordingUrl": null
  },
  "pipeline": [
    { "name": "Orlando Code Camp 2026", "location": "Orlando, FL", "date": "2026-04-01", "status": "delivered" },
    { "name": "DevNexus 2026", "location": "Atlanta, GA", "date": "2026-03-01", "status": "delivered" },
    { "name": "Connect.Tech 2025", "location": "Atlanta, GA", "date": "2025-10-01", "status": "delivered" },
    { "name": "Nebraska.Code() 2026", "location": "Lincoln, NE", "date": "2026-07-17", "status": "confirmed" },
    { "name": "Connect.Tech 2026", "location": "Atlanta, GA", "date": "2026-10-01", "status": "cfp-open" }
  ]
}
```

- [ ] **Step 2: Add featured + resources to people-skills-technical-skills.md**

In the frontmatter (between `tier: "45min"` and the closing `---`), add:

```yaml
featured: true
resources:
  - label: "Blog post"
    url: ""
  - label: "Recording"
    url: ""
```

Full frontmatter result:

```yaml
---
id: "people-skills-technical-skills"
title: "People Skills Are Technical Skills"
description: "Why soft skills are the hardest engineering problems — and how to debug them."
tags: ["career", "soft-skills", "community"]
slideCount: 28
durationMinutes: 45
createdAt: "2025-06-15"
updatedAt: "2026-03-20"
revealBasePath: "/reveals/people-skills"
currentVersion: 2
versions:
  - version: 1
    label: "Original — Connect.Tech 2025"
    date: "2025-06-15"
    revealFile: "v1.html"
  - version: 2
    label: "OrlandoCodeCamp26 Update"
    date: "2026-03-20"
    revealFile: "v2.html"
    changes: "Updated branding, added speaker notes, new closing slide"
featured: true
resources:
  - label: "Blog post"
    url: ""
  - label: "Recording"
    url: ""
events: ["Connect.Tech 2025", "Orlando Code Camp 2026"]
tier: "45min"
---
```

- [ ] **Step 3: Add resources to skills-to-bills.md**

In frontmatter, after `tier: "30min"`:

```yaml
resources:
  - label: "Blog post"
    url: ""
  - label: "Recording"
    url: ""
```

- [ ] **Step 4: Add resources to vue-router-deep-dive.md**

In frontmatter, after `tier: "60min"`:

```yaml
resources:
  - label: "Blog post"
    url: ""
  - label: "Recording"
    url: ""
```

- [ ] **Step 5: Commit**

```bash
git add content/speaker.json content/decks/
git commit -m "feat: add bio/social/links to speaker.json, add featured+resources to deck frontmatter"
```

---

## Task 3: Add useTopics Composable

**Files:**
- Create: `composables/useTopics.ts`

- [ ] **Step 1: Create the composable**

```ts
// composables/useTopics.ts
export function useTopics() {
  const { data: allDecks } = useAsyncData('topics-decks', () =>
    queryContent('decks').find()
  )

  const tagStats = computed<Record<string, number>>(() => {
    const stats: Record<string, number> = {}
    for (const deck of allDecks.value ?? []) {
      for (const tag of (deck.tags as string[]) ?? []) {
        stats[tag] = (stats[tag] ?? 0) + 1
      }
    }
    return stats
  })

  return { tagStats }
}
```

- [ ] **Step 2: Verify it resolves**

```bash
npx nuxi typecheck
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add composables/useTopics.ts
git commit -m "feat: add useTopics composable for tag statistics"
```

---

## Task 4: ResourceLinks Component

**Files:**
- Create: `components/ResourceLinks.vue`

- [ ] **Step 1: Create the component**

```vue
<script setup lang="ts">
import type { Resource } from '~/types'

const props = defineProps<{ resources?: Resource[] }>()
const open = ref(true)

const hasLinks = computed(() =>
  Array.isArray(props.resources) && props.resources.some(r => r.url)
)
</script>

<template>
  <section v-if="hasLinks">
    <button
      class="flex items-center justify-between w-full text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"
      :aria-expanded="open"
      @click="open = !open"
    >
      Resources
      <span class="text-gray-500 transition-transform" :class="open ? 'rotate-180' : ''">▾</span>
    </button>
    <ul v-if="open" class="space-y-1.5">
      <li v-for="resource in resources?.filter(r => r.url)" :key="resource.label">
        <a
          :href="resource.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
        >
          {{ resource.label }}
          <span aria-hidden="true" class="text-gray-500">↗</span>
        </a>
      </li>
    </ul>
  </section>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add components/ResourceLinks.vue
git commit -m "feat: add ResourceLinks component"
```

---

## Task 5: VersionChangelog Component

**Files:**
- Create: `components/VersionChangelog.vue`

- [ ] **Step 1: Create the component**

```vue
<script setup lang="ts">
import type { DeckVersion } from '~/types'

const props = defineProps<{ versions?: DeckVersion[] }>()

const sorted = computed(() =>
  [...(props.versions ?? [])].sort((a, b) => b.version - a.version)
)

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <section v-if="sorted.length">
    <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Changelog</h3>
    <ol class="space-y-3">
      <li
        v-for="v in sorted"
        :key="v.version"
        class="flex gap-3 text-xs"
      >
        <span class="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-emerald-900/30 text-emerald-400 font-mono font-semibold border border-emerald-800">
          v{{ v.version }}
        </span>
        <div class="min-w-0">
          <p class="text-gray-200 font-medium leading-snug">{{ v.label }}</p>
          <p class="text-gray-500 font-mono">{{ formatDate(v.date) }}</p>
          <p v-if="v.changes" class="text-gray-400 mt-1 leading-snug">{{ v.changes }}</p>
        </div>
      </li>
    </ol>
  </section>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add components/VersionChangelog.vue
git commit -m "feat: add VersionChangelog component"
```

---

## Task 6: Update DeckSidebar

**Files:**
- Modify: `components/DeckSidebar.vue`

- [ ] **Step 1: Add ResourceLinks and VersionChangelog after the Events section**

The existing sidebar ends with `<ShareButton />` inside an `<hr>` + `<section>`. Add two new conditional sections before the final `<hr>` + ShareButton:

Full updated template section (replace everything from `<template v-if="deck.events?.length">` to end of `</aside>`):

```vue
    <template v-if="deck.events?.length">
      <hr class="border-gray-200 dark:border-gray-700" />
      <section>
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Events</h3>
        <ul class="text-xs text-gray-600 dark:text-gray-300 space-y-1">
          <li v-for="event in deck.events" :key="event">{{ event }}</li>
        </ul>
      </section>
    </template>

    <template v-if="deck.resources?.some(r => r.url)">
      <hr class="border-gray-200 dark:border-gray-700" />
      <ResourceLinks :resources="deck.resources" />
    </template>

    <template v-if="deck.versions?.length">
      <hr class="border-gray-200 dark:border-gray-700" />
      <VersionChangelog :versions="deck.versions" />
    </template>

    <hr class="border-gray-200 dark:border-gray-700" />

    <!-- Actions -->
    <section>
      <ShareButton />
    </section>
  </aside>
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
npx nuxi typecheck
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add components/DeckSidebar.vue
git commit -m "feat: add ResourceLinks and VersionChangelog to DeckSidebar"
```

---

## Task 7: SpeakerBio Component

**Files:**
- Create: `components/SpeakerBio.vue`

- [ ] **Step 1: Create the component**

```vue
<script setup lang="ts">
import type { SpeakerData } from '~/types'

const { data: speaker } = await useAsyncData('speaker-bio', () =>
  queryContent<SpeakerData>('speaker').findOne()
)

const initials = computed(() => {
  const name = 'Nerando Johnson'
  return name.split(' ').map(n => n[0]).join('')
})
</script>

<template>
  <div v-if="speaker" class="space-y-5">
    <!-- Avatar + name row -->
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
        <span class="text-white font-semibold text-base font-mono">{{ initials }}</span>
      </div>
      <div>
        <p class="font-display font-semibold text-gray-900 dark:text-gray-100 text-lg leading-tight">Nerando Johnson</p>
        <p class="text-xs text-gray-500 font-mono">@{{ speaker.socialHandles?.x }}</p>
      </div>
    </div>

    <!-- Bio -->
    <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{{ speaker.bio }}</p>

    <!-- Social links -->
    <div class="flex flex-wrap gap-2">
      <a
        v-if="speaker.socialHandles?.x"
        :href="`https://x.com/${speaker.socialHandles.x}`"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
      >
        X / Twitter
      </a>
      <a
        v-if="speaker.socialHandles?.github"
        :href="`https://github.com/${speaker.socialHandles.github}`"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
      >
        GitHub
      </a>
      <a
        v-if="speaker.socialHandles?.devto"
        :href="`https://dev.to/${speaker.socialHandles.devto}`"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
      >
        dev.to
      </a>
      <a
        v-for="link in speaker.links"
        :key="link.label"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
      >
        {{ link.label }}
      </a>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add components/SpeakerBio.vue
git commit -m "feat: add SpeakerBio component with avatar, bio, and social links"
```

---

## Task 8: FeaturedDeck Component

**Files:**
- Create: `components/FeaturedDeck.vue`

- [ ] **Step 1: Create the component**

```vue
<script setup lang="ts">
import type { DeckFrontmatter } from '~/types'
import { TAG_COLORS } from '~/types'

const { data: deck } = await useAsyncData('featured-deck', () =>
  queryContent<DeckFrontmatter>('decks').where({ featured: true }).findOne()
)

const gradientClass = computed(() => {
  const firstTag = deck.value?.tags?.[0]
  return firstTag ? TAG_COLORS[firstTag] : 'from-emerald-500 to-teal-600'
})
</script>

<template>
  <div v-if="deck" class="border-b border-[#2a3347] bg-[#161b22]">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <p class="font-mono text-[0.65rem] uppercase tracking-widest text-emerald-400 mb-4">Featured deck</p>
      <div class="rounded-card border border-emerald-800 overflow-hidden flex flex-col sm:flex-row">
        <!-- Thumbnail -->
        <div
          :class="`bg-gradient-to-br ${gradientClass} sm:w-48 h-36 sm:h-auto shrink-0 relative`"
          style="background-image: repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0,0,0,0.08) 39px, rgba(0,0,0,0.08) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(0,0,0,0.08) 39px, rgba(0,0,0,0.08) 40px);"
        >
          <span class="absolute inset-0 flex items-center justify-center font-display text-white/20 text-5xl font-bold select-none">
            {{ deck.title[0] }}
          </span>
        </div>

        <!-- Body -->
        <div class="p-5 flex flex-col flex-1">
          <h2 class="font-display text-xl font-semibold text-white mb-1 leading-snug">{{ deck.title }}</h2>
          <p class="text-sm text-gray-400 mb-3 leading-relaxed">{{ deck.description }}</p>

          <!-- Tags -->
          <div class="flex flex-wrap gap-1.5 mb-4">
            <span
              v-for="tag in deck.tags"
              :key="tag"
              class="text-xs px-2 py-0.5 rounded-tag bg-emerald-900/20 text-emerald-300 border border-emerald-800"
            >{{ tag }}</span>
          </div>

          <!-- CTA -->
          <div class="mt-auto">
            <NuxtLink
              :to="`/decks/${deck.id}`"
              class="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Open deck <span aria-hidden="true">→</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add components/FeaturedDeck.vue
git commit -m "feat: add FeaturedDeck banner component"
```

---

## Task 9: TopicsExplorer Component

**Files:**
- Create: `components/TopicsExplorer.vue`

- [ ] **Step 1: Create the component**

```vue
<script setup lang="ts">
import { TAG_COLORS } from '~/types'
import type { Tag } from '~/types'

const { tagStats } = useTopics()

const topics = computed(() =>
  Object.entries(tagStats.value)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
)

function gradientFor(tag: string) {
  return TAG_COLORS[tag as Tag] ?? 'from-gray-500 to-slate-600'
}
</script>

<template>
  <div v-if="topics.length" class="border-b border-[#2a3347]">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <p class="font-mono text-[0.65rem] uppercase tracking-widest text-gray-500 mb-4">Browse by topic</p>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <NuxtLink
          v-for="[tag, count] in topics"
          :key="tag"
          :to="`/topics/${tag}`"
          class="group relative rounded-card border border-[#2a3347] overflow-hidden hover:border-emerald-700 transition-colors"
        >
          <div :class="`bg-gradient-to-br ${gradientFor(tag)} h-1.5 w-full`" />
          <div class="px-3 py-3">
            <p class="text-sm font-medium text-gray-200 group-hover:text-white transition-colors capitalize">{{ tag }}</p>
            <p class="text-xs text-gray-500 font-mono mt-0.5">{{ count }} {{ count === 1 ? 'deck' : 'decks' }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add components/TopicsExplorer.vue
git commit -m "feat: add TopicsExplorer component"
```

---

## Task 10: Update FilterTags

**Files:**
- Modify: `components/FilterTags.vue`

- [ ] **Step 1: Filter zero-count tags**

In `FilterTags.vue`, the `v-for` iterates `ALL_TAGS`. Change it to only render tags with count > 0, and add the disabled state for any that slip through:

Replace the `<button v-for="tag in ALL_TAGS"` block with:

```vue
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
        tagCount(tag) === 0 ? 'opacity-40 pointer-events-none' : ''
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
```

- [ ] **Step 2: Commit**

```bash
git add components/FilterTags.vue
git commit -m "feat: hide zero-count tags in FilterTags"
```

---

## Task 11: Update Layout Nav

**Files:**
- Modify: `layouts/default.vue`

- [ ] **Step 1: Add About nav link**

In the header `<div class="flex items-center gap-4">`, add the About link between the `@Nerajno` span and the dark-mode button:

```vue
        <div class="flex items-center gap-4">
          <span class="text-xs text-gray-400 font-mono">@Nerajno</span>
          <NuxtLink
            to="/about"
            class="text-xs text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            active-class="text-emerald-600 dark:text-emerald-400"
          >
            About
          </NuxtLink>
          <button
            class="w-9 h-9 flex items-center justify-center rounded-btn text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-colors"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggle"
          >
            <span v-if="isDark" aria-hidden="true">☀️</span>
            <span v-else aria-hidden="true">🌙</span>
          </button>
        </div>
```

- [ ] **Step 2: Commit**

```bash
git add layouts/default.vue
git commit -m "feat: add About nav link to layout header"
```

---

## Task 12: About Page

**Files:**
- Create: `pages/about.vue`

- [ ] **Step 1: Create the page**

```vue
<script setup lang="ts">
import type { SpeakerData } from '~/types'

const { data: speaker } = await useAsyncData('about-speaker', () =>
  queryContent<SpeakerData>('speaker').findOne()
)

const { data: allDecks } = await useAsyncData('about-decks', () =>
  queryContent('decks').find()
)

const totalDecks = computed(() => allDecks.value?.length ?? 0)
const totalSlides = computed(() =>
  allDecks.value?.reduce((sum: number, d: any) => sum + (d.slideCount ?? 0), 0) ?? 0
)

useSeoMeta({
  title: 'About — Slide Warehouse',
  description: 'Nerando Johnson — software developer and international conference speaker.',
})
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-12 space-y-12">

    <!-- Bio block -->
    <section>
      <SpeakerBio />
    </section>

    <hr class="border-gray-200 dark:border-gray-800" />

    <!-- Stats strip -->
    <section v-if="speaker">
      <p class="font-mono text-[0.65rem] uppercase tracking-widest text-gray-500 mb-6">By the numbers</p>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div class="text-center">
          <p class="font-mono text-[0.65rem] uppercase tracking-widest text-gray-500 mb-1">Decks</p>
          <p class="font-display text-[2rem] font-semibold text-emerald-600 dark:text-emerald-400 leading-none">{{ totalDecks }}</p>
        </div>
        <div class="text-center">
          <p class="font-mono text-[0.65rem] uppercase tracking-widest text-gray-500 mb-1">Slides</p>
          <p class="font-display text-[2rem] font-semibold text-gray-800 dark:text-gray-100 leading-none">{{ totalSlides }}</p>
        </div>
        <div class="text-center">
          <p class="font-mono text-[0.65rem] uppercase tracking-widest text-gray-500 mb-1">Talks</p>
          <p class="font-display text-[2rem] font-semibold text-gray-800 dark:text-gray-100 leading-none">{{ speaker.stats.totalTalks }}</p>
        </div>
        <div class="text-center">
          <p class="font-mono text-[0.65rem] uppercase tracking-widest text-gray-500 mb-1">Conferences</p>
          <p class="font-display text-[2rem] font-semibold text-amber-600 dark:text-amber-400 leading-none">{{ speaker.stats.conferencesCount }}</p>
        </div>
      </div>
    </section>

    <hr class="border-gray-200 dark:border-gray-800" />

    <!-- Links row -->
    <section v-if="speaker?.links?.length">
      <p class="font-mono text-[0.65rem] uppercase tracking-widest text-gray-500 mb-4">Find me online</p>
      <div class="flex flex-wrap gap-3">
        <a
          v-for="link in speaker.links"
          :key="link.label"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          {{ link.label }} <span aria-hidden="true" class="text-gray-400">↗</span>
        </a>
      </div>
    </section>

  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add pages/about.vue
git commit -m "feat: add About page with SpeakerBio, stats, and links"
```

---

## Task 13: Topics Page

**Files:**
- Create: `pages/topics/[tag].vue`

- [ ] **Step 1: Create the page**

```vue
<script setup lang="ts">
const route = useRoute()
const tag = route.params.tag as string

const { data: decks } = await useAsyncData(`topic-${tag}`, () =>
  queryContent('decks').where({ tags: { $contains: tag } }).find()
)

const displayTag = computed(() =>
  tag.charAt(0).toUpperCase() + tag.slice(1)
)

useSeoMeta({
  title: () => `${displayTag.value} Decks — Slide Warehouse`,
  description: () => `All presentation decks tagged with ${tag}.`,
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Back link -->
    <nav class="text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
      <NuxtLink to="/" class="hover:text-emerald-600 focus:outline-none focus:underline">
        ← All decks
      </NuxtLink>
    </nav>

    <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">{{ displayTag }}</h1>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
      {{ decks?.length ?? 0 }} {{ (decks?.length ?? 0) === 1 ? 'deck' : 'decks' }} tagged
      <span class="font-mono text-emerald-600 dark:text-emerald-400">{{ tag }}</span>
    </p>

    <!-- Empty state -->
    <div v-if="!decks?.length" class="py-16 text-center">
      <p class="text-gray-400 text-sm">No decks found for this topic yet.</p>
      <NuxtLink to="/" class="mt-4 inline-block text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
        Browse all decks →
      </NuxtLink>
    </div>

    <!-- Grid -->
    <DeckGrid v-else :decks="decks" :pending="false" />
  </div>
</template>
```

- [ ] **Step 2: Commit**

```bash
git add pages/topics/
git commit -m "feat: add topics/[tag] page for filtered deck browsing"
```

---

## Task 14: Wire Index Page

**Files:**
- Modify: `pages/index.vue`

- [ ] **Step 1: Add FeaturedDeck and TopicsExplorer above the hero**

Replace the existing `<template>` block:

```vue
<template>
  <div>
    <FeaturedDeck />
    <TopicsExplorer />
    <SpeakerOverview />
    <div class="border-t border-gray-200 dark:border-gray-800" />
    <div class="max-w-6xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Presentations</h1>
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

- [ ] **Step 2: Verify the dev server starts without errors**

```bash
npm run dev
```

Open `http://localhost:3000` and confirm:
- FeaturedDeck banner appears at top (people-skills deck)
- TopicsExplorer cards appear below
- SpeakerOverview and existing grid are unchanged
- About link appears in header

Open `http://localhost:3000/about` and confirm:
- Bio, stats strip, and links row all render

Open `http://localhost:3000/topics/career` and confirm:
- Decks tagged "career" appear (people-skills, skills-to-bills)

Open `http://localhost:3000/decks/people-skills-technical-skills` and confirm:
- VersionChangelog appears in sidebar
- ResourceLinks section does not appear (URLs are empty strings)

- [ ] **Step 3: Commit**

```bash
git add pages/index.vue
git commit -m "feat: add FeaturedDeck and TopicsExplorer to homepage"
```

---

## Task 15: Build Verification

- [ ] **Step 1: Run static build**

```bash
npm run build
```

Expected: clean build, no TypeScript errors, all routes prerendered including `/about` and `/topics/career`, `/topics/vue`, `/topics/soft-skills`, etc.

- [ ] **Step 2: Check prerendered routes include new pages**

In build output, confirm these routes appear:
- `/about`
- `/topics/career`
- `/topics/vue`
- `/topics/soft-skills`
- `/topics/community`
- `/topics/javascript`
- `/topics/fundamentals`

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "chore: verify six-sections build"
```
