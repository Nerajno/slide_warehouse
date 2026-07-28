<script setup lang="ts">
import type { DeckFrontmatter } from '~/types'
import { tagClass } from '~/types'

const route = useRoute()
const tag = computed(() => route.params.tag as string)

const { data: decks } = await useAsyncData(
  () => `topic-${tag.value}`,
  async () => {
    const all = withSlug(await queryCollection('decks').all())
    return all.filter(d => (d.tags as string[] | undefined)?.includes(tag.value) ?? false) as unknown as DeckFrontmatter[]
  },
  { watch: [tag] }
)

const displayTag = computed(() =>
  tag.value.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
)

useSeoMeta({
  title: () => `${displayTag.value} Decks — Slide Warehouse`,
  description: () => `All presentation decks by Nerando Johnson tagged with "${displayTag.value}". Browse Reveal.js slides at Slide Warehouse.`,
  ogTitle: () => `${displayTag.value} Decks`,
  ogDescription: () => `Browse all "${displayTag.value}" presentation decks at Slide Warehouse.`,
  ogSiteName: 'Slide Warehouse',
  twitterCard: 'summary',
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <nav class="text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
      <ol class="flex items-center gap-1.5">
        <li><NuxtLink to="/" class="inline-flex items-center justify-center min-h-[44px] px-1 hover:text-emerald-600 focus:outline-none focus:underline transition-colors">← All decks</NuxtLink></li>
      </ol>
    </nav>

    <h1 class="sw-section-head">{{ displayTag }}</h1>
    <p class="font-sans text-[var(--sw-text-3)] mt-4" aria-live="polite" aria-atomic="true">
      {{ decks?.length ?? 0 }} {{ (decks?.length ?? 0) === 1 ? 'deck' : 'decks' }} tagged
      <span :class="tagClass(tag)">{{ tag }}</span>
    </p>

    <div class="mt-section-md">
      <DeckGrid :decks="decks" :pending="false" />
    </div>
  </div>
</template>
