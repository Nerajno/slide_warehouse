<script setup lang="ts">
import type { DeckFrontmatter } from '~/types'
import { TAG_LIST } from '~/types'

const { data: decks } = await useAsyncData('topics-index', async () =>
  withSlug(await queryCollection('decks').all()) as unknown as DeckFrontmatter[],
)

function displayTag(tag: string) {
  return tag.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

// Swatches defined in assets/css/tokens.css (--tag-<swatch>-bg|text|border).
const TOPIC_SWATCHES = ['blue', 'cyan', 'violet', 'slate', 'magenta'] as const

const tags = computed(() => {
  const all = decks.value ?? []
  return TAG_LIST.map(tag => ({
    tag,
    label: displayTag(tag),
    count: all.filter(d => (d.tags as string[] | undefined)?.includes(tag)).length,
  })).filter(t => t.count > 0)
    .sort((a, b) => b.count - a.count)
    // Colour by position, not topic: order depends on deck counts, and
    // cycling five swatches keeps any two tiles within four places distinct.
    .map((t, i) => ({ ...t, swatch: TOPIC_SWATCHES[i % TOPIC_SWATCHES.length] }))
})

useSeoMeta({
  title: 'Topics — Slide Warehouse',
  description: 'Browse presentations by topic — Vue, TypeScript, career, accessibility and more.',
})
</script>

<template>
  <div class="max-w-page mx-auto px-page-x lg:px-page-x-lg py-section-lg mt-14">
    <h1 class="sw-section-head">Topics</h1>
    <p class="sw-section-lede mt-5">Browse presentations by category.</p>

    <!--
      Tiles take one of five topic swatches by position (see TOPIC_SWATCHES),
      so neighbours differ. Colour is wayfinding only; deck-card chips are
      neutral.
    -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-section-md">
      <NuxtLink
        v-for="{ tag, label, count, swatch } in tags"
        :key="tag"
        :to="`/topics/${tag}`"
        class="group rounded-card border p-5 flex flex-col justify-between min-h-[7rem]
               transition-[box-shadow,transform] duration-base ease-out-smooth
               hover:shadow-lift focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--sw-focus-ring)]"
        :style="{
          background: `var(--tag-${swatch}-bg)`,
          borderColor: `var(--tag-${swatch}-border)`,
          color: `var(--tag-${swatch}-text)`,
        }"
      >
        <span class="font-display text-xl font-semibold leading-tight text-pretty">{{ label }}</span>
        <span class="font-sans text-sm tabular-nums">{{ count }} deck{{ count === 1 ? '' : 's' }}</span>
      </NuxtLink>
    </div>
  </div>
</template>
