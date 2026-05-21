<script setup lang="ts">
import type { ConferenceEvent } from '~/types'

const { data: events } = await useAsyncData('history-events',
  () => queryContent<ConferenceEvent>('history').find()
)

const historyList = computed<ConferenceEvent[]>(() => events.value ?? [])

const STATUS_DOT: Record<string, string> = {
  delivered:  'bg-emerald-400',
  confirmed:  'bg-sky-400',
  'cfp-open': 'bg-amber-400',
}

const STATUS_BADGE: Record<string, string> = {
  delivered:  'text-emerald-700 border-emerald-300 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800 dark:bg-emerald-950/40',
  confirmed:  'text-sky-700 border-sky-300 bg-sky-50 dark:text-sky-400 dark:border-sky-800 dark:bg-sky-950/40',
  'cfp-open': 'text-amber-700 border-amber-300 bg-amber-50 dark:text-amber-400 dark:border-amber-800 dark:bg-amber-950/40',
}

const byYear = computed(() => {
  const map = new Map<number, ConferenceEvent[]>()
  for (const event of historyList.value) {
    if (!map.has(event.year)) map.set(event.year, [])
    map.get(event.year)!.push(event)
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0])
})
</script>

<template>
  <section id="history" aria-labelledby="history-heading" class="border-t border-border py-20 px-6">
    <div class="max-w-6xl mx-auto md:grid md:grid-cols-3 md:gap-16">
      <!-- Left col -->
      <div class="mb-12 md:mb-0">
        <p class="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-2">Speaking Circuit</p>
        <h2 id="history-heading" class="text-3xl font-semibold text-foreground mb-4 text-balance">2025–2026 Circuit</h2>
        <p class="text-sm text-muted-foreground leading-relaxed mb-6">
          From Atlanta to Lincoln — conferences, meetups, and community events across the US.
        </p>
        <div class="rounded-xl border border-border bg-card p-6 inline-block">
          <p class="font-mono text-3xl font-semibold text-primary mb-1" aria-label="`${historyList.length} events`">{{ historyList.length }}</p>
          <p class="text-sm text-muted-foreground" aria-hidden="true">{{ historyList.length === 0 ? 'No events yet' : 'Events' }}</p>
        </div>
      </div>

      <!-- Right col — timeline -->
      <div class="md:col-span-2">
        <!-- Empty state -->
        <div v-if="historyList.length === 0" class="flex flex-col gap-4 py-10">
          <p class="text-sm text-muted-foreground">Past events coming soon — check back after the next conference.</p>
          <a href="#decks" class="text-sm font-medium text-primary underline underline-offset-2">View deck catalog</a>
        </div>

        <div v-for="([year, yearEvents], yi) in byYear" :key="year">
          <p class="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground mb-4" :class="yi > 0 ? 'mt-8' : ''">{{ year }}</p>

          <div class="relative">
            <div
              v-for="(event, i) in yearEvents"
              :key="event.id"
              class="relative pl-7 pb-6"
            >
              <span
                aria-hidden="true"
                class="absolute left-0 top-1.5 w-3 h-3 rounded-full shrink-0"
                :class="STATUS_DOT[event.status] ?? 'bg-muted-foreground'"
              />
              <span
                v-if="!(yi === byYear.length - 1 && i === yearEvents.length - 1)"
                class="absolute left-[5px] top-4 w-px bg-border"
                style="bottom: 0"
                aria-hidden="true"
              />

              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                <div>
                  <p class="text-sm font-medium text-foreground leading-snug">{{ event.conference }}</p>
                  <div class="flex items-center gap-2 mt-0.5">
                    <svg aria-hidden="true" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-muted-foreground shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span class="text-xs text-muted-foreground">{{ event.location }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-2 shrink-0 mt-1 sm:mt-0">
                  <span class="font-mono text-xs text-muted-foreground">{{ event.date }}</span>
                  <span
                    class="text-[11px] font-medium border rounded-full px-2 py-0.5"
                    :class="STATUS_BADGE[event.status] ?? 'border-border text-muted-foreground'"
                  >{{ event.status }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
