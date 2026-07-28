<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  tags?: string[]
}>()
</script>

<template>
  <div class="w-full h-full flex flex-col justify-between bg-gray-950 p-16" style="font-family: 'Plus Jakarta Sans', sans-serif;">
    <!-- Header badge -->
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      </div>
      <span style="color: #6b7280; font-size: 18px; font-weight: 500;">slides.developingdvlpr.com</span>
    </div>

    <!-- Content -->
    <div class="flex flex-col gap-6">
      <h1 style="color: #f9fafb; font-size: 56px; font-weight: 700; line-height: 1.1; margin: 0;">
        {{ title }}
      </h1>
      <p v-if="description" style="color: #9ca3af; font-size: 24px; line-height: 1.5; margin: 0; max-width: 800px;">
        {{ description }}
      </p>
    </div>

    <!-- Footer: tags + brand -->
    <div class="flex items-center justify-between">
      <div v-if="tags?.length" class="flex gap-2 flex-wrap">
        <span
          v-for="tag in tags.slice(0, 4)"
          :key="tag"
          style="background: #064e3b; color: #6ee7b7; border-radius: 9999px; padding: 4px 16px; font-size: 16px; font-weight: 500;"
        >
          {{ tag }}
        </span>
      </div>
      <span style="color: #059669; font-size: 18px; font-weight: 600;">@Nerajno</span>
    </div>
  </div>
</template>
