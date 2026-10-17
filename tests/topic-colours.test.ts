import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'
import { TAG_LIST, tagClass } from '../types'

// #71: topic colours must not read as brand or status colours, and chips on
// cards are neutral. Colour maths: WCAG contrast and OKLab ΔE (×100).
const root = resolve(__dirname, '..')
const tokens = readFileSync(resolve(root, 'assets/css/tokens.css'), 'utf8')
const component = readFileSync(resolve(root, 'assets/css/component.css'), 'utf8')

const blocks = [...tokens.matchAll(/(:root|\.dark)\s*\{([^}]*)\}/g)]
const vars = (theme: ':root' | '.dark') => Object.fromEntries(
  blocks.filter(b => b[1] === theme).flatMap(b => [...b[2].matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(m => [m[1], m[2].trim()])),
)
const light = vars(':root'), dark = { ...light, ...vars('.dark') }
const resolveVar = (v: Record<string, string>, value: string, depth = 0): string => {
  const m = value.match(/^var\((--[\w-]+)\)$/)
  if (!m) return value
  if (depth > 10) throw new Error(`var() cycle at ${m[1]}`)
  if (!(m[1] in v)) throw new Error(`undefined token ${m[1]}`)
  return resolveVar(v, v[m[1]], depth + 1)
}

const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const rgb = (h: string) => [1, 3, 5].map(i => lin(parseInt(h.slice(i, i + 2), 16) / 255))
const lum = (h: string) => { const [r, g, b] = rgb(h); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
const contrast = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }
const oklab = (h: string) => {
  const [r, g, b] = rgb(h)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s]
}
const dE = (a: string, b: string) => { const x = oklab(a), y = oklab(b); return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]) * 100 }

const RESERVED = ['primary', 'primary-text', 'accent', 'accent-text', 'success', 'success-text', 'warning', 'warning-text', 'danger', 'danger-text']
const SWATCHES = ['blue', 'cyan', 'violet', 'slate', 'magenta']
const themes = [['light', light], ['dark', dark]] as const
const c = (v: Record<string, string>, name: string) => resolveVar(v, v[name] ?? '')

describe('#71 topic colours', () => {
  it.each(themes)('each swatch is a full colour triple with text ≥ 5.5:1 on its bg (%s)', (_, v) => {
    for (const s of SWATCHES) {
      for (const k of ['bg', 'text', 'border']) expect(c(v, `--tag-${s}-${k}`), `${s}-${k}`).toMatch(/^#[0-9a-f]{6}$/i)
      expect(contrast(c(v, `--tag-${s}-text`), c(v, `--tag-${s}-bg`)), s).toBeGreaterThanOrEqual(5.5)
    }
  })

  it.each(themes)('no hued swatch sits within ΔE 10 of a brand/status colour (%s)', (_, v) => {
    for (const s of SWATCHES.filter(s => s !== 'slate')) // slate is neutral: no hue to confuse
      for (const r of RESERVED) expect(dE(c(v, `--tag-${s}-text`), c(v, `--sw-${r}`)), `${s} vs ${r}`).toBeGreaterThanOrEqual(10)
  })

  it.each(themes)('every pair of swatches differs by ≥ ΔE 6 (%s)', (_, v) => {
    for (let i = 0; i < SWATCHES.length; i++) for (let j = i + 1; j < SWATCHES.length; j++)
      expect(dE(c(v, `--tag-${SWATCHES[i]}-text`), c(v, `--tag-${SWATCHES[j]}-text`)), `${SWATCHES[i]} vs ${SWATCHES[j]}`).toBeGreaterThanOrEqual(6)
  })

  it('there are no per-topic colour tokens left to drift', () => {
    for (const t of TAG_LIST) expect(tokens).not.toContain(`--tag-${t}-`)
  })

  it('deck-card chips are neutral: no per-topic chip rules, tagClass is the base class', () => {
    expect(component).not.toMatch(/\.sw-tag--/)
    const base = component.match(/\.sw-tag \{([^}]*)\}/)?.[1] ?? ''
    for (const token of ['--sw-surface', '--sw-border', '--sw-text-2']) expect(base).toContain(token)
    for (const t of [...TAG_LIST, 'unknown']) expect(tagClass(t)).toBe('sw-tag')
  })
})
