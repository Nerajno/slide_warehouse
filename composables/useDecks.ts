import type { Tag } from '~/types';

export function useDecks() {
  const store = useDeckStore();
  const route = useRoute();

  // Sync URL query params to store
  onMounted(() => {
    if (route.query.q) store.setSearch(String(route.query.q));
    if (route.query.tags) {
      const tags = String(route.query.tags).split(',') as Tag[];
      tags.forEach((t) => store.toggleTag(t));
    }
    if (route.query.sort) store.setSort(route.query.sort as any);
  });

  // Sync store changes to URL query params
  watch(
    [() => store.searchQuery, () => store.activeTags, () => store.sort],
    ([searchQuery, activeTags, sort]) => {
      const query: Record<string, string> = {};

      if (searchQuery) query.q = String(searchQuery);
      if (activeTags.length) query.tags = activeTags.join(',');
      if (sort && sort !== 'newest') query.sort = sort;

      // Update URL without full page reload
      const newQuery = new URLSearchParams(query).toString();
      if (newQuery !== route.query.toString()) {
        navigateTo({ query, replace: true });
      }
    },
    { deep: true },
  );

  const decks = computed(() => {
    let result = [...(store.allDecks ?? [])];

    if (store.searchQuery) {
      const q = store.searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q),
      );
    }

    if (store.activeTags.length) {
      result = result.filter((d) =>
        store.activeTags.some((t) => d.tags.includes(t)),
      );
    }

    result.sort((a, b) => {
      if (store.sort === 'az') return a.title.localeCompare(b.title);
      if (store.sort === 'za') return b.title.localeCompare(a.title);
      if (store.sort === 'oldest')
        return a.updatedAt.localeCompare(b.updatedAt);
      return b.updatedAt.localeCompare(a.updatedAt);
    });

    return result;
  });

  return { decks, pending: computed(() => store.pending) };
}
