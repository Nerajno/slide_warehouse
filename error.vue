<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number; message?: string } }>()
const is404 = computed(() => props.error.statusCode === 404)

useHead({ title: `${props.error.statusCode} — Slide Warehouse` })
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-6 px-4 font-sans">
    <span class="text-6xl font-bold text-emerald-600 font-display">{{ error.statusCode }}</span>
    <h1 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
      {{ is404 ? 'Deck not found' : 'Something went wrong' }}
    </h1>
    <p class="text-sm text-gray-500 dark:text-gray-400 max-w-sm text-center">
      {{ is404
        ? "We couldn't find that presentation. It may have been moved or the link is incorrect."
        : error.message ?? 'An unexpected error occurred.' }}
    </p>
    <NuxtLink
      to="/"
      class="h-9 px-5 rounded-btn bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 flex items-center"
    >
      Browse all decks
    </NuxtLink>
  </div>
</template>
