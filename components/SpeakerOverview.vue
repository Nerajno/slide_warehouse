<script setup lang="ts">
import type { SpeakerData, DeckFrontmatter } from '~/types'

const { data: speaker } = await useAsyncData('speaker', () =>
  queryCollection('speaker').first()
)

const { data: allDecks } = await useAsyncData('speaker-all-decks', () =>
  $fetch<DeckFrontmatter[]>('/api/decks')
)

const totalDecks = computed(() => allDecks.value?.length ?? 0)
const totalSlides = computed(() =>
  (allDecks.value as any[])?.reduce((sum: number, d: any) => sum + (d.slideCount ?? 0), 0) ?? 0
)

const recentTalkSlideCount = computed(() => {
  const deck = (allDecks.value as any[])?.find((d: any) => d.id === speaker.value?.recentTalk?.deckSlug)
  return deck?.slideCount ?? 0
})

const sortedPipeline = computed(() => {
  if (!speaker.value?.pipeline) return []
  return [...speaker.value.pipeline].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function getYear(dateStr: string) {
  return new Date(dateStr).getFullYear()
}

const STATUS_STYLES: Record<string, { dot: string; badge: string }> = {
  'delivered': {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-900/30 text-emerald-400 border border-emerald-800',
  },
  'confirmed': {
    dot: 'bg-amber-500',
    badge: 'bg-amber-900/30 text-amber-400 border border-amber-800',
  },
  'cfp-open': {
    dot: 'bg-violet-500',
    badge: 'bg-violet-900/30 text-violet-400 border border-violet-800',
  },
  'submitted': {
    dot: 'bg-gray-500',
    badge: 'bg-gray-800/50 text-gray-400 border border-gray-700',
  },
}
</script>

<template>
  <div v-if="speaker" class="max-w-6xl mx-auto px-4 py-8">
    <!-- Stats strip -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      <div class="text-center">
        <p class="font-mono text-[0.65rem] uppercase tracking-widest text-gray-500 dark:text-gray-500 mb-1">Decks</p>
        <p class="font-display text-[1.75rem] font-semibold text-emerald-600 dark:text-emerald-400 leading-none">{{
          totalDecks }}</p>
      </div>
      <div class="text-center">
        <p class="font-mono text-[0.65rem] uppercase tracking-widest text-gray-500 mb-1">Slides</p>
        <p class="font-display text-[1.75rem] font-semibold text-gray-800 dark:text-gray-100 leading-none">{{
          totalSlides }}</p>
      </div>
      <div class="text-center">
        <p class="font-mono text-[0.65rem] uppercase tracking-widest text-gray-500 mb-1">Deliveries</p>
        <p class="font-display text-[1.75rem] font-semibold text-gray-800 dark:text-gray-100 leading-none">{{
          speaker.stats?.totalTalks }}</p>
      </div>
      <div class="text-center">
        <p class="font-mono text-[0.65rem] uppercase tracking-widest text-gray-500 mb-1">Conferences</p>
        <p class="font-display text-[1.75rem] font-semibold text-amber-600 dark:text-amber-400 leading-none">{{
          speaker.stats?.conferencesCount }}</p>
      </div>
    </div>

    <!-- Two-column panel -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Most Recent Talk -->
      <div class="bg-gray-900 border border-emerald-700 rounded-card overflow-hidden flex flex-col">
        <!-- Thumbnail with grid-line overlay -->
        <div class="h-32 bg-gray-800 relative"
          style="background-image: repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.04) 39px, rgba(255,255,255,0.04) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.04) 39px, rgba(255,255,255,0.04) 40px);">
          <span class="absolute top-3 left-3 font-mono text-xs text-gray-300 bg-gray-900/70 px-2 py-1 rounded">
            {{ speaker.recentTalk?.conference }}
          </span>
          <span class="absolute top-3 right-3 text-xs text-gray-400 bg-gray-900/70 px-2 py-1 rounded">
            {{ formatDate(speaker.recentTalk?.date ?? '') }}
          </span>
        </div>

        <!-- Body -->
        <div class="p-4 flex flex-col flex-1">
          <p class="font-mono text-[0.65rem] uppercase tracking-widest text-emerald-400 mb-1">Most recent talk</p>
          <h2 class="font-display text-lg font-semibold text-white mb-1 leading-snug">{{ speaker.recentTalk?.title }}
          </h2>
          <p class="text-sm text-gray-400 mb-3">{{ speaker.recentTalk?.conference }} · {{ speaker.recentTalk?.hashtag }}
          </p>

          <!-- Chips -->
          <div class="flex flex-wrap gap-2 mb-4">
            <span class="text-xs bg-violet-900/40 text-violet-300 border border-violet-800 px-2 py-0.5 rounded-tag">
              {{ speaker.recentTalk?.location }}
            </span>
            <span class="text-xs bg-gray-800 text-gray-400 border border-gray-700 px-2 py-0.5 rounded-tag">
              {{ speaker.recentTalk?.durationMinutes }}min
            </span>
            <span v-if="recentTalkSlideCount"
              class="text-xs bg-gray-800 text-gray-400 border border-gray-700 px-2 py-0.5 rounded-tag">
              {{ recentTalkSlideCount }} slides
            </span>
          </div>

          <!-- Footer -->
          <div class="mt-auto flex items-center justify-between text-xs border-t border-gray-800 pt-3">
            <span class="font-mono text-gray-500 truncate mr-2">/{{ speaker.recentTalk?.deckSlug }}</span>
            <div class="flex items-center gap-3 shrink-0">
              <a v-if="speaker.recentTalk?.recordingUrl" :href="speaker.recentTalk?.recordingUrl" target="_blank"
                rel="noopener"
                class="text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer">Recording →</a>
              <span v-else class="text-gray-600 cursor-not-allowed">Recording →</span>
              <NuxtLink :to="`/decks/${speaker.recentTalk?.deckSlug}`"
                class="text-emerald-400 hover:text-emerald-300 transition-colors">
                Open deck →
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Conference Pipeline -->
      <div class="bg-gray-900 border border-gray-800 rounded-card overflow-hidden flex flex-col">
        <!-- Header -->
        <div class="p-4 border-b border-gray-800 flex items-center justify-between shrink-0">
          <div>
            <h2 class="font-mono text-[0.65rem] uppercase tracking-widest text-gray-500 mb-0.5">Speaker History</h2>
            <p class="text-xs text-gray-500">2025–2026 circuit</p>
          </div>
          <span class="text-xs bg-gray-800 text-gray-400 border border-gray-700 px-2 py-0.5 rounded-full">
            {{ sortedPipeline.length }}
          </span>
        </div>

        <!-- Pipeline list -->
        <ul class="divide-y divide-gray-800 flex-1">
          <template v-for="(item, idx) in sortedPipeline" :key="item.name">
            <!-- Year group separator -->
            <li v-if="idx === 0 || getYear(sortedPipeline[idx - 1].date) !== getYear(item.date)"
              class="px-4 py-1.5 bg-zinc-950/60 border-b border-gray-800" aria-hidden="true">
              <span class="font-mono text-[0.6rem] uppercase tracking-widest text-gray-600">
                {{ getYear(item.date) }}
              </span>
            </li>
            <li class="flex items-center gap-3 px-4 py-3">
              <span :class="[STATUS_STYLES[item.status]?.dot ?? 'bg-gray-500', 'w-2 h-2 rounded-full shrink-0']" />
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-200 truncate">{{ item.name }}</p>
                <div class="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span class="text-xs text-gray-500">{{ formatDate(item.date) }}</span>
                  <span
                    class="inline-flex items-center gap-1 text-xs bg-gray-800 text-gray-400 border border-gray-700 px-1.5 py-0.5 rounded">
                    <svg aria-hidden="true" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {{ item.location }}
                  </span>
                </div>
              </div>
              <span :class="[
                'text-[0.65rem] font-mono uppercase px-2 py-0.5 rounded shrink-0',
                STATUS_STYLES[item.status]?.badge ?? 'bg-gray-800 text-gray-400 border border-gray-700',
              ]">
                {{ item.status }}
              </span>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>
