<script setup lang="ts">
import type { Tag } from '~/types'

const props = defineProps<{ decks: any[] }>()
const store = useDeckStore()
const { syncUrl } = useSearch()

const ALL_TAGS: Tag[] = [
  'vue', 'nuxt', 'javascript', 'typescript', 'career',
  'soft-skills', 'fundamentals', 'architecture', 'accessibility', 'community',
]

function tagCount(tag: Tag) {
  return (props.decks ?? []).filter((d: any) => d.tags?.includes(tag)).length
}

function toggle(tag: Tag) {
  store.toggleTag(tag)
  syncUrl()
}

function clearAll() {
  store.clearFilters()
  syncUrl()
}
</script>

<template>
  <div class="flex items-center gap-2 flex-wrap">
    <button
      :aria-pressed="store.activeTags.length === 0"
      class="h-8 px-3 rounded-tag text-xs font-medium transition-colors"
      :class="store.activeTags.length === 0
        ? 'bg-emerald-600 text-white'
        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
      @click="clearAll"
    >
      All
    </button>

    <button
      v-for="tag in ALL_TAGS"
      :key="tag"
      role="button"
      :aria-pressed="store.activeTags.includes(tag)"
      class="h-8 px-3 rounded-tag text-xs font-medium flex items-center gap-1.5 transition-colors"
      :class="store.activeTags.includes(tag)
        ? 'bg-emerald-600 text-white'
        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'"
      @click="toggle(tag)"
    >
      {{ tag }}
      <span
        class="text-[10px] px-1 rounded-full"
        :class="store.activeTags.includes(tag)
          ? 'bg-emerald-500 text-white'
          : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300'"
      >{{ tagCount(tag) }}</span>
    </button>

    <button
      v-if="store.hasActiveFilters"
      class="h-8 px-3 text-xs text-gray-500 dark:text-gray-400 underline"
      @click="clearAll"
    >
      Clear filters
    </button>
  </div>
</template>
