import { defineStore } from 'pinia'
import type { Tag, SearchParams } from '~/types'

export const useDeckStore = defineStore('decks', () => {
  const searchQuery = ref('')
  const activeTags = ref<Tag[]>([])
  const sort = ref<SearchParams['sort']>('newest')

  function setSearch(q: string) {
    searchQuery.value = q
  }

  function toggleTag(tag: Tag) {
    const idx = activeTags.value.indexOf(tag)
    if (idx === -1) {
      activeTags.value.push(tag)
    } else {
      activeTags.value.splice(idx, 1)
    }
  }

  function clearFilters() {
    searchQuery.value = ''
    activeTags.value = []
    sort.value = 'newest'
  }

  function setSort(s: SearchParams['sort']) {
    sort.value = s
  }

  const hasActiveFilters = computed(
    () => searchQuery.value.length > 0 || activeTags.value.length > 0,
  )

  return {
    searchQuery,
    activeTags,
    sort,
    hasActiveFilters,
    setSearch,
    toggleTag,
    clearFilters,
    setSort,
  }
})
