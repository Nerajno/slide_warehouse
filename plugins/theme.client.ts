import { updateClass } from '~/composables/useTheme'

export default defineNuxtPlugin(() => {
  const stored = (localStorage.getItem('sw-theme') ?? 'system') as 'light' | 'dark' | 'system'
  const { apply } = useTheme()
  apply(stored)

  // Keep in sync if user changes OS preference while 'system' is selected
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (stored === 'system') updateClass('system')
  })
})
