<script setup lang="ts">
import type { DeckFrontmatter } from '~/types'

const { data: speaker } = await useAsyncData('about-speaker', () =>
  queryCollection('speaker').first()
)

const { data: allDecks } = await useAsyncData('about-decks', () =>
  queryCollection('decks').all() as unknown as Promise<DeckFrontmatter[]>
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
  <div class="max-w-page mx-auto px-page-x lg:px-page-x-lg py-section-lg mt-14">

    <h1 class="font-display text-5xl sm:text-6xl font-semibold text-[var(--sw-text-1)] leading-[1.05] tracking-tight text-balance max-w-[16ch]">
      About + Purpose
    </h1>

    <section aria-label="Speaker bio" class="mt-section-md max-w-content">
      <SpeakerBio />
    </section>

    <section v-if="speaker" aria-label="By the numbers" class="mt-section-lg">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="sw-stat-block">
          <p class="sw-stat-block__number">{{ totalDecks }}</p>
          <p class="sw-stat-block__label">Decks</p>
        </div>
        <div class="sw-stat-block">
          <p class="sw-stat-block__number">{{ totalSlides }}</p>
          <p class="sw-stat-block__label">Slides</p>
        </div>
        <div class="sw-stat-block">
          <p class="sw-stat-block__number">{{ speaker.stats?.totalTalks }}</p>
          <p class="sw-stat-block__label">Deliveries</p>
        </div>
        <div class="sw-stat-block">
          <p class="sw-stat-block__number">{{ speaker.stats?.conferencesCount }}</p>
          <p class="sw-stat-block__label">Conferences</p>
        </div>
      </div>
    </section>

    <!-- Case Study — the three beats hang off the same rail as the circuit. -->
    <section aria-labelledby="case-study-heading" class="mt-section-lg">
      <h2 id="case-study-heading" class="sw-section-head">Case Study</h2>

      <div class="sw-rail mt-section-sm space-y-8 max-w-content">
        <div class="sw-rail-node">
          <h3 class="font-display text-2xl font-semibold text-[var(--sw-text-1)] leading-tight">The Problem</h3>
          <p class="font-sans text-[var(--sw-text-2)] leading-relaxed mt-2">
            Speakers accumulate decks across repos and events with no shareable home. Finding decks for CFPs means
            digging through GitHub, limiting reuse and reach.
          </p>
        </div>

        <div class="sw-rail-node">
          <h3 class="font-display text-2xl font-semibold text-[var(--sw-text-1)] leading-tight">The Approach</h3>
          <p class="font-sans text-[var(--sw-text-2)] leading-relaxed mt-2">
            Self-hosted, Git-driven repo treating every Reveal.js deck as versioned and searchable. One Markdown file
            adds a talk. Versioning preserves event branding. An iframe viewer delivers the deck as presented.
          </p>
        </div>

        <div class="sw-rail-node">
          <h3 class="font-display text-2xl font-semibold text-[var(--sw-text-1)] leading-tight">The Result</h3>
          <p class="font-sans text-[var(--sw-text-2)] leading-relaxed mt-2">
            Portfolio-grade tool demonstrating Nuxt 3 mastery, WCAG 2.2 AA compliance, and "Progress over Perfection" in
            production.
          </p>
        </div>
      </div>
    </section>

    <section v-if="speaker?.links?.length" class="mt-section-lg">
      <h2 class="font-display text-2xl font-semibold text-[var(--sw-text-1)]">Find me online</h2>
      <div class="flex flex-wrap gap-2 mt-5">
        <a v-for="link in speaker.links" :key="link.label" :href="link.url" target="_blank" rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 min-h-[44px] px-4 rounded-pill border border-[var(--sw-border)] font-sans text-sm text-[var(--sw-text-1)] transition-colors duration-fast hover:border-[var(--sw-primary)] hover:text-[var(--sw-primary)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--sw-focus-ring)]">
          {{ link.label }}
          <span aria-hidden="true" class="text-[var(--sw-text-3)]">↗</span>
          <span class="sr-only">(opens in new tab)</span>
        </a>
      </div>
    </section>

  </div>
</template>
