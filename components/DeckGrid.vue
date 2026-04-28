<script setup lang="ts">
import type { DeckFrontmatter } from '~/types'

defineProps<{ decks: DeckFrontmatter[] | null; pending: boolean }>()
</script>

<template>
  <div aria-live="polite">
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

    <div v-else class="flex flex-col items-center py-20 gap-4 text-center">
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
        <rect width="80" height="80" rx="16" class="fill-gray-100 dark:fill-gray-800"/>
        <rect x="18" y="24" width="44" height="6" rx="3" class="fill-gray-300 dark:fill-gray-600"/>
        <rect x="18" y="36" width="32" height="6" rx="3" class="fill-gray-200 dark:fill-gray-700"/>
        <rect x="18" y="48" width="20" height="6" rx="3" class="fill-gray-200 dark:fill-gray-700"/>
        <circle cx="58" cy="52" r="10" class="fill-emerald-100 dark:fill-emerald-900/40"/>
        <path d="M54 52h8M58 48v8" stroke="#059669" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <p class="text-sm text-gray-500 dark:text-gray-400">No decks match your search.</p>
      <NuxtLink to="/" class="text-xs text-emerald-600 dark:text-emerald-400 underline underline-offset-2">Clear all filters</NuxtLink>
    </div>
  </div>
</template>
