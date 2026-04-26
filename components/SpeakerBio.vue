<script setup lang="ts">
import type { SpeakerData } from '~/types'

const { data: speaker } = await useAsyncData('speaker-bio', () =>
  queryContent<SpeakerData>('speaker').findOne()
)

const initials = computed(() =>
  speaker.value?.name?.split(' ').map((n: string) => n[0]).join('') ?? ''
)
</script>

<template>
  <div v-if="speaker" class="space-y-5">
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center shrink-0">
        <span class="text-white font-semibold text-base font-mono">{{ initials }}</span>
      </div>
      <div>
        <p class="font-display font-semibold text-gray-900 dark:text-gray-100 text-lg leading-tight">{{ speaker.name }}</p>
        <p class="text-xs text-gray-500 font-mono">@{{ speaker.socialHandles?.x }}</p>
      </div>
    </div>

    <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{{ speaker.bio }}</p>

    <div class="flex flex-wrap gap-2">
      <a
        v-if="speaker.socialHandles?.x"
        :href="`https://x.com/${speaker.socialHandles.x}`"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
      >
        X / Twitter
      </a>
      <a
        v-if="speaker.socialHandles?.github"
        :href="`https://github.com/${speaker.socialHandles.github}`"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
      >
        GitHub
      </a>
      <a
        v-if="speaker.socialHandles?.devto"
        :href="`https://dev.to/${speaker.socialHandles.devto}`"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
      >
        dev.to
      </a>
      <a
        v-for="link in speaker.links"
        :key="link.label"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
      >
        {{ link.label }}
      </a>
    </div>
  </div>
</template>
