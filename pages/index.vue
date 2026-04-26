<script setup lang="ts">
const { decks, pending } = useDecks()
const allDecks = computed(() => decks.value ?? [])
const { recent } = useRecentDecks()
const recentDecks = computed(() =>
  recent.value
    .map(id => allDecks.value.find(d => d.id === id))
    .filter(Boolean) as typeof allDecks.value
)
</script>

<template>
  <div>
    <FeaturedDeck />
    <TopicsExplorer />
    <SpeakerOverview />
    <div class="border-t border-gray-200 dark:border-gray-800" />
    <div class="max-w-6xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Presentations</h1>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Browse, search, and share Reveal.js decks.</p>

    <!-- Recently Viewed -->
    <div v-if="recentDecks.length" class="mb-6">
      <p class="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Recently Viewed</p>
      <div class="flex gap-3 overflow-x-auto pb-2">
        <div v-for="deck in recentDecks" :key="deck.id" class="w-48 shrink-0">
          <DeckCard :deck="deck" />
        </div>
      </div>
    </div>

    <!-- Search + Sort row -->
    <div class="flex flex-col sm:flex-row gap-3 mb-4">
      <div class="flex-1">
        <SearchBar />
      </div>
      <SortDropdown />
    </div>

    <!-- Filter Tags -->
    <div class="mb-6 overflow-x-auto">
      <FilterTags :decks="allDecks" />
    </div>

    <!-- Grid -->
    <DeckGrid :decks="allDecks" :pending="pending" />
    </div>
  </div>

</template>
