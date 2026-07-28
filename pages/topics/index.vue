<script setup lang="ts">
import type { DeckFrontmatter } from '~/types'
import { TAG_LIST } from '~/types'

const { data: decks } = await useAsyncData('topics-index', () =>
  queryCollection('decks').all() as unknown as Promise<DeckFrontmatter[]>,
)

function displayTag(tag: string) {
  return tag.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

const tags = computed(() => {
  const all = decks.value ?? []
  return TAG_LIST.map(tag => ({
    tag,
    label: displayTag(tag),
    count: all.filter(d => d.tags?.includes(tag as any)).length,
  })).filter(t => t.count > 0).sort((a, b) => b.count - a.count)
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
      Each tile carries its own topic colour from the token layer, so the grid
      reads as the same vocabulary used by the tags on every deck card.
    -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-section-md">
      <NuxtLink
        v-for="{ tag, label, count } in tags"
        :key="tag"
        :to="`/topics/${tag}`"
        class="group rounded-card border p-5 flex flex-col justify-between min-h-[7rem]
               transition-[box-shadow,transform] duration-base ease-out-smooth
               hover:shadow-lift focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--sw-focus-ring)]"
        :style="{
          background: `var(--tag-${tag}-bg)`,
          borderColor: `var(--tag-${tag}-border)`,
          color: `var(--tag-${tag}-text)`,
        }"
      >
        <span class="font-display text-xl font-semibold leading-tight text-pretty">{{ label }}</span>
        <span class="font-sans text-sm opacity-80 tabular-nums">{{ count }} deck{{ count === 1 ? '' : 's' }}</span>
      </NuxtLink>
    </div>
  </div>
</template>
