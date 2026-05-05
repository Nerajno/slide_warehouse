<script setup lang="ts">
const props = defineProps<{ src: string; title: string }>()

const container = ref<HTMLDivElement | null>(null)
const iframe = ref<HTMLIFrameElement | null>(null)
const { isFullscreen, toggle } = useFullscreen(container)

const slideIndex = ref(1)
const slideTotal = ref(0)
const copiedSlide = ref(false)
const iframeLoaded = ref(false)
const iframeError = ref(false)

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

function handleIframeError() {
  iframeError.value = true
}
</script>

<template>
  <div>
    <!-- iframe wrapper -->
    <div ref="container" class="relative rounded-card overflow-hidden border border-gray-200 dark:border-gray-700"
      style="aspect-ratio: 16/9; min-height: 400px;">
      <!-- Error state -->
      <div v-if="iframeError" class="flex flex-col items-center justify-center py-12 text-center">
        <div class="text-6xl mb-4">⚠️</div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Slides unavailable</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
          The presentation file may be missing or failed to load. Please try again later or report this issue.
        </p>
        <a href="https://github.com/nerajno/slide-warehouse/issues" target="_blank" rel="noopener noreferrer"
          class="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-2a2 2 0 012.79A2 2 0 002.79 0 012.79z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 12h.01M4 12a4 4 0 01-4 4-4.01M4 12z" />
          </svg>
          Report issue
          <svg aria-hidden="true" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h10l5 5M0 12h18" />
          </svg>
        </a>
      </div>

      <!-- Loading state -->
      <div v-else-if="!iframeLoaded && !iframeError"
        class="absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center"
        aria-hidden="true">
        <div class="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>

      <!-- Iframe -->
      <iframe v-if="!iframeError" ref="iframe" :src="src" :title="`Presentation: ${title}`"
        sandbox="allow-scripts allow-same-origin" class="w-full h-full border-0" allow="fullscreen"
        @load="iframeLoaded = true" @error="handleIframeError" />
    </div>

    <!-- Progress bar -->
    <div v-if="slideTotal > 0" role="progressbar" :aria-valuenow="slideIndex" :aria-valuemax="slideTotal"
      aria-label="Presentation progress" class="w-full h-1 bg-gray-200 dark:bg-gray-700">
      <div class="h-1 bg-emerald-500 transition-all duration-150"
        :style="{ width: `${(slideIndex / slideTotal) * 100}%` }" />
    </div>
    <div v-else aria-hidden="true" class="w-full h-1 bg-gray-200 dark:bg-gray-700" />

    <!-- Controls -->
    <div class="mt-2 flex items-center justify-between">
      <div class="flex items-center gap-1">
        <button
          class="w-11 h-11 rounded flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          aria-label="Previous slide" @click="prevSlide">‹</button>
        <span v-if="slideTotal" class="text-xs text-gray-500 font-mono px-2">
          Slide {{ slideIndex }} of {{ slideTotal }}
        </span>
        <button
          class="w-11 h-11 rounded flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          aria-label="Next slide" @click="nextSlide">›</button>
      </div>

      <button
        class="w-11 h-11 rounded flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        :aria-label="isFullscreen ? 'Exit fullscreen mode' : 'Enter fullscreen mode'" @click="toggle">
        <span v-if="isFullscreen">⊡</span>
        <span v-else>⛶</span>
      </button>
    </div>
  </div>
</template>
