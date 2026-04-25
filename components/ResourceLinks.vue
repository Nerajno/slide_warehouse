<script setup lang="ts">
import type { Resource } from '~/types'

const props = defineProps<{ resources?: Resource[] }>()
const open = ref(true)

const hasLinks = computed(() =>
  Array.isArray(props.resources) && props.resources.some(r => r.url)
)
</script>

<template>
  <section v-if="hasLinks">
    <button
      class="flex items-center justify-between w-full text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"
      :aria-expanded="open"
      @click="open = !open"
    >
      Resources
      <span class="text-gray-500 transition-transform" :class="open ? 'rotate-180' : ''">▾</span>
    </button>
    <ul v-if="open" class="space-y-1.5">
      <li v-for="resource in resources?.filter(r => r.url)" :key="resource.label">
        <a
          :href="resource.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
        >
          {{ resource.label }}
          <span aria-hidden="true" class="text-gray-500">↗</span>
        </a>
      </li>
    </ul>
  </section>
</template>
