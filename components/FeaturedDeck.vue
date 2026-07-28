<script setup lang="ts">
import { tagClass } from '~/types'

const { data: deck } = await useAsyncData('featured-deck', async () => {
  const row = await queryCollection('decks').where('featured', '=', true).first()
  return row ? { ...row, id: deckSlug(row) } : null
})
</script>

<template>
  <!--
    The featured deck is simply the deck card at a larger scale: same
    vocabulary, more room. It carries no artwork because there is none to
    carry — the previous version filled the gap with a gradient, a grid
    overlay, and a giant initial, none of which said anything about the talk.
  -->
  <article v-if="deck" class="sw-deck-card sw-deck-card--featured group gap-3 p-6 sm:p-8">
    <div class="relative z-raised flex items-center gap-2">
      <span class="sw-badge-featured">Featured</span>
      <span v-if="deck.conference" class="sw-deck-card__conference truncate">{{ deck.conference }}</span>
    </div>

    <NuxtLink
      :to="`/decks/${deck.id}`"
      class="block rounded-btn focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--sw-focus-ring)]"
    >
      <span class="absolute inset-0" aria-hidden="true" />
      <h2 class="font-display text-3xl sm:text-4xl font-semibold text-[var(--sw-text-1)] leading-tight text-pretty">
        {{ deck.title }}
      </h2>
    </NuxtLink>

    <p class="sw-deck-card__description max-w-2xl">{{ deck.description }}</p>

    <div class="flex flex-wrap gap-1.5">
      <span v-for="tag in deck.tags" :key="tag" :class="tagClass(tag)">{{ tag }}</span>
    </div>

    <div class="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
      <span class="sw-deck-card__cta">Open deck <span aria-hidden="true">→</span></span>
      <span class="sw-deck-card__meta">{{ deck.slideCount }} slides · {{ deck.durationMinutes }}min</span>
    </div>
  </article>
</template>
