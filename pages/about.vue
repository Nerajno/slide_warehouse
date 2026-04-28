<script setup lang="ts">
import type { SpeakerData, DeckFrontmatter } from '~/types'

const { data: speaker } = await useAsyncData('about-speaker', () =>
  queryContent<SpeakerData>('speaker').findOne()
)

const { data: allDecks } = await useAsyncData('about-decks', () =>
  queryContent('decks').find()
)

const totalDecks = computed(() => allDecks.value?.length ?? 0)
const totalSlides = computed(() =>
  allDecks.value?.reduce((sum: number, d: DeckFrontmatter) => sum + (d.slideCount ?? 0), 0) ?? 0
)

useSeoMeta({
  title: 'About Nerando Johnson — Slide Warehouse',
  description: 'Nerando Johnson is a software developer, international conference speaker, and community builder. Speaker since 2019.',
  ogTitle: 'About Nerando Johnson',
  ogDescription: 'Software developer, conference speaker, and community builder. Browse all presentation decks at Slide Warehouse.',
  ogSiteName: 'Slide Warehouse',
  twitterCard: 'summary',
  twitterSite: '@nerajno',
})

useHead({
  meta: [{ property: 'og:type', content: 'profile' }],
})
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-12 space-y-12">

    <section>
      <SpeakerBio />
    </section>

    <hr class="border-gray-200 dark:border-gray-800" />

    <section v-if="speaker">
      <p class="font-mono text-[0.65rem] uppercase tracking-widest text-gray-500 mb-6">By the numbers</p>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div class="text-center">
          <p class="font-mono text-[0.65rem] uppercase tracking-widest text-gray-500 mb-1">Decks</p>
          <p class="font-display text-[2rem] font-semibold text-emerald-600 dark:text-emerald-400 leading-none">{{ totalDecks }}</p>
        </div>
        <div class="text-center">
          <p class="font-mono text-[0.65rem] uppercase tracking-widest text-gray-500 mb-1">Slides</p>
          <p class="font-display text-[2rem] font-semibold text-gray-800 dark:text-gray-100 leading-none">{{ totalSlides }}</p>
        </div>
        <div class="text-center">
          <p class="font-mono text-[0.65rem] uppercase tracking-widest text-gray-500 mb-1">Talks</p>
          <p class="font-display text-[2rem] font-semibold text-gray-800 dark:text-gray-100 leading-none">{{ speaker.stats.totalTalks }}</p>
        </div>
        <div class="text-center">
          <p class="font-mono text-[0.65rem] uppercase tracking-widest text-gray-500 mb-1">Conferences</p>
          <p class="font-display text-[2rem] font-semibold text-amber-600 dark:text-amber-400 leading-none">{{ speaker.stats.conferencesCount }}</p>
        </div>
      </div>
    </section>

    <hr class="border-gray-200 dark:border-gray-800" />

    <section v-if="speaker?.links?.length">
      <p class="font-mono text-[0.65rem] uppercase tracking-widest text-gray-500 mb-4">Find me online</p>
      <div class="flex flex-wrap gap-3">
        <a
          v-for="link in speaker.links"
          :key="link.label"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          {{ link.label }} <span aria-hidden="true" class="text-gray-400">↗</span>
        </a>
      </div>
    </section>

  </div>
</template>
