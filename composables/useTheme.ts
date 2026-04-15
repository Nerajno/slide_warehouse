type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'sw-theme'

export function useTheme() {
  const preference = useState<Theme>('theme-preference', () => 'system')

  function apply(pref: Theme) {
    preference.value = pref
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, pref)
      updateClass(pref)
    }
  }

  function toggle() {
    apply(preference.value === 'dark' ? 'light' : 'dark')
  }

  const isDark = computed(() => preference.value === 'dark')

  return { preference, isDark, apply, toggle }
}

export function updateClass(pref: Theme) {
  const dark =
    pref === 'dark' ||
    (pref === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', dark)
}
