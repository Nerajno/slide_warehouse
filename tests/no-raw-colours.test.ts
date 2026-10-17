import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { describe, it, expect } from 'vitest'

// #69: colour comes from --sw-* tokens (assets/css/tokens.css), which already
// switch for dark mode. Raw palette utilities and hand-written `dark:` variants
// drift from the system. OgImage templates render outside the page and need
// literal colours, so they're exempt.
const root = resolve(__dirname, '..')
const EXEMPT = ['components/OgImage/']

const files = (dir: string): string[] =>
  readdirSync(join(root, dir)).flatMap((name) => {
    const rel = join(dir, name)
    return statSync(join(root, rel)).isDirectory() ? files(rel) : rel.endsWith('.vue') ? [rel] : []
  })

const PALETTE = 'gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose'
const PREFIX = '(?:bg|text|border(?:-[xytblrse])?|ring(?:-offset)?|divide|from|to|via|fill|stroke|outline|decoration|placeholder|shadow|accent|caret)'
const RULES: [string, RegExp][] = [
  ['raw palette utility', new RegExp(`\\b${PREFIX}-(?:${PALETTE})-\\d{2,3}\\b`)],
  ['black/white utility', new RegExp(`\\b${PREFIX}-(?:white|black)\\b`)],
  ['hand-written dark: variant', /\bdark:/],
  // Skip in-page anchors such as href="#add" or to="#decks".
  ['hex colour', /(?<!(?:href|to)=["'][^"']*)#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/],
  ['rgb/hsl colour', /\b(?:rgba?|hsla?)\(/],
]

const sources = [...files('components'), ...files('pages'), ...files('layouts'), 'app.vue', 'error.vue']
  .filter(f => !EXEMPT.some(e => relative(root, join(root, f)).startsWith(e)))

describe('#69 no colours outside the token system', () => {
  it('rules catch the forms they target and ignore in-page anchors', () => {
    const rule = (name: string) => RULES.find(([n]) => n === name)![1]
    expect(rule('raw palette utility').test('border-t-gray-200')).toBe(true)
    expect(rule('raw palette utility').test('ring-offset-emerald-500')).toBe(true)
    expect(rule('black/white utility').test('ring-offset-white')).toBe(true)
    expect(rule('hand-written dark: variant').test('dark:[--x:1]')).toBe(true)
    expect(rule('hex colour').test('color="#d97706"')).toBe(true)
    expect(rule('hex colour').test('href="#add"')).toBe(false)
    expect(rule('hex colour').test('to="/#decade"')).toBe(false)
    expect(rule('rgb/hsl colour').test('style="color: rgba(0,0,0,.5)"')).toBe(true)
  })

  it('scans a real set of files', () => {
    expect(sources.length).toBeGreaterThanOrEqual(15)
  })

  it.each(RULES)('no %s in components, pages, layouts or app.vue', (_, re) => {
    const hits = sources.flatMap(f =>
      readFileSync(join(root, f), 'utf8').split('\n')
        .map((line, i) => (re.test(line) ? `${f}:${i + 1}: ${line.trim().slice(0, 80)}` : null))
        .filter(Boolean),
    )
    expect(hits).toEqual([])
  })
})
