<script setup lang="ts">
import type { SpeakerData } from '~/types'

const { data: speaker } = await useAsyncData('speaker-bio', () =>
  queryCollection('speaker').first()
)

const initials = computed(() =>
  speaker.value?.name?.split(' ').map((n: string) => n[0]).join('') ?? ''
)
</script>

<template>
  <div v-if="speaker" class="space-y-5">
    <div class="flex items-center gap-4">
      <div class="w-12 h-12 rounded-full bg-[var(--sw-primary)] flex items-center justify-center shrink-0">
        <span class="text-white font-semibold text-base font-mono">{{ initials }}</span>
      </div>
      <div>
        <p class="font-semibold text-[var(--sw-text-1)] text-lg leading-tight">{{ speaker.name }}</p>
        <p class="text-xs text-[var(--sw-text-3)] font-mono">@{{ speaker.socialHandles?.x }}</p>
      </div>
    </div>

    <p class="text-sm text-[var(--sw-text-2)] leading-relaxed">{{ speaker.bio }}</p>

    <div class="flex flex-wrap gap-2">
      <a
        v-if="speaker.socialHandles?.x"
        :href="`https://x.com/${speaker.socialHandles.x}`"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs px-3 py-1.5 rounded-full border border-[var(--sw-border)] text-[var(--sw-text-2)] hover:text-[var(--sw-text-1)] hover:border-[var(--sw-primary)] transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--sw-focus-ring)]"
      >
        X / @{{ speaker.socialHandles.x }}
      </a>
      <a
        v-if="speaker.socialHandles?.github"
        :href="`https://github.com/${speaker.socialHandles.github}`"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs px-3 py-1.5 rounded-full border border-[var(--sw-border)] text-[var(--sw-text-2)] hover:text-[var(--sw-text-1)] hover:border-[var(--sw-primary)] transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--sw-focus-ring)]"
      >
        GitHub / @{{ speaker.socialHandles.github }}
      </a>
      <a
        v-if="speaker.socialHandles?.devto"
        :href="`https://dev.to/${speaker.socialHandles.devto}`"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs px-3 py-1.5 rounded-full border border-[var(--sw-border)] text-[var(--sw-text-2)] hover:text-[var(--sw-text-1)] hover:border-[var(--sw-primary)] transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--sw-focus-ring)]"
      >
        dev.to / @{{ speaker.socialHandles.devto }}
      </a>
      <a
        v-for="link in speaker.links"
        :key="link.label"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs px-3 py-1.5 rounded-full border border-[var(--sw-border)] text-[var(--sw-text-2)] hover:text-[var(--sw-text-1)] hover:border-[var(--sw-primary)] transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--sw-focus-ring)]"
      >
        {{ link.label }}
      </a>
    </div>
  </div>
</template>
