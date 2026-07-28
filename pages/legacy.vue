<script setup lang="ts">
definePageMeta({ keepalive: true })

const { public: { siteUrl } } = useRuntimeConfig()
const canonicalUrl = `${siteUrl}/legacy`

useSeoMeta({
  title: 'Legacy Presentations — Slide Warehouse',
  description: 'Browse older presentation decks in various formats including PowerPoint, PDF, and Keynote.',
  ogTitle: 'Legacy Presentations',
  ogDescription: 'Older presentation decks in various formats from before the Reveal.js era.',
  ogUrl: canonicalUrl,
  ogImage: `${siteUrl}/og-default.png`,
  ogSiteName: 'Slide Warehouse',
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
})
</script>

<template>
  <div class="max-w-page mx-auto px-page-x lg:px-page-x-lg py-section-lg mt-14">
    <h1 class="sw-section-head">Legacy Presentations</h1>
    <p class="sw-section-lede mt-5">
      Earlier presentations from before the Reveal.js era. These decks are available in their original formats
      including PowerPoint, PDF, and Keynote.
    </p>

    <!--
      Neutral, not amber. This is the deepest part of the archive, and amber
      means "forthcoming" everywhere else on the site.
    -->
    <div class="rounded-card border border-[var(--sw-border)] bg-[var(--sw-surface-2)] p-6 mt-section-md max-w-content">
      <h2 class="font-display text-xl font-semibold text-[var(--sw-text-1)] mb-2">About This Collection</h2>
      <p class="font-sans text-sm text-[var(--sw-text-2)] leading-relaxed">
        These presentations represent earlier work and speaking engagements. While they may not have the interactive
        features of modern Reveal.js decks, they contain valuable content and historical context. Formats vary by
        original creation tools and event requirements.
      </p>
    </div>

    <section aria-label="Legacy presentation deck" class="mt-section-md">
      <LegacyDeckGrid />
    </section>
  </div>
</template>
