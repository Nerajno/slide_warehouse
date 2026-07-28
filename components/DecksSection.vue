<script setup lang="ts">
import type { Tag, SearchParams } from '~/types'
import { tagClass } from '~/types'

const store = useDeckStore()
const { pending } = useDecks()
const { syncUrl } = useSearch()

const SORT_OPTIONS: { value: SearchParams['sort']; label: string }[] = [
  { value: 'newest',           label: 'Newest First'     },
  { value: 'oldest',           label: 'Oldest First'     },
  { value: 'az',               label: 'A → Z'            },
  { value: 'za',               label: 'Z → A'            },
  { value: 'recently-updated', label: 'Recently Updated' },
]

/**
 * Derived from the decks themselves. The previous hardcoded list omitted
 * `beginner`, so decks carrying that tag could never be filtered to.
 */
const TAGS = computed<Tag[]>(() => {
  const seen = new Set<string>()
  for (const deck of store.allDecks ?? []) {
    for (const tag of deck.tags ?? []) seen.add(tag)
  }
  return [...seen].sort() as Tag[]
})

const filteredDecks = computed(() => {
  let list = [...(store.allDecks ?? [])]
  if (store.activeTags.length) {
    list = list.filter(d => d.tags.some(t => store.activeTags.includes(t)))
  }
  // Search was mounted but never applied here, so typing filtered nothing.
  const q = store.searchQuery?.trim().toLowerCase()
  if (q) {
    list = list.filter(d =>
      d.title?.toLowerCase().includes(q)
      || d.description?.toLowerCase().includes(q)
      || d.tags?.some(t => t.toLowerCase().includes(q))
    )
  }
  if (store.sort === 'oldest') list.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  else if (store.sort === 'az') list.sort((a, b) => a.title.localeCompare(b.title))
  else if (store.sort === 'za') list.sort((a, b) => b.title.localeCompare(a.title))
  else if (store.sort === 'recently-updated') list.sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''))
  else list.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return list
})

const copiedId = ref<string | null>(null)
const toastVisible = ref(false)
let toastTimer: ReturnType<typeof setTimeout> | null = null

async function copyPath(id: string) {
  const path = `/decks/${id}`
  try {
    await navigator.clipboard.writeText(window.location.origin + path)
  } catch {
    const el = document.createElement('input')
    el.value = window.location.origin + path
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
  copiedId.value = id
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    copiedId.value = null
    toastVisible.value = false
  }, 1500)
}

/**
 * Single-select tag behaviour. Deliberately leaves `searchQuery` alone —
 * `store.clearFilters()` also resets the search, which would wipe what the
 * user typed the moment they narrowed by topic.
 */
function setTag(tag: Tag | null) {
  const wasActive = tag ? store.activeTags.includes(tag) : false
  store.activeTags = []
  if (tag && !wasActive) store.toggleTag(tag)
  syncUrl()
}

function resetAll() {
  store.clearFilters()
  syncUrl()
}

const totalCount = computed(() => store.allDecks?.length ?? 0)
const isFiltered = computed(() => store.activeTags.length > 0 || !!store.searchQuery?.trim())
</script>

