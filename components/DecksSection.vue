<script setup lang="ts">
import type { Tag, SearchParams } from '~/types'

const store = useDeckStore()
const { decks, pending } = useDecks()

const TAGS: Tag[] = ['vue', 'javascript', 'career', 'soft-skills', 'fundamentals', 'community']
const SORT_OPTIONS: { value: SearchParams['sort']; label: string }[] = [
  { value: 'newest',           label: 'Newest First'     },
  { value: 'oldest',           label: 'Oldest First'     },
  { value: 'az',               label: 'A → Z'            },
  { value: 'za',               label: 'Z → A'            },
  { value: 'recently-updated', label: 'Recently Updated' },
]

const filteredDecks = computed(() => {
  let list = [...(store.allDecks ?? [])]
  if (store.activeTags.length) {
    list = list.filter(d => d.tags.some(t => store.activeTags.includes(t)))
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

function setTag(tag: Tag | null) {
  store.clearFilters()
  if (tag) store.toggleTag(tag)
}

const totalCount = computed(() => store.allDecks?.length ?? 0)
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

    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <p class="sw-section-label mb-2">Presentations</p>
      <h2 id="decks-heading" class="font-display text-3xl font-semibold text-[var(--sw-text-1)] mb-8">Browse Decks</h2>

      <!-- Controls -->
      <div class="flex flex-col sm:flex-row gap-4 mb-3">
        <!-- Tag chips -->
        <div class="flex flex-wrap gap-2 flex-1" role="group" aria-label="Filter by tag">
          <button
            :aria-pressed="store.activeTags.length === 0"
            class="sw-filter-pill"
            :class="{ 'sw-filter-pill--active': store.activeTags.length === 0 }"
            @click="setTag(null)"
          >All</button>
          <button
            v-for="tag in TAGS"
            :key="tag"
            :aria-pressed="store.activeTags.includes(tag)"
            class="sw-filter-pill"
            :class="{ 'sw-filter-pill--active': store.activeTags.includes(tag) }"
            @click="setTag(tag)"
          >
            {{ tag }}
            <svg v-if="store.activeTags.includes(tag)" aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Sort -->
        <div class="flex items-center gap-2 shrink-0">
          <label for="sort-select" class="font-mono text-xs text-[var(--sw-text-3)] whitespace-nowrap">Sort by</label>
          <select
            id="sort-select"
            :value="store.sort"
            class="sw-input h-9 pl-3 pr-8 text-xs"
            @change="store.setSort(($event.target as HTMLSelectElement).value as SearchParams['sort'])"
          >
            <option v-for="opt in SORT_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>
      </div>

      <!-- Result count -->
      <p class="font-mono text-xs text-[var(--sw-text-3)] mb-6">
        <template v-if="!pending">
          Showing {{ filteredDecks.length }} of {{ totalCount }} deck{{ totalCount !== 1 ? 's' : '' }}
        </template>
      </p>

      <!-- Deck list -->
      <div aria-live="polite">
        <!-- Skeleton -->
        <div v-if="pending" class="space-y-4">
          <div v-for="n in 4" :key="n" class="h-36 rounded-card bg-[var(--sw-surface-2)] animate-pulse" />
        </div>

        <!-- Decks -->
        <div v-else-if="filteredDecks.length" class="space-y-4">
          <article
            v-for="deck in filteredDecks"
            :key="deck.id"
            class="sw-deck-card flex-row sm:items-start gap-4 flex-col sm:flex-row"
            :class="deck.featured ? 'sw-deck-card--featured' : ''"
          >
            <!-- Left -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span v-if="deck.featured" class="sw-badge-featured">Featured</span>
                <span class="sw-deck-card__conference truncate">{{ deck.events?.at(-1) ?? deck.conference ?? '' }}</span>
              </div>
              <h3 class="sw-deck-card__title mb-1">{{ deck.title }}</h3>
              <p class="sw-deck-card__description text-pretty mb-3">{{ deck.description }}</p>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="tag in deck.tags"
                  :key="tag"
                  class="sw-tag"
                  :class="`sw-tag--${tag}`"
                >{{ tag }}</span>
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

        <!-- Empty state -->
        <div v-else class="sw-empty-state" role="status">
          <svg class="sw-empty-state__icon" aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <p class="sw-empty-state__title">No decks found</p>
          <p class="sw-empty-state__message">No decks match the active filter.</p>
          <button class="sw-btn-secondary mt-2" @click="setTag(null)">Clear filters</button>
        </div>
      </div>
    </div>
  </section>
</template>
