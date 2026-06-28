<script setup lang="ts">
import type { DeckFrontmatter, SpeakerData } from '~/types'

const { data: decksData } = await useAsyncData('hero-decks',
  () => queryCollection('decks').select('id', 'slideCount').all()
)
const { data: speakerData } = await useAsyncData('hero-speaker',
  () => queryCollection('speaker').first()
)
const { data: recentDeck } = await useAsyncData('hero-recent',
  () => queryCollection('decks').where('mostRecent', '=', true).first()
)

const deckCount = computed(() => decksData.value?.length ?? 0)
const slideCount = computed(() => decksData.value?.reduce((s, d) => s + (d.slideCount ?? 0), 0) ?? 0)
const talkCount = computed(() => speakerData.value?.stats?.totalTalks ?? 0)
const confCount = computed(() => speakerData.value?.stats?.conferencesCount ?? 0)

const stats = computed(() => [
  { value: deckCount.value,  label: 'Decks'       },
  { value: slideCount.value, label: 'Slides'      },
  { value: talkCount.value,  label: 'Deliveries'  },
  { value: confCount.value,  label: 'Conferences' },
])

const recentDeckUrl = computed(() =>
  recentDeck.value ? `/decks/${recentDeck.value.id}` : '#decks'
)
const recentConf = computed(() =>
  (recentDeck.value as DeckFrontmatter | null)?.events?.at(-1) ?? ''
)

// Animated counters
const statsRef = ref<HTMLElement | null>(null)
const displayValues = ref(stats.value.map(() => 0))
const prefersReducedMotion = ref(false)

onMounted(() => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return
      observer.disconnect()

      if (prefersReducedMotion.value) {
        displayValues.value = stats.value.map(s => s.value)
        return
      }

      const duration = 1200
      const start = performance.now()
      const targets = stats.value.map(s => s.value)

      function tick(now: number) {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        const ease = 1 - Math.pow(1 - progress, 3)
        displayValues.value = targets.map(t => Math.round(t * ease))
        if (progress < 1) requestAnimationFrame(tick)
      }

      requestAnimationFrame(tick)
    },
    { threshold: 0.2 }
  )

  if (statsRef.value) observer.observe(statsRef.value)
})

watch(stats, (val) => {
  if (prefersReducedMotion.value) {
    displayValues.value = val.map(s => s.value)
  }
})
</script>

<template>
  <section aria-labelledby="hero-heading" class="pt-32 pb-20 px-6">
    <div class="max-w-6xl mx-auto">
      <div class="md:grid md:grid-cols-2 md:gap-16 md:items-start">
        <!-- Left col -->
        <div>
          <span class="inline-block font-mono text-2xs uppercase tracking-widest text-[var(--sw-text-3)] mb-6">
            Conference Presentations · @Nerajno
          </span>
          <h1 id="hero-heading" class="font-display text-5xl sm:text-6xl font-semibold leading-[0.95] tracking-tight text-[var(--sw-text-1)] mb-6 text-balance">
            Talks that<br><em class="text-[var(--sw-primary)] not-italic">connect.</em>
          </h1>
          <p class="font-sans text-[var(--sw-text-2)] text-base sm:text-lg leading-relaxed mb-10 text-pretty max-w-lg">
            Browse, search, and share Reveal.js presentation decks — from meetups and conference stages to your screen.
          </p>
          <div class="flex flex-wrap gap-3">
            <a href="#decks" class="sw-btn-primary">Browse Decks</a>
            <a href="#history" class="sw-btn-secondary">Speaker History</a>
          </div>
        </div>

        <!-- Right col -->
        <div class="mt-16 md:mt-0">
          <!-- 2×2 stat grid -->
          <div ref="statsRef" class="grid grid-cols-2 gap-4 mb-6">
            <div
              v-for="(stat, i) in stats"
              :key="stat.label"
              class="sw-stat-block"
            >
              <p class="sw-stat-block__number" :aria-label="`${stat.value} ${stat.label}`">{{ displayValues[i] }}</p>
              <p class="sw-stat-block__label" aria-hidden="true">{{ stat.label }}</p>
            </div>
          </div>

          <!-- Most-recent-talk banner -->
          <div v-if="recentDeck" class="rounded-card border border-[var(--sw-border)] bg-[var(--sw-surface)] p-6 flex gap-4 items-start">
            <div class="shrink-0 flex items-center justify-center w-10 h-10 rounded-card bg-[var(--sw-primary-bg)]">
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[var(--sw-primary)]">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-mono text-2xs uppercase tracking-widest text-[var(--sw-text-3)] mb-1">
                Most Recent · {{ recentConf }}
              </p>
              <h3 class="font-sans text-sm font-semibold text-[var(--sw-text-1)] mb-3 truncate">{{ recentDeck.title }}</h3>
              <NuxtLink
                :to="recentDeckUrl"
                class="sw-deck-card__cta"
              >Open deck →</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
