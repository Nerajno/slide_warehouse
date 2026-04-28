<script setup lang="ts">
const props = defineProps<{ src: string; title: string }>()

const container = ref<HTMLDivElement | null>(null)
const iframe = ref<HTMLIFrameElement | null>(null)
const { isFullscreen, toggle } = useFullscreen(container)

const slideIndex = ref(1)
const slideTotal = ref(0)
const copiedSlide = ref(false)
const iframeLoaded = ref(false)

function handleKeydown(e: KeyboardEvent) {
  const tag = (e.target as HTMLElement).tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
  if (e.key === 'ArrowLeft') prevSlide()
  else if (e.key === 'ArrowRight') nextSlide()
  else if (e.key === 'f' || e.key === 'F') toggle()
}

onMounted(() => {
  window.addEventListener('message', (e) => {
    if (e.data?.type === 'slidechanged') {
      slideIndex.value = (e.data.indexh ?? 0) + 1
      slideTotal.value = e.data.totalSlides ?? 0
    }
  })
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

async function copySlideLink() {
  const url = new URL(window.location.href)
  url.search = ''
  url.searchParams.set('slide', String(slideIndex.value - 1))
  await navigator.clipboard.writeText(url.toString())
  copiedSlide.value = true
  setTimeout(() => (copiedSlide.value = false), 2000)
}

function prevSlide() {
  iframe.value?.contentWindow?.postMessage({ method: 'prev' }, '*')
}
function nextSlide() {
  iframe.value?.contentWindow?.postMessage({ method: 'next' }, '*')
}
</script>

<template>
  <div>
    <!-- iframe wrapper -->
    <div
      ref="container"
      class="relative rounded-card overflow-hidden border border-gray-200 dark:border-gray-700"
      style="aspect-ratio: 16/9; min-height: 400px;"
    >
      <div
        v-if="!iframeLoaded"
        class="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center"
        aria-hidden="true"
      >
        <div class="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
      <iframe
        ref="iframe"
        :src="src"
        :title="`Presentation: ${title}`"
        sandbox="allow-scripts allow-same-origin"
        class="w-full h-full border-0"
        allow="fullscreen"
        @load="iframeLoaded = true"
      />
    </div>

    <!-- Progress bar -->
    <div
      v-if="slideTotal > 0"
      role="progressbar"
      :aria-valuenow="slideIndex"
      :aria-valuemax="slideTotal"
      aria-label="Presentation progress"
      class="w-full h-1 bg-gray-200 dark:bg-gray-700"
    >
      <div class="h-1 bg-emerald-500 transition-all duration-150" :style="{ width: `${(slideIndex / slideTotal) * 100}%` }" />
    </div>
    <div v-else aria-hidden="true" class="w-full h-1 bg-gray-200 dark:bg-gray-700" />

    <!-- Controls -->
    <div class="mt-2 flex items-center justify-between">
      <div class="flex items-center gap-1">
        <button
          class="w-11 h-11 rounded flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          aria-label="Previous slide"
          @click="prevSlide"
        >‹</button>
        <span v-if="slideTotal" class="text-xs text-gray-500 font-mono px-2">
          Slide {{ slideIndex }} of {{ slideTotal }}
        </span>
        <button
          class="w-11 h-11 rounded flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          aria-label="Next slide"
          @click="nextSlide"
        >›</button>
      </div>

      <button
        class="w-11 h-11 rounded flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        :aria-label="isFullscreen ? 'Exit fullscreen mode' : 'Enter fullscreen mode'"
        @click="toggle"
      >
        <span v-if="isFullscreen">⊡</span>
        <span v-else>⛶</span>
      </button>
    </div>
  </div>
</template>
