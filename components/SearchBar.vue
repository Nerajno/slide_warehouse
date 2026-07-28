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
      placeholder="Search by title, description, or tags…"
      class="sw-input pr-10"
      @input="handleInput"
      @keydown="handleKeydown"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <button
      v-if="store.searchQuery"
      type="button"
      class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-pill
             text-[var(--sw-text-3)] transition-colors duration-fast
             hover:text-[var(--sw-text-1)] hover:bg-[var(--sw-surface-2)]
             focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--sw-focus-ring)]"
      aria-label="Clear search"
      @click="clear"
    >
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
    </button>

    <!-- Suggestions dropdown -->
    <ul
      v-if="showSuggestions && suggestions.length > 0"
      id="search-listbox"
      role="listbox"
      aria-label="Search suggestions"
      class="absolute z-dropdown top-full left-0 right-0 mt-1 overflow-hidden
             bg-[var(--sw-surface)] border border-[var(--sw-border)] rounded-card shadow-lift"
    >
      <li
        v-for="(s, i) in suggestions"
        :id="`suggestion-${i}`"
        :key="s"
        role="option"
        :aria-selected="i === activeIndex"
        class="px-4 py-2.5 font-sans text-sm cursor-pointer transition-colors duration-fast"
        :class="i === activeIndex
          ? 'bg-[var(--sw-primary-bg)] text-[var(--sw-primary-text)]'
          : 'text-[var(--sw-text-1)] hover:bg-[var(--sw-surface-2)]'"
        @mousedown.prevent="selectSuggestion(s)"
      >
        {{ s }}
      </li>
    </ul>
  </div>
</template>
