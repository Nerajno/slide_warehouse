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
      // ─── Color Scales ───────────────────────────────────────────────
      colors: {
        // Primary — Emerald
        emerald: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669', // DEFAULT / primary
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
          DEFAULT: '#059669',
        },

        // Accent — Amber
        amber: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706', // DEFAULT / accent
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
          DEFAULT: '#d97706',
        },

        // Neutral — Zinc (warm gray)
        zinc: {
          50:  '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        },

        // Semantic aliases for component use
        // Use these in components instead of raw scale values.
        sw: {
          bg:         'var(--sw-bg)',
          surface:    'var(--sw-surface)',
          'surface-2':'var(--sw-surface-2)',
          border:     'var(--sw-border)',
          'text-1':   'var(--sw-text-1)',
          'text-2':   'var(--sw-text-2)',
          'text-3':   'var(--sw-text-3)',
          primary:    'var(--sw-primary)',
          'primary-bg':'var(--sw-primary-bg)',
          'primary-text':'var(--sw-primary-text)',
          accent:     'var(--sw-accent)',
          'accent-bg':'var(--sw-accent-bg)',
          'accent-text':'var(--sw-accent-text)',
          danger:     'var(--sw-danger)',
          'danger-bg':'var(--sw-danger-bg)',
          focus:      'var(--sw-focus-ring)',
          rail:       'var(--sw-rail)',
          'rail-live':'var(--sw-rail-live)',
        },

        // Per-topic tag color pairs.
        // These point at the CSS vars in tokens.css so they follow the theme —
        // hardcoding hex here is what made the old values light-mode only.
        // Usage: bg-tag-vue text-tag-vue-text border-tag-vue-border
        tag: Object.fromEntries(
          [
            'vue', 'javascript', 'career', 'soft-skills', 'fundamentals',
            'community', 'architecture', 'accessibility', 'nuxt', 'typescript',
            'beginner', 'css', 'react', 'design', 'patterns', 'workshop', 'advanced',
          ].flatMap(t => [
            [t, `var(--tag-${t}-bg)`],
            [`${t}-text`, `var(--tag-${t}-text)`],
            [`${t}-border`, `var(--tag-${t}-border)`],
          ])
        ),
      },

      // ─── Typography ─────────────────────────────────────────────────
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans:    ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Menlo', 'monospace'],
      },

      fontSize: {
        // Custom scale additions on top of Tailwind defaults
        '2xs': ['10px', { lineHeight: '1.4' }],
        xs:    ['12px', { lineHeight: '1.5' }],
        sm:    ['13px', { lineHeight: '1.6' }],
        base:  ['15px', { lineHeight: '1.7' }],
        lg:    ['17px', { lineHeight: '1.6' }],
        xl:    ['20px', { lineHeight: '1.4' }],
        '2xl': ['24px', { lineHeight: '1.3' }],
        '3xl': ['30px', { lineHeight: '1.2' }],
        '4xl': ['36px', { lineHeight: '1.15' }],
        '5xl': ['48px', { lineHeight: '1.1' }],
        // Display ceiling. Editorial sizes for Persuade surfaces only —
        // never for Operate UI labels or data. 96px is the hard cap.
        '6xl': ['60px', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        '7xl': ['76px', { lineHeight: '1.0',  letterSpacing: '-0.03em' }],
        '8xl': ['96px', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
      },

      fontWeight: {
        normal:   '400',
        medium:   '500',
        semibold: '600',
        bold:     '700',
      },

      // ─── Spacing ────────────────────────────────────────────────────
      // Tailwind's default spacing scale is already 4px-based.
      // These are named semantic additions.
      spacing: {
        'component-xs': '8px',
        'component-sm': '12px',
        'component-md': '16px',
        'component-lg': '24px',
        'section-sm':   '32px',
        'section-md':   '48px',
        'section-lg':   '64px',
        'section-xl':   '80px',
        'page-x':       '24px',   // horizontal page padding (mobile)
        'page-x-lg':    '48px',   // horizontal page padding (desktop)
        'nav-h':        '60px',   // nav bar height
        'card-p':       '16px',   // card internal padding
        'card-gap':     '12px',   // gap between cards
      },

      // ─── Border Radius ──────────────────────────────────────────────
      borderRadius: {
        btn:   '6px',    // buttons, inputs — small controls stay tight
        tag:   '6px',    // topic tags
        card:  '12px',   // deck cards, stat blocks, panels
        modal: '16px',   // modals, drawers, larger panels
        pill:  '9999px', // filter pills, badges
      },

      // ─── Box Shadows ─────────────────────────────────────────────────
      boxShadow: {
        'card-sm':    '0 1px 3px 0 rgba(0,0,0,0.08)',
        'card-md':    '0 4px 12px 0 rgba(0,0,0,0.08)',
        'card-hover': 'var(--sw-card-hover)',
        'lift':       'var(--sw-lift)',
        'focus':      '0 0 0 3px rgba(5,150,105,0.35)',
        'focus-amber':'0 0 0 3px rgba(217,119,6,0.35)',
        none:         'none',
      },

      // ─── Z-Index ─────────────────────────────────────────────────────
      zIndex: {
        base:     '0',
        raised:   '10',
        dropdown: '100',
        sticky:   '150',
        modal:    '200',
        toast:    '300',
      },

      // ─── Max Widths ───────────────────────────────────────────────────
      maxWidth: {
        'content':  '680px',   // readable prose width
        'page':     '1200px',  // full page container
        'deck-grid':'1000px',  // deck browser grid
      },

      // ─── Animation ────────────────────────────────────────────────────
      transitionDuration: {
        fast:   '150ms',
        base:   '200ms',
        slow:   '300ms',
      },

      // Tailwind emits `ease-{key}`, so these keys must NOT be prefixed with
      // `ease-` themselves — the previous `ease-out-smooth` key produced
      // `ease-ease-out-smooth` and every `ease-out-smooth` in a template was
      // silently a no-op.
      transitionTimingFunction: {
        'out-smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'in-smooth':  'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
        'spring':     'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },

      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'count-up': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%':   { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },

      // The easing here is a raw CSS value, not a class name — `ease-out-smooth`
      // is not a valid <easing-function>, so these shorthands were invalid and
      // the animations fell back to the browser default.
      animation: {
        'fade-in':  'fade-in 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        'count-up': 'count-up 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        'slide-in': 'slide-in 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
      },
    },
  },

  plugins: [],
} satisfies Config
