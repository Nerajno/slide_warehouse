export function useSearch() {
  const store = useDeckStore()
  const router = useRouter()
  const route = useRoute()

  function onInput(val: string) {
    store.setSearch(val)
    syncUrl()
  }

  function syncUrl() {
    const query: Record<string, string> = {}
    if (store.searchQuery) query.q = store.searchQuery
    if (store.activeTags.length) query.tags = store.activeTags.join(',')
    if (store.sort && store.sort !== 'newest') query.sort = store.sort
    router.replace({ query })
  }

  return { onInput, syncUrl }
}
