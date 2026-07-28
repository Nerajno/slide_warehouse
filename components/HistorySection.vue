<script setup lang="ts">
const { data: events } = await useAsyncData('history-events',
  () => queryCollection('history').all()
)

const historyList = computed(() => events.value ?? [])

/**
 * Two hues, one meaning each: emerald for what's already happened, amber for
 * what hasn't yet. `confirmed` previously used an off-palette sky, which made
 * three colours say two things.
 */
const STATUS_LABEL: Record<string, string> = {
  delivered:  'Delivered',
  confirmed:  'Confirmed',
  'cfp-open': 'CFP open',
}

const isForthcoming = (status: string) => status !== 'delivered'

const byYear = computed(() => {
  const map = new Map<number, typeof historyList.value>()
  for (const event of historyList.value) {
    if (!map.has(event.year)) map.set(event.year, [])
    map.get(event.year)!.push(event)
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0])
})
</script>

<template>
  <section
    id="history"
    aria-labelledby="history-heading"
    class="border-t border-[var(--sw-border)] py-section-xl px-page-x lg:px-page-x-lg"
  >
    <div class="max-w-page mx-auto">
      <div class="max-w-2xl">
        <h2 id="history-heading" class="sw-section-head">2025–2026 Circuit</h2>
        <p class="sw-section-lede mt-5">
          From Atlanta to Lincoln — conferences, meetups, and community events across the US.
        </p>
        <p
          class="font-sans text-sm text-[var(--sw-text-3)] mt-4 tabular-nums"
          :aria-label="`${historyList.length} events`"
        >
          {{ historyList.length === 0 ? 'No events yet' : `${historyList.length} events` }}
        </p>
      </div>

      <!-- Empty state -->
      <div v-if="historyList.length === 0" class="sw-empty-state mt-section-md">
        <p class="sw-empty-state__message">Past events coming soon — check back after the next conference.</p>
        <div class="sw-empty-state__actions">
          <a href="#decks" class="sw-btn-secondary">View deck catalog</a>
        </div>
      </div>

      <!--
        One continuous rail runs the length of the circuit; years and events
        hang off it. The line is a structural axis, not a stripe glued to a
        card edge — that's what lets it read as a spine rather than trim.
      -->
      <div v-else class="sw-rail mt-section-md">
        <div v-for="([year, yearEvents], yi) in byYear" :key="year" :class="yi > 0 ? 'mt-section-md' : ''">
          <h3 class="font-display text-4xl sm:text-5xl font-semibold text-[var(--sw-text-3)] leading-none tabular-nums">
            {{ year }}
          </h3>

          <ul class="mt-6 space-y-5">
            <li
              v-for="event in yearEvents"
              :key="event.id"
              class="sw-rail-node"
              :class="isForthcoming(event.status) ? 'sw-rail-node--live' : ''"
            >
              <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-6 gap-y-1">
                <div class="min-w-0">
                  <p class="font-sans text-lg font-semibold text-[var(--sw-text-1)] leading-snug">
                    {{ event.conference }}
                  </p>
                  <p class="font-sans text-sm text-[var(--sw-text-3)] mt-0.5">
                    {{ event.location }}
                  </p>
                </div>
                <div class="flex items-center gap-3 shrink-0">
                  <span class="font-sans text-sm text-[var(--sw-text-3)] tabular-nums">{{ event.date }}</span>
                  <span
                    class="sw-status"
                    :class="isForthcoming(event.status) ? 'sw-status--confirmed' : 'sw-status--delivered'"
                  >{{ STATUS_LABEL[event.status] ?? event.status }}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
