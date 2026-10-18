export function useTopics() {
  const { data: allDecks } = useAsyncData('topics-decks', async () =>
    (await queryCollection('decks').all()).filter(isDisplayed)
  )

  const tagStats = computed<Record<string, number>>(() => {
    const stats: Record<string, number> = {}
    for (const deck of allDecks.value ?? []) {
      for (const tag of (deck.tags as string[]) ?? []) {
        stats[tag] = (stats[tag] ?? 0) + 1
      }
    }
    return stats
  })

  return { tagStats }
}
