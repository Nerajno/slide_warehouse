<script setup lang="ts">
const store = useDeckStore()
const { onInput } = useSearch()

let timer: ReturnType<typeof setTimeout>
function handleInput(e: Event) {
  clearTimeout(timer)
  timer = setTimeout(() => onInput((e.target as HTMLInputElement).value), 300)
}

function clear() {
  onInput('')
}
</script>

<template>
  <div role="search" class="relative">
    <label for="deck-search" class="sr-only">Search presentations</label>
    <input
      id="deck-search"
      type="search"
      autocomplete="off"
      :value="store.searchQuery"
      placeholder="Search by title, description, or tags..."
      class="w-full h-11 pl-4 pr-10 border border-gray-200 dark:border-gray-700 rounded-card bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
      @input="handleInput"
    />
    <button
      v-if="store.searchQuery"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      aria-label="Clear search"
      @click="clear"
    >
      ×
    </button>
  </div>
</template>
