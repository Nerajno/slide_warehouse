import { STORAGE_KEY, updateClass } from '~/composables/useTheme'

export default defineNuxtPlugin(() => {
  // One-time move from the pre-Dialects key, so a saved choice survives.
  const legacy = localStorage.getItem('sw-theme')
  if (legacy !== null) {
    if ((legacy === 'light' || legacy === 'dark') && localStorage.getItem(STORAGE_KEY) === null) {
      localStorage.setItem(STORAGE_KEY, legacy)
      updateClass(legacy)
    }
    localStorage.removeItem('sw-theme')
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem(STORAGE_KEY) === null) updateClass('system')
  })
})
