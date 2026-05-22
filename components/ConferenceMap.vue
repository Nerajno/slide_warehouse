<script setup lang="ts">
import type { ConferenceEvent } from '~/types'

const props = defineProps<{ events: ConferenceEvent[] }>()

// Group events by unique location
const cityGroups = computed(() => {
  const map = new Map<string, { location: string; events: ConferenceEvent[]; x: number; y: number }>()
  for (const e of props.events) {
    if (!map.has(e.location)) {
      map.set(e.location, {
        location: e.location,
        events: [],
        ...CITY_COORDS[e.location] ?? { x: 50, y: 50 },
      })
    }
    map.get(e.location)!.events.push(e)
  }
  return [...map.values()]
})

// Status priority for dot color at a city
function dotStatus(events: ConferenceEvent[]) {
  if (events.some(e => e.status === 'cfp-open'))  return 'cfp-open'
  if (events.some(e => e.status === 'confirmed')) return 'confirmed'
  return 'delivered'
}

const DOT_COLOR: Record<string, string> = {
  delivered:  'var(--sw-primary)',
  confirmed:  '#38bdf8',
  'cfp-open': 'var(--sw-accent)',
}

// % positions in the map card (calibrated to continental US geography)
// Origin = top-left of card, which maps to ~Pacific NW / Northern US
const CITY_COORDS: Record<string, { x: number; y: number }> = {
  'Atlanta, GA':   { x: 68, y: 63 },
  'Lincoln, NE':   { x: 47, y: 37 },
  'Orlando, FL':   { x: 72, y: 79 },
  'Chicago, IL':   { x: 62, y: 28 },
  'Denver, CO':    { x: 36, y: 42 },
  'Austin, TX':    { x: 48, y: 70 },
  'Seattle, WA':   { x: 11, y: 16 },
  'Boston, MA':    { x: 86, y: 21 },
  'New York, NY':  { x: 83, y: 26 },
  'Nashville, TN': { x: 64, y: 55 },
  'Phoenix, AZ':   { x: 25, y: 62 },
  'Miami, FL':     { x: 76, y: 85 },
  'Detroit, MI':   { x: 68, y: 22 },
  'Portland, OR':  { x: 12, y: 22 },
  'Dallas, TX':    { x: 50, y: 68 },
  'Charlotte, NC': { x: 73, y: 52 },
  'Raleigh, NC':   { x: 77, y: 51 },
  'Indianapolis, IN': { x: 65, y: 34 },
  'Columbus, OH':  { x: 70, y: 30 },
}

const activeCity = ref<string | null>(null)
</script>

