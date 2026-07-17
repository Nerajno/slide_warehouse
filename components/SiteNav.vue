<script setup lang="ts">
const isOpen = ref(false)
const toggleBtn = ref<HTMLButtonElement | null>(null)
const firstLink = ref<HTMLAnchorElement | null>(null)

watch(isOpen, (open) => {
  nextTick(() => {
    if (open) firstLink.value?.focus()
    else toggleBtn.value?.focus()
  })
})

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) {
    isOpen.value = false
  }
}
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-[150] h-14 border-b border-[var(--sw-border)] bg-[var(--sw-nav-bg)]/80 backdrop-blur-md"
    @keydown="handleKeydown"
  >
    <div class="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
      <!-- Logo -->
      <NuxtLink
        to="/"
        class="rounded focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--sw-focus-ring)]"
      >
        <span class="font-mono text-sm text-[var(--sw-text-3)]">slides.</span><span class="text-sm font-semibold text-[var(--sw-text-1)]">developingdvlpr</span>
      </NuxtLink>

      <!-- Desktop nav -->
      <nav aria-label="Main navigation" class="hidden items-center gap-0.5 md:flex">
        <a href="#decks" class="inline-flex min-h-[44px] items-center justify-center rounded px-3 text-xs text-[var(--sw-text-2)] transition-colors duration-[150ms] hover:text-[var(--sw-text-1)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--sw-focus-ring)]">Decks</a>
        <a href="#history" class="inline-flex min-h-[44px] items-center justify-center rounded px-3 text-xs text-[var(--sw-text-2)] transition-colors duration-[150ms] hover:text-[var(--sw-text-1)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--sw-focus-ring)]">History</a>
        <NuxtLink to="/about" class="inline-flex min-h-[44px] items-center justify-center rounded px-3 text-xs text-[var(--sw-text-2)] transition-colors duration-[150ms] hover:text-[var(--sw-text-1)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--sw-focus-ring)]" active-class="text-[var(--sw-primary)]">About</NuxtLink>
        <a href="mailto:iamnerandojohnson@gmail.com" aria-label="Email Nerando to book a talk" class="inline-flex min-h-[44px] items-center justify-center rounded-btn px-3 text-xs font-medium border border-[var(--sw-primary)] bg-[var(--sw-primary)]/10 text-[var(--sw-primary)] transition-colors duration-[150ms] hover:bg-[var(--sw-primary)]/20 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--sw-focus-ring)] ml-1">Book a Talk</a>
        <a
          href="https://x.com/Nerajno"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-[44px] items-center justify-center rounded px-3 text-xs font-medium text-[var(--sw-primary)] transition-colors duration-[150ms] hover:text-[var(--sw-primary-hover)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--sw-focus-ring)]"
        >
          @Nerajno
          <svg aria-hidden="true" class="ml-1" width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 8.5L8.5 1.5M8.5 1.5H4M8.5 1.5V6" /></svg>
          <span class="sr-only">(opens in new tab)</span>
        </a>
      </nav>

      <!-- Mobile hamburger -->
      <button
        ref="toggleBtn"
        class="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded text-[var(--sw-text-2)] hover:bg-[var(--sw-surface-2)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--sw-focus-ring)] md:hidden"
        aria-label="Toggle navigation"
        :aria-expanded="isOpen"
        aria-controls="mobile-nav"
        @click="isOpen = !isOpen"
      >
        <svg v-if="!isOpen" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        <svg v-else aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <div
      id="mobile-nav"
      class="overflow-hidden border-t border-[var(--sw-border)] bg-[var(--sw-nav-bg)]/95 transition-[max-height] duration-[300ms] md:hidden"
      :class="isOpen ? 'max-h-96' : 'max-h-0'"
      :aria-hidden="!isOpen"
    >
      <nav aria-label="Mobile navigation" class="flex flex-col px-4 py-2">
        <a ref="firstLink" href="#decks" :tabindex="isOpen ? 0 : -1" class="inline-flex min-h-[44px] items-center text-sm text-[var(--sw-text-2)] hover:text-[var(--sw-text-1)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--sw-focus-ring)]" @click="isOpen = false">Decks</a>
        <a href="#history" :tabindex="isOpen ? 0 : -1" class="inline-flex min-h-[44px] items-center text-sm text-[var(--sw-text-2)] hover:text-[var(--sw-text-1)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--sw-focus-ring)]" @click="isOpen = false">History</a>
        <a href="#about" :tabindex="isOpen ? 0 : -1" class="inline-flex min-h-[44px] items-center text-sm text-[var(--sw-text-2)] hover:text-[var(--sw-text-1)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--sw-focus-ring)]" @click="isOpen = false">About</a>
        <a href="mailto:iamnerandojohnson@gmail.com" aria-label="Email Nerando to book a talk" :tabindex="isOpen ? 0 : -1" class="inline-flex min-h-[44px] items-center text-sm font-medium text-[var(--sw-primary)] bg-[var(--sw-primary)]/10 px-3 rounded-btn hover:bg-[var(--sw-primary)]/20 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--sw-focus-ring)]" @click="isOpen = false">Book a Talk</a>
        <a
          href="https://x.com/Nerajno"
          target="_blank"
          rel="noopener noreferrer"
          :tabindex="isOpen ? 0 : -1"
          class="inline-flex min-h-[44px] items-center text-sm font-medium text-[var(--sw-primary)] hover:text-[var(--sw-primary-hover)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--sw-focus-ring)]"
        >@Nerajno <span class="sr-only">(opens in new tab)</span></a>
      </nav>
    </div>
  </header>
</template>
