<script setup lang="ts">
import type { DeckFrontmatter } from '~/types'
import { tagClass } from '~/types'

const props = defineProps<{ deck: DeckFrontmatter }>()

const latestEvent = computed(() => props.deck.events?.at(-1) ?? props.deck.conference ?? '')
const tier = computed(() => props.deck.tier ?? `${props.deck.durationMinutes}min`)
</script>

<template>
  <!--
    No thumbnail. These decks have no rendered preview image, and the gradient
    block that used to sit here was a coloured rectangle standing in for
    content. The title is the artifact, so it gets the space instead.
  -->
  <article class="sw-deck-card group h-full">
    <!-- Sits above the stretched link below so the share control stays clickable. -->
    <div class="relative z-raised flex items-start justify-between gap-2">
      <span v-if="latestEvent" class="sw-deck-card__conference truncate">{{ latestEvent }}</span>
      <div class="shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-fast">
        <ShareButton :url="`/decks/${deck.id}`" compact />
      </div>
    </div>

    <NuxtLink
      :to="`/decks/${deck.id}`"
      class="block rounded-btn focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--sw-focus-ring)]"
    >
      <!-- Stretched link: the whole card is the hit target, controls above sit on top. -->
      <span class="absolute inset-0" aria-hidden="true" />
      <h3 class="sw-deck-card__title text-pretty">{{ deck.title }}</h3>
    </NuxtLink>

    <p class="sw-deck-card__description line-clamp-2">{{ deck.description }}</p>

    <div class="flex flex-wrap gap-1.5 mt-auto pt-3">
      <span v-for="tag in deck.tags" :key="tag" :class="tagClass(tag)">{{ tag }}</span>
    </div>

    <div class="sw-deck-card__meta flex flex-wrap items-center gap-x-3 gap-y-1">
      <span>{{ deck.slideCount }} slides</span>
      <span>{{ tier }}</span>
      <span v-if="deck.versions?.length > 1">v{{ deck.currentVersion }}</span>
    </div>
  </article>
</template>
