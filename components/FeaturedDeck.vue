<script setup lang="ts">
import type { DeckFrontmatter } from '~/types'
import { TAG_COLORS } from '~/types'

const { data: deck } = await useAsyncData('featured-deck', () =>
  queryContent<DeckFrontmatter>('decks').where({ featured: true }).findOne()
)

const gradientClass = computed(() => {
  const firstTag = deck.value?.tags?.[0]
  return firstTag ? TAG_COLORS[firstTag] : 'from-emerald-500 to-teal-600'
})
</script>

<template>
  <div v-if="deck" class="border-b border-[#2a3347] bg-[#161b22]">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <p class="font-mono text-[0.65rem] uppercase tracking-widest text-emerald-400 mb-4">Featured deck</p>
      <div class="rounded-card border border-emerald-800 overflow-hidden flex flex-col sm:flex-row">
        <!-- Thumbnail -->
        <div
          :class="`bg-gradient-to-br ${gradientClass} sm:w-48 h-36 sm:h-auto shrink-0 relative`"
          style="background-image: repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(0,0,0,0.08) 39px, rgba(0,0,0,0.08) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(0,0,0,0.08) 39px, rgba(0,0,0,0.08) 40px);"
        >
          <span class="absolute inset-0 flex items-center justify-center font-display text-white/20 text-5xl font-bold select-none">
            {{ deck.title[0] }}
          </span>
        </div>

        <!-- Body -->
        <div class="p-5 flex flex-col flex-1">
          <h2 class="font-display text-xl font-semibold text-white mb-1 leading-snug">{{ deck.title }}</h2>
          <p class="text-sm text-gray-400 mb-3 leading-relaxed">{{ deck.description }}</p>

          <!-- Tags -->
          <div class="flex flex-wrap gap-1.5 mb-4">
            <span
              v-for="tag in deck.tags"
              :key="tag"
              class="text-xs px-2 py-0.5 rounded-tag bg-emerald-900/20 text-emerald-300 border border-emerald-800"
            >{{ tag }}</span>
          </div>

          <!-- CTA -->
          <div class="mt-auto">
            <NuxtLink
              :to="`/decks/${deck.id}`"
              class="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Open deck <span aria-hidden="true">→</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
