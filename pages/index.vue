<script setup lang="ts">
const { decks, pending } = useDecks()
const allDecks = computed(() => decks.value ?? [])
const { recent } = useRecentDecks()
const recentDecks = computed(() =>
  recent.value
    .map(id => allDecks.value.find(d => d.id === id))
    .filter(Boolean) as typeof allDecks.value
)

useSeoMeta({
  title: 'Slide Warehouse — Conference Presentations by @Nerajno',
  description: 'Browse, search, and share Reveal.js presentation decks by Nerando Johnson — software developer and international conference speaker.',
  ogTitle: 'Slide Warehouse',
  ogDescription: 'Conference presentation decks by @Nerajno — browse, search, and share.',
  ogSiteName: 'Slide Warehouse',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div>
    <!-- Dark editorial hero -->
    <section class="relative bg-zinc-950 overflow-hidden">
      <div
        class="absolute inset-0 opacity-[0.04] pointer-events-none"
        aria-hidden="true"
        style="background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")"
      />
      <div class="absolute top-0 inset-x-0 h-px bg-emerald-500" aria-hidden="true" />
      <div class="relative max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <p class="font-mono text-[0.65rem] uppercase tracking-widest text-amber-400 mb-5">
          Conference Presentations · slides.developingdvlpr.com
        </p>
        <h1 class="font-display text-5xl sm:text-7xl font-semibold text-white leading-[0.95] tracking-tight mb-6">
          Talks that<br><em class="text-emerald-400 italic">connect.</em>
        </h1>
        <p class="text-zinc-400 text-base sm:text-lg max-w-xl leading-relaxed">
          Browse, search, and share Reveal.js presentation decks — from conference stages to your screen.
        </p>
      </div>
    </section>

    <FeaturedDeck />
    <TopicsExplorer />
    <SpeakerOverview />
    <div class="border-t border-gray-200 dark:border-gray-800" />
    <div class="max-w-6xl mx-auto px-4 py-8">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Presentations</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Browse, search, and share Reveal.js decks.</p>

      <div v-if="recentDecks.length" class="mb-6">
        <p class="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Recently Viewed</p>
        <div class="flex gap-3 overflow-x-auto pb-2">
          <div v-for="deck in recentDecks" :key="deck.id" class="w-48 shrink-0">
            <DeckCard :deck="deck" />
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 mb-4">
        <div class="flex-1">
          <SearchBar />
        </div>
        <SortDropdown />
      </div>

      <div class="mb-6 overflow-x-auto">
        <FilterTags :decks="allDecks" />
      </div>

      <DeckGrid :decks="allDecks" :pending="pending" />
    </div>
  </div>
</template>
