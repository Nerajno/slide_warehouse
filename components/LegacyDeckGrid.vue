<script setup lang="ts">
const { data: legacyDecks } = await useAsyncData(
  'legacy-decks',
  () => queryCollection('legacy').all()
)

/**
 * Format is real metadata — it tells you what you're about to download — so it
 * gets a readable label rather than an emoji standing in for a thumbnail.
 */
const formatLabel = (format?: string) => {
  switch ((format ?? '').toLowerCase()) {
    case 'powerpoint':
    case 'pptx':
      return 'PowerPoint'
    case 'pdf':
      return 'PDF'
    case 'keynote':
    case 'key':
      return 'Keynote'
    default:
      return format || 'File'
  }
}
</script>

<template>
  <!-- The page owns the heading and intro; repeating them here rendered both. -->
  <div v-if="legacyDecks?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
    <article v-for="deck in legacyDecks" :key="deck.id" class="sw-deck-card">
      <div class="flex items-center justify-between gap-2">
        <span class="sw-deck-card__conference truncate">{{ deck.conference }}</span>
        <span class="sw-tag sw-tag--patterns shrink-0">{{ formatLabel(deck.format) }}</span>
      </div>

      <h3 class="sw-deck-card__title text-pretty">{{ deck.title }}</h3>
      <p class="sw-deck-card__description line-clamp-2">{{ deck.description }}</p>

      <div v-if="deck.tags?.length" class="flex flex-wrap gap-1.5">
        <span v-for="tag in deck.tags" :key="tag" class="sw-tag sw-tag--patterns">{{ tag }}</span>
      </div>

      <div class="sw-deck-card__meta mt-auto pt-2">
        {{ deck.date ? new Date(deck.date).getFullYear() : '' }}
      </div>

      <a :href="deck.fileUrl" download class="sw-btn-secondary w-full mt-2">
        <svg class="w-4 h-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Download {{ formatLabel(deck.format) }}
      </a>
    </article>
  </div>

  <div v-else class="sw-empty-state" role="status">
    <p class="sw-empty-state__title">Nothing archived here yet</p>
    <p class="sw-empty-state__message">Pre-Reveal.js decks will appear here as they're recovered.</p>
  </div>
</template>
