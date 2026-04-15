<script setup lang="ts">
import type { DeckFrontmatter } from '~/types'

defineProps<{ decks: DeckFrontmatter[] | null; pending: boolean }>()
</script>

<template>
  <div>
    <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="n in 6"
        :key="n"
        class="h-52 rounded-card bg-gray-100 dark:bg-gray-800 animate-pulse"
      />
    </div>

    <div
      v-else-if="decks?.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <DeckCard v-for="deck in decks" :key="deck.id" :deck="deck" />
    </div>

    <p
      v-else
      class="text-sm text-gray-500 dark:text-gray-400 text-center py-16"
      aria-live="polite"
    >
      No decks match your search.
    </p>
  </div>
</template>
