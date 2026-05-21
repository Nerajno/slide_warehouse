<script setup lang="ts">
import type { Tag, SearchParams } from '~/types'
import { Badge } from '~/components/ui/badge'

const store = useDeckStore()
const { decks, pending } = useDecks()

const TAGS: Tag[] = ['vue', 'javascript', 'career', 'soft-skills', 'fundamentals', 'community']
const SORT_OPTIONS: { value: SearchParams['sort']; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'az',     label: 'A → Z'        },
  { value: 'za',     label: 'Z → A'        },
]

const filteredDecks = computed(() => {
  let list = [...(store.allDecks ?? [])]
  if (store.activeTags.length) {
    list = list.filter(d => d.tags.some(t => store.activeTags.includes(t)))
  }
  if (store.sort === 'oldest') list.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  else if (store.sort === 'az') list.sort((a, b) => a.title.localeCompare(b.title))
  else if (store.sort === 'za') list.sort((a, b) => b.title.localeCompare(a.title))
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
  <section id="decks" aria-labelledby="decks-heading" class="border-t border-border py-20 px-6">
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
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card shadow-md text-sm font-medium text-foreground motion-reduce:transition-none"
      >
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        Link copied!
      </div>
    </Transition>

    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <p class="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-2">Presentations</p>
      <h2 id="decks-heading" class="text-3xl font-semibold text-foreground mb-8">Browse Decks</h2>

      <!-- Controls -->
      <div class="flex flex-col sm:flex-row gap-4 mb-3">
        <!-- Tag chips -->
        <div class="flex flex-wrap gap-2 flex-1" role="radiogroup" aria-label="Filter by tag">
          <button
            role="radio"
            :aria-checked="store.activeTags.length === 0"
            class="h-8 px-3 rounded-full text-xs font-mono font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
            :class="store.activeTags.length === 0 ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:text-foreground'"
            @click="setTag(null)"
          >All</button>
          <button
            v-for="tag in TAGS"
            :key="tag"
            role="radio"
            :aria-checked="store.activeTags.includes(tag)"
            class="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-mono font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
            :class="store.activeTags.includes(tag) ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:text-foreground'"
            @click="setTag(tag)"
          >
            {{ tag }}
            <svg v-if="store.activeTags.includes(tag)" aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Sort -->
        <div class="flex items-center gap-2 shrink-0">
          <label for="sort-select" class="text-xs text-muted-foreground font-mono whitespace-nowrap">Sort by</label>
          <select
            id="sort-select"
            :value="store.sort"
            class="h-9 pl-3 pr-8 border border-border rounded text-xs bg-card text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            @change="store.setSort(($event.target as HTMLSelectElement).value as SearchParams['sort'])"
          >
            <option v-for="opt in SORT_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>
      </div>

      <!-- Result count -->
      <p class="font-mono text-xs text-muted-foreground mb-6">
        <template v-if="!pending">
          Showing {{ filteredDecks.length }} of {{ totalCount }} deck{{ totalCount !== 1 ? 's' : '' }}
        </template>
      </p>

      <!-- Deck list -->
      <div aria-live="polite">
        <!-- Skeleton -->
        <div v-if="pending" class="space-y-4">
          <div v-for="n in 4" :key="n" class="h-36 rounded-xl bg-muted animate-pulse" />
        </div>

        <!-- Decks -->
        <div v-else-if="filteredDecks.length" class="space-y-4">
          <article
            v-for="deck in filteredDecks"
            :key="deck.id"
            class="rounded-xl border bg-card p-6 flex flex-col sm:flex-row sm:items-start gap-4 transition-colors hover:border-primary/30 focus-within:border-primary/30 motion-reduce:transition-none"
            :class="deck.featured ? 'bg-primary/5 border-primary/30' : 'border-border'"
          >
            <!-- Featured badge -->
            <span v-if="deck.featured" class="sr-only">Featured</span>

            <!-- Left -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <Badge v-if="deck.featured" variant="outline" class="font-mono text-[0.6rem] uppercase tracking-widest text-primary border-primary/30">Featured</Badge>
                <span class="font-mono text-xs text-muted-foreground truncate">{{ deck.events?.at(-1) ?? deck.conference ?? '' }}</span>
              </div>
              <h3 class="text-base font-semibold text-foreground mb-1">{{ deck.title }}</h3>
              <p class="text-sm text-muted-foreground text-pretty mb-3">{{ deck.description }}</p>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="tag in deck.tags"
                  :key="tag"
                  class="font-mono text-[11px] px-2 py-0.5 rounded-full border border-border text-muted-foreground"
                >{{ tag }}</span>
              </div>
            </div>

            <!-- Right -->
            <div class="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-3 shrink-0">
              <div class="flex sm:flex-col gap-3 sm:gap-1.5 font-mono text-xs text-muted-foreground">
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
                  class="inline-flex items-center justify-center w-8 h-8 rounded border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                  aria-label="Copy deck path"
                  @click="copyPath(deck.id)"
                >
                  <span aria-live="polite" class="sr-only">{{ copiedId === deck.id ? 'Copied!' : '' }}</span>
                  <!-- Clipboard icon -->
                  <svg v-if="copiedId !== deck.id" aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="2" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                  <!-- Check icon -->
                  <svg v-else aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </button>

                <!-- Open Deck button -->
                <NuxtLink
                  :to="`/decks/${deck.id}`"
                  class="inline-flex items-center justify-center h-8 px-3 rounded border border-border text-xs text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                >Open deck →</NuxtLink>
              </div>
            </div>
          </article>
        </div>

        <!-- Empty state -->
        <div v-else class="flex flex-col items-center py-20 gap-4 text-center">
          <div class="w-16 h-16 rounded-xl bg-muted flex items-center justify-center">
            <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-muted-foreground"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </div>
          <p class="text-sm text-muted-foreground">No decks match the active filter.</p>
          <button class="text-xs text-primary underline underline-offset-2" @click="setTag(null)">Clear filters</button>
        </div>
      </div>
    </div>
  </section>
</template>
