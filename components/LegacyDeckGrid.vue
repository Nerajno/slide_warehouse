<script setup lang="ts">
const { data: legacyDecks } = await useAsyncData(
  'legacy-decks',
  () => queryCollection('legacy').all()
)

const formatIcon = (format: string) => {
  switch (format.toLowerCase()) {
    case 'powerpoint':
    case 'pptx':
      return '📊'
    case 'pdf':
      return '📄'
    case 'keynote':
    case 'key':
      return '🎯'
    default:
      return '📁'
  }
}

const formatColor = (format: string) => {
  switch (format.toLowerCase()) {
    case 'powerpoint':
    case 'pptx':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
    case 'pdf':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    case 'keynote':
    case 'key':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-8 space-y-6">
    <div>
      <h2
        class="font-display text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight leading-tight mb-4">
        Legacy Presentations
      </h2>
      <p class="text-gray-600 dark:text-gray-400 text-lg">
        Earlier presentations from before the Reveal.js era. These decks are available in their original formats
        including PowerPoint, PDF, and Keynote.
      </p>
    </div>

    <section aria-label="Legacy presentation deck">
      <div v-if="legacyDecks?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="deck in legacyDecks" :key="deck.id"
          class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
          <!-- Thumbnail -->
          <div class="aspect-video bg-gray-100 dark:bg-gray-700 relative">
            <img v-if="deck.thumbnailUrl" :src="deck.thumbnailUrl" :alt="`${deck.title} thumbnail`"
              class="w-full h-full object-cover" loading="lazy" />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="text-6xl mb-4">{{ formatIcon(deck.format ?? '') }}</span>
            </div>

            <!-- Format badge -->
            <div class="absolute top-3 right-3">
              <span :class="`px-2 py-1 text-xs font-medium rounded-full ${formatColor(deck.format ?? '')}`">
                {{ deck.format }}
              </span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-5 space-y-3">
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-gray-100 text-lg leading-tight mb-1">
                {{ deck.title }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {{ deck.description }}
              </p>
            </div>

            <!-- Metadata -->
            <div class="space-y-2 text-sm">
              <div class="flex items-center justify-between">
                <span class="text-gray-500 dark:text-gray-400">
                  {{ deck.date ? new Date(deck.date).getFullYear() : '' }} • {{ deck.conference }}
                </span>
                <span class="text-gray-500 dark:text-gray-400"></span>
              </div>
            </div>

            <!-- Tags -->
            <div v-if="deck.tags?.length" class="flex flex-wrap gap-1">
              <span v-for="tag in deck.tags" :key="tag"
                class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                {{ tag }}
              </span>
            </div>

            <!-- Download button -->
            <a :href="deck.fileUrl" download
              class="inline-flex items-center justify-center w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md transition-colors duration-200">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download {{ deck.format ?? 'file' }}
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
