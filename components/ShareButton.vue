<script setup lang="ts">
const props = withDefaults(defineProps<{ url?: string; compact?: boolean }>(), {
  url: undefined,
  compact: false,
})

const copied = ref(false)

async function copy() {
  const target = props.url
    ? new URL(props.url, window.location.origin).href
    : window.location.href
  await navigator.clipboard.writeText(target)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <button
    class="rounded-btn font-medium border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-colors"
    :class="compact ? 'w-8 h-8 flex items-center justify-center text-base' : 'h-9 px-4 text-xs'"
    :aria-label="copied ? 'Link copied' : 'Copy link to this deck'"
    @click.prevent="copy"
  >
    <span v-if="compact">{{ copied ? '✓' : '⎘' }}</span>
    <span v-else>{{ copied ? 'Copied!' : 'Copy Link' }}</span>
  </button>
</template>
