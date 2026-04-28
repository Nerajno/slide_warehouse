import { updateClass } from '~/composables/useTheme'

export default defineNuxtPlugin(() => {
  const stored = (localStorage.getItem('sw-theme') ?? 'system') as 'light' | 'dark' | 'system'
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (stored === 'system') updateClass('system')
  })
})
