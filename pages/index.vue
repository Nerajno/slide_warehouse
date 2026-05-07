<script setup lang="ts">
definePageMeta({ keepalive: true })
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
  ogDescription: 'A searchable portfolio of conference talks.',
  ogUrl: 'https://slides.developingdvlpr.com',
  ogImage: '/og-default.png',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div>
    <HeroSection />
    <DecksSection />
    <HistorySection />
  </div>
</template>