<template>
  <section id="decks" aria-labelledby="decks-heading" class="border-t border-[var(--sw-border)] py-20 px-6">
    <!-- Copy toast -->
    <Transition
      enter-active-class="transition-opacity duration-150"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="toastVisible"
        role="status"
        aria-live="polite"
        class="sw-toast sw-toast--success fixed bottom-6 left-1/2 -translate-x-1/2 z-[300]"
      >
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        Link copied!
      </div>
    </Transition>

    <div class="max-w-page mx-auto">
      <!--
        No FeaturedDeck component here. The hero already surfaces one deck, and
        the featured row in the list below carries its own badge and emerald
        border — mounting it here put the same talk on screen three times.
      -->
      <h2 id="decks-heading" class="sw-section-head">Browse Decks</h2>

      <!--
        Operate surface: the controls are the point, so they sit directly under
        the heading at working density rather than being spaced like a brand
        section. Search first — it is the fastest path to a known deck.
      -->
      <div class="mt-8 flex flex-col lg:flex-row lg:items-center gap-3">
        <div class="lg:max-w-md lg:flex-1">
          <SearchBar />
        </div>

        <div class="flex items-center gap-2 shrink-0 lg:ml-auto">
          <label for="sort-select" class="font-sans text-sm text-[var(--sw-text-3)] whitespace-nowrap">Sort by</label>
          <select
            id="sort-select"
            :value="store.sort"
            class="sw-input w-auto pl-3 pr-8 text-sm"
            @change="store.setSort(($event.target as HTMLSelectElement).value as SearchParams['sort'])"
          >
            <option v-for="opt in SORT_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>
      </div>

      <!-- Tag chips -->
      <div class="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
        <button
          type="button"
          :aria-pressed="store.activeTags.length === 0"
          class="sw-filter-pill"
          :class="{ 'sw-filter-pill--active': store.activeTags.length === 0 }"
          @click="setTag(null)"
        >All</button>
        <button
          v-for="tag in TAGS"
          :key="tag"
          type="button"
          :aria-pressed="store.activeTags.includes(tag)"
          class="sw-filter-pill"
          :class="{ 'sw-filter-pill--active': store.activeTags.includes(tag) }"
          @click="setTag(tag)"
        >
          {{ tag }}
          <svg v-if="store.activeTags.includes(tag)" aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Result count -->
      <p class="font-sans text-sm text-[var(--sw-text-3)] mt-6 mb-4 h-5">
        <template v-if="!pending">
          Showing {{ filteredDecks.length }} of {{ totalCount }} deck{{ totalCount !== 1 ? 's' : '' }}
        </template>
      </p>

      <!-- Deck list -->
      <div aria-live="polite">
        <!-- Skeleton — matches the real row height so nothing jumps on load -->
        <div v-if="pending" class="space-y-4">
          <div v-for="n in 4" :key="n" class="sw-skeleton h-36" />
        </div>

        <!-- Decks -->
        <div v-else-if="filteredDecks.length" class="space-y-3">
          <article
            v-for="deck in filteredDecks"
            :key="deck.id"
            class="sw-deck-card sm:flex-row sm:items-start gap-4"
            :class="deck.featured ? 'sw-deck-card--featured' : ''"
          >
            <!-- Left -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span v-if="deck.featured" class="sw-badge-featured">Featured</span>
                <span class="sw-deck-card__conference truncate">{{ deck.events?.at(-1) ?? deck.conference ?? '' }}</span>
              </div>
              <h3 class="sw-deck-card__title mb-1.5 text-pretty">{{ deck.title }}</h3>
              <p class="sw-deck-card__description text-pretty mb-3 max-w-2xl">{{ deck.description }}</p>
              <div class="flex flex-wrap gap-1.5">
                <span v-for="tag in deck.tags" :key="tag" :class="tagClass(tag)">{{ tag }}</span>
              </div>
            </div>

            <!-- Right -->
            <div class="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-3 shrink-0">
              <div class="flex sm:flex-col gap-3 sm:gap-1.5 sw-deck-card__meta">
                <span class="flex items-center gap-1">
                  <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                  {{ deck.slideCount }} slides
                </span>
                <span class="flex items-center gap-1">
                  <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  {{ deck.durationMinutes }}min
                </span>
                <span>v{{ deck.currentVersion }}</span>
              </div>

              <div class="flex items-center gap-2">
                <!-- Copy-path button -->
                <button
                  class="sw-btn-icon"
                  aria-label="Copy deck path"
                  @click="copyPath(deck.id)"
                >
                  <span aria-live="polite" class="sr-only">{{ copiedId === deck.id ? 'Copied!' : '' }}</span>
                  <svg v-if="copiedId !== deck.id" aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="2" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                  <svg v-else aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </button>

                <NuxtLink :to="`/decks/${deck.id}`" class="sw-deck-card__cta">Open deck <span aria-hidden="true">→</span></NuxtLink>
              </div>
            </div>
          </article>
        </div>

        <!--
          Two genuinely different empty states. "Nothing matched your filters"
          is recoverable and says how; "nothing published yet" is not, and
          pretending otherwise would offer a button that does nothing.
        -->
        <div v-else-if="isFiltered" class="sw-empty-state" role="status">
          <svg class="sw-empty-state__icon" aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <p class="sw-empty-state__title">No decks match</p>
          <p class="sw-empty-state__message">
            <template v-if="store.searchQuery?.trim()">
              Nothing matches “{{ store.searchQuery.trim() }}”{{ store.activeTags.length ? ` in ${store.activeTags.join(', ')}` : '' }}. Try a broader term, or search by topic.
            </template>
            <template v-else>
              No decks are tagged {{ store.activeTags.join(', ') }} yet. Pick another topic, or browse all {{ totalCount }}.
            </template>
          </p>
          <div class="sw-empty-state__actions">
            <button type="button" class="sw-btn-secondary" @click="resetAll">Show all decks</button>
          </div>
        </div>

        <div v-else class="sw-empty-state" role="status">
          <svg class="sw-empty-state__icon" aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          <p class="sw-empty-state__title">No decks published yet</p>
          <p class="sw-empty-state__message">The first talk goes up here once it's been delivered.</p>
        </div>
      </div>
    </div>
  </section>
</template>
