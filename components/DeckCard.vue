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
    <div v-if="latestEvent" class="absolute top-2 left-2 z-10">
      <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 leading-none">
        {{ latestEvent }}
      </span>
    </div>

    <div class="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
      <ShareButton :url="`/decks/${deck.id}`" compact />
    </div>

    <NuxtLink
      :to="`/decks/${deck.id}`"
      class="block focus:outline-none focus:ring-2 focus:ring-emerald-600 rounded-card"
      :aria-label="deck.title"
    >
      <div
        class="h-32 rounded-t-card bg-gradient-to-br"
        :class="gradient"
        :aria-label="`Preview of ${deck.title}`"
        role="img"
      >
        <div class="h-full flex items-end p-3">
          <NuxtLink
            :to="`/?tier=${deck.tier ?? deck.durationMinutes + 'min'}`"
            class="text-[10px] font-mono text-white/80 uppercase tracking-widest hover:text-white transition-colors"
            @click.stop
          >
            {{ deck.tier ?? deck.durationMinutes + 'min' }}
          </NuxtLink>
        </div>
      </div>

      <div class="p-4">
        <h3 class="font-display text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug mb-1">
          {{ deck.title }}
        </h3>
        <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
          {{ deck.description }}
        </p>

        <div class="flex flex-wrap gap-1 mb-3">
          <span
            v-for="tag in deck.tags"
            :key="tag"
            class="text-[11px] px-2 py-0.5 rounded-tag bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300"
          >{{ tag }}</span>
        </div>

        <div class="flex items-center gap-3 text-[11px] text-gray-400 font-mono">
          <span>{{ deck.slideCount }} slides</span>
          <span>{{ deck.durationMinutes }}min</span>
          <span v-if="deck.versions?.length > 1">v{{ deck.currentVersion }}</span>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>
