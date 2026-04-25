<script setup lang="ts">
import type { DeckVersion } from '~/types'

const props = defineProps<{ versions?: DeckVersion[] }>()

const sorted = computed(() =>
  [...(props.versions ?? [])].sort((a, b) => b.version - a.version)
)

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<template>
  <section v-if="sorted.length">
    <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Changelog</h3>
    <ol class="space-y-3">
      <li
        v-for="v in sorted"
        :key="v.version"
        class="flex gap-3 text-xs"
      >
        <span class="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-emerald-900/30 text-emerald-400 font-mono font-semibold border border-emerald-800">
          v{{ v.version }}
        </span>
        <div class="min-w-0">
          <p class="text-gray-200 font-medium leading-snug">{{ v.label }}</p>
          <p class="text-gray-500 font-mono">{{ formatDate(v.date) }}</p>
          <p v-if="v.changes" class="text-gray-400 mt-1 leading-snug">{{ v.changes }}</p>
        </div>
      </li>
    </ol>
  </section>
</template>
