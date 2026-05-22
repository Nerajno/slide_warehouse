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
  <div>
    <span
      aria-live="polite"
      aria-atomic="true"
      class="sr-only"
    >
      {{ store.hasActiveFilters
        ? `${props.decks.length} deck${props.decks.length === 1 ? '' : 's'} shown`
        : '' }}
    </span>

    <!-- Count is always global (not filtered) — intentional UX choice -->
    <div class="flex items-center gap-2 flex-nowrap overflow-x-auto sm:flex-wrap pb-1 scrollbar-none -webkit-overflow-scrolling-touch">
      <button
        :aria-pressed="store.activeTags.length === 0"
        class="sw-filter-pill"
        :class="{ 'sw-filter-pill--active': store.activeTags.length === 0 }"
        @click="clearAll"
      >
        All
      </button>

      <button
        v-for="tag in ALL_TAGS.filter(t => tagCount(t) > 0)"
        :key="tag"
        :aria-pressed="store.activeTags.includes(tag)"
        class="sw-filter-pill"
        :class="{ 'sw-filter-pill--active': store.activeTags.includes(tag) }"
        @click="toggle(tag)"
      >
        {{ tag }}
        <span
          class="font-mono text-2xs px-1 rounded-full"
          :class="store.activeTags.includes(tag)
            ? 'bg-white/20 text-white'
            : 'bg-[var(--sw-primary-bg)] text-[var(--sw-primary-text)]'"
        >{{ tagCount(tag) }}</span>
      </button>

      <button
        v-if="store.hasActiveFilters"
        class="sw-btn-ghost h-8 min-h-0 px-3 text-xs"
        @click="clearAll"
      >
        Clear filters
      </button>
    </div>
  </div>
</template>