<template>
  <div
    class="relative rounded-card border border-[var(--sw-border)] bg-[var(--sw-surface-2)] overflow-visible"
    style="aspect-ratio: 16/7; min-height: 160px;"
    aria-label="Map showing conference locations"
    role="img"
  >
    <!-- Dot-grid background -->
    <svg
      class="absolute inset-0 w-full h-full pointer-events-none rounded-card"
      aria-hidden="true"
      viewBox="0 0 80 35"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="dot-grid" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="0.5" cy="0.5" r="0.35" fill="currentColor" class="text-[var(--sw-border)]" />
        </pattern>
      </defs>
      <rect width="80" height="35" fill="url(#dot-grid)" />

      <!-- Rough geographic reference lines (state borders suggestion) -->
      <!-- Mississippi River (vertical ~52%) -->
      <line x1="44" y1="0" x2="46" y2="35" stroke="currentColor" stroke-width="0.3" class="text-[var(--sw-border-2)]" opacity="0.4" />
      <!-- Great Plains east edge (~55%) -->
      <line x1="52" y1="0" x2="52" y2="20" stroke="currentColor" stroke-width="0.2" class="text-[var(--sw-border)]" opacity="0.3" />
      <!-- Appalachians (~67%) -->
      <line x1="62" y1="0" x2="65" y2="25" stroke="currentColor" stroke-width="0.2" class="text-[var(--sw-border)]" opacity="0.3" />
      <!-- Northern border (lat ~49) -->
      <line x1="0" y1="8" x2="80" y2="8" stroke="currentColor" stroke-width="0.3" class="text-[var(--sw-border-2)]" opacity="0.4" />
      <!-- Southern border suggestion -->
      <line x1="10" y1="82" x2="70" y2="82" stroke="currentColor" stroke-width="0.2" class="text-[var(--sw-border)]" opacity="0.2" />
    </svg>

    <!-- Region labels (faint) -->
    <span class="absolute font-mono text-[8px] text-[var(--sw-border-2)] select-none pointer-events-none" style="left:10%;top:10%" aria-hidden="true">PNW</span>
    <span class="absolute font-mono text-[8px] text-[var(--sw-border-2)] select-none pointer-events-none" style="left:28%;top:14%" aria-hidden="true">Rockies</span>
    <span class="absolute font-mono text-[8px] text-[var(--sw-border-2)] select-none pointer-events-none" style="left:47%;top:14%" aria-hidden="true">Midwest</span>
    <span class="absolute font-mono text-[8px] text-[var(--sw-border-2)] select-none pointer-events-none" style="left:68%;top:12%" aria-hidden="true">Northeast</span>
    <span class="absolute font-mono text-[8px] text-[var(--sw-border-2)] select-none pointer-events-none" style="left:30%;top:62%" aria-hidden="true">Southwest</span>
    <span class="absolute font-mono text-[8px] text-[var(--sw-border-2)] select-none pointer-events-none" style="left:62%;top:42%" aria-hidden="true">Southeast</span>

    <!-- City pins -->
    <div
      v-for="city in cityGroups"
      :key="city.location"
      class="absolute -translate-x-1/2 -translate-y-1/2 z-10"
      :style="{ left: city.x + '%', top: city.y + '%' }"
    >
      <button
        class="relative flex items-center justify-center focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--sw-focus-ring)] rounded-full"
        :aria-label="`${city.location} — ${city.events.length} event${city.events.length > 1 ? 's' : ''}`"
        @mouseenter="activeCity = city.location"
        @mouseleave="activeCity = null"
        @focus="activeCity = city.location"
        @blur="activeCity = null"
      >
        <!-- Pulse ring for upcoming events -->
        <span
          v-if="dotStatus(city.events) !== 'delivered'"
          class="absolute inset-0 rounded-full animate-ping opacity-40"
          :style="{ backgroundColor: DOT_COLOR[dotStatus(city.events)] }"
          aria-hidden="true"
        />
        <!-- Dot -->
        <span
          class="relative flex items-center justify-center w-6 h-6 rounded-full font-mono text-[10px] font-semibold text-white shadow-card-sm ring-2 ring-[var(--sw-surface-2)] transition-transform duration-150 hover:scale-110"
          :style="{ backgroundColor: DOT_COLOR[dotStatus(city.events)] }"
          aria-hidden="true"
        >{{ city.events.length }}</span>
      </button>

      <!-- Tooltip -->
      <Transition
        enter-active-class="transition-all duration-150 ease-out"
        enter-from-class="opacity-0 scale-95"
        leave-active-class="transition-all duration-100 ease-in"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="activeCity === city.location"
          class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-48 rounded-card border border-[var(--sw-border)] bg-[var(--sw-surface)] shadow-card-md p-3 pointer-events-none"
          style="z-index:50"
        >
          <!-- Arrow -->
          <span
            class="absolute top-full left-1/2 -translate-x-1/2 w-2 h-1.5 overflow-hidden"
            aria-hidden="true"
          >
            <span class="block w-2 h-2 border border-[var(--sw-border)] bg-[var(--sw-surface)] rotate-45 -translate-y-1/2" />
          </span>

          <p class="font-sans text-xs font-semibold text-[var(--sw-text-1)] mb-1.5 flex items-center gap-1.5">
            <svg aria-hidden="true" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-[var(--sw-primary)] shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {{ city.location }}
          </p>
          <ul class="space-y-1">
            <li
              v-for="e in city.events"
              :key="e.id"
              class="flex items-center gap-1.5"
            >
              <span
                class="w-1.5 h-1.5 rounded-full shrink-0"
                :style="{ backgroundColor: DOT_COLOR[e.status] ?? DOT_COLOR.delivered }"
                aria-hidden="true"
              />
              <span class="font-sans text-[11px] text-[var(--sw-text-2)] truncate leading-tight">{{ e.conference }}</span>
            </li>
          </ul>
        </div>
      </Transition>
    </div>

    <!-- Legend -->
    <div class="absolute bottom-2.5 right-3 flex flex-col gap-1 bg-[var(--sw-surface)]/90 backdrop-blur-sm rounded-[6px] px-2.5 py-2 border border-[var(--sw-border)]">
      <div v-for="[status, color] in [['Delivered', 'var(--sw-primary)'], ['Confirmed', '#38bdf8'], ['CFP Open', 'var(--sw-accent)']]" :key="status" class="flex items-center gap-1.5">
        <span class="w-2 h-2 rounded-full shrink-0" :style="{ backgroundColor: color }" aria-hidden="true" />
        <span class="font-mono text-[9px] text-[var(--sw-text-3)] uppercase tracking-wider">{{ status }}</span>
      </div>
    </div>

    <!-- Label -->
    <p class="absolute top-2.5 left-3 font-mono text-[9px] uppercase tracking-widest text-[var(--sw-text-3)]" aria-hidden="true">
      Continental US
    </p>
  </div>
</template>
