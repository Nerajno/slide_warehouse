import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Resolves the site's colour tokens the way the browser does on the `teach`
// surface: the @nerajno/dialects spine first, then assets/css/tokens.css,
// following var() chains and evaluating calc(), oklch() and color-mix().
// Returns opaque sRGB hex so contrast and ΔE checks test the real colours.

type Mode = 'light' | 'dark'
type Oklch = { l: number, c: number, h: number, a: number }

const root = resolve(__dirname, '../..')
const read = (p: string) => readFileSync(resolve(root, p), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
const SPINE = read('node_modules/@nerajno/dialects/tokens.css')
const SITE = read('assets/css/tokens.css')

const blocks = (css: string) =>
  [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(m => ({
    selectors: m[1].split(',').map(s => s.trim()),
    decls: [...m[2].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(d => [d[1], d[2].trim()] as const),
  }))

const applies = (selectors: string[], mode: Mode, surface: string) =>
  selectors.some(s => s === ':root' || s === `:root[data-surface="${surface}"]` || (mode === 'dark' && s === '.dark'))

/** All custom properties for a mode, in cascade order (spine, then site). */
export function tokenTable(mode: Mode, surface = 'teach'): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const css of [SPINE, SITE]) {
    // Specificity: :root (0,1,0) and .dark (0,1,0) apply in source order;
    // :root[data-surface] (0,2,0) beats both, so apply it last per file.
    const bs = blocks(css)
    const plain = bs.filter(b => b.selectors.includes(':root') || b.selectors.includes('.dark'))
    const surf = bs.filter(b => b.selectors.includes(`:root[data-surface="${surface}"]`) && !b.selectors.includes(':root'))
    for (const b of [...plain, ...surf]) if (applies(b.selectors, mode, surface)) for (const [k, v] of b.decls) vars[k] = v
  }
  return vars
}

const substitute = (vars: Record<string, string>, value: string, depth = 0): string => {
  if (depth > 20) throw new Error(`var() cycle in ${value}`)
  return value.replace(/var\((--[\w-]+)\)/g, (_, name: string) => {
    if (!(name in vars)) throw new Error(`undefined token ${name}`)
    return substitute(vars, vars[name], depth + 1)
  })
}

// Split at top-level separators (outside parentheses).
const split = (s: string, sep: RegExp) => {
  const out: string[] = []; let depth = 0, cur = ''
  for (const ch of s) {
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (depth === 0 && sep.test(ch)) { if (cur.trim()) out.push(cur.trim()); cur = ''; continue }
    cur += ch
  }
  if (cur.trim()) out.push(cur.trim())
  return out
}
const inner = (s: string) => s.slice(s.indexOf('(') + 1, s.lastIndexOf(')'))

const num = (s: string): number => {
  s = s.trim()
  if (s.startsWith('calc(')) return arith(inner(s))
  if (s.endsWith('%')) return parseFloat(s) / 100
  return parseFloat(s)
}
// calc() with + - * / and parentheses.
const arith = (expr: string): number => {
  const t = expr.match(/\d*\.?\d+(?:e-?\d+)?|[-+*/()]/g) ?? []
  let i = 0
  const factor = (): number => {
    const tok = t[i++]
    if (tok === '(') { const v = sum(); i++; return v }
    if (tok === '-') return -factor()
    return parseFloat(tok)
  }
  const term = (): number => { let v = factor(); while (t[i] === '*' || t[i] === '/') v = t[i++] === '*' ? v * factor() : v / factor(); return v }
  const sum = (): number => { let v = term(); while (t[i] === '+' || t[i] === '-') v = t[i++] === '+' ? v + term() : v - term(); return v }
  return sum()
}

const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const gam = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)

const fromHex = (h: string): Oklch => {
  const [r, g, b] = [1, 3, 5].map(i => lin(parseInt(h.slice(i, i + 2), 16) / 255))
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  return { l: L, c: Math.hypot(A, B), h: ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360, a: 1 }
}

const toHex = ({ l: L, c, h }: Oklch): string => {
  const A = c * Math.cos((h * Math.PI) / 180), B = c * Math.sin((h * Math.PI) / 180)
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
  return '#' + rgb.map(v => Math.round(Math.min(1, Math.max(0, gam(Math.min(1, Math.max(0, v))))) * 255).toString(16).padStart(2, '0')).join('')
}

const parse = (v: string): Oklch => {
  v = v.trim()
  if (v.startsWith('#')) return fromHex(v)
  if (v === 'black') return { l: 0, c: 0, h: 0, a: 1 }
  if (v === 'white') return { l: 1, c: 0, h: 0, a: 1 }
  if (v === 'transparent') return { l: 0, c: 0, h: 0, a: 0 }
  if (v.startsWith('oklch(')) {
    const [color, alpha] = split(inner(v), /\//)
    const [l, c, h] = split(color, /\s/).map(num)
    return { l, c, h, a: alpha === undefined ? 1 : num(alpha) }
  }
  if (v.startsWith('color-mix(')) {
    const [space, x, y] = split(inner(v), /,/)
    if (space !== 'in oklch') throw new Error(`unsupported color-mix space: ${space}`)
    const part = (p: string) => { const [col, pct] = split(p, /\s/); return { col: parse(col), p: pct === undefined ? undefined : num(pct) } }
    const a = part(x), b = part(y)
    const pa = a.p ?? (b.p === undefined ? 0.5 : 1 - b.p), pb = b.p ?? 1 - pa
    const w = pa / (pa + pb)
    // Achromatic sides adopt the other side's hue, as CSS does (powerless hue).
    const ha = a.col.c < 1e-4 ? b.col.h : a.col.h, hb = b.col.c < 1e-4 ? a.col.h : b.col.h
    let dh = hb - ha; if (dh > 180) dh -= 360; if (dh < -180) dh += 360
    return { l: a.col.l * w + b.col.l * (1 - w), c: a.col.c * w + b.col.c * (1 - w), h: (ha + dh * (1 - w) + 360) % 360, a: a.col.a * w + b.col.a * (1 - w) }
  }
  throw new Error(`unsupported colour: ${v}`)
}

/** Resolved, opaque hex for each named token. Throws on a translucent token. */
export function resolveColours(mode: Mode, surface = 'teach') {
  const vars = tokenTable(mode, surface)
  return (name: string): string => {
    const col = parse(substitute(vars, vars[name] ?? (() => { throw new Error(`undefined token ${name}`) })()))
    if (col.a < 1) throw new Error(`${name} is translucent (alpha ${col.a}); contrast needs an opaque colour`)
    return toHex(col)
  }
}
