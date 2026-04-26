import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './app.vue',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        emerald: {
          DEFAULT: '#059669',
        },
        amber: {
          DEFAULT: '#d97706',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Fraunces', 'serif'],
      },
      borderRadius: {
        card: '8px',
        tag: '6px',
        btn: '4px',
      },
    },
  },
  plugins: [],
} satisfies Config
