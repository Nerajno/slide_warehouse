<script setup lang="ts">
definePageMeta({ keepalive: true })

const { public: { siteUrl } } = useRuntimeConfig()
const canonicalUrl = `${siteUrl}/`

useSeoMeta({
  title: 'Slide Warehouse — Conference Presentations by @Nerajno',
  description: 'Browse, search, and share Reveal.js presentation decks by Nerando Johnson — software developer and international conference speaker.',
  ogTitle: 'Slide Warehouse',
  ogDescription: 'A searchable portfolio of conference talks.',
  ogUrl: canonicalUrl,
  ogImage: `${siteUrl}/og-default.png`,
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
})
</script>

<template>
  <HeroSection />
  <DecksSection />
  <HistorySection />
</template>
