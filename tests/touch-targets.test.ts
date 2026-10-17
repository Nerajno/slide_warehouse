import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect, vi } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import ShareButton from '../components/ShareButton.vue'
import SiteFooter from '../components/SiteFooter.vue'
import SiteNav from '../components/SiteNav.vue'
import SpeakerBio from '../components/SpeakerBio.vue'

const speaker = vi.hoisted(() => ({ name: 'Nerando Johnson', socialHandles: { x: 'nerajno', github: 'Nerajno', devto: 'nerajno' }, links: [] }))
mockNuxtImport('queryCollection', () => () => {
  const q = { select: () => q, where: () => q, all: async () => [speaker], first: async () => speaker }
  return q
})

// #68: compact controls get a 44px target on coarse pointers (WCAG 2.5.8).
// Pixel sizes are checked in a real browser (see PR); these guard the wiring.
const css = readFileSync(resolve(__dirname, '../assets/css/component.css'), 'utf8')
// Contents of every `@media (pointer: coarse) { … }` block (one nesting level).
const COARSE = /@media \(pointer: coarse\)\s*\{((?:[^{}]|\{[^{}]*\})*)\}/g
const coarse = [...css.matchAll(COARSE)].map(m => m[1]).join('\n')
const outsideCoarse = css.replace(COARSE, '')

describe('#68 touch targets', () => {
  it('touch utilities and the CTA minimum apply on coarse pointers only', () => {
    expect(coarse).toMatch(/\.sw-touch[\s,][^{]*\{[^}]*min-height:\s*44px/)
    expect(coarse).toMatch(/a\.sw-deck-card__cta[^{]*\{[^}]*min-height:\s*44px/)
    expect(coarse).toMatch(/\.sw-touch-hit::after\s*\{[^}]*inset:\s*-7px/)
    // nothing forces 44px on desktop
    expect(outsideCoarse).not.toMatch(/sw-deck-card__cta \{[^}]*min-height/)
  })

  it('compact share button keeps its 32px box and extends only its hit area', async () => {
    const btn = (await mountSuspended(ShareButton, { props: { url: '/decks/x', compact: true } })).find('button')
    expect(btn.classes()).toEqual(expect.arrayContaining(['sw-touch-hit', 'w-8', 'h-8']))
    expect(btn.classes()).not.toContain('sw-touch')
  })

  it('full-size share button grows on touch', async () => {
    const btn = (await mountSuspended(ShareButton, { props: { url: '/decks/x' } })).find('button')
    expect(btn.classes()).toContain('sw-touch')
  })

  it('footer social links get the touch utility', async () => {
    const links = (await mountSuspended(SiteFooter)).findAll('a.h-9')
    expect(links).toHaveLength(3)
    for (const a of links) expect(a.classes()).toContain('sw-touch')
  })

  it('speaker bio links get the touch utility', async () => {
    const links = (await mountSuspended(SpeakerBio)).findAll('a.rounded-full')
    expect(links.length).toBeGreaterThanOrEqual(3)
    for (const a of links) expect(a.classes()).toContain('sw-touch')
  })

  it('logo link is 44px tall at every size', async () => {
    const logo = (await mountSuspended(SiteNav)).findAll('[to="/"], a[href="/"]')[0]
    expect(logo.classes()).toContain('min-h-[44px]')
  })
})
