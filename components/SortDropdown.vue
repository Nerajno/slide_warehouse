<script setup lang="ts">
import type { SearchParams } from '~/types'

const store = useDeckStore()
const { syncUrl } = useSearch()

const options: { value: SearchParams['sort']; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'az', label: 'A → Z' },
  { value: 'za', label: 'Z → A' },
]

function onChange(e: Event) {
  store.setSort((e.target as HTMLSelectElement).value as SearchParams['sort'])
  syncUrl()
}
</script>

<template>
  <div class="flex items-center gap-2">
    <label for="sort-select" class="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Sort by</label>
    <select
      id="sort-select"
      :value="store.sort"
      class="h-9 pl-3 pr-8 border border-gray-200 dark:border-gray-700 rounded-btn text-xs bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
      @change="onChange"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
  </div>
</template>
