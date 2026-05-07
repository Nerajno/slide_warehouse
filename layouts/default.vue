<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <SkipLink />
    <SiteNav />
    <main id="main-content" class="flex-1 pt-14">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
