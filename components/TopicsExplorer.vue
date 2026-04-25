<script setup lang="ts">
import { TAG_COLORS } from '~/types'
import type { Tag } from '~/types'

const { tagStats } = useTopics()

const topics = computed(() =>
  Object.entries(tagStats.value)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
)

function gradientFor(tag: string) {
  return TAG_COLORS[tag as Tag] ?? 'from-gray-500 to-slate-600'
}
</script>

<template>
  <div v-if="topics.length" class="border-b border-[#2a3347]">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <p class="font-mono text-[0.65rem] uppercase tracking-widest text-gray-500 mb-4">Browse by topic</p>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <NuxtLink
          v-for="[tag, count] in topics"
          :key="tag"
          :to="`/topics/${tag}`"
          class="group relative rounded-card border border-[#2a3347] overflow-hidden hover:border-emerald-700 transition-colors"
        >
          <div :class="`bg-gradient-to-br ${gradientFor(tag)} h-1.5 w-full`" />
          <div class="px-3 py-3">
            <p class="text-sm font-medium text-gray-200 group-hover:text-white transition-colors capitalize">{{ tag }}</p>
            <p class="text-xs text-gray-500 font-mono mt-0.5">{{ count }} {{ count === 1 ? 'deck' : 'decks' }}</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
