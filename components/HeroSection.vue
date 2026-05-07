<script setup lang="ts">
import { decks, mostRecentDeck } from '~/data/decks'
import { history, mostRecentEvent } from '~/data/history'

const totalSlides = decks.reduce((sum, d) => sum + d.slideCount, 0)
const yearsSince = new Date().getFullYear() - 2019

const stats = [
  { value: decks.length,        label: 'Decks'         },
  { value: history.length,      label: 'Events'        },
  { value: totalSlides,         label: 'Slides'        },
  { value: yearsSince + '+',    label: 'Years Speaking'},
]

const recentDeckUrl = mostRecentDeck
  ? `/decks/${mostRecentDeck.id}`
  : '#decks'
</script>

<template>
  <section aria-labelledby="hero-heading" class="pt-32 pb-20 px-6">
    <div class="max-w-6xl mx-auto">
      <div class="md:grid md:grid-cols-2 md:gap-16 md:items-start">
        <!-- Left col -->
        <div>
          <span class="inline-block font-mono text-[0.65rem] uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-6">
            Conference Presentations
          </span>
          <h1 id="hero-heading" class="font-display text-5xl sm:text-6xl font-semibold leading-[0.95] tracking-tight text-foreground mb-6 text-balance">
            Talks that<br><em class="text-primary not-italic">connect.</em>
          </h1>
          <p class="text-muted-foreground text-base sm:text-lg leading-relaxed mb-10 text-pretty max-w-lg">
            Browse, search, and share Reveal.js presentation decks — from meetups and conference stages to your screen.
          </p>
          <div class="flex flex-wrap gap-3">
            <a
              href="#decks"
              class="inline-flex items-center justify-center rounded-btn px-5 py-2.5 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
            >Browse Decks</a>
            <a
              href="#history"
              class="inline-flex items-center justify-center rounded-btn px-5 py-2.5 text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
            >Speaker History</a>
          </div>
        </div>

        <!-- Right col -->
        <div class="mt-16 md:mt-0">
          <!-- 2x2 stat grid -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div
              v-for="stat in stats"
              :key="stat.label"
              class="rounded-xl border border-border bg-card p-6"
            >
              <p class="font-mono text-3xl font-semibold text-primary mb-1">{{ stat.value }}</p>
              <p class="text-sm text-muted-foreground">{{ stat.label }}</p>
            </div>
          </div>

          <!-- Most-recent-talk banner -->
          <div v-if="mostRecentDeck" class="rounded-xl border border-border bg-card p-6 flex gap-4 items-start">
            <div class="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-1">
                Most Recent · {{ mostRecentEvent?.name }}
              </p>
              <h3 class="text-sm font-semibold text-foreground mb-3 truncate">{{ mostRecentDeck.title }}</h3>
              <NuxtLink
                :to="recentDeckUrl"
                class="inline-flex items-center text-xs font-medium border border-border rounded px-3 py-1.5 text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
              >Open Deck →</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
