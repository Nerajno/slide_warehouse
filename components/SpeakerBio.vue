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
      <div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center shrink-0">
        <span class="text-primary-foreground font-semibold text-base font-mono">{{ initials }}</span>
      </div>
      <div>
        <p class="font-semibold text-foreground text-lg leading-tight">{{ speaker.name }}</p>
        <p class="text-xs text-muted-foreground font-mono">@{{ speaker.socialHandles?.x }}</p>
      </div>
    </div>

    <p class="text-sm text-muted-foreground leading-relaxed">{{ speaker.bio }}</p>

    <div class="flex flex-wrap gap-2">
      <a
        v-if="speaker.socialHandles?.x"
        :href="`https://x.com/${speaker.socialHandles.x}`"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        X / @{{ speaker.socialHandles.x }}
      </a>
      <a
        v-if="speaker.socialHandles?.github"
        :href="`https://github.com/${speaker.socialHandles.github}`"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        GitHub / @{{ speaker.socialHandles.github }}
      </a>
      <a
        v-if="speaker.socialHandles?.devto"
        :href="`https://dev.to/${speaker.socialHandles.devto}`"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        dev.to / @{{ speaker.socialHandles.devto }}
      </a>
      <a
        v-for="link in speaker.links"
        :key="link.label"
        :href="link.url"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {{ link.label }}
      </a>
    </div>
  </div>
</template>
