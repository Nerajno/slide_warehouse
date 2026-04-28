const MAX = 6
const KEY = 'sw:recent'

export function useRecentDecks() {
  const recent = ref<string[]>([])

  function load() {
    if (!import.meta.client) return
    try { recent.value = JSON.parse(localStorage.getItem(KEY) ?? '[]') } catch { recent.value = [] }
  }

  function addRecent(id: string) {
    if (!import.meta.client) return
    load()
    recent.value = [id, ...recent.value.filter(x => x !== id)].slice(0, MAX)
    localStorage.setItem(KEY, JSON.stringify(recent.value))
  }

  onMounted(load)
  return { recent, addRecent }
}
