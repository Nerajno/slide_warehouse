<script setup lang="ts">
import type { DeckFrontmatter } from '~/types'

defineProps<{ deck: DeckFrontmatter }>()

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <aside class="space-y-5 text-sm">
    <!-- Description -->
    <section>
      <p class="text-gray-600 dark:text-gray-300 leading-relaxed">{{ deck.description }}</p>
    </section>

    <hr class="border-gray-200 dark:border-gray-700" />

    <!-- Tags -->
    <section>
      <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tags</h3>
      <div class="flex flex-wrap gap-1.5">
        <NuxtLink
          v-for="tag in deck.tags"
          :key="tag"
          :to="`/?tags=${tag}`"
          class="text-xs px-2 py-1 rounded-tag bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        >{{ tag }}</NuxtLink>
      </div>
    </section>

    <hr class="border-gray-200 dark:border-gray-700" />

    <!-- Statistics -->
    <section>
      <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Statistics</h3>
      <dl class="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
        <div class="flex justify-between">
          <dt>Slides</dt><dd class="font-mono">{{ deck.slideCount }}</dd>
        </div>
        <div class="flex justify-between">
          <dt>Duration</dt><dd class="font-mono">{{ deck.durationMinutes }} min</dd>
        </div>
        <div class="flex justify-between">
          <dt>Created</dt><dd>{{ formatDate(deck.createdAt) }}</dd>
        </div>
        <div class="flex justify-between">
          <dt>Updated</dt><dd>{{ formatDate(deck.updatedAt) }}</dd>
        </div>
        <div v-if="deck.tier" class="flex justify-between">
          <dt>Tier</dt><dd>{{ deck.tier }}</dd>
        </div>
      </dl>
    </section>

    <template v-if="deck.events?.length">
      <hr class="border-gray-200 dark:border-gray-700" />
      <section>
        <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Events</h3>
        <ul class="text-xs text-gray-600 dark:text-gray-300 space-y-1">
          <li v-for="event in deck.events" :key="event">{{ event }}</li>
        </ul>
      </section>
    </template>

    <hr class="border-gray-200 dark:border-gray-700" />

    <!-- Actions -->
    <section>
      <ShareButton />
    </section>
  </aside>
</template>
