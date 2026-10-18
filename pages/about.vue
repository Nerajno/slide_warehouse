<script setup lang="ts">
import type { DeckFrontmatter } from '~/types'

const { data: speaker } = await useAsyncData('about-speaker', () =>
  queryCollection('speaker').first()
)

const { data: allDecks } = await useAsyncData('about-decks', async () =>
  withSlug(await queryCollection('decks').all()) as unknown as DeckFrontmatter[]
)

const totalDecks = computed(() => (allDecks.value as DeckFrontmatter[])?.length ?? 0)
const totalSlides = computed(() =>
  (allDecks.value as DeckFrontmatter[])?.reduce((sum: number, d: DeckFrontmatter) => sum + (d.slideCount ?? 0), 0) ?? 0
)

const techStack = [
  { name: 'Nuxt 3', role: 'SSG & App Framework' },
  { name: 'Reveal.js', role: 'Presentation Engine' },
  { name: 'Vue 3.5+', role: 'Reactivity Core' },
  { name: 'Nuxt Content', role: 'Git-backed Deck Store' },
  { name: 'TypeScript', role: 'Type Safety' },
]

const verifiedLinks = computed(() => {
  if (speaker.value?.links?.length) return speaker.value.links

  return [
    { label: 'Portfolio (developingdvlpr.com)', url: 'https://developingdvlpr.com' },
    { label: 'Sessionize Profile', url: 'https://sessionize.com/Nerajno/' },
    { label: 'GitHub (@Nerajno)', url: 'https://github.com/Nerajno' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/nerando-johnson/' },
  ]
})

useSeoMeta({
  title: 'About + Purpose — Slide Warehouse',
  description: 'Nerando Johnson is a full-stack engineer, international conference speaker, and former science educator bridging JavaScript fundamentals and modern Vue architecture.',
  ogTitle: 'About Nerando Johnson — Slide Warehouse',
  ogDescription: 'Explore session decks, talk abstracts, and architecture notes from Nerando Johnson at Slide Warehouse.',
  ogSiteName: 'Slide Warehouse',
  twitterCard: 'summary_large_image',
  twitterSite: '@nerajno',
})

useHead({
  meta: [{ property: 'og:type', content: 'profile' }],
})
</script>

<template>
  <div class="max-w-page mx-auto px-page-x lg:px-page-x-lg py-12 md:py-16 space-y-16 sm:space-y-24 mt-4">

    <!-- Hero Header -->
    <header class="max-w-3xl space-y-4">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[var(--sw-surface-2)] text-[var(--sw-primary)] border border-[var(--sw-border)]">
        <span class="w-2 h-2 rounded-full bg-[var(--sw-primary)] animate-pulse" aria-hidden="true" />
        Conference Speaker &amp; Software Engineer
      </div>

      <h1 class="font-display text-4xl sm:text-6xl font-bold text-[var(--sw-text-1)] tracking-tight leading-[1.08] text-balance">
        About <span class="text-[var(--sw-primary)]">+ Purpose</span>
      </h1>

      <p class="font-sans text-lg sm:text-xl text-[var(--sw-text-2)] leading-relaxed max-w-2xl text-pretty">
        Slide Warehouse is the permanent, open-source archive for Nerando Johnson's conference talks, interactive slide engines, and architectural demos.
      </p>
    </header>

    <!-- Bio & Core Focus Area -->
    <section aria-label="Speaker background" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div class="lg:col-span-7 space-y-5">
        <h2 class="text-xs font-mono uppercase tracking-widest text-[var(--sw-text-3)]">Background &amp; Mission</h2>
        
        <div class="space-y-4 text-base sm:text-lg text-[var(--sw-text-2)] leading-relaxed font-sans">
          <SpeakerBio v-if="$slots.default" />
          <template v-else>
            <p>
              I am a full-stack engineer, technical mentor, and conference speaker based in Georgia. Drawing from over a decade of experience in science education, my focus is breaking down cognitive friction in software engineering—connecting bedrock JavaScript primitives directly to modern reactive frameworks like Vue 3 and Nuxt.
            </p>
            <p>
              Whether delivering sessions at conferences like <em>TechBash</em> and <em>REFACTR.TECH</em> or working under the <em>"Skills to Bills"</em> and <em>Kill List Framework</em> models, I emphasize actionable execution, clean accessibility (WCAG 2.2 AA), and open-source documentation.
            </p>
          </template>
        </div>
      </div>

      <!-- Talk & Expertise Snapshot -->
      <aside class="lg:col-span-5 p-6 rounded-2xl border border-[var(--sw-border)] bg-[var(--sw-surface-1)] space-y-4">
        <h3 class="font-display text-base font-semibold text-[var(--sw-text-1)]">Signature Topics &amp; Focus</h3>
        <ul class="space-y-3 text-sm text-[var(--sw-text-2)] font-sans">
          <li class="border-b border-[var(--sw-border)] pb-2.5">
            <span class="text-xs font-mono uppercase text-[var(--sw-text-3)] block mb-0.5">Flagship Keynote / Session</span>
            <span class="font-medium text-[var(--sw-text-1)]">Back to Basics: JS Foundations for Modern Frameworks</span>
          </li>
          <li class="border-b border-[var(--sw-border)] pb-2.5">
            <span class="text-xs font-mono uppercase text-[var(--sw-text-3)] block mb-0.5">Project Strategy</span>
            <span class="font-medium text-[var(--sw-text-1)]">The Kill List Framework (Project Delivery)</span>
          </li>
          <li class="border-b border-[var(--sw-border)] pb-2.5">
            <span class="text-xs font-mono uppercase text-[var(--sw-text-3)] block mb-0.5">Core Ecosystem</span>
            <span class="font-mono text-[var(--sw-text-1)]">Vue 3.5+ · Nuxt 3 · TypeScript · Reveal.js</span>
          </li>
          <li class="flex items-center justify-between pt-1">
            <span class="text-xs font-mono uppercase text-[var(--sw-text-3)]">Accessibility Bar</span>
            <span class="font-mono font-semibold text-[var(--sw-primary)]">WCAG 2.2 AA Compliant</span>
          </li>
        </ul>
      </aside>
    </section>

    <!-- By The Numbers -->
    <section aria-label="Speaking and deck statistics">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-6 rounded-2xl border border-[var(--sw-border)] bg-[var(--sw-surface-1)] transition-transform duration-200 hover:-translate-y-1">
          <p class="text-3xl sm:text-5xl font-mono font-bold text-[var(--sw-text-1)] tracking-tight">{{ totalDecks }}</p>
          <p class="mt-2 text-xs font-mono uppercase tracking-wider text-[var(--sw-text-3)]">Decks Published</p>
        </div>

        <div class="p-6 rounded-2xl border border-[var(--sw-border)] bg-[var(--sw-surface-1)] transition-transform duration-200 hover:-translate-y-1">
          <p class="text-3xl sm:text-5xl font-mono font-bold text-[var(--sw-text-1)] tracking-tight">{{ totalSlides }}</p>
          <p class="mt-2 text-xs font-mono uppercase tracking-wider text-[var(--sw-text-3)]">Slides Preserved</p>
        </div>

        <div class="p-6 rounded-2xl border border-[var(--sw-border)] bg-[var(--sw-surface-1)] transition-transform duration-200 hover:-translate-y-1">
          <p class="text-3xl sm:text-5xl font-mono font-bold text-[var(--sw-text-1)] tracking-tight">{{ speaker?.stats?.totalTalks ?? '15+' }}</p>
          <p class="mt-2 text-xs font-mono uppercase tracking-wider text-[var(--sw-text-3)]">Talk Deliveries</p>
        </div>

        <div class="p-6 rounded-2xl border border-[var(--sw-border)] bg-[var(--sw-surface-1)] transition-transform duration-200 hover:-translate-y-1">
          <p class="text-3xl sm:text-5xl font-mono font-bold text-[var(--sw-text-1)] tracking-tight">{{ speaker?.stats?.conferencesCount ?? '10+' }}</p>
          <p class="mt-2 text-xs font-mono uppercase tracking-wider text-[var(--sw-text-3)]">Conferences &amp; Events</p>
        </div>
      </div>
    </section>

    <!-- Case Study Section (Preserving the Rail Architecture) -->
    <section aria-labelledby="case-study-heading" class="pt-2">
      <div class="max-w-2xl mb-10">
        <h2 id="case-study-heading" class="font-display text-3xl sm:text-4xl font-bold text-[var(--sw-text-1)] tracking-tight">
          Case Study: Slide Warehouse
        </h2>
        <p class="mt-3 text-[var(--sw-text-2)] text-base leading-relaxed">
          The engineering rationale behind creating a purpose-built, versioned presentation repository.
        </p>
      </div>

      <div class="relative pl-6 sm:pl-10 border-l border-[var(--sw-border)] space-y-12">
        <!-- 01: The Problem -->
        <article class="relative group">
          <span class="absolute -left-[31px] sm:-left-[47px] top-1.5 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[var(--sw-surface-2)] border border-[var(--sw-border)] text-xs font-mono font-bold text-[var(--sw-text-2)] group-hover:border-[var(--sw-primary)] group-hover:text-[var(--sw-primary)] transition-colors">
            01
          </span>
          <div class="space-y-2">
            <h3 class="font-display text-xl sm:text-2xl font-semibold text-[var(--sw-text-1)]">
              The Problem
            </h3>
            <p class="text-[var(--sw-text-2)] leading-relaxed max-w-2xl text-pretty font-sans">
              Speakers accumulate decks across multiple repositories, local markdown folders, and transient slide hosts. Sourcing presentation history for CFP submissions typically means digging through commits, risking broken demo assets and lost attendee reach.
            </p>
          </div>
        </article>

        <!-- 02: The Approach -->
        <article class="relative group">
          <span class="absolute -left-[31px] sm:-left-[47px] top-1.5 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[var(--sw-surface-2)] border border-[var(--sw-border)] text-xs font-mono font-bold text-[var(--sw-text-2)] group-hover:border-[var(--sw-primary)] group-hover:text-[var(--sw-primary)] transition-colors">
            02
          </span>
          <div class="space-y-3">
            <h3 class="font-display text-xl sm:text-2xl font-semibold text-[var(--sw-text-1)]">
              The Approach
            </h3>
            <p class="text-[var(--sw-text-2)] leading-relaxed max-w-2xl text-pretty font-sans">
              A self-hosted, Git-driven repository treating every Reveal.js presentation as versioned software. A single Markdown document registers a talk, preserves conference-specific branding, and loads through an isolated iframe viewer that runs the exact deck as delivered on stage.
            </p>
            <div class="flex flex-wrap gap-2 pt-1">
              <span class="px-2.5 py-1 text-xs font-mono rounded-md bg-[var(--sw-surface-2)] border border-[var(--sw-border)] text-[var(--sw-text-2)]">Isolated iframe Runner</span>
              <span class="px-2.5 py-1 text-xs font-mono rounded-md bg-[var(--sw-surface-2)] border border-[var(--sw-border)] text-[var(--sw-text-2)]">Git Markdown Frontmatter</span>
              <span class="px-2.5 py-1 text-xs font-mono rounded-md bg-[var(--sw-surface-2)] border border-[var(--sw-border)] text-[var(--sw-text-2)]">Event-Specific Branding</span>
            </div>
          </div>
        </article>

        <!-- 03: The Result -->
        <article class="relative group">
          <span class="absolute -left-[31px] sm:-left-[47px] top-1.5 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[var(--sw-surface-2)] border border-[var(--sw-border)] text-xs font-mono font-bold text-[var(--sw-text-2)] group-hover:border-[var(--sw-primary)] group-hover:text-[var(--sw-primary)] transition-colors">
            03
          </span>
          <div class="space-y-2">
            <h3 class="font-display text-xl sm:text-2xl font-semibold text-[var(--sw-text-1)]">
              The Result
            </h3>
            <p class="text-[var(--sw-text-2)] leading-relaxed max-w-2xl text-pretty font-sans">
              A portfolio-grade platform demonstrating Nuxt 3 static architecture, strict WCAG 2.2 AA accessibility standards, and the core tenet of "Progress over Perfection" deployed to production.
            </p>
          </div>
        </article>
      </div>
    </section>

    <!-- Architecture & Stack Details -->
    <section aria-label="System architecture" class="p-6 sm:p-8 rounded-2xl border border-[var(--sw-border)] bg-[var(--sw-surface-1)]">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 class="font-display text-lg font-semibold text-[var(--sw-text-1)]">System Architecture</h3>
          <p class="text-sm text-[var(--sw-text-2)] font-sans">Core tooling powering Slide Warehouse and live deck execution.</p>
        </div>
        <div class="flex flex-wrap gap-2.5">
          <div v-for="tech in techStack" :key="tech.name" class="px-3 py-1.5 rounded-lg bg-[var(--sw-surface-2)] border border-[var(--sw-border)] text-xs">
            <span class="font-semibold text-[var(--sw-text-1)]">{{ tech.name }}</span>
            <span class="text-[var(--sw-text-3)] ml-1">({{ tech.role }})</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Connect & Verified Channels -->
    <section aria-label="Verified speaker channels" class="pt-4 border-t border-[var(--sw-border)]">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 class="font-display text-xl font-bold text-[var(--sw-text-1)]">Find Me Online</h2>
          <p class="text-sm text-[var(--sw-text-2)] mt-1 font-sans">Conference profiles, engineering portfolio, and source code.</p>
        </div>

        <div class="flex flex-wrap gap-2.5">
          <a
            v-for="link in verifiedLinks"
            :key="link.label"
            :href="link.url"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-[var(--sw-border)] bg-[var(--sw-surface-1)] font-sans text-sm font-medium text-[var(--sw-text-1)] transition-all duration-150 hover:border-[var(--sw-primary)] hover:text-[var(--sw-primary)] hover:bg-[var(--sw-surface-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sw-focus-ring)]"
          >
            <span>{{ link.label }}</span>
            <svg class="w-3.5 h-3.5 text-[var(--sw-text-3)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
            <span class="sr-only">(opens in new tab)</span>
          </a>
        </div>
      </div>
    </section>

  </div>
</template>