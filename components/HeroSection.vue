<script setup lang="ts">
import type { DeckFrontmatter } from '~/types'

const { data: decksData } = await useAsyncData('hero-decks',
  () => queryCollection('decks').select('id', 'slideCount').all()
)
const { data: speakerData } = await useAsyncData('hero-speaker',
  () => queryCollection('speaker').first()
)
const { data: recentDeck } = await useAsyncData('hero-recent',
  async () => {
    const row = await queryCollection('decks').where('mostRecent', '=', true).first()
    return row ? { ...row, id: deckSlug(row) } : null
  }
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
  <section aria-labelledby="hero-heading" class="pt-28 pb-section-xl sm:pt-40 px-page-x lg:px-page-x-lg">
    <div class="max-w-page mx-auto">
      <!--
        The headline gets the page's largest type and the most air. Everything
        below it steps down hard — that contrast is what makes this read as the
        peak of the scroll rather than one more evenly-weighted band.
      -->
      <h1
        id="hero-heading"
        class="font-display text-6xl sm:text-7xl lg:text-8xl font-semibold text-[var(--sw-text-1)] text-balance max-w-[14ch]"
      >
        Talks that<br><em class="text-[var(--sw-primary)] not-italic">connect.</em>
      </h1>

      <p class="sw-section-lede mt-8 max-w-xl">
        Browse, search, and share Reveal.js presentation decks — from meetups and conference stages to your screen.
      </p>

      <div class="flex flex-wrap gap-3 mt-10">
        <a href="#decks" class="sw-btn-primary">Browse Decks</a>
        <a href="#history" class="sw-btn-secondary">Speaker History</a>
      </div>

      <!-- Evidence sits below the claim, at a deliberately quieter volume. -->
      <div class="mt-section-lg grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div ref="statsRef" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            v-for="(stat, i) in stats"
            :key="stat.label"
            class="sw-stat-block"
          >
            <p class="sw-stat-block__number" :aria-label="`${stat.value} ${stat.label}`">{{ displayValues[i] }}</p>
            <p class="sw-stat-block__label" aria-hidden="true">{{ stat.label }}</p>
          </div>
        </div>

        <!--
          Most-recent talk. Amber throughout, per the site's one colour rule:
          emerald is the archive, amber is what's current or forthcoming.
        -->
        <NuxtLink
          v-if="recentDeck"
          :to="recentDeckUrl"
          class="group block rounded-card border border-[var(--sw-accent)] bg-[var(--sw-surface)] p-5
                 transition-[box-shadow,border-color] duration-base ease-out-smooth
                 hover:shadow-lift focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--sw-focus-ring)]"
        >
          <span class="sw-status sw-status--confirmed">
            <span aria-hidden="true" class="w-1.5 h-1.5 rounded-pill bg-current" />
            Most recent{{ recentConf ? ` · ${recentConf}` : '' }}
          </span>
          <h2 class="font-display text-2xl font-semibold text-[var(--sw-text-1)] leading-tight mt-3 text-pretty">
            {{ recentDeck.title }}
          </h2>
          <span class="sw-deck-card__cta mt-4">Open deck <span aria-hidden="true">→</span></span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
