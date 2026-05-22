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
    class="group relative rounded-card border border-[var(--sw-border)] bg-[var(--sw-surface)] transition-shadow duration-[200ms] hover:border-[var(--sw-primary)] hover:shadow-card-hover"
    role="article"
  >
    <div v-if="latestEvent" class="absolute top-2 left-2 z-10">
      <span class="sw-badge-featured">{{ latestEvent }}</span>
    </div>

    <div class="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
      <ShareButton :url="`/decks/${deck.id}`" compact />
    </div>

    <button
      type="button"
      class="absolute top-24 left-3 z-20 font-mono text-2xs text-white/80 uppercase tracking-widest hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--sw-focus-ring)]"
      @click="navigateTo(`/?tier=${deck.tier ?? deck.durationMinutes + 'min'}`)"
    >
      {{ deck.tier ?? deck.durationMinutes + 'min' }}
    </button>
    <NuxtLink
      :to="`/decks/${deck.id}`"
      class="block focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--sw-focus-ring)] rounded-card"
    >
      <div
        class="h-32 rounded-t-card bg-gradient-to-br"
        :class="gradient"
        :aria-label="`Preview of ${deck.title}`"
        role="img"
      />

      <div class="p-4 flex flex-col gap-2">
        <h3 class="sw-deck-card__title leading-snug">{{ deck.title }}</h3>
        <p class="sw-deck-card__description line-clamp-2">{{ deck.description }}</p>

        <div class="flex flex-wrap gap-1">
          <span
            v-for="tag in deck.tags"
            :key="tag"
            class="sw-tag"
            :class="`sw-tag--${tag}`"
          >{{ tag }}</span>
        </div>

        <div class="sw-deck-card__meta flex items-center gap-3">
          <span>{{ deck.slideCount }} slides</span>
          <span>{{ deck.durationMinutes }}min</span>
          <span v-if="deck.versions?.length > 1">v{{ deck.currentVersion }}</span>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>
