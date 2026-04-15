import type { DeckFrontmatter, Tag } from '~/types'

export function useDecks() {
  const store = useDeckStore()
  const route = useRoute()

  // Sync store from URL on mount
  onMounted(() => {
    if (route.query.q) store.setSearch(String(route.query.q))
    if (route.query.tags) {
      const tags = String(route.query.tags).split(',') as Tag[]
      tags.forEach(t => store.toggleTag(t))
    }
    if (route.query.sort) store.setSort(route.query.sort as any)
  })

  const sortField = computed(() => {
    if (store.sort === 'az' || store.sort === 'za') return 'title'
    return 'updatedAt'
  })
  const sortDir = computed(() => (store.sort === 'oldest' || store.sort === 'az' ? 1 : -1))

  const { data: decks, pending } = useAsyncData(
    'decks',
    () => {
      let query = queryContent<DeckFrontmatter>('decks')
      if (store.searchQuery) {
        query = query.where({
          $or: [
            { title: { $icontains: store.searchQuery } },
            { description: { $icontains: store.searchQuery } },
          ],
        })
      }
      if (store.activeTags.length) {
        query = query.where({ tags: { $containsAny: store.activeTags } })
      }
      return query.sort({ [sortField.value]: sortDir.value as any }).find()
    },
    { watch: [() => store.searchQuery, () => store.activeTags, () => store.sort] },
  )

  return { decks, pending }
}
