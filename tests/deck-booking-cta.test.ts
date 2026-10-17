import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect, vi } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import DeckPage from '../pages/decks/[id].vue'
import SiteNav from '../components/SiteNav.vue'
import { CONTACT_EMAIL } from '../utils/constants'

// nuxt-og-image is off in the test env (no SSR), so its auto-import is missing.
vi.hoisted(() => vi.stubGlobal('defineOgImage', () => {}))

const state = vi.hoisted(() => ({ title: 'Skills & Bills: Q/A' }))
const row = () => ({
  id: 'decks/decks/test.md', stem: 'decks/test', path: '/decks/test', title: state.title, tags: [],
  revealBasePath: '/reveals/test', currentVersion: 1,
  versions: [{ version: 1, label: 'Original', date: '2025-01-01', revealFile: 'v1.html' }],
})
mockNuxtImport('queryCollection', () => () => {
  const q = { select: () => q, where: () => q, all: async () => [row()], first: async () => row() }
  return q
})

const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const lum = (h: string) => { const [r, g, b] = [1, 3, 5].map(i => lin(parseInt(h.slice(i, i + 2), 16) / 255)); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
const contrast = (a: string, b: string) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }
const tokens = readFileSync(resolve(__dirname, '../assets/css/tokens.css'), 'utf8')
const theme = (sel: string) => Object.fromEntries([...tokens.matchAll(new RegExp(`${sel}\\s*\\{([^}]*)\\}`, 'g'))]
  .flatMap(b => [...b[1].matchAll(/(--sw-[\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map(m => [m[1], m[2]])))
const hex = (v: Record<string, string>, name: string) => { expect(v[name], `${name} must be a 6-digit hex`).toMatch(/^#[0-9a-f]{6}$/i); return v[name] }

describe('#63 booking CTA on deck pages', () => {
  it('renders one ink CTA that emails a prefilled, encoded subject', async () => {
    state.title = 'Skills & Bills: Q/A'
    const wrapper = await mountSuspended(DeckPage, { route: '/decks/test' })
    const ctas = wrapper.findAll('a.sw-btn-cta')
    expect(ctas).toHaveLength(1)
    const href = ctas[0].attributes('href')!
    expect(href.startsWith(`mailto:${CONTACT_EMAIL}?subject=`)).toBe(true)
    expect(decodeURIComponent(href.split('subject=')[1])).toBe('Booking request: Skills & Bills: Q/A')
    expect(href).not.toContain(' ')
    expect(wrapper.find('#book-heading').text()).toBe('Want this talk at your event?')
  })

  // Characters that truncate or corrupt a mailto subject if left raw.
  it.each([
    ['hash', 'Vue #1: Router'],
    ['question mark', 'Why TypeScript?'],
    ['plus and percent', 'C++ at 100%'],
    ['quotes', 'The "Real" Skills'],
    ['unicode', 'Café Talks — Ñandú ✓'],
    ['newline', 'Line one\nLine two'],
  ])('encodes a title with %s', async (_, title) => {
    state.title = title
    const slug = `enc-${Math.random().toString(36).slice(2)}` // fresh route = fresh useAsyncData key
    const href = (await mountSuspended(DeckPage, { route: `/decks/${slug}` })).find('a.sw-btn-cta').attributes('href')!
    const raw = href.split('?subject=')[1]
    expect(raw).not.toMatch(/[#?\s"]/)
    expect(decodeURIComponent(raw)).toBe(`Booking request: ${title}`)
  })

  it.each([[':root'], ['\\.dark']])('CTA text and hover meet 4.5:1 (%s)', (sel) => {
    const v = theme(sel)
    expect(contrast(hex(v, '--sw-cta'), hex(v, '--sw-on-cta'))).toBeGreaterThanOrEqual(4.5)
    expect(contrast(hex(v, '--sw-cta-hover'), hex(v, '--sw-on-cta'))).toBeGreaterThanOrEqual(4.5)
  })

  it('.sw-btn-cta is wired to the CTA tokens', () => {
    const css = readFileSync(resolve(__dirname, '../assets/css/component.css'), 'utf8')
    const base = css.match(/\.sw-btn-cta \{([^}]*)\}/)?.[1] ?? ''
    const hover = css.match(/\.sw-btn-cta:hover[^{]*\{([^}]*)\}/)?.[1] ?? ''
    expect(base).toContain('var(--sw-cta)')
    expect(base).toContain('var(--sw-on-cta)')
    expect(hover).toContain('var(--sw-cta-hover)')
  })

  it('the nav books through the shared contact constant', async () => {
    const html = (await mountSuspended(SiteNav)).html()
    expect(html).toContain(`mailto:${CONTACT_EMAIL}`)
    expect(readFileSync(resolve(__dirname, '../components/SiteNav.vue'), 'utf8')).not.toMatch(/mailto:[a-z]/i)
  })
})
