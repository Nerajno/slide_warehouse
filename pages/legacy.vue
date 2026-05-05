<script setup lang="ts">
definePageMeta({ keepalive: true })

useSeoMeta({
  title: 'Legacy Presentations — Slide Warehouse',
  description: 'Browse older presentation decks in various formats including PowerPoint, PDF, and Keynote.',
  ogTitle: 'Legacy Presentations',
  ogDescription: 'Older presentation decks in various formats from before the Reveal.js era.',
  ogSiteName: 'Slide Warehouse',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 py-12 space-y-8">
    <div>
      <h1 class="font-display text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight leading-tight mb-4">
        Legacy Presentations
      </h1>
      <p class="text-gray-600 dark:text-gray-400 text-lg">
        Earlier presentations from before the Reveal.js era. These decks are available in their original formats including PowerPoint, PDF, and Keynote.
      </p>
    </div>

    <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
      <h2 class="font-semibold text-amber-900 dark:text-amber-100 mb-2">About This Collection</h2>
      <p class="text-amber-800 dark:text-amber-200 text-sm leading-relaxed">
        These presentations represent earlier work and speaking engagements. While they may not have the interactive features of modern Reveal.js decks, they contain valuable content and historical context. Formats vary by original creation tools and event requirements.
      </p>
    </div>

    <section aria-label="Legacy presentation deck">
      <LegacyDeckGrid />
    </section>
  </div>
</template>
