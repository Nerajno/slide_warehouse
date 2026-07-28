<script setup lang="ts">
import type { DeckFrontmatter } from '~/types'

defineProps<{ decks: DeckFrontmatter[] | null; pending: boolean }>()
</script>

<template>
  <div aria-live="polite">
    <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <div v-for="n in 6" :key="n" class="sw-skeleton h-52" />
    </div>

    <div
      v-else-if="decks?.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
    >
      <DeckCard v-for="deck in decks" :key="deck.id" :deck="deck" />
    </div>

    <!--
      The mock-slide SVG that used to sit here was a drawing of a deck, not a
      deck — decorative filler in the one spot where the interface should be
      telling the user what to do next.
    -->
    <div v-else class="sw-empty-state" role="status">
      <svg class="sw-empty-state__icon" aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
      <p class="sw-empty-state__title">No decks match</p>
      <p class="sw-empty-state__message">Nothing here for this topic yet.</p>
      <div class="sw-empty-state__actions">
        <NuxtLink to="/" class="sw-btn-secondary">Browse all decks</NuxtLink>
      </div>
    </div>
  </div>
</template>
