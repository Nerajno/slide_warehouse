<script setup lang="ts">
const isOpen = ref(false)
</script>

<template>
  <header class="fixed inset-x-0 top-0 z-30 h-14 border-b border-border/50 bg-background/80 backdrop-blur-md">
    <div class="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
      <!-- Logo -->
      <a
        href="#"
        class="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span class="font-mono text-sm text-muted-foreground">slides.</span><span class="text-sm font-semibold text-foreground">developingdvlpr</span>
      </a>

      <!-- Desktop nav -->
      <nav aria-label="Main navigation" class="hidden items-center gap-0.5 md:flex">
        <a href="#decks" class="inline-flex min-h-[44px] items-center justify-center rounded px-3 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none">Decks</a>
        <a href="#history" class="inline-flex min-h-[44px] items-center justify-center rounded px-3 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none">History</a>
        <a href="#about" class="inline-flex min-h-[44px] items-center justify-center rounded px-3 text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none">About</a>
        <a
          href="https://twitter.com/Nerajno"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-[44px] items-center justify-center rounded px-3 text-xs font-medium text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
        >
          @Nerajno
          <svg aria-hidden="true" class="ml-1" width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 8.5L8.5 1.5M8.5 1.5H4M8.5 1.5V6" /></svg>
          <span class="sr-only">(opens in new tab)</span>
        </a>
      </nav>

      <!-- Mobile hamburger -->
      <button
        class="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
        aria-label="Toggle navigation"
        :aria-expanded="isOpen"
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
      class="overflow-hidden border-t border-border/50 bg-background/95 transition-[max-height] duration-300 motion-reduce:transition-none md:hidden"
      :class="isOpen ? 'max-h-96' : 'max-h-0'"
    >
      <nav aria-label="Mobile navigation" class="flex flex-col px-4 py-2">
        <a href="#decks" class="inline-flex min-h-[44px] items-center text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" @click="isOpen = false">Decks</a>
        <a href="#history" class="inline-flex min-h-[44px] items-center text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" @click="isOpen = false">History</a>
        <a href="#about" class="inline-flex min-h-[44px] items-center text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" @click="isOpen = false">About</a>
        <a
          href="https://twitter.com/Nerajno"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex min-h-[44px] items-center text-sm font-medium text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >@Nerajno <span class="sr-only">(opens in new tab)</span></a>
      </nav>
    </div>
  </header>
</template>
