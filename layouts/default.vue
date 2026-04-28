<script setup lang="ts">
const { isDark, toggle } = useTheme()
const router = useRouter()
const route = useRoute()

function openSearch() {
  if (route.path === '/') {
    document.getElementById('deck-search')?.focus()
  } else {
    router.push('/?focus=search')
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <SkipLink />
    <header class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-30">
      <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <NuxtLink to="/" class="font-semibold text-gray-900 dark:text-gray-100 text-sm tracking-tight hover:text-emerald-600 transition-colors">
          Slide Warehouse
        </NuxtLink>

        <nav aria-label="Main navigation" class="flex items-center gap-1 sm:gap-2">
          <NuxtLink
            to="/topics"
            class="text-xs text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors px-2 py-1 rounded"
            active-class="text-emerald-600 dark:text-emerald-400"
          >
            Topics
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="text-xs text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors px-2 py-1 rounded"
            active-class="text-emerald-600 dark:text-emerald-400"
          >
            About
          </NuxtLink>
          <a
            href="https://developingdvlpr.com"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs text-gray-400 font-mono hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors px-2 py-1 rounded hidden sm:block"
            aria-label="Portfolio — developingdvlpr.com (opens in new tab)"
          >@Nerajno</a>

          <!-- Search -->
          <button
            class="w-9 h-9 flex items-center justify-center rounded-btn text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-colors"
            aria-label="Search presentations"
            @click="openSearch"
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>

          <!-- Theme toggle -->
          <button
            class="w-9 h-9 flex items-center justify-center rounded-btn text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-colors"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggle"
          >
            <svg v-if="isDark" aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
            </svg>
            <svg v-else aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
        </nav>
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
