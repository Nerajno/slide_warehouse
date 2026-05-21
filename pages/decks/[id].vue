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

// Related talks based on shared tags
const { data: allDecks } = await useAsyncData(
  `related-decks-${route.params.id}`,
  () => $fetch<DeckFrontmatter[]>('/api/decks')
)

const relatedTalks = computed(() => {
  if (!deck.value?.tags || !allDecks.value) return []

  return allDecks.value
    .filter(d => d.id !== deck.value!.id)
    .filter(d => d.tags?.some(tag => deck.value!.tags!.includes(tag)))
    .slice(0, 3)
})

definePageMeta({})
onMounted(() => addRecent(route.params.id as string))

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
</script>

<template>
  <div v-if="deck" class="flex flex-col mt-14" style="height: calc(100vh - 56px);">
    <!-- Breadcrumb -->
    <nav aria-label="Breadcrumb" class="px-4 py-2 border-b border-gray-100 dark:border-zinc-800/50 bg-white dark:bg-zinc-950">
      <ol class="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
        <li><NuxtLink to="/" class="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:underline">Home</NuxtLink></li>
        <li aria-hidden="true"><span class="text-border">/</span></li>
        <li><NuxtLink to="/#decks" class="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:underline">Decks</NuxtLink></li>
        <li aria-hidden="true"><span class="text-border">/</span></li>
        <li class="text-foreground truncate max-w-[200px]" aria-current="page">{{ deck.title }}</li>
      </ol>
    </nav>

    <!-- Top bar -->
    <div
      class="shrink-0 flex items-center justify-between gap-4 px-4 h-12 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <!-- Left: back + title + event badge -->
      <div class="flex items-center gap-3 min-w-0">
        <NuxtLink to="/"
          class="shrink-0 text-xs text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 focus:outline-none focus:underline transition-colors">
          ← Back
        </NuxtLink>
        <span class="text-gray-200 dark:text-zinc-700 shrink-0" aria-hidden="true">|</span>
        <h1 class="font-display text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
          {{ deck.title }}
        </h1>
        <div v-if="deck.conference" class="flex items-center gap-1 mt-1">
          <a v-if="deck.conferenceUrl" :href="deck.conferenceUrl" target="_blank" rel="noopener noreferrer"
            class="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 hover:border-emerald-500 dark:hover:border-emerald-500 text-xs font-medium transition-colors">
            {{ deck.conference }}
            <svg aria-hidden="true" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <span v-else
            class="px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium">
            {{ deck.conference }}
          </span>
        </div>
        <div v-if="deck.location" class="text-xs text-gray-500 dark:text-gray-400 mt-1">
          📍 {{ deck.location }}
        </div>
      </div>

      <!-- Status pill + video recording button -->
      <div class="flex items-center gap-2 mt-1">
        <!-- Status pill -->
        <span v-if="deck.status" :class="{
          'upcoming': 'px-2 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
          'delivered': 'px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400',
          'archived': 'px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400'
        }[deck.status]">
          {{ deck.status }}
        </span>

        <!-- Video recording button -->
        <a v-if="deck.videoUrl" :href="deck.videoUrl" target="_blank" rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 hover:border-emerald-500 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-300 text-sm font-medium transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
          </svg>
          Watch Recording
          <svg aria-hidden="true" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h10l5 5M0 12h18" />
          </svg>
        </a>
      </div>

      <!-- Right: duration switcher -->
      <div class="flex items-center gap-1 shrink-0" role="group" aria-label="Select talk duration">
        <button v-for="d in DURATIONS" :key="d" :aria-pressed="selectedDuration === d"
          class="text-[11px] font-mono px-2.5 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600"
          :class="selectedDuration === d
            ? 'bg-emerald-600 text-white'
            : 'border border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-emerald-500 dark:hover:border-emerald-500'"
          @click="selectedDuration = d">
          {{ d }}
        </button>
      </div>
    </div>

    <!-- Full-height iframe -->
    <div class="flex-1 min-h-0">
      <iframe :src="revealSrc" :title="`${deck.title} presentation`" sandbox="allow-scripts allow-same-origin"
        class="w-full h-full border-0" allow="fullscreen" />
    </div>

    <!-- Related talks -->
    <section v-if="relatedTalks.length" class="mt-8 border-t border-gray-200 dark:border-gray-700">
      <div class="max-w-6xl mx-auto px-4 py-8">
        <h2 class="font-display text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Related Talks
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          More presentations with similar topics and themes.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="relatedDeck in relatedTalks" :key="relatedDeck.id"
            class="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <NuxtLink :to="`/decks/${relatedDeck.id}`" class="block">
              <div class="aspect-video bg-gray-100 dark:bg-gray-700 relative">
                <img v-if="relatedDeck.thumbnail" :src="relatedDeck.thumbnail" :alt="`${relatedDeck.title} thumbnail`"
                  class="w-full h-full object-cover" loading="lazy" />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <span class="text-6xl mb-4">📊</span>
                </div>
              </div>

              <!-- Content -->
              <div class="p-5">
                <h3 class="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-2">
                  {{ relatedDeck.title }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                  {{ relatedDeck.description }}
                </p>

                <!-- Metadata -->
                <div class="space-y-2 text-sm">
                  <div class="flex items-center justify-between">
                    <span class="text-gray-500 dark:text-gray-400">
                      {{ relatedDeck.durationMinutes }}min • {{ relatedDeck.slideCount }} slides
                    </span>
                    <span v-if="relatedDeck.updatedAt" class="text-gray-500 dark:text-gray-400">
                      {{ new Date(relatedDeck.updatedAt).toLocaleDateString() }}
                    </span>
                  </div>

                  <!-- Tags -->
                  <div v-if="relatedDeck.tags?.length" class="flex flex-wrap gap-1">
                    <span v-for="tag in relatedDeck.tags" :key="tag"
                      class="px-2 py-1 text-xs rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400">
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
