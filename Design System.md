# Slide Warehouse — Design System

> **Stack:** Nuxt 3 · Tailwind CSS · Vue 3 · TypeScript
> **Fonts:** Fraunces · Plus Jakarta Sans · JetBrains Mono
> **Palette:** Emerald (primary) · Amber (accent) · Zinc (neutral)
> **Standard:** WCAG 2.2 AA · 4px spacing grid

---

## Table of contents

1. [File structure](#1-file-structure)
2. [Color system](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & layout](#4-spacing--layout)
5. [Border radius](#5-border-radius)
6. [Shadows & elevation](#6-shadows--elevation)
7. [Motion & animation](#7-motion--animation)
8. [Components](#8-components)
9. [Accessibility](#9-accessibility)
10. [Dark mode](#10-dark-mode)
11. [Adding a new topic tag](#11-adding-a-new-topic-tag)

---

## 1. File structure

```
assets/css/
├── tokens.css       ← CSS custom properties (light + dark)
├── components.css   ← @layer components — reusable sw-* classes
└── main.css         ← Entry point (imports tokens + components)
tailwind.config.ts   ← Extends Tailwind with full token system
DESIGN_SYSTEM.md     ← This file
```

**`main.css` import order:**
```css
@import './tokens.css';
@import './components.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## 2. Color system

### Primary — Emerald

| Stop | Hex | Usage |
|------|-----|-------|
| 50   | `#ecfdf5` | Hover bg, light tints |
| 100  | `#d1fae5` | Tag backgrounds, primary-bg token |
| 200  | `#a7f3d0` | Focus tint, hover ring fill |
| 500  | `#10b981` | Dark mode primary |
| **600** | **`#059669`** | **Default primary — CTAs, links, accents** |
| 700  | `#047857` | Hover state on primary |
| 800  | `#065f46` | Active state, text on emerald-100 |
| 900  | `#064e3b` | Dark mode tag backgrounds |

### Accent — Amber

| Stop | Hex | Usage |
|------|-----|-------|
| 100  | `#fef3c7` | Featured badge background |
| 200  | `#fde68a` | Badge border |
| **600** | **`#d97706`** | **Default accent — "Book a talk" CTA, featured highlight** |
| 700  | `#b45309` | Hover on amber CTA |
| 800  | `#92400e` | Text on amber-100 |

### Neutral — Zinc (warm gray)

| Stop | Hex | Usage |
|------|-----|-------|
| 50   | `#fafafa` | Page background (light) |
| 100  | `#f4f4f5` | Surface-2 (stats, inputs) |
| 200  | `#e4e4e7` | Borders |
| 400  | `#a1a1aa` | Body text (dark mode) |
| 500  | `#71717a` | Meta text, timestamps |
| 600  | `#52525b` | Body text (light mode) |
| 900  | `#18181b` | Primary text (light mode) |
| 950  | `#09090b` | Page background (dark) |

### Semantic token quick reference

```css
/* Use these in Vue templates and component CSS */
var(--sw-bg)            /* Page canvas          */
var(--sw-surface)       /* Cards, nav           */
var(--sw-surface-2)     /* Stats, inputs        */
var(--sw-border)        /* Card borders         */
var(--sw-text-1)        /* Headings, primary    */
var(--sw-text-2)        /* Body, descriptions   */
var(--sw-text-3)        /* Meta, timestamps     */
var(--sw-primary)       /* CTAs, links          */
var(--sw-primary-bg)    /* Tag bg, tint areas   */
var(--sw-accent)        /* Featured, "Book" CTA */
var(--sw-focus-ring)    /* Focus outline color  */
```

**Rule:** Always use semantic tokens in component code — never raw hex values or Tailwind scale numbers directly. Raw values live only in `tokens.css`.

---

## 3. Typography

### Font families

| Role | Font | Tailwind class | CSS |
|------|------|---------------|-----|
| Display / hero headings | Fraunces | `font-display` | `font-family: 'Fraunces', Georgia, serif` |
| UI / body / buttons | Plus Jakarta Sans | `font-sans` | `font-family: 'Plus Jakarta Sans', system-ui, sans-serif` |
| Tags / meta / code | JetBrains Mono | `font-mono` | `font-family: 'JetBrains Mono', Menlo, monospace` |

### Type scale

| Class | Size | Line height | Weight | Usage |
|-------|------|------------|--------|-------|
| `text-2xs` | 10px | 1.4 | — | micro labels |
| `text-xs` | 12px | 1.5 | — | timestamps, meta — **Mono** |
| `text-sm` | 13px | 1.6 | — | descriptions, secondary body |
| `text-base` | 15px | 1.7 | — | primary body text |
| `text-lg` | 17px | 1.6 | `medium` | card titles |
| `text-xl` | 20px | 1.4 | `medium` | section headings |
| `text-2xl` | 24px | 1.3 | `semibold` | sub-hero headings |
| `text-3xl` | 30px | 1.2 | `semibold` | hero h1 — **Display** |
| `text-4xl` | 36px | 1.15 | `bold` | large hero variant |
| `text-5xl` | 48px | 1.1 | `bold` | maximum hero — **Display** |

### Usage rules

- Hero h1 always uses `font-display font-semibold` — never `font-sans`
- Deck card titles use `font-display font-semibold text-base`
- All metadata (slide count, duration, version) uses `font-mono text-xs text-[var(--sw-text-3)]`
- Topic tags always use `font-mono text-xs`
- Buttons always use `font-sans font-medium`
- Body copy is `font-sans font-normal text-base text-[var(--sw-text-2)]`

---

## 4. Spacing & layout

### Scale (4px base unit)

```
1  →  4px    component-xs gap
2  →  8px    tight component spacing
3  →  12px   card internal gap
4  →  16px   card-p (card padding)
5  →  20px
6  →  24px   component-lg, page-x (mobile)
8  →  32px   section-sm, between cards vertically
10 →  40px
12 →  48px   section-md, page-x-lg (desktop)
16 →  64px   section-lg
20 →  80px   section-xl, large section gaps
```

### Named spacing tokens

```
spacing.page-x      → 24px   /* horizontal padding, mobile  */
spacing.page-x-lg   → 48px   /* horizontal padding, desktop */
spacing.card-p      → 16px   /* card internal padding       */
spacing.card-gap    → 12px   /* gap between deck cards      */
spacing.nav-h       → 60px   /* nav bar height              */
spacing.section-sm  → 32px   /* between sections, tight     */
spacing.section-md  → 48px   /* between sections, default   */
spacing.section-lg  → 64px   /* between sections, large     */
```

### Layout containers

```html
<!-- Page wrapper -->
<div class="max-w-page mx-auto px-[var(--page-x)] lg:px-[var(--page-x-lg)]">

<!-- Deck grid — 2 columns desktop, 1 mobile -->
<div class="grid grid-cols-1 sm:grid-cols-2 gap-[var(--card-gap)]">

<!-- Content reading width -->
<div class="max-w-content mx-auto">
```

---

## 5. Border radius

| Token | Value | Used on |
|-------|-------|---------|
| `rounded-btn` | 4px | Buttons, inputs, select |
| `rounded-tag` | 6px | Topic tags |
| `rounded-card` | 8px | Deck cards, stat blocks, panels |
| `rounded-modal` | 12px | Modals, drawers, large panels |
| `rounded-pill` | 9999px | Filter pills, avatar circles |

---

## 6. Shadows & elevation

| Class | Value | Used on |
|-------|-------|---------|
| `shadow-card-sm` | `0 1px 3px rgba(0,0,0,0.08)` | Resting cards |
| `shadow-card-md` | `0 4px 12px rgba(0,0,0,0.08)` | Modals |
| `shadow-card-hover` | `0 4px 16px rgba(5,150,105,0.12)` | Deck card hover |
| `shadow-focus` | `0 0 0 3px rgba(5,150,105,0.35)` | Focus rings (primary) |
| `shadow-focus-amber` | `0 0 0 3px rgba(217,119,6,0.35)` | Focus rings (accent) |

**Rule:** No drop shadows on text, icons, or decorative elements. Shadows are reserved for interactive surfaces (cards on hover, modals).

---

## 7. Motion & animation

### Duration

```
duration-[150ms]  → fast   — hover color changes, pills
duration-[200ms]  → base   — card transitions, slide-in
duration-[300ms]  → slow   — page transitions
```

### Keyframes

```
animate-fade-in   → opacity 0→1, translateY 4px→0 (200ms, ease-out)
animate-count-up  → opacity 0→1, translateY 8px→0 (600ms, ease-out) — stat counters
animate-slide-in  → opacity 0→1, translateX -8px→0 (200ms, ease-out) — nav items
```

### Rules

- **Always** honor `prefers-reduced-motion: reduce` — see `tokens.css` for the global override
- Animation `duration` for interactive micro-interactions: 150–300ms
- No animation on page load for above-the-fold content (causes CLS)
- Stat counter animation: use `IntersectionObserver`, fires once only
- Card hover shadow: `transition-shadow duration-[200ms]` — not `transition-all` (avoids layout thrash)

---

## 8. Components

### Buttons

```vue
<!-- Primary -->
<button class="sw-btn-primary">
  Browse decks <Icon name="tabler:arrow-right" class="h-4 w-4" />
</button>

<!-- Secondary -->
<button class="sw-btn-secondary">Speaker history</button>

<!-- Ghost (tertiary) -->
<button class="sw-btn-ghost">Sort by</button>

<!-- Accent — book a talk -->
<button class="sw-btn-accent">Book a talk</button>

<!-- Icon only -->
<button class="sw-btn-icon" aria-label="Copy link to deck">
  <Icon name="tabler:copy" class="h-5 w-5" />
</button>
```

**Rules:**
- Never use raw Tailwind color classes on buttons — use `sw-btn-*` variants
- All buttons must have min-height 44px (built into base `sw-btn`)
- Disabled state: add `disabled` attribute — opacity is handled by CSS

### Topic tags

```vue
<span class="sw-tag sw-tag--vue">vue</span>
<span class="sw-tag sw-tag--career">career</span>
<span class="sw-tag sw-tag--soft-skills">soft-skills</span>
```

Tag color variants: `vue`, `javascript`, `career`, `soft-skills`, `fundamentals`, `community`, `architecture`, `accessibility`

### Filter pills

```vue
<button
  class="sw-filter-pill"
  :class="{ 'sw-filter-pill--active': activeFilter === tag }"
  :aria-pressed="activeFilter === tag"
  @click="setFilter(tag)"
>
  {{ tag }}
  <Icon v-if="activeFilter === tag" name="tabler:x" class="h-3 w-3" />
</button>
```

### Deck card

```vue
<article class="sw-deck-card" :class="{ 'sw-deck-card--featured': deck.featured }">
  <span v-if="deck.featured" class="sw-badge-featured">Featured</span>
  <p class="sw-deck-card__conference">{{ deck.conference }} {{ deck.year }}</p>
  <h3 class="sw-deck-card__title">{{ deck.title }}</h3>
  <p class="sw-deck-card__description">{{ deck.description }}</p>
  <div class="flex gap-1 flex-wrap">
    <span v-for="tag in deck.tags" :key="tag" :class="`sw-tag sw-tag--${tag}`">
      {{ tag }}
    </span>
  </div>
  <div class="flex items-center justify-between mt-auto">
    <span class="sw-deck-card__meta">
      {{ deck.slideCount }} slides · {{ deck.durationMinutes }} min · v{{ deck.currentVersion }}
    </span>
    <a :href="`/decks/${deck.id}`" class="sw-deck-card__cta">
      Open deck <Icon name="tabler:arrow-right" class="h-3.5 w-3.5" />
    </a>
  </div>
</article>
```

### Stat block

```vue
<div class="sw-stat-block">
  <p class="sw-stat-block__number" aria-live="polite">{{ count }}</p>
  <p class="sw-stat-block__label">{{ label }}</p>
</div>
```

### Empty state

```vue
<div class="sw-empty-state" role="status">
  <Icon name="tabler:calendar-off" class="sw-empty-state__icon" aria-hidden="true" />
  <p class="sw-empty-state__title">No events yet</p>
  <p class="sw-empty-state__message">
    Past events will appear here after each conference. Check back soon.
  </p>
  <NuxtLink to="/#decks" class="sw-btn-secondary mt-2">Browse decks</NuxtLink>
</div>
```

### Form input

```vue
<div class="sw-input-wrapper">
  <label class="sw-input-label" :for="id">{{ label }}</label>
  <input
    :id="id"
    class="sw-input"
    :class="{ 'sw-input--error': hasError }"
    :placeholder="placeholder"
    v-model="value"
  />
  <span v-if="hint && !hasError" class="sw-input-hint">{{ hint }}</span>
  <span v-if="hasError" class="sw-input-error-msg" role="alert">
    <Icon name="tabler:alert-circle" class="h-3.5 w-3.5" aria-hidden="true" />
    {{ errorMessage }}
  </span>
</div>
```

### Toast notification

```vue
<!-- In composables/useToast.ts -->
// showToast({ message: 'Link copied!', type: 'success' })

<div
  v-if="toast.visible"
  class="sw-toast sw-toast--success"
  role="status"
  aria-live="polite"
>
  <Icon name="tabler:check" class="h-4 w-4" aria-hidden="true" />
  {{ toast.message }}
</div>
```

### Breadcrumb

```vue
<nav class="sw-breadcrumb" aria-label="Breadcrumb">
  <ol class="flex items-center gap-1.5 list-none">
    <li>
      <NuxtLink to="/#decks">Slide Warehouse</NuxtLink>
    </li>
    <li class="sw-breadcrumb__separator" aria-hidden="true">›</li>
    <li aria-current="page">{{ deck.title }}</li>
  </ol>
</nav>
```

---

## 9. Accessibility

### Checklist (WCAG 2.2 AA)

- [ ] All color combos meet 4.5:1 contrast (normal text) or 3:1 (large text / UI elements)
- [ ] All interactive elements have min 44×44px touch targets
- [ ] Focus rings are visible on all interactive elements — `sw-btn` classes include this
- [ ] All icon-only buttons have `aria-label`
- [ ] Filter pills use `aria-pressed="true/false"`
- [ ] Sort select has a visible `<label>` — never placeholder-only
- [ ] Empty state has `role="status"` so it's announced on dynamic render
- [ ] Toast has `role="status"` and `aria-live="polite"` — never `assertive`
- [ ] Modal/drawer: `role="dialog"`, `aria-modal="true"`, focus trap on open, restore on close
- [ ] Skip link is present and functional (`#main-content`)
- [ ] Images have descriptive `alt` — decorative images use `alt=""`
- [ ] Error messages are associated with their input via `aria-describedby`
- [ ] Mobile nav: `aria-hidden="true"` + `tabindex="-1"` on children when closed

### Contrast ratios

| Pair | Ratio | Passes |
|------|-------|--------|
| `--sw-text-1` on `--sw-bg` (light) | 17.5:1 | ✅ AAA |
| `--sw-text-2` on `--sw-bg` (light) | 7.5:1 | ✅ AAA |
| `--sw-primary` on white | 4.6:1 | ✅ AA |
| `--sw-text-1` on `--sw-bg` (dark) | 19.8:1 | ✅ AAA |
| `--sw-primary-text` on `--sw-primary-bg` | 5.8:1 | ✅ AA |
| `--sw-accent-text` on `--sw-accent-bg` | 7.1:1 | ✅ AAA |

---

## 10. Dark mode

Dark mode is toggled by adding/removing `.dark` on `<html>`. The init script in `nuxt.config.ts` handles flash-of-wrong-theme (FOWT) prevention.

### Rules

- Never hardcode colors in Vue templates — always use `var(--sw-*)` tokens or `sw-*` component classes
- Test every new component in both modes before merging
- Use `dark:` Tailwind prefix only when a semantic token doesn't cover the case
- The token pairs in `tokens.css` map every semantic variable to its dark equivalent

### Theme composable

```ts
// composables/useTheme.ts
export const useTheme = () => {
  const theme = ref<'light' | 'dark' | 'system'>(
    (localStorage.getItem('sw-theme') as 'light' | 'dark' | 'system') ?? 'system'
  )

  const apply = (t: typeof theme.value) => {
    const isDark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('sw-theme', t)
    theme.value = t
  }

  return { theme, apply }
}
```

---

## 11. Adding a new topic tag

1. Add the tag to `types/deck.ts`:
   ```ts
   export type DeckTag = 'vue' | 'javascript' | 'career' | 'soft-skills' | 'fundamentals' | 'community' | 'architecture' | 'accessibility' | 'your-new-tag'
   ```

2. Add light + dark color pair to `tokens.css`:
   ```css
   :root {
     --tag-your-new-tag-bg:     #f0f9ff;
     --tag-your-new-tag-text:   #0c4a6e;
     --tag-your-new-tag-border: #7dd3fc;
   }
   .dark {
     --tag-your-new-tag-bg:     #082f49;
     --tag-your-new-tag-text:   #7dd3fc;
     --tag-your-new-tag-border: #0c4a6e;
   }
   ```

3. Add the Tailwind color pair to `tailwind.config.ts` under `theme.extend.colors.tag`:
   ```ts
   'your-new-tag':        '#f0f9ff',
   'your-new-tag-text':   '#0c4a6e',
   'your-new-tag-border': '#7dd3fc',
   ```

4. Add the component class to `components.css`:
   ```css
   .sw-tag--your-new-tag {
     background: var(--tag-your-new-tag-bg);
     color: var(--tag-your-new-tag-text);
     border-color: var(--tag-your-new-tag-border);
   }
   ```

5. Add the prerender route to `nuxt.config.ts`:
   ```ts
   '/topics/your-new-tag',
   ```

---

*Progress over perfection — ship the system, iterate on the edges.*
