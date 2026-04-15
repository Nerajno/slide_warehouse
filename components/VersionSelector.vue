<script setup lang="ts">
import type { DeckVersion } from '~/types'

const props = defineProps<{ versions: DeckVersion[]; modelValue: number }>()
const emit = defineEmits<{ 'update:modelValue': [v: number] }>()

const selected = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const current = computed(() => props.versions.find(v => v.version === selected.value))

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}
</script>

<template>
  <div v-if="versions.length > 1" class="mt-3 space-y-1.5">
    <div class="flex items-center gap-2">
      <label for="version-select" class="text-xs text-gray-500 dark:text-gray-400">Version</label>
      <select
        id="version-select"
        v-model="selected"
        aria-label="Select presentation version"
        class="h-11 pl-3 pr-8 border border-gray-200 dark:border-gray-700 rounded-btn text-xs bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
      >
        <option v-for="v in versions" :key="v.version" :value="v.version">
          v{{ v.version }} — {{ v.label }} · {{ formatDate(v.date) }}
        </option>
      </select>
    </div>
    <p v-if="current?.changes" class="text-xs text-gray-500 dark:text-gray-400">
      {{ current.changes }}
    </p>
  </div>
</template>
