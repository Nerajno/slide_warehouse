<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number; message?: string } }>()
const is404 = computed(() => props.error.statusCode === 404)

useHead({ title: `${props.error.statusCode} — Slide Warehouse` })
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-5 px-page-x font-sans text-center">
    <span class="font-display text-7xl font-semibold text-[var(--sw-text-3)] leading-none tabular-nums">{{ error.statusCode }}</span>
    <h1 class="font-display text-3xl font-semibold text-[var(--sw-text-1)] leading-tight">
      {{ is404 ? 'Deck not found' : 'Something went wrong' }}
    </h1>
    <p class="font-sans text-[var(--sw-text-2)] max-w-sm leading-relaxed">
      {{ is404
        ? "We couldn't find that presentation. It may have been moved or the link is incorrect."
        : error.message ?? 'An unexpected error occurred.' }}
    </p>
    <NuxtLink to="/" class="sw-btn-primary mt-2">Browse all decks</NuxtLink>
  </div>
</template>
