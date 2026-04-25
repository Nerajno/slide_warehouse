<script setup lang="ts">
import type { DeckFrontmatter } from '~/types'

const route = useRoute()
const tag = route.params.tag as string

const { data: decks } = await useAsyncData(`topic-${tag}`, () =>
  queryContent('decks').where({ tags: { $contains: tag } }).find() as unknown as Promise<DeckFrontmatter[]>
)

const displayTag = computed(() =>
  tag.charAt(0).toUpperCase() + tag.slice(1)
)

useSeoMeta({
  title: () => `${displayTag.value} Decks — Slide Warehouse`,
  description: () => `All presentation decks tagged with ${tag}.`,
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Back link -->
    <nav class="text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
      <NuxtLink to="/" class="hover:text-emerald-600 focus:outline-none focus:underline">
        ← All decks
      </NuxtLink>
    </nav>

    <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">{{ displayTag }}</h1>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
      {{ decks?.length ?? 0 }} {{ (decks?.length ?? 0) === 1 ? 'deck' : 'decks' }} tagged
      <span class="font-mono text-emerald-600 dark:text-emerald-400">{{ tag }}</span>
    </p>

    <!-- Empty state -->
    <div v-if="!decks?.length" class="py-16 text-center">
      <p class="text-gray-400 text-sm">No decks found for this topic yet.</p>
      <NuxtLink to="/" class="mt-4 inline-block text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
        Browse all decks →
      </NuxtLink>
    </div>

    <!-- Grid -->
    <DeckGrid v-else :decks="decks" :pending="false" />
  </div>
</template>
