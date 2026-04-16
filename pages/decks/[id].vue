<script setup lang="ts">
import type { DeckFrontmatter } from '~/types'

const route = useRoute()
const { addRecent } = useRecentDecks()

const { data: deck } = await useAsyncData(
  `deck-${route.params.id}`,
  () => queryContent<DeckFrontmatter>('decks').where({ id: route.params.id }).findOne(),
)

if (!deck.value) throw createError({ statusCode: 404, message: 'Deck not found' })

const selectedVersion = ref(deck.value!.currentVersion)

const revealSrc = computed(
  () => `${deck.value!.revealBasePath}/v${selectedVersion.value}.html`,
)

definePageMeta({ keepalive: true })
onMounted(() => addRecent(route.params.id as string))

useSeoMeta({
  title: () => `${deck.value?.title ?? 'Deck'} — Slide Warehouse`,
  description: () => deck.value?.description,
  ogTitle: () => deck.value?.title,
  ogDescription: () => deck.value?.description,
})
</script>

<template>
  <div v-if="deck" class="max-w-6xl mx-auto px-4 py-6">
    <!-- Breadcrumb -->
    <nav class="text-xs text-gray-400 mb-4" aria-label="Breadcrumb">
      <NuxtLink to="/" class="hover:text-emerald-600 focus:outline-none focus:underline">Home</NuxtLink>
      <span class="mx-1">›</span>
      <span class="text-gray-700 dark:text-gray-200">{{ deck.title }}</span>
    </nav>

    <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-5">{{ deck.title }}</h1>

    <!-- Main layout: viewer (70%) + sidebar (30%) -->
    <div class="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
      <!-- Viewer column -->
      <div>
        <DeckViewer :src="revealSrc" :title="deck.title" />
        <VersionSelector v-model="selectedVersion" :versions="deck.versions" />
      </div>

      <!-- Sidebar -->
      <div class="mt-8 lg:mt-0 lg:sticky lg:top-20 lg:self-start">
        <DeckSidebar :deck="deck" />
      </div>
    </div>
  </div>
</template>
