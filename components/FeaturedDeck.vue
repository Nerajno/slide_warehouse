<script setup lang="ts">
import type { Tag } from '~/types'
import { TAG_COLORS } from '~/types'

const { data: deck } = await useAsyncData('featured-deck', () =>
  queryCollection('decks').where('featured', '=', true).first()
)

const gradientClass = computed(() => {
  const firstTag = deck.value?.tags?.[0]
  return firstTag ? (TAG_COLORS[firstTag as Tag] ?? 'from-emerald-500 to-teal-600') : 'from-emerald-500 to-teal-600'
})
</script>

<template>
  <div v-if="deck" class="rounded-card border border-emerald-800 overflow-hidden flex flex-col sm:flex-row">
        <div
          :class="`bg-gradient-to-br ${gradientClass} sm:w-48 h-36 sm:h-auto shrink-0 relative`"
          style="background-image: repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0,0,0,0.08) 39px, rgba(0,0,0,0.08) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(0,0,0,0.08) 39px, rgba(0,0,0,0.08) 40px);"
        >
          <span class="absolute inset-0 flex items-center justify-center font-display text-white/20 text-5xl font-bold select-none">
            {{ deck.title[0] }}
          </span>
        </div>

        <div class="p-5 flex flex-col flex-1">
          <h2 class="font-display text-xl font-semibold text-white mb-1 leading-snug">{{ deck.title }}</h2>
          <p class="text-sm text-gray-400 mb-3 leading-relaxed">{{ deck.description }}</p>

          <div class="flex flex-wrap gap-1.5 mb-4">
            <span
              v-for="tag in deck.tags"
              :key="tag"
              class="text-xs px-2 py-0.5 rounded-tag bg-emerald-900/20 text-emerald-300 border border-emerald-800"
            >{{ tag }}</span>
          </div>

          <div class="mt-auto">
            <NuxtLink
              :to="`/decks/${deck.id}`"
              class="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 motion-safe:transition-colors"
            >
              Open deck <span aria-hidden="true">→</span>
            </NuxtLink>
          </div>
        </div>
  </div>
</template>
