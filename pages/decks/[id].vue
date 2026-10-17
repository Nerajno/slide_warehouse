<script setup lang="ts">
import type { DeckFrontmatter } from '~/types'

const route = useRoute()
const { addRecent } = useRecentDecks()
const { trackDeckView } = useAnalytics()

// Query by `path`, not `id`: Content v3 sets `id` to the source file path.
const { data: deck } = await useAsyncData(
  `deck-${route.params.id}`,
  async () => {
    const row = await queryCollection('decks').where('path', '=', `/decks/${route.params.id}`).first()
    return (row ? { ...row, id: deckSlug(row) } : null) as unknown as DeckFrontmatter | null
  },
)

if (!deck.value) throw createError({ statusCode: 404, message: 'Deck not found' })

// Each deck is one length; there are no per-duration files to switch between.
const talkLength = computed(() => {
  const min = deck.value!.durationMinutes ?? Number.parseInt(deck.value!.tier ?? '', 10)
  return Number.isFinite(min) ? `${min} min` : ''
})
const selectedVersion = ref(deck.value!.currentVersion)
const frameLoaded = ref(false)

// Each version is a delivery of the talk at a different event. Most labels
// already name the event and year; only add the date when they don't, so the
// closed select stays short enough to show "(current)".
const versionOptions = computed(() =>
  (deck.value!.versions ?? []).map(v => {
    const when = /\b\d{4}\b/.test(v.label)
      ? ''
      : ` · ${new Date(`${v.date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
    return {
      value: v.version,
      label: `${v.label}${when}${v.version === deck.value!.currentVersion ? ' (current)' : ''}`,
    }
  }),
)

// `?v=` makes a specific delivery shareable. Pages are prerendered without the
// query, and while a prerendered page hydrates the router briefly sits on that
// query-less route, restoring the real URL only after mount. So follow the
// router's live route from mount on instead of reading the query once.
const router = useRouter()
onMounted(() => {
  watch(() => router.currentRoute.value.query.v, (q) => {
    const v = Number(q)
    if (versionOptions.value.some(o => o.value === v)) selectedVersion.value = v
  }, { immediate: true })
})
watch(selectedVersion, (v) => {
  frameLoaded.value = false
  const want = v === deck.value!.currentVersion ? undefined : String(v)
  if (router.currentRoute.value.query.v === want) return
  router.replace({ query: { ...router.currentRoute.value.query, v: want } })
})

/** Same two-hue rule as the circuit: amber ahead, emerald done, neutral filed. */
const STATUS_CLASS: Record<string, string> = {
  upcoming:  'sw-status--confirmed',
  delivered: 'sw-status--delivered',
  archived:  'border-[var(--sw-border)] text-[var(--sw-text-2)]',
}

const STATUS_LABEL: Record<string, string> = {
  upcoming:  'Upcoming',
  delivered: 'Delivered',
  archived:  'Archived',
}

// Use the version's declared `revealFile`. Synthesising `v{N}.html` broke any
// version whose file keeps its event-branded name (v2 of networking-talk is
// `networking-talk-revealjs-Boise2026.html`), which 404'd the viewer.
const revealSrc = computed(() => {
  const v = deck.value!.versions?.find(x => x.version === selectedVersion.value)
  return `${deck.value!.revealBasePath}/${v?.revealFile ?? `v${selectedVersion.value}.html`}`
})


// Related talks based on shared tags
const { data: allDecks } = await useAsyncData(
  `related-decks-${route.params.id}`,
  async () => withSlug(await queryCollection('decks').all()) as unknown as DeckFrontmatter[],
)

const relatedTalks = computed(() => {
  if (!deck.value?.tags || !allDecks.value) return []

  return allDecks.value
    .filter(d => d.id !== deck.value!.id)
    .filter(d => d.tags?.some(tag => deck.value!.tags!.includes(tag)))
    .slice(0, 3)
})

definePageMeta({})
onMounted(async () => {
  addRecent(route.params.id as string)
  await trackDeckView(route.params.id as string)
})

const { public: { siteUrl } } = useRuntimeConfig()

useSeoMeta({
  title: () => `${deck.value?.title ?? 'Deck'} — Slide Warehouse`,
  description: () => deck.value?.description,
  ogTitle: () => deck.value?.title,
  ogDescription: () => deck.value?.description,
  ogImage: () => deck.value?.thumbnail ? `${siteUrl}${deck.value.thumbnail}` : `${siteUrl}/og-default.png`,
  ogUrl: () => `${siteUrl}/decks/${route.params.id}`,
  ogSiteName: 'Slide Warehouse',
})

useHead({
  meta: [{ property: 'og:type', content: 'article' }],
  link: [{ rel: 'canonical', href: () => `${siteUrl}/decks/${route.params.id}` }],
})

defineOgImage({
  component: 'DeckCard',
  props: {
    title: deck.value?.title,
    description: deck.value?.description,
    tags: deck.value?.tags,
  },
})
</script>

<template>
  <div v-if="deck" class="mt-14">
    <!-- Breadcrumb -->
    <nav aria-label="Breadcrumb" class="px-4 py-2 border-b border-[var(--sw-border)] bg-[var(--sw-surface)]">
      <ol class="flex items-center gap-1.5 font-mono text-xs text-[var(--sw-text-3)]">
        <li><NuxtLink to="/" class="inline-flex items-center justify-center min-h-[44px] px-1 hover:text-[var(--sw-text-1)] transition-colors focus-visible:outline-none focus-visible:underline">Home</NuxtLink></li>
        <li aria-hidden="true"><span class="sw-breadcrumb__separator">/</span></li>
        <li><NuxtLink to="/#decks" class="inline-flex items-center justify-center min-h-[44px] px-1 hover:text-[var(--sw-text-1)] transition-colors focus-visible:outline-none focus-visible:underline">Decks</NuxtLink></li>
        <li aria-hidden="true"><span class="sw-breadcrumb__separator">/</span></li>
        <li class="text-[var(--sw-text-1)] truncate max-w-[200px]" aria-current="page">{{ deck.title }}</li>
      </ol>
    </nav>

    <!-- Top bar -->
    <div
      class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-page-x py-2.5 border-b border-[var(--sw-border)] bg-[var(--sw-surface)]">
      <!-- Left: back + title + event -->
      <div class="flex items-center gap-3 min-w-0">
        <NuxtLink to="/"
          class="shrink-0 inline-flex items-center justify-center min-h-[44px] min-w-[44px] shrink-0 text-xs text-[var(--sw-text-3)] hover:text-[var(--sw-primary)] focus:outline-none focus:underline transition-colors">
          ← Back
        </NuxtLink>
        <span class="text-[var(--sw-text-3)] shrink-0" aria-hidden="true">|</span>
        <h1 class="font-display text-base font-semibold text-[var(--sw-text-1)] truncate">
          {{ deck.title }}
        </h1>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <a v-if="deck.conferenceUrl" :href="deck.conferenceUrl" target="_blank" rel="noopener noreferrer"
          class="sw-status sw-status--delivered hover:border-[var(--sw-primary)] transition-colors duration-fast">
          {{ deck.conference }}
          <span class="sr-only">(opens in new tab)</span>
        </a>
        <span v-else-if="deck.conference" class="sw-status border-[var(--sw-border)] text-[var(--sw-text-2)]">
          {{ deck.conference }}
        </span>

        <span v-if="deck.location" class="font-sans text-sm text-[var(--sw-text-3)]">{{ deck.location }}</span>

        <span v-if="deck.status" class="sw-status" :class="STATUS_CLASS[deck.status] ?? 'border-[var(--sw-border)] text-[var(--sw-text-2)]'">
          {{ STATUS_LABEL[deck.status] ?? deck.status }}
        </span>

        <a v-if="deck.videoUrl" :href="deck.videoUrl" target="_blank" rel="noopener noreferrer" class="sw-btn-secondary">
          <svg class="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
          </svg>
          Watch Recording
          <span class="sr-only">(opens in new tab)</span>
        </a>
      </div>

      <!-- Right: version (when there's more than one) and talk length. -->
      <div class="flex flex-wrap items-center gap-x-3 gap-y-2 min-w-0">
        <div v-if="versionOptions.length > 1" class="flex items-center gap-2 min-w-0">
          <label for="version-select" class="shrink-0 font-sans text-sm text-[var(--sw-text-3)]">Version</label>
          <select id="version-select" v-model.number="selectedVersion" class="sw-input w-auto min-w-0 max-w-full pl-3 pr-8 text-sm">
            <option v-for="o in versionOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
          </select>
        </div>
        <p v-if="talkLength" class="font-sans text-sm text-[var(--sw-text-3)]">
          <span class="sr-only">Talk length: </span>{{ talkLength }}
        </p>
      </div>
    </div>

    <!--
      The viewer gets a fixed viewport-relative height rather than the page
      itself, so everything below it (Related Talks) is reachable. Previously
      the whole page was locked to calc(100vh - 56px) and that content sat
      outside the visible box.
    -->
    <div class="relative w-full bg-[var(--sw-surface-2)]" style="height: calc(100vh - 8.5rem); min-height: 420px;">
      <div v-if="!frameLoaded" class="absolute inset-0 sw-skeleton rounded-none" aria-hidden="true" />
      <iframe :src="revealSrc" :title="`${deck.title} presentation`" sandbox="allow-scripts"
        class="relative w-full h-full border-0" allow="fullscreen" @load="frameLoaded = true" />
    </div>

    <!-- Related talks — same card as everywhere else, not a second variant. -->
    <section v-if="relatedTalks.length" class="border-t border-[var(--sw-border)]">
      <div class="max-w-page mx-auto px-page-x lg:px-page-x-lg py-section-md">
        <h2 class="font-display text-3xl font-semibold text-[var(--sw-text-1)] leading-tight">
          Related Talks
        </h2>
        <p class="font-sans text-[var(--sw-text-2)] mt-3 mb-8">
          More presentations with similar topics and themes.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <DeckCard v-for="relatedDeck in relatedTalks" :key="relatedDeck.id" :deck="relatedDeck" />
        </div>
      </div>
    </section>
  </div>
</template>
