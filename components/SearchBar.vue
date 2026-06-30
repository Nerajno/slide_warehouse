<script setup lang="ts">
const store = useDeckStore()
const { onInput } = useSearch()
const route = useRoute()
const inputEl = ref<HTMLInputElement | null>(null)

const activeIndex = ref(-1)
const showSuggestions = ref(false)

const suggestions = computed(() => {
  const q = store.searchQuery.trim().toLowerCase()
  if (q.length < 2 || !store.allDecks) return []

  const titles = store.allDecks
    .map(d => d.title)
    .filter(t => t?.toLowerCase().includes(q))

  const tags = [...new Set(
    store.allDecks.flatMap(d => d.tags ?? [])
      .filter(t => t.toLowerCase().includes(q))
  )]

  return [...new Set([...titles, ...tags])].slice(0, 8)
})

let timer: ReturnType<typeof setTimeout>
function handleInput(e: Event) {
  clearTimeout(timer)
  const val = (e.target as HTMLInputElement).value
  timer = setTimeout(() => {
    onInput(val)
    activeIndex.value = -1
    showSuggestions.value = suggestions.value.length > 0
  }, 300)
}

function selectSuggestion(s: string) {
  onInput(s)
  showSuggestions.value = false
  activeIndex.value = -1
  inputEl.value?.focus()
}

function handleKeydown(e: KeyboardEvent) {
  if (!showSuggestions.value || suggestions.value.length === 0) return
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = Math.min(activeIndex.value + 1, suggestions.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value = Math.max(activeIndex.value - 1, -1)
  } else if (e.key === 'Enter' && activeIndex.value >= 0) {
    e.preventDefault()
    selectSuggestion(suggestions.value[activeIndex.value])
  } else if (e.key === 'Escape') {
    showSuggestions.value = false
    activeIndex.value = -1
  }
}

function handleFocus() {
  if (suggestions.value.length > 0) showSuggestions.value = true
}

function handleBlur() {
  setTimeout(() => { showSuggestions.value = false }, 150)
}

function clear() {
  onInput('')
  showSuggestions.value = false
}

onMounted(() => {
  if (route.query.focus === 'search') inputEl.value?.focus()
})
</script>

<template>
  <div role="search" class="relative">
    <label for="deck-search" class="sr-only">Search presentations</label>
    <input
      id="deck-search"
      ref="inputEl"
      type="search"
      role="combobox"
      autocomplete="off"
      :value="store.searchQuery"
      :aria-expanded="showSuggestions && suggestions.length > 0"
      aria-controls="search-listbox"
      :aria-activedescendant="activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined"
      placeholder="Search by title, description, or tags..."
      class="w-full h-11 pl-4 pr-10 border border-gray-200 dark:border-gray-700 rounded-card bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
      @input="handleInput"
      @keydown="handleKeydown"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <button
      v-if="store.searchQuery"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
      aria-label="Clear search"
      @click="clear"
    >
      ×
    </button>

    <!-- Suggestions dropdown -->
    <ul
      v-if="showSuggestions && suggestions.length > 0"
      id="search-listbox"
      role="listbox"
      aria-label="Search suggestions"
      class="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-card shadow-lg overflow-hidden"
    >
      <li
        v-for="(s, i) in suggestions"
        :id="`suggestion-${i}`"
        :key="s"
        role="option"
        :aria-selected="i === activeIndex"
        class="px-4 py-2.5 text-sm cursor-pointer transition-colors"
        :class="i === activeIndex
          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
          : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'"
        @mousedown.prevent="selectSuggestion(s)"
      >
        {{ s }}
      </li>
    </ul>
  </div>
</template>
