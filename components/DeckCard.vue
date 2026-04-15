<script setup lang="ts">
import type { DeckFrontmatter } from '~/types'
import { TAG_COLORS } from '~/types'

const props = defineProps<{ deck: DeckFrontmatter }>()

const gradient = computed(() => {
  const tag = props.deck.tags?.[0]
  return tag ? TAG_COLORS[tag] : 'from-gray-400 to-gray-500'
})
</script>

<template>
  <div class="group relative rounded-card border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700 transition-colors duration-150" role="article">
    <!-- Share button — sits above the link layer -->
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
        <span class="text-[10px] font-mono text-white/70 uppercase tracking-widest">
          {{ deck.tier ?? deck.durationMinutes + ' min' }}
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug mb-1">
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
