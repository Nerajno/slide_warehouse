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
