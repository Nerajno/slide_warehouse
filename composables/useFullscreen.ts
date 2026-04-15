export function useFullscreen(target: Ref<HTMLElement | null>) {
  const isFullscreen = ref(false)

  function enter() {
    const el = target.value
    if (!el) return
    if (el.requestFullscreen) el.requestFullscreen()
    else if ((el as any).webkitRequestFullscreen) (el as any).webkitRequestFullscreen()
    isFullscreen.value = true
  }

  function exit() {
    if (document.exitFullscreen) document.exitFullscreen()
    else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen()
    isFullscreen.value = false
  }

  function toggle() {
    isFullscreen.value ? exit() : enter()
  }

  onMounted(() => {
    document.addEventListener('fullscreenchange', () => {
      isFullscreen.value = !!document.fullscreenElement
    })
  })

  return { isFullscreen, toggle, enter, exit }
}
