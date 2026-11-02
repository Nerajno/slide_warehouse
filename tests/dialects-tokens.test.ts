import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'
import { resolveColours } from './helpers/resolve-tokens'

// The --sw-* tokens are aliases over the @nerajno/dialects spine (teach
// surface). These pairs used to carry hand-measured ratios in comments; now
// they are measured on the resolved colours in both modes.
const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const lum = (h: string) => { const [r, g, b] = [1, 3, 5].map(i => lin(parseInt(h.slice(i, i + 2), 16) / 255)); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
const contrast = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }

const TEXT = 4.5, UI = 3
// [foreground, background, minimum]
const PAIRS: [string, string, number][] = [
  ...['--sw-text-1', '--sw-text-2', '--sw-text-3'].flatMap(t =>
    ['--sw-bg', '--sw-surface', '--sw-surface-2'].map(b => [t, b, TEXT] as [string, string, number])),
  ['--sw-primary', '--sw-surface', TEXT],        // links, "Open deck"
  ['--sw-primary', '--sw-bg', TEXT],
  ['--sw-primary-text', '--sw-primary-bg', TEXT],
  ['--sw-on-primary', '--sw-primary-solid', TEXT],
  ['--sw-accent', '--sw-surface', TEXT],
  ['--sw-accent-text', '--sw-accent-bg', TEXT],
  ['--sw-on-accent', '--sw-accent-solid', TEXT],
  ['--sw-on-cta', '--sw-cta', TEXT],
  ['--sw-on-cta', '--sw-cta-hover', TEXT],
  ['--sw-danger-text', '--sw-danger-bg', TEXT],
  ['--sw-success-text', '--sw-success-bg', TEXT],
  ['--sw-warning-text', '--sw-warning-bg', TEXT],
  ['--sw-on-success', '--sw-success-solid', TEXT],
  ['--sw-success', '--sw-surface', UI],          // icons and borders
  ['--sw-warning', '--sw-surface', UI],
  ['--sw-danger', '--sw-surface', UI],
  ['--sw-border-2', '--sw-surface', UI],         // input edges
]

describe('Dialects teach tokens', () => {
  for (const mode of ['light', 'dark'] as const) {
    const c = resolveColours(mode)
    it.each(PAIRS)(`${mode}: %s on %s meets %s:1`, (fg, bg, min) => {
      expect(contrast(c(fg), c(bg))).toBeGreaterThanOrEqual(min)
    })
  }

  it('the site runs on the teach surface', () => {
    const config = readFileSync(resolve(__dirname, '../nuxt.config.ts'), 'utf8')
    expect(config).toMatch(/'data-surface':\s*'teach'/)
    expect(config).toContain('@nerajno/dialects/theme-init.js')
  })

  it('every --sw-* colour reads the spine, not a raw value', () => {
    const css = readFileSync(resolve(__dirname, '../assets/css/tokens.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
    const raw = [...css.matchAll(/(--sw-[\w-]+):\s*(#[0-9a-f]{3,8}|rgba?\([^)]*\))\s*;/gi)].map(m => m[1])
    // White text on light-mode fills is the one deliberate literal.
    expect(raw.filter(n => !['--sw-on-primary', '--sw-on-accent', '--sw-on-success'].includes(n))).toEqual([])
  })
})
