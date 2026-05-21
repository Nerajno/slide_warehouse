<script setup lang="ts">
import type { SpeakerData, DeckFrontmatter } from '~/types'

const { data: speaker } = await useAsyncData('about-speaker', () =>
  queryContent<SpeakerData>('speaker').findOne()
)

const { data: allDecks } = await useAsyncData('about-decks', () =>
  $fetch<DeckFrontmatter[]>('/api/decks')
)

const totalDecks = computed(() => (allDecks.value as DeckFrontmatter[])?.length ?? 0)
const totalSlides = computed(() =>
  (allDecks.value as DeckFrontmatter[])?.reduce((sum: number, d: DeckFrontmatter) => sum + (d.slideCount ?? 0), 0) ?? 0
)

useSeoMeta({
  title: 'About + Purpose — Slide Warehouse',
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
  <div class="max-w-3xl mx-auto px-4 py-12 mt-14 space-y-12">

    <h1
      class="font-display text-3xl sm:text-4xl font-semibold text-foreground tracking-tight leading-tight">
      About + Purpose
    </h1>

    <section aria-label="Speaker bio">
      <SpeakerBio />
    </section>

    <hr class="border-border" />

    <section v-if="speaker" aria-label="By the numbers">
      <p class="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-6">By the numbers
      </p>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div class="text-center">
          <p class="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-1">Decks</p>
          <p class="font-display text-[2rem] font-semibold text-primary leading-none">{{
            totalDecks }}</p>
        </div>
        <div class="text-center">
          <p class="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-1">Slides</p>
          <p class="font-display text-[2rem] font-semibold text-foreground leading-none">{{ totalSlides
            }}</p>
        </div>
        <div class="text-center">
          <p class="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-1">Talks</p>
          <p class="font-display text-[2rem] font-semibold text-foreground leading-none">{{
            speaker.stats.totalTalks }}</p>
        </div>
        <div class="text-center">
          <p class="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-1">
            Conferences</p>
          <p class="font-display text-[2rem] font-semibold text-foreground leading-none">{{
            speaker.stats.conferencesCount }}</p>
        </div>
      </div>
    </section>

    <hr class="border-border" />

    <!-- Case Study -->
    <section aria-labelledby="case-study-heading">
      <div class="bg-card border border-border rounded-card p-8 space-y-8">
        <h2 id="case-study-heading" class="font-mono text-[0.65rem] uppercase tracking-widest text-primary">Case Study
        </h2>

        <div class="border-l-2 border-primary pl-4">
          <h3 class="font-display font-semibold text-foreground mb-2">The Problem</h3>
          <p class="text-muted-foreground text-sm leading-relaxed">
            Speakers accumulate decks across repos and events with no shareable home. Finding decks for CFPs means
            digging through GitHub, limiting reuse and reach.
          </p>
        </div>

        <div class="border-l-2 border-primary pl-4">
          <h3 class="font-display font-semibold text-foreground mb-2">The Approach</h3>
          <p class="text-muted-foreground text-sm leading-relaxed">
            Self-hosted, Git-driven repo treating every Reveal.js deck as versioned and searchable. One Markdown file
            adds a talk. Versioning preserves event branding. An iframe viewer delivers the deck as presented.
          </p>
        </div>

        <div class="border-l-2 border-primary pl-4">
          <h3 class="font-display font-semibold text-foreground mb-2">The Result</h3>
          <p class="text-muted-foreground text-sm leading-relaxed">
            Portfolio-grade tool demonstrating Nuxt 3 mastery, WCAG 2.2 AA compliance, and "Progress over Perfection" in
            production.
          </p>
        </div>
      </div>
    </section>

    <hr class="border-border" />

    <section v-if="speaker?.links?.length">
      <p class="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-4">Find me online
      </p>
      <div class="flex flex-wrap gap-3">
        <a v-for="link in speaker.links" :key="link.label" :href="link.url" target="_blank" rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-sm text-foreground hover:border-primary hover:text-primary transition-colors">
          {{ link.label }} <span aria-hidden="true" class="text-gray-500 dark:text-gray-400">↗</span>
        </a>
      </div>
    </section>

  </div>
</template>
