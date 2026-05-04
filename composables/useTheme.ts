type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'sw-theme'

export function useTheme() {
  const preference = useState<Theme>('theme-preference', () => 'system')
  const systemDark = ref(false)

  if (import.meta.client) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    systemDark.value = mq.matches
    // Keep reactive to OS changes
    mq.addEventListener('change', (e) => {
      systemDark.value = e.matches
      if (preference.value === 'system') updateClass('system')
    })
    // Hydrate preference from storage on mount
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (stored) preference.value = stored
  }

  function apply(pref: Theme) {
    preference.value = pref
    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, pref)
      updateClass(pref)
    }
  }

  function toggle() {
    // Toggle from actual rendered state, not stored preference
    apply(isDark.value ? 'light' : 'dark')
  }

  // Reflects the actual rendered state (system preference respected)
  const isDark = computed(() =>
    preference.value === 'dark' ||
    (preference.value === 'system' && systemDark.value)
  )

  return { preference, isDark, apply, toggle }
}

export function updateClass(pref: Theme) {
  const dark =
    pref === 'dark' ||
    (pref === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', dark)
}
