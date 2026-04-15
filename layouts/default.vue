<script setup lang="ts">
const { isDark, toggle } = useTheme()
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <SkipLink />
    <header class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-30">
      <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <NuxtLink to="/" class="font-semibold text-gray-900 dark:text-gray-100 text-sm tracking-tight hover:text-emerald-600 transition-colors">
          Slide Warehouse
        </NuxtLink>
        <div class="flex items-center gap-4">
          <span class="text-xs text-gray-400 font-mono">@Nerajno</span>
          <button
            class="w-9 h-9 flex items-center justify-center rounded-btn text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-colors"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggle"
          >
            <span v-if="isDark" aria-hidden="true">☀️</span>
            <span v-else aria-hidden="true">🌙</span>
          </button>
        </div>
      </div>
    </header>

    <main id="main-content" class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-xs text-gray-400">
      Built with Nuxt 3 · Reveal.js · Tailwind CSS
    </footer>
  </div>
</template>
