<script setup lang="ts">
import type { DeckFrontmatter } from '~/types'
import { TAG_COLORS } from '~/types'

const { data: decks } = await useAsyncData('topics-index', () =>
  queryCollection('decks').all() as unknown as Promise<DeckFrontmatter[]>,
)

function displayTag(tag: string) {
  return tag.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

const tags = computed(() => {
  const all = decks.value ?? []
  return Object.keys(TAG_COLORS).map(tag => ({
    tag,
    label: displayTag(tag),
    count: all.filter(d => d.tags?.includes(tag as any)).length,
    gradient: TAG_COLORS[tag as keyof typeof TAG_COLORS],
  })).filter(t => t.count > 0).sort((a, b) => b.count - a.count)
})

useSeoMeta({
  title: 'Topics — Slide Warehouse',
  description: 'Browse presentations by topic — Vue, TypeScript, career, accessibility and more.',
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-10">
    <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Topics</h1>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-8">Browse presentations by category.</p>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <NuxtLink
        v-for="{ tag, label, count, gradient } in tags"
        :key="tag"
        :to="`/topics/${tag}`"
        class="group relative rounded-card overflow-hidden h-28 flex flex-col justify-end p-4 focus:outline-none focus:ring-2 focus:ring-emerald-600"
      >
        <div class="absolute inset-0 bg-gradient-to-br transition-opacity duration-150" :class="gradient" />
        <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-150" />
        <span class="relative text-sm font-semibold text-white">{{ label }}</span>
        <span class="relative text-xs text-white/70 font-mono">{{ count }} deck{{ count === 1 ? '' : 's' }}</span>
      </NuxtLink>
    </div>
  </div>
</template>
