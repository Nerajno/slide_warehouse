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
        emerald: { DEFAULT: '#059669' },
        amber:   { DEFAULT: '#d97706' },
        background:  'hsl(var(--background) / <alpha-value>)',
        foreground:  'hsl(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT:    'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT:    'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        border:      'hsl(var(--border) / <alpha-value>)',
        card: {
          DEFAULT:    'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
        ring:        'hsl(var(--ring) / <alpha-value>)',
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
