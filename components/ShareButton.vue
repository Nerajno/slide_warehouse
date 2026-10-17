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
  try {
    await navigator.clipboard.writeText(target)
  } catch {
    prompt('Copy this link:', target)
    return
  }
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <button
    class="rounded-btn font-medium border border-[var(--sw-border)] bg-[var(--sw-surface)] text-[var(--sw-text-2)] hover:bg-[var(--sw-surface-2)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--sw-focus-ring)] transition-colors"
    :class="compact ? 'sw-touch-hit w-8 h-8 flex items-center justify-center text-base' : 'sw-touch h-9 px-4 text-xs'"
    :aria-label="copied ? 'Link copied' : 'Copy link to this deck'"
    @click.prevent="copy"
  >
    <span v-if="compact">{{ copied ? '✓' : '⎘' }}</span>
    <span v-else>{{ copied ? 'Copied!' : 'Copy Link' }}</span>
  </button>
</template>
