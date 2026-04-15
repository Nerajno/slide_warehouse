<script setup lang="ts">
const { decks, pending } = useDecks()
const allDecks = computed(() => decks.value ?? [])
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <h1 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">Presentations</h1>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Browse, search, and share Reveal.js decks.</p>

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
</template>
